const state = {
  config: null,
  me: null,
  dashboard: null,
  loading: true,
  loginEmail: "",
  loginCode: "",
  pendingEmail: "",
  debugCode: "",
  notice: "",
  error: "",
  busy: false,
};

const root = document.querySelector("#app");

boot().catch((error) => {
  console.error(error);
  state.loading = false;
  state.error = error.message || "Failed to open the guild hall.";
  render();
});

async function boot() {
  const configResponse = await api("/api/config");
  state.config = configResponse;

  const sessionResponse = await api("/api/me", { allow401: true });
  state.me = sessionResponse.member;

  if (state.me) {
    state.dashboard = await api("/api/dashboard");
  }

  state.loading = false;
  render();
}

function render() {
  if (state.loading) {
    root.innerHTML = `
      <main class="shell">
        <section class="loading-panel panel">
          <p class="eyebrow">Duty Guild</p>
          <h1>Opening the guild hall...</h1>
          <p class="muted">Preparing rosters, events and duty ledgers.</p>
        </section>
      </main>
    `;
    return;
  }

  root.innerHTML = `
    <main class="shell">
      ${renderHero()}
      ${renderFlash()}
      ${state.me ? renderDashboard() : renderAuth()}
    </main>
  `;

  bindEvents();
}

function renderHero() {
  const appName = escapeHtml(state.config?.appName || "Duty Guild");
  return `
    <section class="hero panel">
      <div class="hero-copy">
        <p class="eyebrow">Office Campaign Board</p>
        <h1>${appName}</h1>
        <p class="lead">
          Closed office roster for cleaning duty, board-game planning and team reputation.
        </p>
        <div class="hero-pills">
          <span class="pill">Invite only</span>
          <span class="pill">Email sign-in</span>
          <span class="pill">Biweekly cycles</span>
        </div>
      </div>
      <div class="hero-side">
        <div class="crest-card">
          <p class="crest-title">Guild Charter</p>
          <p>
            Duty parties are assigned fairly, game nights stay visible, and entry is limited to the
            office roster.
          </p>
        </div>
      </div>
    </section>
  `;
}

function renderFlash() {
  if (!state.notice && !state.error) {
    return "";
  }

  const className = state.error ? "flash flash-error" : "flash flash-notice";
  const message = escapeHtml(state.error || state.notice);
  return `<section class="${className}">${message}</section>`;
}

function renderAuth() {
  const debugBlock = state.debugCode
    ? `
      <div class="debug-card">
        <p class="eyebrow">Local dev helper</p>
        <strong>${escapeHtml(state.debugCode)}</strong>
        <span>Visible only when debug codes are enabled.</span>
      </div>
    `
    : "";

  return `
    <section class="auth-layout">
      <div class="panel auth-panel">
        <p class="eyebrow">Sign In</p>
        <h2>${state.pendingEmail ? "Enter your guild code" : "Request a magic code"}</h2>
        <p class="muted">
          Access is limited to approved office emails. An admin adds members first, then sign-in works.
        </p>
        ${
          state.pendingEmail
            ? `
              <form id="verify-form" class="stack-form">
                <label>
                  <span>Email</span>
                  <input id="login-email" name="email" type="email" value="${escapeHtml(
                    state.pendingEmail,
                  )}" readonly />
                </label>
                <label>
                  <span>6-digit code</span>
                  <input id="login-code" name="code" inputmode="numeric" maxlength="6" placeholder="123456" value="${escapeHtml(
                    state.loginCode,
                  )}" />
                </label>
                <div class="button-row">
                  <button class="button" type="submit" ${
                    state.busy ? "disabled" : ""
                  }>Enter the hall</button>
                  <button id="back-to-email" class="button button-secondary" type="button" ${
                    state.busy ? "disabled" : ""
                  }>Back</button>
                </div>
              </form>
              ${debugBlock}
            `
            : `
              <form id="request-code-form" class="stack-form">
                <label>
                  <span>Work email</span>
                  <input id="request-email" name="email" type="email" placeholder="name@dutyguild.ru" value="${escapeHtml(
                    state.loginEmail,
                  )}" />
                </label>
                <button class="button" type="submit" ${
                  state.busy ? "disabled" : ""
                }>Send sign-in code</button>
              </form>
            `
        }
      </div>

      <div class="panel side-quest">
        <p class="eyebrow">What is already wired</p>
        <ul class="feature-list">
          <li>Approved member list in D1</li>
          <li>Email code auth with secure session cookie</li>
          <li>Manual cycle generation with fair rotation</li>
          <li>Board-game events to avoid schedule collisions</li>
          <li>Dungeons-and-duties visual shell</li>
        </ul>
      </div>
    </section>
  `;
}

