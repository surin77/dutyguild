import { readFileSync } from "node:fs";

const appScript = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const indexDocument = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const stylesSheet = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="shield" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#f4d28c" />
      <stop offset="100%" stop-color="#8c5524" />
    </linearGradient>
  </defs>
  <path d="M64 10 106 26v32c0 31-18 50-42 60C40 108 22 89 22 58V26Z" fill="url(#shield)" stroke="#351b10" stroke-width="8" />
  <path d="M64 30 78 57H50Z" fill="#351b10" />
  <circle cx="64" cy="75" r="15" fill="#351b10" />
</svg>
`;

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

const RANK_LADDER = Object.freeze([
  {
    id: "emberbound",
    minDutyCount: 0,
    title: "Искроносец Свитка",
    shortTitle: "Искроносец",
    crest: "I",
    sigil: "Искра Свитка",
    motto: "Каждый путь начинается с первой искры.",
    description: "Новобранец круга, чьё имя только внесено в свиток ордена.",
    theme: {
      panelStart: "#f9ebe1",
      panelEnd: "#efd8ca",
      crestStart: "#da7b49",
      crestEnd: "#8f2f1c",
      accent: "#a73d26",
      glow: "rgba(167, 61, 38, 0.18)",
    },
  },
  {
    id: "oathbearer",
    minDutyCount: 1,
    title: "Клятвенный Послушник",
    shortTitle: "Послушник",
    crest: "II",
    sigil: "Узел Клятвы",
    motto: "Служение крепнет там, где слово не расходится с делом.",
    description: "Первый ритуал пройден, клятва служения впервые подтверждена делом.",
    theme: {
      panelStart: "#f6ebdf",
      panelEnd: "#e7d7c0",
      crestStart: "#b99056",
      crestEnd: "#6c4522",
      accent: "#8f6330",
      glow: "rgba(143, 99, 48, 0.18)",
    },
  },
  {
    id: "torchwarden",
    minDutyCount: 3,
    title: "Факелоносец Порядка",
    shortTitle: "Факелоносец",
    crest: "III",
    sigil: "Факел Рассвета",
    motto: "Порядок держится там, где огонь не дают уронить.",
    description: "Соратник уже держит пламя порядка уверенно и не теряется в рутине круга.",
    theme: {
      panelStart: "#fbf0dc",
      panelEnd: "#f0dfbb",
      crestStart: "#f0ae47",
      crestEnd: "#9a4b19",
      accent: "#b96724",
      glow: "rgba(185, 103, 36, 0.18)",
    },
  },
  {
    id: "sealkeeper",
    minDutyCount: 6,
    title: "Хранитель Печати Зала",
    shortTitle: "Хранитель Печати",
    crest: "IV",
    sigil: "Печать Воска",
    motto: "Там, где знак нерушим, круг дышит спокойно.",
    description: "Орден доверяет ему поддерживать чистоту зала как незыблемый обет.",
    theme: {
      panelStart: "#f5e3df",
      panelEnd: "#ebd0c8",
      crestStart: "#b95e55",
      crestEnd: "#5f1f20",
      accent: "#8e373b",
      glow: "rgba(142, 55, 59, 0.2)",
    },
  },
  {
    id: "hallsentinel",
    minDutyCount: 10,
    title: "Страж Ритуального Зала",
    shortTitle: "Страж Зала",
    crest: "V",
    sigil: "Щит Зала",
    motto: "Верность порядку тише грома, но крепче камня.",
    description: "Опытный защитник порядка, на которого можно опереться без лишних слов.",
    theme: {
      panelStart: "#e6ecef",
      panelEnd: "#d7e0e6",
      crestStart: "#5a738a",
      crestEnd: "#2d3947",
      accent: "#3f566a",
      glow: "rgba(63, 86, 106, 0.18)",
    },
  },
  {
    id: "dawnmarshal",
    minDutyCount: 15,
    title: "Маршал Белого Пламени",
    shortTitle: "Маршал Пламени",
    crest: "VI",
    sigil: "Белое Пламя",
    motto: "Высшая дисциплина не шумит, а светит.",
    description: "Ветеран служения, несущий пример дисциплины и спокойной силы для всего круга.",
    theme: {
      panelStart: "#f8f3e5",
      panelEnd: "#ede2be",
      crestStart: "#e6c77a",
      crestEnd: "#8f6833",
      accent: "#a37a3f",
      glow: "rgba(163, 122, 63, 0.2)",
    },
  },
  {
    id: "archon",
    minDutyCount: 21,
    title: "Архон Вечного Порядка",
    shortTitle: "Архон Порядка",
    crest: "VII",
    sigil: "Звезда Архонта",
    motto: "Когда служение становится легендой, орден помнит его вечно.",
    description: "Высшая ступень братства для тех, чьё служение стало легендой летописи.",
    theme: {
      panelStart: "#eee7ef",
      panelEnd: "#d9cce2",
      crestStart: "#7a6295",
      crestEnd: "#2a2037",
      accent: "#5d4676",
      glow: "rgba(93, 70, 118, 0.22)",
    },
  },
]);

export async function handleRequest(request, env) {
  try {
    return withSecurityHeaders(await handleFetch(request, env), request);
  } catch (error) {
    console.error("Unhandled request error", error);
    return withSecurityHeaders(
      json(
        {
          error: "Внутри Duty Guild произошла ошибка.",
        },
        500,
      ),
      request,
    );
  }
}

export { runScheduledTasks };

async function handleFetch(request, env) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (shouldRedirectToHttps(url)) {
    url.protocol = "https:";
    return Response.redirect(url.toString(), 308);
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (!pathname.startsWith("/api/")) {
    return serveStaticAsset(pathname);
  }

  if (pathname === "/api/health" && request.method === "GET") {
    return json({ ok: true, hasDatabase: Boolean(env.DB) });
  }

  if (pathname === "/api/config" && request.method === "GET") {
    const config = getConfig(env);
    return json({
      appName: config.appName,
      timeZone: config.timeZone,
      dutyIntervalDays: config.dutyIntervalDays,
      dutyTeamSize: config.dutyTeamSize,
      debugAuthCodes: config.authDebugCodes,
      rankLadder: getRankLadder(),
    });
  }

  await ensureBootstrapMembers(env);

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

  if (
    (pathname === "/api/game-events" || pathname === "/api/admin/game-events") &&
    request.method === "POST"
  ) {
    const member = await requireMember(request, env);
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

  return json({ error: "Маршрут не найден." }, 404);
}

async function handleRequestCode(request, env) {
  const body = await readJson(request);
  const rawEmail = body?.email;
  const email = normalizeEmail(rawEmail);

  if (!isValidEmail(email)) {
    return json({ error: "Введите корректный рабочий email." }, 400);
  }

  const member = await first(
    env,
    "SELECT * FROM members WHERE email = ? AND status = 'active' LIMIT 1",
    [email],
  );

  if (!member) {
    return json({ error: "Этот адрес ещё не внесён Советом в свиток допуска." }, 403);
  }

  const config = getConfig(env);
  const code = generateLoginCode();
  const codeHash = await hashValue(`${email}:${code}`, env);
  const expiresAt = new Date(
    Date.now() + config.loginCodeTtlMinutes * 60 * 1000,
  ).toISOString();
  const loginCodeId = crypto.randomUUID();

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
    [loginCodeId, email, codeHash, expiresAt],
  );

  const delivery = await sendLoginCodeEmail(env, {
    email,
    displayName: member.display_name,
    code,
    expiresAt,
  });

  if (!delivery.ok) {
    await run(env, "DELETE FROM login_codes WHERE id = ?", [loginCodeId]);

    return json(
      {
        error:
          delivery.mode === "misconfigured"
            ? "Почтовый вестник ордена ещё не настроен. Обратитесь к Магистру Совета."
            : "Печать допуска не удалось отправить письмом. Попробуйте ещё раз чуть позже.",
      },
      502,
    );
  }

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
    return json({ error: "Печать не распознана. Проверьте email и код." }, 400);
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
    return json({ error: "Сначала призовите новую печать допуска." }, 400);
  }

  if (loginCode.used_at) {
    return json({ error: "Эта печать уже угасла и не может быть призвана вновь." }, 400);
  }

  if (new Date(loginCode.expires_at).getTime() <= Date.now()) {
    return json({ error: "Сила этой печати уже рассеялась." }, 400);
  }

  if (Number(loginCode.attempt_count || 0) >= 5) {
    return json({ error: "Слишком много попыток. Призовите новую печать допуска." }, 400);
  }

  const expectedHash = await hashValue(`${email}:${code}`, env);
  if (expectedHash !== loginCode.code_hash) {
    await run(
      env,
      "UPDATE login_codes SET attempt_count = attempt_count + 1 WHERE id = ?",
      [loginCode.id],
    );
    return json({ error: "Печать не совпадает." }, 400);
  }

  const member = await first(
    env,
    "SELECT * FROM members WHERE email = ? AND status = 'active' LIMIT 1",
    [email],
  );

  if (!member) {
    return json({ error: "Этот соратник сейчас не числится в активном круге." }, 403);
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
    return json({ error: "Введите корректный email для нового соратника." }, 400);
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
    return json({ error: "Заполните название события и дату." }, 400);
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
    return json({ error: "Заполните оценку, получателя свидетельства и комментарий хрониста." }, 400);
  }

  if (rating < 1 || rating > 5) {
    return json({ error: "Оценка должна быть от 1 до 5." }, 400);
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
    return json({ error: "Этот соратник не назначен на выбранный Ритуал Порядка." }, 400);
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
          SELECT
            g.id,
            g.title,
            g.event_date,
            g.starts_at,
            g.ends_at,
            g.notes,
            g.status,
            creator.display_name AS created_by_name
          FROM game_events g
          LEFT JOIN members creator ON creator.id = g.created_by_member_id
          WHERE g.event_date >= ? AND g.status != 'cancelled'
          ORDER BY g.event_date ASC
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
    me: roster.find((entry) => entry.id === member.id) || memberToClient(member),
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
      createdByName: row.created_by_name,
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

  return rows.map((row) => {
    const member = memberToClient(row);

    return {
      ...member,
      feedbackCount: Number(row.feedback_count || 0),
      averageRating:
        row.average_rating === null || row.average_rating === undefined
          ? null
          : Number(row.average_rating),
    };
  });
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
      error: "Следующий Ритуал Порядка уже вписан в летопись и ждёт своего часа.",
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
      error: "Недостаточно активных соратников, чтобы собрать отряд Хранителей Порядка.",
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
        INSERT INTO members (
          id,
          email,
          display_name,
          role,
          status,
          approved_at,
          updated_at
        )
        VALUES (?, ?, ?, 'admin', 'active', ?, ?)
        ON CONFLICT (email) DO NOTHING
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
    return json({ error: "Сначала нужно предъявить печать допуска." }, 401);
  }
  return member;
}

async function requireAdmin(request, env) {
  const member = await requireMember(request, env);
  if (member instanceof Response) {
    return member;
  }
  if (member.role !== "admin") {
    return json({ error: "Это право принадлежит только Магистрам Совета." }, 403);
  }
  return member;
}

function memberToClient(member) {
  const dutyCount = Number(member.duty_count || 0);
  const averageRating =
    member.average_rating === null ||
    member.average_rating === undefined ||
    member.average_rating === ""
      ? null
      : Number(member.average_rating);
  const rank = getMemberRank({ dutyCount, averageRating });

  return {
    id: member.id,
    email: member.email,
    displayName: member.display_name,
    role: member.role,
    status: member.status,
    dutyCount,
    rank,
  };
}

function getMemberRank({ dutyCount, averageRating }) {
  const ladder = RANK_LADDER;

  let currentRank = ladder[0];
  let nextRank = null;

  for (const rank of ladder) {
    if (dutyCount >= rank.minDutyCount) {
      currentRank = rank;
      continue;
    }

    nextRank = rank;
    break;
  }

  const currentStageFloor = currentRank.minDutyCount;
  const nextStageFloor = nextRank ? nextRank.minDutyCount : currentStageFloor;
  const progressCurrent = nextRank
    ? Math.max(dutyCount - currentStageFloor, 0)
    : Math.max(dutyCount, 0);
  const progressTarget = nextRank
    ? Math.max(nextStageFloor - currentStageFloor, 1)
    : Math.max(dutyCount, 1);
  const ritualsToNextRank = nextRank ? Math.max(nextStageFloor - dutyCount, 0) : 0;

  return {
    ...currentRank,
    dutyCount,
    averageRating,
    ritualsToNextRank,
    nextId: nextRank?.id || null,
    nextTitle: nextRank?.title || null,
    progressCurrent,
    progressTarget,
    stageLabel: nextRank
      ? `Ступень ${currentRank.crest} · ${progressCurrent} из ${progressTarget} служений этой ступени.`
      : `Ступень ${currentRank.crest} · вершина братства достигнута.`,
    progressLabel: nextRank
      ? `Следующая ступень — «${nextRank.title}». Осталось ${ritualsToNextRank} ритуал${pluralizeRussian(
          ritualsToNextRank,
          ["", "а", "ов"],
        )}.`
      : "Следующая ступень больше не скрыта: высший сан братства уже достигнут.",
    futureRatingHint:
      averageRating === null
        ? "Пока звание питается только числом ритуалов. Позже к нему прибавится сила славы."
        : "Слава уже учитывается в летописи и позже сможет усилить путь звания.",
  };
}

function getRankLadder() {
  return RANK_LADDER.map((rank, index) => {
    const nextRank = RANK_LADDER[index + 1] || null;

    return {
      id: rank.id,
      minDutyCount: rank.minDutyCount,
      title: rank.title,
      shortTitle: rank.shortTitle,
      crest: rank.crest,
      sigil: rank.sigil,
      motto: rank.motto,
      description: rank.description,
      theme: rank.theme,
      thresholdLabel:
        rank.minDutyCount === 0
          ? "Открывается сразу после внесения в свиток."
          : `Порог ступени: после ${rank.minDutyCount}-го ритуала служения.`,
      nextThresholdLabel: nextRank
        ? `Дальше: после ${nextRank.minDutyCount}-го ритуала служения.`
        : "Это вершина лестницы ордена.",
    };
  });
}

function pluralizeRussian(count, suffixes) {
  const value = Math.abs(Number(count || 0)) % 100;
  const remainder = value % 10;

  if (value > 10 && value < 20) {
    return suffixes[2];
  }
  if (remainder > 1 && remainder < 5) {
    return suffixes[1];
  }
  if (remainder === 1) {
    return suffixes[0];
  }
  return suffixes[2];
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
    `${details.displayName}, приветствую.`,
    "",
    `Ваша печать допуска в Duty Guild: ${details.code}`,
    `Её сила сохранится до ${details.expiresAt}.`,
  ].join("\n");

  return sendEmail(env, {
    to: details.email,
    subject: "Duty Guild: печать допуска",
    text,
    html: `<p>${escapeHtml(details.displayName)}, приветствую.</p><p>Ваша печать допуска в Duty Guild: <strong>${details.code}</strong>.</p><p>Её сила сохранится до ${escapeHtml(details.expiresAt)}.</p>`,
    debugCode: details.code,
  });
}

async function sendAssignmentEmail(env, details) {
  const text = [
    `${details.displayName}, приветствую.`,
    "",
    "Для вашей команды созван новый Ритуал Порядка.",
    `Окно ритуала: ${details.startsOn} - ${details.endsOn}`,
    `Рекомендованный день ритуала: ${details.plannedCleaningDate}`,
  ].join("\n");

  return sendEmail(env, {
    to: details.email,
    subject: "Duty Guild: созван Ритуал Порядка",
    text,
    html: `<p>${escapeHtml(details.displayName)}, приветствую.</p><p>Для вашей команды созван новый Ритуал Порядка.</p><p><strong>Окно ритуала:</strong> ${escapeHtml(details.startsOn)} - ${escapeHtml(details.endsOn)}</p><p><strong>Рекомендованный день ритуала:</strong> ${escapeHtml(details.plannedCleaningDate)}</p>`,
  });
}

async function sendReminderEmail(env, details) {
  const text = [
    `${details.displayName}, приветствую.`,
    "",
    "Напоминание от Duty Guild.",
    `Сегодня настал день Ритуала Порядка для окна ${details.startsOn} - ${details.endsOn}.`,
    `Дата ритуала: ${details.plannedCleaningDate}`,
  ].join("\n");

  return sendEmail(env, {
    to: details.email,
    subject: "Duty Guild: напоминание о Ритуале Порядка",
    text,
    html: `<p>${escapeHtml(details.displayName)}, приветствую.</p><p>Напоминание от Duty Guild.</p><p>Сегодня настал день Ритуала Порядка для окна <strong>${escapeHtml(details.startsOn)}</strong> - <strong>${escapeHtml(details.endsOn)}</strong>.</p><p><strong>Дата ритуала:</strong> ${escapeHtml(details.plannedCleaningDate)}</p>`,
  });
}

async function sendEmail(env, payload) {
  const config = getConfig(env);
  const senderAddress = String(
    env.EMAIL_FROM || "noreply@dutyguild.ru",
  ).trim().toLowerCase();

  if (config.emailMode === "stub") {
    console.log("Email stub", {
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
    });

    return {
      ok: true,
      mode: "stub",
      debugCode: config.authDebugCodes ? payload.debugCode ?? null : null,
    };
  }

  if (config.emailMode === "smtp" && typeof env.SMTP_TRANSPORTER?.sendMail !== "function") {
    console.error("SMTP email mode is enabled, but SMTP transporter is missing.");
    return {
      ok: false,
      mode: "misconfigured",
      debugCode: config.authDebugCodes ? payload.debugCode ?? null : null,
    };
  }

  if (config.emailMode !== "smtp") {
    console.error(`Unsupported email mode: ${config.emailMode}`);
    return {
      ok: false,
      mode: "misconfigured",
      debugCode: config.authDebugCodes ? payload.debugCode ?? null : null,
    };
  }

  try {
    await env.SMTP_TRANSPORTER.sendMail({
      from: `Duty Guild <${senderAddress}>`,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });

    return {
      ok: true,
      mode: "smtp",
      debugCode: config.authDebugCodes ? payload.debugCode ?? null : null,
    };
  } catch (error) {
    console.error("SMTP email send failed", error);
    return {
      ok: false,
      mode: "failed",
      debugCode: config.authDebugCodes ? payload.debugCode ?? null : null,
    };
  }
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
  if (!env.DB || typeof env.DB.prepare !== "function") {
    throw new Error("Database adapter DB is not available.");
  }
  const statement = env.DB.prepare(sql);
  return params.length ? statement.bind(...params) : statement;
}

function serveStaticAsset(pathname) {
  const asset = getStaticAsset(pathname);
  if (!asset) {
    return new Response("Не найдено.", { status: 404 });
  }

  return new Response(asset.body, {
    status: 200,
    headers: {
      "Content-Type": asset.contentType,
      "Cache-Control": asset.cacheControl,
    },
  });
}

function getStaticAsset(pathname) {
  if (pathname === "/styles.css") {
    return {
      body: stylesSheet,
      contentType: "text/css; charset=utf-8",
      cacheControl: "public, max-age=3600",
    };
  }

  if (pathname === "/app.js") {
    return {
      body: appScript,
      contentType: "text/javascript; charset=utf-8",
      cacheControl: "public, max-age=3600",
    };
  }

  if (pathname === "/favicon.svg" || pathname === "/favicon.ico") {
    return {
      body: FAVICON_SVG,
      contentType: "image/svg+xml",
      cacheControl: "public, max-age=86400",
    };
  }

  if (pathname === "/" || pathname === "/index.html" || !pathname.includes(".")) {
    return {
      body: indexDocument,
      contentType: "text/html; charset=utf-8",
      cacheControl: "no-store",
    };
  }

  return null;
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

function buildMimeMessage({ from, to, subject, text, html }) {
  const boundary = `dg-${crypto.randomUUID()}`;
  const messageId = buildMessageId(from);
  const headers = [
    `From: Duty Guild <${from}>`,
    `To: <${to}>`,
    `Subject: ${encodeMimeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: ${messageId}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ];

  return [
    ...headers,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrapMimeBase64(text),
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrapMimeBase64(html),
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");
}

function encodeMimeHeader(value) {
  return `=?UTF-8?B?${base64Utf8(value)}?=`;
}

function wrapMimeBase64(value) {
  return chunkString(base64Utf8(value), 76).join("\r\n");
}

function base64Utf8(value) {
  const bytes = new TextEncoder().encode(String(value || ""));
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function chunkString(value, size) {
  const chunks = [];
  for (let index = 0; index < value.length; index += size) {
    chunks.push(value.slice(index, index + size));
  }
  return chunks;
}

function buildMessageId(from) {
  const domain = String(from || "").split("@")[1] || "notify.dutyguild.ru";
  return `<${crypto.randomUUID()}@${domain}>`;
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
    return "Соратник круга";
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

function shouldRedirectToHttps(url) {
  if (url.protocol !== "http:") {
    return false;
  }

  return !isLocalHostname(url.hostname);
}

function isLocalHostname(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function withSecurityHeaders(response, request) {
  const url = new URL(request.url);
  const headers = new Headers(response.headers);

  if (url.protocol === "https:" && !isLocalHostname(url.hostname)) {
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
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
