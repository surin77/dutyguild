const DEFAULTS = Object.freeze({
  appName: "Duty Guild",
  timeZone: "Europe/Samara",
  sessionCookieName: "dutyguild_session",
  sessionTtlDays: 30,
  loginCodeTtlMinutes: 15,
  dutyIntervalDays: 14,
  dutyTeamSize: 2,
  preferredWeekdays: [2, 4],
  authDebugCodes: false,
  emailMode: "stub",
});

export default {
  async fetch(request, env, ctx) {
    try {
      return await handleFetch(request, env, ctx);
    } catch (error) {
      console.error("Unhandled fetch error", error);
      return json(
        {
          error: "Something went wrong inside the guild hall.",
        },
        500,
      );
    }
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(runScheduledTasks(env, event.scheduledTime));
  },
};

async function handleFetch(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  await ensureBootstrapMembers(env);

  const url = new URL(request.url);
  const { pathname } = url;

  if (!pathname.startsWith("/api/")) {
    if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
      return env.ASSETS.fetch(request);
    }
    return new Response("Not found.", { status: 404 });
  }

  if (pathname === "/api/health" && request.method === "GET") {
    return json({ ok: true });
  }

  if (pathname === "/api/config" && request.method === "GET") {
    const config = getConfig(env);
    return json({
      appName: config.appName,
      timeZone: config.timeZone,
      dutyIntervalDays: config.dutyIntervalDays,
      dutyTeamSize: config.dutyTeamSize,
      debugAuthCodes: config.authDebugCodes,
    });
  }

  if (pathname === "/api/auth/request-code" && request.method === "POST") {
    return handleRequestCode(request, env);
  }

  if (pathname === "/api/auth/verify-code" && request.method === "POST") {
    return handleVerifyCode(request, env);
  }

  if (pathname === "/api/auth/logout" && request.method === "POST") {
    return handleLogout(request, env);
  }

  if (pathname === "/api/me" && request.method === "GET") {
    const member = await getCurrentMember(request, env);
    if (!member) {
      return json({ member: null }, 401);
    }
    return json({ member: memberToClient(member) });
  }

  if (pathname === "/api/dashboard" && request.method === "GET") {
    const member = await requireMember(request, env);
    if (member instanceof Response) {
      return member;
    }
    return json(await buildDashboard(env, member));
  }

  if (pathname === "/api/admin/members" && request.method === "GET") {
    const member = await requireAdmin(request, env);
    if (member instanceof Response) {
      return member;
    }
    return json({
      members: await loadRoster(env),
    });
  }

  if (pathname === "/api/admin/members" && request.method === "POST") {
    const member = await requireAdmin(request, env);
    if (member instanceof Response) {
      return member;
    }
    return handleCreateMember(request, env);
  }

  if (pathname === "/api/admin/game-events" && request.method === "POST") {
    const member = await requireAdmin(request, env);
    if (member instanceof Response) {
      return member;
    }
    return handleCreateGameEvent(request, env, member);
  }

  if (pathname === "/api/admin/cycles/generate" && request.method === "POST") {
    const member = await requireAdmin(request, env);
    if (member instanceof Response) {
      return member;
    }
    return handleGenerateCycle(env, member);
  }

  const feedbackMatch = pathname.match(/^\/api\/cycles\/([^/]+)\/feedback$/);
  if (feedbackMatch && request.method === "POST") {
    const member = await requireMember(request, env);
    if (member instanceof Response) {
      return member;
    }
    return handleFeedbackSubmission(request, env, member, feedbackMatch[1]);
  }

  return json({ error: "Route not found." }, 404);
}