function renderDashboard() {
  const stats = getStats();
  const currentCycle = renderCyclePanel(
    "Current quest",
    state.dashboard.currentCycle,
    "No active cycle yet. Generate one from the admin panel when the guild is ready.",
  );
  const nextCycle = renderCyclePanel(
    "Next quest",
    state.dashboard.nextCycle,
    "No future cycle is queued yet.",
  );

  return `
    <section class="toolbar panel">
      <div>
        <p class="eyebrow">Signed in as</p>
        <h2>${escapeHtml(state.me.displayName)}</h2>
        <p class="muted">${escapeHtml(state.me.email)} · ${escapeHtml(state.me.role)}</p>
      </div>
      <div class="button-row">
        <button id="refresh-dashboard" class="button button-secondary" type="button">Refresh board</button>
        <button id="logout-button" class="button" type="button">Leave hall</button>
      </div>
    </section>

    <section class="stats-grid">
      <div class="panel stat-card">
        <span class="stat-label">Guild members</span>
        <strong>${stats.memberCount}</strong>
      </div>
      <div class="panel stat-card">
        <span class="stat-label">Cycles logged</span>
        <strong>${stats.cycleCount}</strong>
      </div>
      <div class="panel stat-card">
        <span class="stat-label">Upcoming game nights</span>
        <strong>${stats.gameCount}</strong>
      </div>
      <div class="panel stat-card">
        <span class="stat-label">Average feedback</span>
        <strong>${stats.averageRating}</strong>
      </div>
    </section>

    <section class="dashboard-grid">
      ${currentCycle}
      ${nextCycle}
      ${renderGamesPanel()}
      ${renderFeedbackPanel()}
      ${renderRosterPanel()}
      ${state.me.role === "admin" ? renderAdminPanel() : ""}
    </section>
  `;
}

function renderCyclePanel(title, cycle, emptyText) {
  if (!cycle) {
    return `
      <section class="panel">
        <p class="eyebrow">${escapeHtml(title)}</p>
        <h3>Awaiting assignment</h3>
        <p class="muted">${escapeHtml(emptyText)}</p>
      </section>
    `;
  }

  const badges = cycle.assignees
    .map(
      (member) => `<span class="pill">${escapeHtml(member.displayName)}</span>`,
    )
    .join("");

  return `
    <section class="panel">
      <p class="eyebrow">${escapeHtml(title)}</p>
      <h3>${formatDate(cycle.plannedCleaningDate)}</h3>
      <p class="muted">
        Cycle runs from ${formatDate(cycle.startsOn)} to ${formatDate(cycle.endsOn)}.
      </p>
      <div class="pill-row">${badges || '<span class="muted">No assignees</span>'}</div>
    </section>
  `;
}

function renderGamesPanel() {
  const items = state.dashboard.upcomingGames
    .map(
      (event) => `
        <li class="list-item">
          <strong>${escapeHtml(event.title)}</strong>
          <span>${formatEventDate(event)}</span>
          ${event.notes ? `<p>${escapeHtml(event.notes)}</p>` : ""}
        </li>
      `,
    )
    .join("");

  return `
    <section class="panel">
      <p class="eyebrow">Tavern events</p>
      <h3>Upcoming game nights</h3>
      ${
        items
          ? `<ul class="card-list">${items}</ul>`
          : '<p class="muted">No board-game events yet.</p>'
      }
    </section>
  `;
}

