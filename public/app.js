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
  state.error = error.message || "Не удалось открыть зал ордена Duty Guild.";
  render();
});

async function boot() {
  state.config = await api("/api/config");

  const sessionResponse = await api("/api/me", { allow401: true });
  state.me = sessionResponse.member;

  if (state.me) {
    state.dashboard = await api("/api/dashboard");
  }

  state.loading = false;
  render();
}

function render() {
  root.innerHTML = `
    <main class="page-shell">
      ${renderSiteHeader()}
      <div class="page-inner">
        ${state.loading ? renderLoading() : `${renderFlash()}${state.me ? renderDashboard() : renderAuth()}`}
      </div>
    </main>
  `;

  if (!state.loading) {
    bindEvents();
  }
}

function renderSiteHeader() {
  const appName = escapeHtml(state.config?.appName || "Duty Guild");
  const userLabel = state.me
    ? `
      <div class="header-user">
        <span class="header-user__name">${escapeHtml(state.me.displayName)}</span>
        <span class="header-user__meta">${roleLabel(state.me.role)} · ${escapeHtml(memberRankShort(state.me))}</span>
      </div>
    `
    : '<span class="header-user__meta">Закрытый зал ордена</span>';

  return `
    <header class="site-header">
      <div class="site-header__inner">
        <div class="brand-lockup">
          <div class="brand-mark">DG</div>
          <div class="brand-copy">
            <span class="brand-kicker">Duty Guild</span>
            <strong class="brand-title">${appName}</strong>
          </div>
        </div>
        <nav class="top-nav" aria-label="Разделы">
          <span class="top-nav__item">Летопись</span>
          <span class="top-nav__item">Ритуалы</span>
          <span class="top-nav__item">Круг</span>
          <span class="top-nav__item">${state.me?.role === "admin" ? "Совет" : "Знамения"}</span>
        </nav>
        ${userLabel}
      </div>
    </header>
  `;
}

function renderLoading() {
  return `
    <section class="hero-stage">
      <article class="feature-card feature-card--loading">
        <p class="section-tag">Загрузка</p>
        <h1>Пробуждаем летопись ордена</h1>
        <p>
          Собираем свитки круга, ближайшие Ритуалы Порядка и таверненные сборы.
        </p>
      </article>
    </section>
  `;
}

function renderFlash() {
  if (!state.notice && !state.error) {
    return "";
  }

  const className = state.error ? "flash flash--error" : "flash flash--notice";
  return `<section class="${className}">${escapeHtml(state.error || state.notice)}</section>`;
}

function renderAuth() {
  const authCard = state.pendingEmail ? renderVerifyCard() : renderRequestCodeCard();
  const debugBlock = state.debugCode
    ? `
      <div class="debug-note">
        <span class="debug-note__label">Печать для локальной разработки</span>
        <strong>${escapeHtml(state.debugCode)}</strong>
        <span>Показывается только когда включён режим отладочных печатей.</span>
      </div>
    `
    : "";

  return `
    <section class="hero-stage">
      <article class="feature-card">
        <div class="feature-card__content">
          <p class="section-tag">Хроники Duty Guild</p>
          <h1>Орден Ритуала Порядка для вашего офиса</h1>
          <p class="feature-card__lead">
            Здесь хранятся Ритуалы Порядка, свидетельства хронистов, история созывов и
            свод настольных собраний, чтобы выбирать день без ненужных столкновений.
          </p>
          <div class="feature-badges">
            <span class="feature-badge">Только для посвящённых</span>
            <span class="feature-badge">Печать допуска по почте</span>
            <span class="feature-badge">Созыв раз в 2 недели</span>
          </div>
        </div>
        <aside class="feature-rail">
          <div class="rail-card">
            <p class="rail-card__title">Как войти в круг</p>
            <p>В орден допускаются только одобренные адреса. Сначала Совет вносит имя в свиток, затем вход открывается по одноразовой печати допуска.</p>
          </div>
          <div class="rail-card">
            <p class="rail-card__title">Что уже вписано в летопись</p>
            <ul class="rail-list">
              <li>Закрытый допуск через почтовую печать</li>
              <li>Балансное назначение Хранителей Порядка</li>
              <li>Таверненный свод настольных собраний</li>
              <li>Интерфейс с налётом героической хроники</li>
            </ul>
          </div>
        </aside>
      </article>

      <section class="content-grid content-grid--auth">
        <article class="panel panel--auth">
          <div class="panel__header">
            <p class="section-tag">Печать допуска</p>
            <h2>${state.pendingEmail ? "Подтвердите печать" : "Запросите печать доступа"}</h2>
          </div>
          <p class="panel__intro">
            Используйте одобренную рабочую почту. Печать придёт письмом, а в локальной разработке может появиться прямо здесь.
          </p>
          ${authCard}
          ${debugBlock}
        </article>

        <article class="panel panel--sidebar">
          <div class="panel__header">
            <p class="section-tag">Устав ордена</p>
            <h2>О чём эта летопись</h2>
          </div>
          <ul class="info-list">
            <li><strong>Справедливый жребий.</strong> Орден не даёт одному и тому же герою тащить всё бремя слишком часто.</li>
            <li><strong>Единая карта дней.</strong> Ритуалы и настольные сборы видны рядом, без россыпи чатов и таблиц.</li>
            <li><strong>Закрытый круг.</strong> Посторонние не могут войти в орден своей волей.</li>
            <li><strong>Лёгкое основание.</strong> Без собственной инфраструктуры и лишней тяжести на старте.</li>
          </ul>
        </article>
      </section>
    </section>
  `;
}

