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
  state.error = error.message || "Не удалось открыть Duty Guild.";
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
        <span class="header-user__meta">${roleLabel(state.me.role)}</span>
      </div>
    `
    : '<span class="header-user__meta">Закрытый офисный портал</span>';

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
          <span class="top-nav__item">Обзор</span>
          <span class="top-nav__item">График</span>
          <span class="top-nav__item">Команда</span>
          <span class="top-nav__item">${state.me?.role === "admin" ? "Управление" : "Статистика"}</span>
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
        <h1>Поднимаем доску гильдии</h1>
        <p>
          Загружаем состав команды, ближайшие Ритуалы Порядка и настольные вечера.
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
        <span class="debug-note__label">Код для локальной разработки</span>
        <strong>${escapeHtml(state.debugCode)}</strong>
        <span>Показывается только когда включен режим debug-кодов.</span>
      </div>
    `
    : "";

  return `
    <section class="hero-stage">
      <article class="feature-card">
        <div class="feature-card__content">
          <p class="section-tag">В духе D&D Beyond</p>
          <h1>Гильдия порядка для вашего офиса</h1>
          <p class="feature-card__lead">
            Здесь живут Ритуалы Порядка, отзывы о них, история циклов и календарь настолок,
            чтобы выбирать день без лишних пересечений.
          </p>
          <div class="feature-badges">
            <span class="feature-badge">Только для команды</span>
            <span class="feature-badge">Вход по почте</span>
            <span class="feature-badge">Ротация раз в 2 недели</span>
          </div>
        </div>
        <aside class="feature-rail">
          <div class="rail-card">
            <p class="rail-card__title">Как работает доступ</p>
            <p>На сайт попадают только одобренные email-адреса. Сначала админ добавляет участника, потом вход работает по одноразовому коду.</p>
          </div>
          <div class="rail-card">
            <p class="rail-card__title">Что уже есть</p>
            <ul class="rail-list">
              <li>Закрытая авторизация через email</li>
              <li>Назначение Хранителей Порядка с балансом</li>
              <li>Учёт игровых вечеров</li>
              <li>DnD-стилистика интерфейса</li>
            </ul>
          </div>
        </aside>
      </article>

      <section class="content-grid content-grid--auth">
        <article class="panel panel--auth">
          <div class="panel__header">
            <p class="section-tag">Вход</p>
            <h2>${state.pendingEmail ? "Подтвердите вход" : "Получите код доступа"}</h2>
          </div>
          <p class="panel__intro">
            Используйте одобренную рабочую почту. Код придёт письмом, а в локальной разработке может показываться прямо здесь.
          </p>
          ${authCard}
          ${debugBlock}
        </article>

        <article class="panel panel--sidebar">
          <div class="panel__header">
            <p class="section-tag">Правила гильдии</p>
            <h2>О чём этот портал</h2>
          </div>
          <ul class="info-list">
            <li><strong>Честная ротация.</strong> Система старается не перегружать одних и тех же людей.</li>
            <li><strong>Календарь в одном месте.</strong> Уборка и настолки видны рядом, без отдельного чата и таблиц.</li>
            <li><strong>Закрытый контур.</strong> Посторонние не могут зарегистрироваться сами.</li>
            <li><strong>Мягкий старт.</strong> Никакой собственной инфраструктуры и лишней админки на первом этапе.</li>
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
      <button class="button button--primary" type="submit" ${state.busy ? "disabled" : ""}>Отправить код входа</button>
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
        <span>Шестизначный код</span>
        <input id="login-code" name="code" inputmode="numeric" maxlength="6" placeholder="123456" value="${escapeHtml(
          state.loginCode,
        )}" />
      </label>
      <div class="button-row">
        <button class="button button--primary" type="submit" ${state.busy ? "disabled" : ""}>Войти</button>
        <button id="back-to-email" class="button button--secondary" type="button" ${
          state.busy ? "disabled" : ""
        }>Назад</button>
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
          <p class="section-tag">Панель гильдии</p>
          <h1>${escapeHtml(state.me.displayName)}, управление в одном окне</h1>
          <p class="feature-card__lead">
            Видно, кто назначен Хранителем Порядка сейчас, когда следующий Ритуал, какие настолки впереди и как распределяется нагрузка по команде.
          </p>
          <div class="feature-badges">
            <span class="feature-badge">${roleLabel(state.me.role)}</span>
            <span class="feature-badge">${escapeHtml(state.me.email)}</span>
          </div>
        </div>
        <aside class="feature-rail">
          <div class="rail-card rail-card--compact">
            <span class="rail-metric">${stats.memberCount}</span>
            <span class="rail-label">участников в составе</span>
          </div>
          <div class="rail-card rail-card--compact">
            <span class="rail-metric">${stats.cycleCount}</span>
            <span class="rail-label">циклов в истории</span>
          </div>
          <div class="rail-card rail-card--compact">
            <span class="rail-metric">${stats.gameCount}</span>
            <span class="rail-label">ближайших настолок</span>
          </div>
        </aside>
      </article>

      <section class="toolbar">
        <div class="toolbar__copy">
          <p class="section-tag">Статус сессии</p>
          <h2>Вы вошли как ${escapeHtml(state.me.displayName)}</h2>
          <p>${roleLabel(state.me.role)} · ${escapeHtml(state.me.email)}</p>
        </div>
        <div class="button-row">
          <button id="refresh-dashboard" class="button button--secondary" type="button">Обновить данные</button>
          <button id="logout-button" class="button button--primary" type="button">Выйти</button>
        </div>
      </section>

      <section class="stats-band">
        <article class="stat-card">
          <span class="stat-card__label">Участники</span>
          <strong>${stats.memberCount}</strong>
          <p>Активных людей в гильдии</p>
        </article>
        <article class="stat-card">
          <span class="stat-card__label">Циклы</span>
          <strong>${stats.cycleCount}</strong>
          <p>Сохранено в истории</p>
        </article>
        <article class="stat-card">
          <span class="stat-card__label">Настолки</span>
          <strong>${stats.gameCount}</strong>
          <p>Видно в ближайшем окне</p>
        </article>
        <article class="stat-card">
          <span class="stat-card__label">Средний отзыв</span>
          <strong>${stats.averageRating}</strong>
          <p>По завершённым Ритуалам Порядка</p>
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
        <h2>Ритуал ещё не созван</h2>
        </div>
        <p class="panel__intro">${escapeHtml(emptyText)}</p>
      </article>
    `;
  }

  const badges = cycle.assignees
    .map((member) => `<span class="tag-pill">${escapeHtml(member.displayName)}</span>`)
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
      <div class="tag-row">${badges || '<span class="muted">Назначений пока нет</span>'}</div>
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
        <p class="section-tag">Календарь вечеров</p>
        <h2>Ближайшие настолки</h2>
      </div>
      ${
        items
          ? `<ul class="list-stack">${items}</ul>`
          : '<p class="panel__intro">Игровые вечера пока не добавлены.</p>'
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
        <p class="section-tag">Репутация</p>
        <h2>Последние отзывы</h2>
      </div>
      ${
        items
          ? `<ul class="list-stack">${items}</ul>`
          : '<p class="panel__intro">Отзывы появятся после завершённых уборок.</p>'
      }
    </article>
  `;
}

function renderRosterPanel() {
  const rows = state.dashboard.roster
    .map(
      (member) => `
        <tr>
          <td>${escapeHtml(member.displayName)}</td>
          <td>${roleLabel(member.role)}</td>
          <td>${member.dutyCount}</td>
          <td>${member.averageRating === null ? "—" : member.averageRating.toFixed(1)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <article class="panel panel--wide">
      <div class="panel__header">
        <p class="section-tag">Состав</p>
        <h2>Участники гильдии</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Роль</th>
              <th>Дежурств</th>
              <th>Рейтинг</th>
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
        <p class="section-tag">Управление</p>
        <h2>Инструменты администратора</h2>
      </div>
      <p class="panel__intro">
        Добавляйте людей, планируйте игровые вечера и запускайте следующий Ритуал Порядка из одного блока.
      </p>

      <div class="admin-grid">
        <form id="invite-member-form" class="stack-form admin-form">
          <h3>Одобрить участника</h3>
          <label>
            <span>Имя</span>
            <input name="displayName" placeholder="Мила Храбрая" />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="mila@dutyguild.ru" />
          </label>
          <label>
            <span>Роль</span>
            <select name="role">
              <option value="member">Участник</option>
              <option value="admin">Админ</option>
            </select>
          </label>
          <button class="button button--primary" type="submit" ${state.busy ? "disabled" : ""}>Сохранить участника</button>
        </form>

        <form id="game-event-form" class="stack-form admin-form">
          <h3>Добавить настолку</h3>
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
            <span>Комментарий</span>
            <textarea name="notes" rows="3" placeholder="Например: занята переговорка"></textarea>
          </label>
          <button class="button button--secondary" type="submit" ${state.busy ? "disabled" : ""}>Сохранить событие</button>
        </form>
      </div>

      <div class="admin-banner">
        <div>
          <p class="section-tag">Следующий шаг</p>
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
    state.notice = "Код входа отправлен. Проверь почту.";
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
    state.notice = "Вход выполнен.";
    state.error = "";
    state.dashboard = await api("/api/dashboard");
    render();
  });
}

async function refreshDashboard() {
  await withBusy(async () => {
    state.dashboard = await api("/api/dashboard");
    state.notice = "Данные обновлены.";
    state.error = "";
    render();
  });
}

async function onLogout() {
  await withBusy(async () => {
    await api("/api/auth/logout", { method: "POST" });
    state.me = null;
    state.dashboard = null;
    state.notice = "Вы вышли из системы.";
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
    state.notice = "Участник добавлен в состав.";
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
    state.notice = "Настолка добавлена в календарь.";
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
    state.error = error.message || "Что-то пошло не так.";
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
  return role === "admin" ? "Администратор" : "Участник";
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