function renderFeedbackPanel() {
  const items = state.dashboard.recentFeedback
    .map(
      (entry) => `
        <li class="list-item">
          <div class="feedback-line">
            <strong>${escapeHtml(entry.targetName)}</strong>
            <span>${"★".repeat(entry.rating)}</span>
          </div>
          <p>${escapeHtml(entry.comment)}</p>
          <span class="muted">By ${escapeHtml(entry.authorName)} on ${formatDateTime(entry.createdAt)}</span>
        </li>
      `,
    )
    .join("");

  return `
    <section class="panel">
      <p class="eyebrow">Reputation ledger</p>
      <h3>Recent feedback</h3>
      ${
        items
          ? `<ul class="card-list">${items}</ul>`
          : '<p class="muted">Feedback will appear here once the team starts using the cycle history.</p>'
      }
    </section>
  `;
}

function renderRosterPanel() {
  const rows = state.dashboard.roster
    .map(
      (member) => `
        <tr>
          <td>${escapeHtml(member.displayName)}</td>
          <td>${escapeHtml(member.role)}</td>
          <td>${member.dutyCount}</td>
          <td>${member.averageRating === null ? "—" : member.averageRating.toFixed(1)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <section class="panel roster-panel">
      <p class="eyebrow">Guild roster</p>
      <h3>Active members</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Duty count</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderAdminPanel() {
  return `
    <section class="panel admin-panel">
      <p class="eyebrow">Guildmaster tools</p>
      <h3>Admin console</h3>
      <div class="admin-grid">
        <form id="invite-member-form" class="stack-form">
          <h4>Approve member</h4>
          <label>
            <span>Name</span>
            <input name="displayName" placeholder="Mila the Brave" />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="mila@dutyguild.ru" />
          </label>
          <label>
            <span>Role</span>
            <select name="role">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button class="button" type="submit" ${state.busy ? "disabled" : ""}>Save member</button>
        </form>

        <form id="game-event-form" class="stack-form">
          <h4>Add board-game night</h4>
          <label>
            <span>Title</span>
            <input name="title" placeholder="Root rematch" />
          </label>
          <label>
            <span>Date</span>
            <input name="eventDate" type="date" />
          </label>
          <div class="split-fields">
            <label>
              <span>Start</span>
              <input name="startsAt" type="time" />
            </label>
            <label>
              <span>End</span>
              <input name="endsAt" type="time" />
            </label>
          </div>
          <label>
            <span>Notes</span>
            <textarea name="notes" rows="3" placeholder="Optional details"></textarea>
          </label>
          <button class="button" type="submit" ${state.busy ? "disabled" : ""}>Save event</button>
        </form>
      </div>

      <div class="cycle-tool">
        <div>
          <h4>Generate the next cleaning cycle</h4>
          <p class="muted">
            The system picks a balanced party, tries to avoid recent assignees and steers away from game nights.
          </p>
        </div>
        <button id="generate-cycle-button" class="button" type="button" ${
          state.busy ? "disabled" : ""
        }>Generate cycle</button>
      </div>
    </section>
  `;
}

function bindEvents() {
  const requestForm = document.querySelector("#request-code-form");
  if (requestForm) {
    requestForm.addEventListener("submit", onRequestCode);
    const input = requestForm.querySelector("#request-email");
    input?.addEventListener("input", (event) => {
      state.loginEmail = event.target.value;
    });
  }

  const verifyForm = document.querySelector("#verify-form");
  if (verifyForm) {
    verifyForm.addEventListener("submit", onVerifyCode);
    const input = verifyForm.querySelector("#login-code");
    input?.addEventListener("input", (event) => {
      state.loginCode = event.target.value;
    });
  }

  document.querySelector("#back-to-email")?.addEventListener("click", () => {
    state.pendingEmail = "";
    state.loginCode = "";
    state.debugCode = "";
    state.notice = "";
    state.error = "";
    render();
  });

  document.querySelector("#refresh-dashboard")?.addEventListener("click", refreshDashboard);
  document.querySelector("#logout-button")?.addEventListener("click", onLogout);
  document.querySelector("#generate-cycle-button")?.addEventListener("click", onGenerateCycle);
  document.querySelector("#invite-member-form")?.addEventListener("submit", onInviteMember);
  document.querySelector("#game-event-form")?.addEventListener("submit", onCreateGameEvent);
}

async function onRequestCode(event) {
  event.preventDefault();
  await withBusy(async () => {
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const response = await api("/api/auth/request-code", {
      method: "POST",
      body: { email },
    });

    state.pendingEmail = email;
    state.loginEmail = email;
    state.debugCode = response.debugCode || "";
    state.notice = "A fresh sign-in code has been prepared for this email.";
    state.error = "";
    render();
  });
}

async function onVerifyCode(event) {
  event.preventDefault();
  await withBusy(async () => {
    const response = await api("/api/auth/verify-code", {
      method: "POST",
      body: {
        email: state.pendingEmail,
        code: state.loginCode,
      },
    });

    state.me = response.member;
    state.pendingEmail = "";
    state.loginCode = "";
    state.debugCode = "";
    state.notice = "Welcome back to the guild hall.";
    state.error = "";
    state.dashboard = await api("/api/dashboard");
    render();
  });
}

async function refreshDashboard() {
  await withBusy(async () => {
    state.dashboard = await api("/api/dashboard");
    state.notice = "Guild board refreshed.";
    state.error = "";
    render();
  });
}

async function onLogout() {
  await withBusy(async () => {
    await api("/api/auth/logout", { method: "POST" });
    state.me = null;
    state.dashboard = null;
    state.notice = "You left the guild hall.";
    state.error = "";
    render();
  });
}

async function onInviteMember(event) {
  event.preventDefault();
  await withBusy(async () => {
    const formData = new FormData(event.currentTarget);
    await api("/api/admin/members", {
      method: "POST",
      body: {
        displayName: formData.get("displayName"),
        email: formData.get("email"),
        role: formData.get("role"),
      },
    });
    event.currentTarget.reset();
    state.dashboard = await api("/api/dashboard");
    state.notice = "Member approved and added to the roster.";
    state.error = "";
    render();
  });
}

async function onCreateGameEvent(event) {
  event.preventDefault();
  await withBusy(async () => {
    const formData = new FormData(event.currentTarget);
    await api("/api/admin/game-events", {
      method: "POST",
      body: {
        title: formData.get("title"),
        eventDate: formData.get("eventDate"),
        startsAt: formData.get("startsAt"),
        endsAt: formData.get("endsAt"),
        notes: formData.get("notes"),
      },
    });
    event.currentTarget.reset();
    state.dashboard = await api("/api/dashboard");
    state.notice = "Game night added to the tavern board.";
    state.error = "";
    render();
  });
}

async function onGenerateCycle() {
  await withBusy(async () => {
    await api("/api/admin/cycles/generate", {
      method: "POST",
      body: {},
    });
    state.dashboard = await api("/api/dashboard");
    state.notice = "A fresh cleaning cycle has been generated.";
    state.error = "";
    render();
  });
}

async function withBusy(action) {
  if (state.busy) {
    return;
  }

  state.busy = true;
  render();

  try {
    await action();
  } catch (error) {
    console.error(error);
    state.error = error.message || "Something went wrong.";
    state.notice = "";
    render();
  } finally {
    state.busy = false;
    render();
  }
}

async function api(path, options = {}) {
  const fetchOptions = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (options.body !== undefined) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(path, fetchOptions);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (options.allow401 && response.status === 401) {
      return payload;
    }
    throw new Error(payload.error || `Request failed with status ${response.status}.`);
  }

  return payload;
}

function getStats() {
  const memberCount = state.dashboard?.roster?.length || 0;
  const cycleCount = state.dashboard?.recentCycles?.length || 0;
  const gameCount = state.dashboard?.upcomingGames?.length || 0;
  const ratings = (state.dashboard?.roster || [])
    .map((member) => member.averageRating)
    .filter((value) => typeof value === "number");

  return {
    memberCount,
    cycleCount,
    gameCount,
    averageRating: ratings.length
      ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1)
      : "—",
  };
}

function formatDate(dateString) {
  if (!dateString) {
    return "Not planned yet";
  }
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${dateString}T12:00:00Z`));
}

function formatDateTime(dateTime) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateTime));
}

function formatEventDate(event) {
  const dateLabel = formatDate(event.eventDate);
  if (!event.startsAt && !event.endsAt) {
    return dateLabel;
  }

  const timeRange = [event.startsAt, event.endsAt].filter(Boolean).join(" - ");
  return `${dateLabel}, ${timeRange}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