async function handleRequestCode(request, env) {
  const body = await readJson(request);
  const rawEmail = body?.email;
  const email = normalizeEmail(rawEmail);

  if (!isValidEmail(email)) {
    return json({ error: "Enter a valid work email." }, 400);
  }

  const member = await first(
    env,
    "SELECT * FROM members WHERE email = ? AND status = 'active' LIMIT 1",
    [email],
  );

  if (!member) {
    return json({ error: "This email is not approved yet." }, 403);
  }

  const config = getConfig(env);
  const code = generateLoginCode();
  const codeHash = await hashValue(`${email}:${code}`, env);
  const expiresAt = new Date(
    Date.now() + config.loginCodeTtlMinutes * 60 * 1000,
  ).toISOString();

  await run(
    env,
    "DELETE FROM login_codes WHERE email = ? AND purpose = 'login'",
    [email],
  );

  await run(
    env,
    `
      INSERT INTO login_codes (id, email, code_hash, purpose, expires_at)
      VALUES (?, ?, ?, 'login', ?)
    `,
    [crypto.randomUUID(), email, codeHash, expiresAt],
  );

  const delivery = await sendLoginCodeEmail(env, {
    email,
    displayName: member.display_name,
    code,
    expiresAt,
  });

  return json({
    ok: true,
    expiresAt,
    deliveryMode: delivery.mode,
    debugCode: delivery.debugCode ?? null,
  });
}

async function handleVerifyCode(request, env) {
  const body = await readJson(request);
  const email = normalizeEmail(body?.email);
  const code = String(body?.code || "").trim();

  if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
    return json({ error: "Email or code is invalid." }, 400);
  }

  const loginCode = await first(
    env,
    `
      SELECT *
      FROM login_codes
      WHERE email = ? AND purpose = 'login'
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [email],
  );

  if (!loginCode) {
    return json({ error: "Request a fresh code first." }, 400);
  }

  if (loginCode.used_at) {
    return json({ error: "This code was already used." }, 400);
  }

  if (new Date(loginCode.expires_at).getTime() <= Date.now()) {
    return json({ error: "This code has expired." }, 400);
  }

  if (Number(loginCode.attempt_count || 0) >= 5) {
    return json({ error: "Too many attempts. Request a new code." }, 400);
  }

  const expectedHash = await hashValue(`${email}:${code}`, env);
  if (expectedHash !== loginCode.code_hash) {
    await run(
      env,
      "UPDATE login_codes SET attempt_count = attempt_count + 1 WHERE id = ?",
      [loginCode.id],
    );
    return json({ error: "The code does not match." }, 400);
  }

  const member = await first(
    env,
    "SELECT * FROM members WHERE email = ? AND status = 'active' LIMIT 1",
    [email],
  );

  if (!member) {
    return json({ error: "This member is not active." }, 403);
  }

  const config = getConfig(env);
  const sessionToken = randomToken();
  const sessionHash = await hashValue(sessionToken, env);
  const expiresAt = new Date(
    Date.now() + config.sessionTtlDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  await run(
    env,
    "UPDATE login_codes SET used_at = ? WHERE id = ?",
    [new Date().toISOString(), loginCode.id],
  );

  await run(
    env,
    `
      INSERT INTO sessions (id, member_id, session_hash, expires_at, last_seen_at)
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      crypto.randomUUID(),
      member.id,
      sessionHash,
      expiresAt,
      new Date().toISOString(),
    ],
  );

  return json(
    {
      ok: true,
      member: memberToClient(member),
    },
    200,
    {
      "Set-Cookie": serializeSessionCookie(
        config.sessionCookieName,
        sessionToken,
        config.sessionTtlDays,
        request.url,
      ),
    },
  );
}

async function handleLogout(request, env) {
  const config = getConfig(env);
  const token = parseCookies(request.headers.get("Cookie")).get(
    config.sessionCookieName,
  );

  if (token) {
    const sessionHash = await hashValue(token, env);
    await run(env, "DELETE FROM sessions WHERE session_hash = ?", [sessionHash]);
  }

  return json(
    { ok: true },
    200,
    {
      "Set-Cookie": clearSessionCookie(config.sessionCookieName),
    },
  );
}