function renderRequestCodeCard() {
  return `
    <form id="request-code-form" class="stack-form">
      <label>
        <span>Рабочий email</span>
        <input id="request-email" name="email" type="email" placeholder="name@dutyguild.ru" value="${escapeHtml(
          state.loginEmail,
        )}" />
      </label>
      <button class="button button--primary" type="submit" ${state.busy ? "disabled" : ""}>Призвать печать допуска</button>
    </form>
  `;
}

function renderVerifyCard() {
  return `
    <form id="verify-form" class="stack-form">
      <label>
        <span>Email</span>
        <input id="login-email" name="email" type="email" value="${escapeHtml(
          state.pendingEmail,
        )}" readonly />
      </label>
      <label>
        <span>Шестизначная печать</span>
        <input id="login-code" name="code" inputmode="numeric" maxlength="6" placeholder="123456" value="${escapeHtml(
          state.loginCode,
        )}" />
      </label>
      <div class="button-row">
        <button class="button button--primary" type="submit" ${state.busy ? "disabled" : ""}>Открыть врата</button>
        <button id="back-to-email" class="button button--secondary" type="button" ${
          state.busy ? "disabled" : ""
        }>К свитку</button>
      </div>
    </form>
  `;
}

function renderDashboard() {
  const stats = getStats();
  const currentCycle = renderCyclePanel(
    "Текущий Ритуал Порядка",
    state.dashboard.currentCycle,
    "Сейчас активного Ритуала Порядка нет. Его можно созвать из блока управления ниже.",
  );
  const nextCycle = renderCyclePanel(
    "Следующий Ритуал Порядка",
    state.dashboard.nextCycle,
    "Следующий Ритуал Порядка пока не запланирован.",
  );

  return `
    <section class="hero-stage">
      <article class="feature-card feature-card--dashboard">
        <div class="feature-card__content">
          <p class="section-tag">Зал летописей</p>
          <h1>${escapeHtml(state.me.displayName)}, хроники открыты</h1>
          <p class="feature-card__lead">
            Здесь видно, кто несёт текущее служение Хранителя Порядка, когда грядёт следующий Ритуал, какие таверненные сборы впереди и как распределяется бремя по кругу.
          </p>
          <div class="feature-badges">
            <span class="feature-badge">${roleLabel(state.me.role)}</span>
            <span class="feature-badge">${escapeHtml(memberRankTitle(state.me))}</span>
            <span class="feature-badge">${escapeHtml(state.me.email)}</span>
          </div>
        </div>
        <aside class="feature-rail">
          <div class="rail-card rail-card--compact">
            <span class="rail-metric">${stats.memberCount}</span>
            <span class="rail-label">имен во свитке братства</span>
          </div>
          <div class="rail-card rail-card--compact">
            <span class="rail-metric">${stats.cycleCount}</span>
            <span class="rail-label">созывов в летописи</span>
          </div>
          <div class="rail-card rail-card--compact">
            <span class="rail-metric">${stats.gameCount}</span>
            <span class="rail-label">грядущих таверненных сборов</span>
          </div>
        </aside>
      </article>

      <section class="toolbar">
        <div class="toolbar__copy">
          <p class="section-tag">Печать признана</p>
          <h2>Врата открыты для ${escapeHtml(state.me.displayName)}</h2>
          <p>${roleLabel(state.me.role)} · ${escapeHtml(memberRankTitle(state.me))} · ${escapeHtml(state.me.email)}</p>
          <p class="toolbar__rank-note">${escapeHtml(memberRankProgress(state.me))}</p>
        </div>
        <div class="button-row">
          <button id="refresh-dashboard" class="button button--secondary" type="button">Освежить летопись</button>
          <button id="logout-button" class="button button--primary" type="button">Покинуть зал</button>
        </div>
      </section>

      <section class="stats-band">
        <article class="stat-card">
          <span class="stat-card__label">Братство</span>
          <strong>${stats.memberCount}</strong>
          <p>Соратников в активном круге</p>
        </article>
        <article class="stat-card">
          <span class="stat-card__label">Летопись</span>
          <strong>${stats.cycleCount}</strong>
          <p>Созывов сохранено в хрониках</p>
        </article>
        <article class="stat-card">
          <span class="stat-card__label">Сборы</span>
          <strong>${stats.gameCount}</strong>
          <p>Таверненных вечеров впереди</p>
        </article>
        <article class="stat-card">
          <span class="stat-card__label">Слава</span>
          <strong>${stats.averageRating}</strong>
          <p>По свидетельствам о Ритуалах Порядка</p>
        </article>
      </section>

      <section class="content-grid">
        ${currentCycle}
        ${nextCycle}
        ${renderGamesPanel()}
        ${renderFeedbackPanel()}
        ${renderRosterPanel()}
        ${state.me.role === "admin" ? renderAdminPanel() : ""}
      </section>
    </section>
  `;
}