async function handleCreateMember(request, env) {
  const body = await readJson(request);
  const email = normalizeEmail(body?.email);
  const displayName = String(body?.displayName || "").trim() || displayNameFromEmail(email);
  const role = body?.role === "admin" ? "admin" : "member";

  if (!isValidEmail(email)) {
    return json({ error: "Enter a valid email for the new member." }, 400);
  }

  const existing = await first(env, "SELECT id FROM members WHERE email = ? LIMIT 1", [
    email,
  ]);
  const now = new Date().toISOString();

  if (existing) {
    await run(
      env,
      `
        UPDATE members
        SET display_name = ?, role = ?, status = 'active', approved_at = COALESCE(approved_at, ?), updated_at = ?
        WHERE email = ?
      `,
      [displayName, role, now, now, email],
    );
  } else {
    await run(
      env,
      `
        INSERT INTO members (id, email, display_name, role, status, approved_at, updated_at)
        VALUES (?, ?, ?, ?, 'active', ?, ?)
      `,
      [crypto.randomUUID(), email, displayName, role, now, now],
    );
  }

  return json({
    ok: true,
    member: memberToClient(
      await first(env, "SELECT * FROM members WHERE email = ? LIMIT 1", [email]),
    ),
  });
}

async function handleCreateGameEvent(request, env, actor) {
  const body = await readJson(request);
  const title = String(body?.title || "").trim();
  const eventDate = String(body?.eventDate || "").trim();
  const startsAt = normalizeTime(body?.startsAt);
  const endsAt = normalizeTime(body?.endsAt);
  const notes = String(body?.notes || "").trim();

  if (!title || !isDateOnly(eventDate)) {
    return json({ error: "Fill in the event title and date." }, 400);
  }

  await run(
    env,
    `
      INSERT INTO game_events (id, title, event_date, starts_at, ends_at, notes, status, created_by_member_id)
      VALUES (?, ?, ?, ?, ?, ?, 'confirmed', ?)
    `,
    [crypto.randomUUID(), title, eventDate, startsAt, endsAt, notes, actor.id],
  );

  return json({ ok: true });
}

async function handleGenerateCycle(env, actor) {
  const result = await createNextCycle(env, actor.id);

  if (!result.ok) {
    return json({ error: result.error }, 400);
  }

  return json({
    ok: true,
    cycle: result.cycle,
  });
}

async function handleFeedbackSubmission(request, env, actor, cycleId) {
  const body = await readJson(request);
  const targetMemberId = String(body?.targetMemberId || "").trim();
  const comment = String(body?.comment || "").trim();
  const rating = Number(body?.rating);

  if (!targetMemberId || !comment || Number.isNaN(rating)) {
    return json({ error: "Fill in rating, target member and comment." }, 400);
  }

  if (rating < 1 || rating > 5) {
    return json({ error: "Rating must be between 1 and 5." }, 400);
  }

  const assignment = await first(
    env,
    `
      SELECT a.id
      FROM cycle_assignments a
      WHERE a.cycle_id = ? AND a.member_id = ?
      LIMIT 1
    `,
    [cycleId, targetMemberId],
  );

  if (!assignment) {
    return json({ error: "This member is not assigned to the chosen cycle." }, 400);
  }

  await run(
    env,
    `
      INSERT INTO cleaning_feedback (id, cycle_id, author_member_id, target_member_id, rating, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [crypto.randomUUID(), cycleId, actor.id, targetMemberId, rating, comment],
  );

  return json({ ok: true });
}

async function buildDashboard(env, member) {
  const today = todayInTimeZone(getConfig(env).timeZone);
  const [currentCycleRow, nextCycleRow, recentCycleRows, upcomingGames, feedback, roster] =
    await Promise.all([
      first(
        env,
        `
          SELECT *
          FROM cleaning_cycles
          WHERE starts_on <= ? AND ends_on >= ?
          ORDER BY starts_on DESC
          LIMIT 1
        `,
        [today, today],
      ),
      first(
        env,
        `
          SELECT *
          FROM cleaning_cycles
          WHERE starts_on > ?
          ORDER BY starts_on ASC
          LIMIT 1
        `,
        [today],
      ),
      all(
        env,
        `
          SELECT *
          FROM cleaning_cycles
          ORDER BY starts_on DESC
          LIMIT 6
        `,
      ),
      all(
        env,
        `
          SELECT id, title, event_date, starts_at, ends_at, notes, status
          FROM game_events
          WHERE event_date >= ? AND status != 'cancelled'
          ORDER BY event_date ASC
          LIMIT 8
        `,
        [today],
      ),
      all(
        env,
        `
          SELECT
            f.id,
            f.rating,
            f.comment,
            f.created_at,
            author.display_name AS author_name,
            target.display_name AS target_name
          FROM cleaning_feedback f
          JOIN members author ON author.id = f.author_member_id
          JOIN members target ON target.id = f.target_member_id
          ORDER BY f.created_at DESC
          LIMIT 8
        `,
      ),
      loadRoster(env),
    ]);

  return {
    me: memberToClient(member),
    currentCycle: currentCycleRow ? await hydrateCycle(env, currentCycleRow) : null,
    nextCycle: nextCycleRow ? await hydrateCycle(env, nextCycleRow) : null,
    recentCycles: await Promise.all(recentCycleRows.map((row) => hydrateCycle(env, row))),
    upcomingGames: upcomingGames.map((row) => ({
      id: row.id,
      title: row.title,
      eventDate: row.event_date,
      startsAt: row.starts_at,
      endsAt: row.ends_at,
      notes: row.notes,
      status: row.status,
    })),
    recentFeedback: feedback.map((row) => ({
      id: row.id,
      rating: Number(row.rating),
      comment: row.comment,
      createdAt: row.created_at,
      authorName: row.author_name,
      targetName: row.target_name,
    })),
    roster,
  };
}

async function loadRoster(env) {
  const rows = await all(
    env,
    `
      SELECT
        m.id,
        m.email,
        m.display_name,
        m.role,
        m.status,
        m.duty_count,
        COUNT(f.id) AS feedback_count,
        ROUND(AVG(f.rating), 1) AS average_rating
      FROM members m
      LEFT JOIN cleaning_feedback f ON f.target_member_id = m.id
      WHERE m.status = 'active'
      GROUP BY m.id
      ORDER BY m.role DESC, m.display_name ASC
    `,
  );

  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    status: row.status,
    dutyCount: Number(row.duty_count || 0),
    feedbackCount: Number(row.feedback_count || 0),
    averageRating:
      row.average_rating === null || row.average_rating === undefined
        ? null
        : Number(row.average_rating),
  }));
}

async function hydrateCycle(env, cycleRow) {
  const assignees = await all(
    env,
    `
      SELECT m.id, m.email, m.display_name, m.role, m.status, m.duty_count
      FROM cycle_assignments a
      JOIN members m ON m.id = a.member_id
      WHERE a.cycle_id = ?
      ORDER BY a.assignment_order ASC, m.display_name ASC
    `,
    [cycleRow.id],
  );

  return {
    id: cycleRow.id,
    startsOn: cycleRow.starts_on,
    endsOn: cycleRow.ends_on,
    plannedCleaningDate: cycleRow.planned_cleaning_date,
    status: cycleRow.status,
    notes: cycleRow.notes || "",
    createdAt: cycleRow.created_at,
    assignees: assignees.map((member) => memberToClient(member)),
  };
}

async function createNextCycle(env, createdByMemberId) {
  const config = getConfig(env);
  const today = todayInTimeZone(config.timeZone);
  const futureCycle = await first(
    env,
    `
      SELECT *
      FROM cleaning_cycles
      WHERE starts_on > ? AND status = 'scheduled'
      ORDER BY starts_on ASC
      LIMIT 1
    `,
    [today],
  );

  if (futureCycle) {
    return {
      ok: false,
      error: "There is already a future cleaning cycle waiting in the queue.",
    };
  }

  const lastCycle = await first(
    env,
    `
      SELECT *
      FROM cleaning_cycles
      ORDER BY ends_on DESC
      LIMIT 1
    `,
  );

  const startsOn = lastCycle ? addDays(lastCycle.ends_on, 1) : today;
  const endsOn = addDays(startsOn, config.dutyIntervalDays - 1);
  const gameRows = await all(
    env,
    `
      SELECT event_date
      FROM game_events
      WHERE event_date >= ? AND event_date <= ? AND status != 'cancelled'
    `,
    [startsOn, endsOn],
  );
  const gameDates = new Set(gameRows.map((row) => row.event_date));

  const members = await all(
    env,
    `
      SELECT id, email, display_name, role, status, duty_count
      FROM members
      WHERE status = 'active'
      ORDER BY display_name ASC
    `,
  );

  if (members.length < config.dutyTeamSize) {
    return {
      ok: false,
      error: "There are not enough active guild members to assign a cleaning party.",
    };
  }

  const unavailableRows = await all(
    env,
    `
      SELECT member_id
      FROM member_unavailability
      WHERE starts_on <= ? AND ends_on >= ?
    `,
    [endsOn, startsOn],
  );
  const unavailableIds = new Set(unavailableRows.map((row) => row.member_id));

  const lastAssignments = lastCycle
    ? await all(
        env,
        "SELECT member_id FROM cycle_assignments WHERE cycle_id = ?",
        [lastCycle.id],
      )
    : [];
  const recentlyAssignedIds = new Set(lastAssignments.map((row) => row.member_id));

  const assignees = pickAssignees(
    members.map((row) => ({
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      dutyCount: Number(row.duty_count || 0),
    })),
    config.dutyTeamSize,
    recentlyAssignedIds,
    unavailableIds,
  );

  const plannedCleaningDate = pickCleaningDate(
    startsOn,
    endsOn,
    gameDates,
    config.preferredWeekdays,
  );
  const cycleId = crypto.randomUUID();

  await run(
    env,
    `
      INSERT INTO cleaning_cycles (
        id,
        starts_on,
        ends_on,
        planned_cleaning_date,
        status,
        notes,
        created_by_member_id
      )
      VALUES (?, ?, ?, ?, 'scheduled', '', ?)
    `,
    [cycleId, startsOn, endsOn, plannedCleaningDate, createdByMemberId],
  );

  for (const [index, assignee] of assignees.entries()) {
    await run(
      env,
      `
        INSERT INTO cycle_assignments (id, cycle_id, member_id, assignment_score, assignment_order)
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        crypto.randomUUID(),
        cycleId,
        assignee.id,
        assignee.score,
        index + 1,
      ],
    );

    await run(
      env,
      `
        UPDATE members
        SET duty_count = duty_count + 1, updated_at = ?
        WHERE id = ?
      `,
      [new Date().toISOString(), assignee.id],
    );

    const delivery = await sendAssignmentEmail(env, {
      email: assignee.email,
      displayName: assignee.displayName,
      startsOn,
      endsOn,
      plannedCleaningDate,
    });

    await logNotification(env, {
      kind: "cycle-created",
      cycleId,
      memberId: assignee.id,
      deliveryStatus: delivery.mode,
    });
  }

  const cycle = await hydrateCycle(
    env,
    await first(env, "SELECT * FROM cleaning_cycles WHERE id = ? LIMIT 1", [cycleId]),
  );

  return { ok: true, cycle };
}