function renderCyclePanel(title, cycle, emptyText) {
  if (!cycle) {
    return `
      <article class="panel">
        <div class="panel__header">
          <p class="section-tag">${escapeHtml(title)}</p>
        <h2>Призыв ещё не совершен</h2>
        </div>
        <p class="panel__intro">${escapeHtml(emptyText)}</p>
      </article>
    `;
  }

  const badges = cycle.assignees
    .map(
      (member) => `
        <span class="tag-pill" title="${escapeHtml(memberRankTitle(member))}">
          ${escapeHtml(member.displayName)} · ${escapeHtml(memberRankShort(member))}
        </span>
      `,
    )
    .join("");

  return `
    <article class="panel">
      <div class="panel__header">
        <p class="section-tag">${escapeHtml(title)}</p>
        <h2>${formatDate(cycle.plannedCleaningDate)}</h2>
      </div>
      <p class="panel__intro">
        Окно ритуала: ${formatDate(cycle.startsOn)} - ${formatDate(cycle.endsOn)}
      </p>
      <div class="tag-row">${badges || '<span class="muted">Хранители ещё не названы</span>'}</div>
    </article>
  `;
}

function renderGamesPanel() {
  const items = state.dashboard.upcomingGames
    .map(
      (event) => `
        <li class="list-card">
          <div class="list-card__head">
            <strong>${escapeHtml(event.title)}</strong>
            <span>${formatEventDate(event)}</span>
          </div>
          ${event.notes ? `<p>${escapeHtml(event.notes)}</p>` : ""}
        </li>
      `,
    )
    .join("");

  return `
    <article class="panel">
      <div class="panel__header">
        <p class="section-tag">Таверненный свод</p>
        <h2>Грядущие настольные сборы</h2>
      </div>
      ${
        items
          ? `<ul class="list-stack">${items}</ul>`
          : '<p class="panel__intro">Пока ни один таверненный сбор не вписан в свод.</p>'
      }
    </article>
  `;
}

function renderFeedbackPanel() {
  const items = state.dashboard.recentFeedback
    .map(
      (entry) => `
        <li class="list-card">
          <div class="list-card__head">
            <strong>${escapeHtml(entry.targetName)}</strong>
            <span>${"★".repeat(entry.rating)}</span>
          </div>
          <p>${escapeHtml(entry.comment)}</p>
          <span class="list-card__meta">Автор: ${escapeHtml(entry.authorName)} · ${formatDateTime(entry.createdAt)}</span>
        </li>
      `,
    )
    .join("");

  return `
    <article class="panel">
      <div class="panel__header">
        <p class="section-tag">Слава гильдии</p>
        <h2>Последние свидетельства хронистов</h2>
      </div>
      ${
        items
          ? `<ul class="list-stack">${items}</ul>`
          : '<p class="panel__intro">Свидетельства появятся после первых завершённых Ритуалов Порядка.</p>'
      }
    </article>
  `;
}