function pickAssignees(members, targetCount, recentlyAssignedIds, unavailableIds) {
  const availablePool = members.filter((member) => !unavailableIds.has(member.id));
  const primaryPool = availablePool.length >= targetCount ? availablePool : members;
  const restedPool = primaryPool.filter((member) => !recentlyAssignedIds.has(member.id));
  const candidatePool = restedPool.length >= targetCount ? restedPool : primaryPool;

  const ranked = candidatePool
    .map((member) => {
      let score = member.dutyCount;
      if (recentlyAssignedIds.has(member.id)) {
        score += 2;
      }
      if (unavailableIds.has(member.id)) {
        score += 10;
      }
      return { ...member, score, tieBreaker: randomInteger(1_000_000) };
    })
    .sort((left, right) => {
      if (left.score !== right.score) {
        return left.score - right.score;
      }
      return left.tieBreaker - right.tieBreaker;
    });

  return ranked.slice(0, targetCount);
}

function pickCleaningDate(startsOn, endsOn, gameDates, preferredWeekdays) {
  let bestDate = startsOn;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let date = startsOn; date <= endsOn; date = addDays(date, 1)) {
    const weekday = dateToUtcDate(date).getUTCDay();
    let score = 0;

    if (!preferredWeekdays.includes(weekday)) {
      score += 3;
    }
    if (weekday === 0 || weekday === 6) {
      score += 6;
    }
    if (gameDates.has(date)) {
      score += 15;
    }

    if (score < bestScore) {
      bestDate = date;
      bestScore = score;
    }
  }

  return bestDate;
}