function renderRosterPanel() {
  const rows = state.dashboard.roster
    .map(
      (member) => `
        <tr>
          <td>
            <div class="member-cell">
              <strong>${escapeHtml(member.displayName)}</strong>
              <span class="member-cell__meta">${escapeHtml(member.email)}</span>
            </div>
          </td>
          <td>${roleLabel(member.role)}</td>
          <td>
            <div class="member-cell">
              <strong>${escapeHtml(memberRankTitle(member))}</strong>
              <span class="member-cell__meta">${escapeHtml(memberRankProgress(member))}</span>
            </div>
          </td>
          <td>${member.dutyCount}</td>
          <td>${member.averageRating === null ? "—" : member.averageRating.toFixed(1)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <article class="panel panel--wide">
      <div class="panel__header">
        <p class="section-tag">Свиток братства</p>
        <h2>Имена, внесённые в круг</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Сан</th>
              <th>Звание</th>
              <th>Служений</th>
              <th>Слава</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </article>
  `;
}

function renderAdminPanel() {
  return `
    <article class="panel panel--wide panel--admin">
      <div class="panel__header">
        <p class="section-tag">Зал совета</p>
        <h2>Повеления Магистра</h2>
      </div>
      <p class="panel__intro">
        Призывайте новых соратников в круг, отмечайте таверненные сборы и созывайте следующий Ритуал Порядка из одного зала.
      </p>

      <div class="admin-grid">
        <form id="invite-member-form" class="stack-form admin-form">
          <h3>Призвать соратника в круг</h3>
          <label>
            <span>Имя</span>
            <input name="displayName" placeholder="Мила Храбрая" />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="mila@dutyguild.ru" />
          </label>
          <label>
            <span>Сан</span>
            <select name="role">
              <option value="member">Соратник круга</option>
              <option value="admin">Магистр Совета</option>
            </select>
          </label>
          <button class="button button--primary" type="submit" ${state.busy ? "disabled" : ""}>Вписать в свиток</button>
        </form>

        <form id="game-event-form" class="stack-form admin-form">
          <h3>Назначить таверненный сбор</h3>
          <label>
            <span>Название</span>
            <input name="title" placeholder="Root: реванш" />
          </label>
          <label>
            <span>Дата</span>
            <input name="eventDate" type="date" />
          </label>
          <div class="split-fields">
            <label>
              <span>Начало</span>
              <input name="startsAt" type="time" />
            </label>
            <label>
              <span>Конец</span>
              <input name="endsAt" type="time" />
            </label>
          </div>
          <label>
            <span>Заметка хрониста</span>
            <textarea name="notes" rows="3" placeholder="Например: великая переговорка уже занята"></textarea>
          </label>
          <button class="button button--secondary" type="submit" ${state.busy ? "disabled" : ""}>Внести в свод</button>
        </form>
      </div>

      <div class="admin-banner">
        <div>
          <p class="section-tag">Воля Совета</p>
          <h3>Созвать новый Ритуал Порядка</h3>
          <p>
            Система выберет сбалансированную пару Хранителей Порядка, постарается не повторять прошлое назначение и
            избегать дней с настольными вечерами.
          </p>
        </div>
        <button id="generate-cycle-button" class="button button--primary" type="button" ${
          state.busy ? "disabled" : ""
        }>Созвать ритуал</button>
      </div>
    </article>
  `;
}

function bindEvents() {
  const requestForm = document.querySelector("#request-code-form");
  if (requestForm) {
    requestForm.addEventListener("submit", onRequestCode);
    requestForm.querySelector("#request-email")?.addEventListener("input", (event) => {
      state.loginEmail = event.target.value;
    });
  }

  const verifyForm = document.querySelector("#verify-form");
  if (verifyForm) {
    verifyForm.addEventListener("submit", onVerifyCode);
    verifyForm.querySelector("#login-code")?.addEventListener("input", (event) => {
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
    state.notice = "Печать допуска отправлена. Проверь почтовый свиток.";
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
    state.notice = "Печать признана. Врата открыты.";
    state.error = "";
    state.dashboard = await api("/api/dashboard");
    render();
  });
}

async function refreshDashboard() {
  await withBusy(async () => {
    state.dashboard = await api("/api/dashboard");
    state.notice = "Летопись обновлена.";
    state.error = "";
    render();
  });
}

async function onLogout() {
  await withBusy(async () => {
    await api("/api/auth/logout", { method: "POST" });
    state.me = null;
    state.dashboard = null;
    state.notice = "Вы покинули зал ордена.";
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
    state.notice = "Имя внесено в свиток братства.";
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
    state.notice = "Таверненный сбор внесён в свод.";
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
    state.notice = "Новый Ритуал Порядка созван.";
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
    state.error = error.message || "Чары дали сбой.";
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
    throw new Error(payload.error || `Запрос завершился со статусом ${response.status}.`);
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

function roleLabel(role) {
  return role === "admin" ? "Магистр Совета" : "Соратник круга";
}

function memberRankTitle(member) {
  return member?.rank?.title || "Искроносец Свитка";
}

function memberRankShort(member) {
  return member?.rank?.shortTitle || "Искроносец";
}

function memberRankProgress(member) {
  return member?.rank?.progressLabel || "Путь звания ещё не раскрыт.";
}

function formatDate(dateString) {
  if (!dateString) {
    return "Дата пока не назначена";
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