async function runScheduledTasks(env) {
  await ensureBootstrapMembers(env);
  await cleanupExpiredRows(env);
  await sendSameDayReminders(env);
}

async function sendSameDayReminders(env) {
  const config = getConfig(env);
  const today = todayInTimeZone(config.timeZone);
  const rows = await all(
    env,
    `
      SELECT
        c.id AS cycle_id,
        c.planned_cleaning_date,
        c.starts_on,
        c.ends_on,
        m.id AS member_id,
        m.email,
        m.display_name
      FROM cleaning_cycles c
      JOIN cycle_assignments a ON a.cycle_id = c.id
      JOIN members m ON m.id = a.member_id
      WHERE c.planned_cleaning_date = ? AND c.status = 'scheduled'
    `,
    [today],
  );

  for (const row of rows) {
    const alreadySent = await first(
      env,
      `
        SELECT id
        FROM notification_logs
        WHERE kind = 'cleaning-reminder'
          AND cycle_id = ?
          AND member_id = ?
        LIMIT 1
      `,
      [row.cycle_id, row.member_id],
    );

    if (alreadySent) {
      continue;
    }

    const delivery = await sendReminderEmail(env, {
      email: row.email,
      displayName: row.display_name,
      plannedCleaningDate: row.planned_cleaning_date,
      startsOn: row.starts_on,
      endsOn: row.ends_on,
    });

    await logNotification(env, {
      kind: "cleaning-reminder",
      cycleId: row.cycle_id,
      memberId: row.member_id,
      deliveryStatus: delivery.mode,
    });
  }
}

async function cleanupExpiredRows(env) {
  const now = new Date().toISOString();
  await Promise.all([
    run(env, "DELETE FROM login_codes WHERE expires_at < ? OR used_at IS NOT NULL", [now]),
    run(env, "DELETE FROM sessions WHERE expires_at < ?", [now]),
  ]);
}

async function ensureBootstrapMembers(env) {
  const emails = String(env.ADMIN_BOOTSTRAP_EMAILS || "")
    .split(",")
    .map((item) => normalizeEmail(item))
    .filter(Boolean);

  if (!emails.length) {
    return;
  }

  const hasAdmin = await first(
    env,
    "SELECT id FROM members WHERE role = 'admin' AND status = 'active' LIMIT 1",
  );

  if (hasAdmin) {
    return;
  }

  const now = new Date().toISOString();
  for (const email of emails) {
    const displayName = displayNameFromEmail(email);
    await run(
      env,
      `
        INSERT OR IGNORE INTO members (
          id,
          email,
          display_name,
          role,
          status,
          approved_at,
          updated_at
        )
        VALUES (?, ?, ?, 'admin', 'active', ?, ?)
      `,
      [crypto.randomUUID(), email, displayName, now, now],
    );

    await run(
      env,
      `
        UPDATE members
        SET role = 'admin', status = 'active', approved_at = COALESCE(approved_at, ?), updated_at = ?
        WHERE email = ?
      `,
      [now, now, email],
    );
  }
}

async function getCurrentMember(request, env) {
  const config = getConfig(env);
  const token = parseCookies(request.headers.get("Cookie")).get(
    config.sessionCookieName,
  );

  if (!token) {
    return null;
  }

  const sessionHash = await hashValue(token, env);
  const row = await first(
    env,
    `
      SELECT
        m.id,
        m.email,
        m.display_name,
        m.role,
        m.status,
        m.duty_count,
        s.id AS session_id
      FROM sessions s
      JOIN members m ON m.id = s.member_id
      WHERE s.session_hash = ?
        AND s.expires_at > ?
        AND m.status = 'active'
      LIMIT 1
    `,
    [sessionHash, new Date().toISOString()],
  );

  if (!row) {
    return null;
  }

  await run(
    env,
    "UPDATE sessions SET last_seen_at = ? WHERE id = ?",
    [new Date().toISOString(), row.session_id],
  );

  return row;
}

async function requireMember(request, env) {
  const member = await getCurrentMember(request, env);
  if (!member) {
    return json({ error: "You need to sign in first." }, 401);
  }
  return member;
}

async function requireAdmin(request, env) {
  const member = await requireMember(request, env);
  if (member instanceof Response) {
    return member;
  }
  if (member.role !== "admin") {
    return json({ error: "Only guild admins may do that." }, 403);
  }
  return member;
}

function memberToClient(member) {
  return {
    id: member.id,
    email: member.email,
    displayName: member.display_name,
    role: member.role,
    status: member.status,
    dutyCount: Number(member.duty_count || 0),
  };
}

function getConfig(env) {
  return {
    appName: String(env.APP_NAME || DEFAULTS.appName),
    timeZone: String(env.APP_TIMEZONE || DEFAULTS.timeZone),
    sessionCookieName: String(
      env.SESSION_COOKIE_NAME || DEFAULTS.sessionCookieName,
    ),
    sessionTtlDays: positiveInteger(
      env.SESSION_TTL_DAYS,
      DEFAULTS.sessionTtlDays,
    ),
    loginCodeTtlMinutes: positiveInteger(
      env.LOGIN_CODE_TTL_MINUTES,
      DEFAULTS.loginCodeTtlMinutes,
    ),
    dutyIntervalDays: positiveInteger(
      env.DUTY_INTERVAL_DAYS,
      DEFAULTS.dutyIntervalDays,
    ),
    dutyTeamSize: positiveInteger(env.DUTY_TEAM_SIZE, DEFAULTS.dutyTeamSize),
    preferredWeekdays: parseWeekdayList(
      env.PREFERRED_CLEANING_WEEKDAYS,
      DEFAULTS.preferredWeekdays,
    ),
    authDebugCodes:
      String(env.AUTH_DEBUG_CODES || String(DEFAULTS.authDebugCodes)) === "true",
    emailMode: String(env.EMAIL_MODE || DEFAULTS.emailMode),
  };
}

async function sendLoginCodeEmail(env, details) {
  const text = [
    `Hello, ${details.displayName}.`,
    "",
    `Your Duty Guild sign-in code is: ${details.code}`,
    `It stays valid until ${details.expiresAt}.`,
  ].join("\n");

  return sendEmail(env, {
    to: details.email,
    subject: "Duty Guild sign-in code",
    text,
    html: `<p>Hello, ${escapeHtml(details.displayName)}.</p><p>Your Duty Guild sign-in code is <strong>${details.code}</strong>.</p><p>It stays valid until ${escapeHtml(details.expiresAt)}.</p>`,
    debugCode: details.code,
  });
}

async function sendAssignmentEmail(env, details) {
  const text = [
    `Hello, ${details.displayName}.`,
    "",
    "A new cleaning cycle has been generated for your office party.",
    `Window: ${details.startsOn} to ${details.endsOn}`,
    `Recommended cleaning day: ${details.plannedCleaningDate}`,
  ].join("\n");

  return sendEmail(env, {
    to: details.email,
    subject: "Duty Guild: new cleaning duty",
    text,
    html: `<p>Hello, ${escapeHtml(details.displayName)}.</p><p>A new cleaning cycle has been generated for your office party.</p><p><strong>Window:</strong> ${escapeHtml(details.startsOn)} to ${escapeHtml(details.endsOn)}</p><p><strong>Recommended cleaning day:</strong> ${escapeHtml(details.plannedCleaningDate)}</p>`,
  });
}

async function sendReminderEmail(env, details) {
  const text = [
    `Hello, ${details.displayName}.`,
    "",
    "Reminder from Duty Guild:",
    `Today is the planned cleaning day for the cycle ${details.startsOn} to ${details.endsOn}.`,
    `Cleaning date: ${details.plannedCleaningDate}`,
  ].join("\n");

  return sendEmail(env, {
    to: details.email,
    subject: "Duty Guild reminder: cleaning day",
    text,
    html: `<p>Hello, ${escapeHtml(details.displayName)}.</p><p>Reminder from Duty Guild:</p><p>Today is the planned cleaning day for the cycle <strong>${escapeHtml(details.startsOn)}</strong> to <strong>${escapeHtml(details.endsOn)}</strong>.</p><p><strong>Cleaning date:</strong> ${escapeHtml(details.plannedCleaningDate)}</p>`,
  });
}

async function sendEmail(env, payload) {
  const config = getConfig(env);
  const useResend =
    config.emailMode === "resend" && String(env.RESEND_API_KEY || "").trim();

  if (!useResend) {
    console.log("Email stub", {
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
    });

    return {
      mode: "stub",
      debugCode: config.authDebugCodes ? payload.debugCode ?? null : null,
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM || "noreply@dutyguild.ru",
      to: [payload.to],
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Resend request failed", body);
    return {
      mode: "failed",
      debugCode: config.authDebugCodes ? payload.debugCode ?? null : null,
    };
  }

  return {
    mode: "resend",
    debugCode: config.authDebugCodes ? payload.debugCode ?? null : null,
  };
}

async function logNotification(env, entry) {
  await run(
    env,
    `
      INSERT INTO notification_logs (id, kind, cycle_id, member_id, delivery_status)
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      crypto.randomUUID(),
      entry.kind,
      entry.cycleId || null,
      entry.memberId || null,
      entry.deliveryStatus,
    ],
  );
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function first(env, sql, params = []) {
  return prepare(env, sql, params).first();
}

async function all(env, sql, params = []) {
  const result = await prepare(env, sql, params).all();
  return result.results || [];
}

async function run(env, sql, params = []) {
  return prepare(env, sql, params).run();
}

function prepare(env, sql, params) {
  const statement = env.DB.prepare(sql);
  return params.length ? statement.bind(...params) : statement;
}

function json(payload, status = 200, extraHeaders = {}) {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });

  for (const [key, value] of Object.entries(extraHeaders)) {
    headers.set(key, value);
  }

  return new Response(JSON.stringify(payload), {
    status,
    headers,
  });
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeTime(value) {
  const stringValue = String(value || "").trim();
  return /^\d{2}:\d{2}$/.test(stringValue) ? stringValue : null;
}

function isDateOnly(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function displayNameFromEmail(email) {
  if (!email) {
    return "Guild Member";
  }

  const stem = email.split("@")[0].replace(/[._-]+/g, " ");
  return stem
    .split(" ")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function generateLoginCode() {
  return String(100000 + randomInteger(900000));
}

function randomInteger(maxExclusive) {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] % maxExclusive;
}

function randomToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function hashValue(value, env) {
  const secret = String(env.APP_SECRET || "local-dev-secret");
  const input = new TextEncoder().encode(`${secret}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function parseCookies(headerValue) {
  const cookies = new Map();
  if (!headerValue) {
    return cookies;
  }

  for (const part of headerValue.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (!name) {
      continue;
    }
    cookies.set(name, decodeURIComponent(valueParts.join("=")));
  }

  return cookies;
}

function serializeSessionCookie(name, value, ttlDays, requestUrl) {
  const secure = new URL(requestUrl).protocol === "https:";
  const maxAge = ttlDays * 24 * 60 * 60;
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];

  if (secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function clearSessionCookie(name) {
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function positiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseWeekdayList(value, fallback) {
  const items = String(value || "")
    .split(",")
    .map((chunk) => Number.parseInt(chunk.trim(), 10))
    .filter((item) => Number.isInteger(item) && item >= 0 && item <= 6);

  return items.length ? items : fallback;
}

function todayInTimeZone(timeZone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDays(dateOnly, delta) {
  const date = dateToUtcDate(dateOnly);
  date.setUTCDate(date.getUTCDate() + delta);
  return date.toISOString().slice(0, 10);
}

function dateToUtcDate(dateOnly) {
  const [year, month, day] = dateOnly.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
