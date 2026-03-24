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
  editingGameEventId: "",
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

  if (sessionResponse.member) {
    await hydrateDashboard();
  }

  state.loading = false;
  render();
}

function render() {
  const content = state.loading
    ? renderLoading()
    : `${renderFlash()}${state.me && state.dashboard ? renderDashboard() : renderAuth()}`;

  root.innerHTML = `
    <main class="page-shell">
      ${renderSiteHeader()}
      <div class="page-inner">
        ${content}
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
          <span class="top-nav__item">Обряды</span>
          <span class="top-nav__item">Походы</span>
          <span class="top-nav__item">${isCouncilMember(state.me) ? "Совет" : "Звания"}</span>
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
          Собираем свитки круга, ближайшие обряды, вердикты хронистов и грядущие сходки у стола.
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
          <h1>Летопись ордена, где каждый обряд помнят по имени</h1>
          <p class="feature-card__lead">
            Здесь хранятся обряды, вердикты круга, созывы героев и карта грядущих походов у
            стола, чтобы свершения не сталкивались друг с другом и не тонули в чатиках.
          </p>
          <div class="feature-badges">
            <span class="feature-badge">Только для посвящённых</span>
            <span class="feature-badge">Печать входа по почте</span>
            <span class="feature-badge">Созыв каждые 2 недели</span>
            <span class="feature-badge">Командная слава пары</span>
          </div>
        </div>
        <aside class="feature-rail">
          <div class="illustration-card">
            ${renderSceneIllustration("entry")}
          </div>
          <div class="rail-card">
            <p class="rail-card__title">Как войти в круг</p>
            <p>В орден допускаются только имена, уже внесённые в свиток. После этого врата открываются через одноразовую печать входа.</p>
          </div>
          <div class="rail-card">
            <p class="rail-card__title">Что уже вписано в летопись</p>
            <ul class="rail-list">
              <li>Закрытый допуск через почтовую печать</li>
              <li>Созыв пары без перекосов и повторов подряд</li>
              <li>Свод походов и сходок для всего круга</li>
              <li>Летопись в духе героической энциклопедии</li>
            </ul>
          </div>
        </aside>
      </article>

      <section class="content-grid content-grid--auth">
        <article class="panel panel--auth">
          <div class="panel__header">
            <p class="section-tag">Печать входа</p>
            <h2>${state.pendingEmail ? "Подтвердите печать" : "Призовите печать"}</h2>
          </div>
          <p class="panel__intro">
            Используйте доверенный адрес, внесённый в свиток. Печать придёт письмом, а в локальной разработке может появиться прямо здесь.
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
            <li><strong>Справедливый жребий.</strong> Орден не наваливает одно и то же бремя на одного героя слишком часто.</li>
            <li><strong>Единая карта дней.</strong> Обряды и сходки у стола видны рядом, без россыпи чатов и таблиц.</li>
            <li><strong>Закрытый круг.</strong> Посторонние не могут войти в орден своей волей.</li>
            <li><strong>Слава пары.</strong> Вердикт всегда общий, а опыт передаётся от сильнейших к тем, кому он нужнее.</li>
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
        <span>Доверенный email</span>
        <input id="request-email" name="email" type="email" placeholder="name@dutyguild.ru" value="${escapeHtml(
          state.loginEmail,
        )}" />
      </label>
      <button class="button button--primary" type="submit" ${state.busy ? "disabled" : ""}>Призвать печать входа</button>
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
    "Текущий обряд",
    state.dashboard.currentCycle,
    "Сейчас ни один обряд не удерживает зал. Его можно призвать из палаты совета ниже.",
  );
  const nextCycle = renderCyclePanel(
    "Следующий обряд",
    state.dashboard.nextCycle,
    "Следующий обряд ещё не вписан в летопись.",
  );

  return `
    <section class="hero-stage">
      <article class="feature-card feature-card--dashboard">
        <div class="feature-card__content">
          <p class="section-tag">Зал летописей</p>
          <h1>${escapeHtml(state.me.displayName)}, хроники открыты</h1>
          <p class="feature-card__lead">
            Здесь видно, кто сейчас несёт обет порядка, какие вердикты уже вынес круг, кому пора передавать опыт и какие походы у стола приближаются следом.
          </p>
          <div class="feature-badges">
            <span class="feature-badge">${roleLabel(state.me.role)}</span>
            <span class="feature-badge">${escapeHtml(memberRankTitle(state.me))}</span>
            <span class="feature-badge">${escapeHtml(state.me.email)}</span>
          </div>
        </div>
        <aside class="feature-rail feature-rail--art">
          <div class="illustration-card illustration-card--wide">
            ${renderSceneIllustration("dashboard")}
          </div>
          <div class="rail-card rail-card--compact">
            <span class="rail-metric">${stats.memberCount}</span>
            <span class="rail-label">имен во свитке братства</span>
          </div>
          <div class="rail-card rail-card--compact">
            <span class="rail-metric">${stats.pendingReviewCount}</span>
            <span class="rail-label">вердиктов ждут голоса круга</span>
          </div>
          <div class="rail-card rail-card--compact">
            <span class="rail-metric">${stats.gameCount}</span>
            <span class="rail-label">походов уже вписано впереди</span>
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
          <span class="stat-card__label">Обряды</span>
          <strong>${stats.cycleCount}</strong>
          <p>Последних обрядов видно на доске</p>
        </article>
        <article class="stat-card">
          <span class="stat-card__label">Вердикты</span>
          <strong>${stats.pendingReviewCount}</strong>
          <p>Обрядов ещё ждут ваш голос</p>
        </article>
        <article class="stat-card">
          <span class="stat-card__label">Походы</span>
          <strong>${stats.gameCount}</strong>
          <p>Сходок у стола впереди</p>
        </article>
        <article class="stat-card">
          <span class="stat-card__label">Слава</span>
          <strong>${stats.averageRating}</strong>
          <p>Средний вердикт летописи</p>
        </article>
      </section>

      <section class="content-grid">
        ${currentCycle}
        ${nextCycle}
        ${renderRecentRitualsPanel()}
        ${renderAdventurePanel()}
        ${renderReviewPanel()}
        ${renderRankGuidePanel()}
        ${renderCouncilElectionPanel()}
        ${renderRosterPanel()}
        ${state.me.permissions?.canManageCycles ? renderAdminPanel() : ""}
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
        <div class="assignment-card">
          <span class="tag-pill" title="${escapeHtml(memberRankTitle(member))}">
            ${escapeHtml(member.displayName)} · ${escapeHtml(memberRankShort(member))}
          </span>
          <span class="assignment-card__state ${member.completedAt ? "assignment-card__state--done" : ""}">
            ${member.completedAt ? "Печать завершения поставлена" : "Ожидает печать завершения"}
          </span>
        </div>
      `,
    )
    .join("");
  const actionBlock = cycle.canMarkComplete
    ? `
      <div class="panel__actions">
        <button class="button button--primary" type="button" data-cycle-complete="${escapeHtml(cycle.id)}" ${
          state.busy ? "disabled" : ""
        }>
          Засвидетельствовать свершение
        </button>
        <p class="panel__aside-note">После второй печати обряд будет закрыт, а круг получит письма с просьбой вынести вердикт.</p>
      </div>
    `
    : cycle.isAssignedToMe && cycle.myAssignmentCompleted
      ? `<p class="panel__aside-note">Ваша печать завершения уже внесена. Теперь летопись ждёт знак второго героя.</p>`
      : "";
  const verdict = cycle.averageRating === null
    ? cycle.status === "completed"
      ? "Обряд завершён, но круг ещё не вынес вердикт."
      : cycle.allAssigneesCompleted
        ? "Обе печати стоят, летопись готова принять вердикты."
        : "Обряд ещё идёт, и летопись ждёт двух подтверждений."
    : `Вердикт круга: ${cycle.averageRating.toFixed(1)} · ${escapeHtml(cycle.outcome.title)}`;

  return `
    <article class="panel">
      <div class="panel__header">
        <p class="section-tag">${escapeHtml(title)}</p>
        <h2>${formatDate(cycle.plannedCleaningDate)}</h2>
      </div>
      <p class="panel__intro">
        Промежуток обряда: ${formatDate(cycle.startsOn)} - ${formatDate(cycle.endsOn)}
      </p>
      <div class="status-row">
        <span class="status-pill status-pill--${escapeHtml(cycleStatusTone(cycle))}">${escapeHtml(cycleStatusLabel(cycle))}</span>
        <span class="status-pill status-pill--ghost">${escapeHtml(cycle.status === "completed" ? cycle.outcome.shortTitle : "Вердикт впереди")}</span>
      </div>
      <p class="panel__aside-note">${escapeHtml(verdict)}</p>
      <div class="assignment-list">${badges || '<span class="muted">Герои ещё не названы</span>'}</div>
      ${actionBlock}
    </article>
  `;
}

function renderAdventurePanel() {
  const items = state.dashboard.upcomingGames
    .map((event) => renderAdventureEvent(event))
    .join("");

  return `
    <article class="panel panel--wide">
      <div class="panel__header">
        <p class="section-tag">Свод походов</p>
        <h2>Сходки у стола и грядущие походы</h2>
      </div>
      <p class="panel__intro">
        Любой соратник круга может вписать сюда новую встречу, и тогда всему братству уйдёт почтовое знамение.
      </p>
      <div class="adventure-grid">
        <div>
          ${
            items
              ? `<ul class="list-stack">${items}</ul>`
              : '<p class="panel__intro">Пока ни одна встреча не вписана в свод походов.</p>'
          }
        </div>
        <form id="game-event-form" class="stack-form adventure-form">
          <h3>Вписать новое событие</h3>
          <label>
            <span>Название</span>
            <input name="title" placeholder="Root: реванш за лесной трон" />
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
            <span>Пометка хрониста</span>
            <textarea name="notes" rows="3" placeholder="Например: кто ведёт партию, сколько героев зовётся и нужен ли большой стол"></textarea>
          </label>
          <button class="button button--secondary" type="submit" ${state.busy ? "disabled" : ""}>Внести в летопись</button>
        </form>
      </div>
    </article>
  `;
}

function renderAdventureEvent(event) {
  const isEditing = state.editingGameEventId === event.id;
  const actions = event.canManage
    ? `
      <div class="list-card__actions">
        <button
          class="button button--secondary"
          type="button"
          data-game-edit-start="${escapeHtml(event.id)}"
          ${state.busy || isEditing ? "disabled" : ""}
        >
          Переписать
        </button>
        <button
          class="button button--danger"
          type="button"
          data-game-delete="${escapeHtml(event.id)}"
          ${state.busy ? "disabled" : ""}
        >
          Изгладить
        </button>
      </div>
    `
    : "";

  const editor = isEditing
    ? `
      <form class="stack-form event-edit-form" data-game-update="${escapeHtml(event.id)}">
        <div class="event-edit-form__header">
          <strong>Переписать запись летописи</strong>
          <button
            class="button button--secondary"
            type="button"
            data-game-edit-cancel="${escapeHtml(event.id)}"
            ${state.busy ? "disabled" : ""}
          >
            Свернуть
          </button>
        </div>
        <label>
          <span>Название</span>
          <input name="title" value="${escapeHtml(event.title)}" />
        </label>
        <label>
          <span>Дата</span>
          <input name="eventDate" type="date" value="${escapeHtml(event.eventDate)}" />
        </label>
        <div class="split-fields">
          <label>
            <span>Начало</span>
            <input name="startsAt" type="time" value="${escapeHtml(event.startsAt || "")}" />
          </label>
          <label>
            <span>Конец</span>
            <input name="endsAt" type="time" value="${escapeHtml(event.endsAt || "")}" />
          </label>
        </div>
        <label>
          <span>Пометка хрониста</span>
          <textarea name="notes" rows="3">${escapeHtml(event.notes || "")}</textarea>
        </label>
        <button class="button button--primary" type="submit" ${state.busy ? "disabled" : ""}>
          Переписать запись
        </button>
      </form>
    `
    : "";

  return `
    <li class="list-card">
      <div class="list-card__head">
        <strong>${escapeHtml(event.title)}</strong>
        <span>${formatEventDate(event)}</span>
      </div>
      ${event.notes ? `<p>${escapeHtml(event.notes)}</p>` : ""}
      <div class="list-card__meta-row">
        <span class="list-card__meta">Вписал в свод: ${escapeHtml(event.createdByName || "Неизвестный хронист")}</span>
        ${event.canManage ? `<span class="list-card__meta">Право пера: у вас есть</span>` : ""}
      </div>
      ${actions}
      ${editor}
    </li>
  `;
}

function renderCouncilElectionPanel() {
  const election = state.dashboard.councilElection;
  if (!election) {
    return "";
  }

  const currentSteward = election.currentSteward
    ? `
      <article class="election-summary-card">
        <span class="rank-summary-card__label">Текущий Сенешаль</span>
        <strong>${escapeHtml(election.currentSteward.displayName)}</strong>
        <p>${escapeHtml(election.currentSteward.rankTitle)}</p>
        <p class="election-summary-card__meta">Слава: ${escapeHtml(formatRatingValue(election.currentSteward.averageRating))}</p>
      </article>
    `
    : `
      <article class="election-summary-card">
        <span class="rank-summary-card__label">Текущий Сенешаль</span>
        <strong>Печать вакантна</strong>
        <p>Совет ещё не назвал соратника, который понесёт этот сан.</p>
      </article>
    `;

  const latestOutcome = election.lastCompletedElection
    ? `
      <article class="election-summary-card">
        <span class="rank-summary-card__label">Последний исход</span>
        <strong>${escapeHtml(election.lastCompletedElection.winnerName)}</strong>
        <p>Кругов понадобилось: ${escapeHtml(String(election.lastCompletedElection.roundNumber || 1))}</p>
        <p class="election-summary-card__meta">${escapeHtml(formatDateTime(election.lastCompletedElection.completedAt))}</p>
      </article>
    `
    : `
      <article class="election-summary-card">
        <span class="rank-summary-card__label">Последний исход</span>
        <strong>Первый собор впереди</strong>
        <p>Как только Магистр созовёт выборы, здесь появится имя первого избранного Сенешаля.</p>
      </article>
    `;

  const activeElection = election.activeElection;
  const startAction = !activeElection && election.canStartElection
    ? `
      <div class="election-actions">
        <button
          class="button button--primary"
          type="button"
          data-steward-election-start="true"
          ${state.busy ? "disabled" : ""}
        >
          Созвать выборный собор
        </button>
        <p class="panel__aside-note">
          В первый круг попадут все соратники, которые делят вершину славы. За себя голосовать нельзя.
        </p>
      </div>
    `
    : "";

  const activeBlock = activeElection
    ? `
      <div class="election-stage">
        <div class="election-stage__head">
          <div>
            <p class="section-tag">Круг голосования</p>
            <h3>Круг ${escapeHtml(String(activeElection.roundNumber))}</h3>
          </div>
          <div class="status-row">
            <span class="status-pill status-pill--ghost">Нужно: ${escapeHtml(String(activeElection.requiredVotes))}</span>
            <span class="status-pill status-pill--${activeElection.allCouncilVoted ? "waiting" : "live"}">
              Голосов: ${escapeHtml(String(activeElection.votesCast))} из ${escapeHtml(String(activeElection.councilSize))}
            </span>
          </div>
        </div>
        <p class="panel__intro">
          Собор созвал ${escapeHtml(activeElection.launchedByName)}. Для избрания нужно больше половины голосов совета.
          Если большинство не найдётся, летопись автоматически откроет следующий круг среди сильнейших имён.
        </p>
        <div class="election-board">
          ${activeElection.candidates.map((candidate) => renderElectionCandidate(activeElection, candidate)).join("")}
        </div>
      </div>
    `
    : `
      <div class="election-stage election-stage--quiet">
        <p class="panel__intro">
          Сейчас выборный собор не открыт. Магистр может созвать его в любой момент, если сан Сенешаля пора обновить.
        </p>
      </div>
    `;

  return `
    <article class="panel panel--wide panel--council">
      <div class="panel__header">
        <p class="section-tag">Собор Совета</p>
        <h2>Печать Сенешаля и воля совета</h2>
      </div>
      <p class="panel__intro">
        Сенешаль избирается среди соратников, которые делят вершину славы ритуалов. Совет решает исход голосами,
        а летопись сама переводит собор в новый круг, если большинство не найдено.
      </p>
      <div class="council-grid">
        <div>
          <div class="election-summary-grid">
            ${currentSteward}
            ${latestOutcome}
          </div>
          ${activeBlock}
          ${startAction}
        </div>
        <aside class="council-side-note">
          <p class="rail-card__title">Закон собора</p>
          <ul class="rail-list">
            <li>В первый круг входят все имена, которые делят верхнюю ступень славы.</li>
            <li>Для избрания нужно больше половины голосов действующего совета.</li>
            <li>Если круг не выявил победителя, летопись оставит 2-3 сильнейших имени и откроет новый круг.</li>
            <li>Каждый шаг собора сопровождается письмами для совета.</li>
          </ul>
        </aside>
      </div>
    </article>
  `;
}

function renderElectionCandidate(activeElection, candidate) {
  const action = activeElection.canVote
    ? candidate.canReceiveVote
      ? `
        <button
          class="button ${candidate.isMyVote ? "button--secondary" : "button--primary"}"
          type="button"
          data-steward-election-vote="${escapeHtml(candidate.id)}"
          ${state.busy ? "disabled" : ""}
        >
          ${candidate.isMyVote ? "Ваш голос" : "Отдать голос"}
        </button>
      `
      : '<span class="member-cell__meta">Свой клинок в собственную пользу не поднимают.</span>'
    : '<span class="member-cell__meta">Этот круг решает действующий совет.</span>';

  return `
    <article class="election-card ${candidate.isMyVote ? "election-card--voted" : ""}">
      <div class="election-card__head">
        <strong>${escapeHtml(candidate.displayName)}</strong>
        <span>${escapeHtml(candidate.rankTitle)}</span>
      </div>
      <div class="election-card__metrics">
        <span>Слава: ${escapeHtml(formatRatingValue(candidate.averageRating))}</span>
        <span>Служений: ${escapeHtml(String(candidate.dutyCount))}</span>
        <span>Голосов: ${escapeHtml(String(candidate.voteCount))}</span>
      </div>
      <p class="member-cell__meta">
        Свидетельств в летописи: ${escapeHtml(String(candidate.feedbackCount))}
      </p>
      ${action}
    </article>
  `;
}

function renderRecentRitualsPanel() {
  const items = (state.dashboard.recentCycles || [])
    .map(
      (cycle) => `
        <li class="list-card list-card--ritual">
          <div class="list-card__head">
            <strong>${formatDate(cycle.plannedCleaningDate)}</strong>
            <span class="status-pill status-pill--${escapeHtml(cycleStatusTone(cycle))}">${escapeHtml(cycleStatusLabel(cycle))}</span>
          </div>
          <p>${escapeHtml(cycle.assignees.map((member) => member.displayName).join(" и "))}</p>
          <div class="list-card__meta-row">
            <span class="list-card__meta">${escapeHtml(cycle.outcome.title)}</span>
            <span class="list-card__meta">${cycle.averageRating === null ? "Без вердикта" : `${cycle.averageRating.toFixed(1)} ★`}</span>
          </div>
        </li>
      `,
    )
    .join("");

  return `
    <article class="panel">
      <div class="panel__header">
        <p class="section-tag">Архив обрядов</p>
        <h2>Недавние свершения и их исход</h2>
      </div>
      ${
        items
          ? `<ul class="list-stack">${items}</ul>`
          : '<p class="panel__intro">Как только орден завершит первые обряды, здесь появятся их исходы и слава.</p>'
      }
    </article>
  `;
}

function renderRankGuidePanel() {
  const ladder = getRankLadder()
    .map((rank) => {
      const isCurrent = state.me?.rank?.id === rank.id;
      const isNext = state.me?.rank?.nextId === rank.id;
      const stateLabel = isCurrent
        ? "Ваше текущее звание"
        : isNext
          ? "Следующий рубеж"
          : "Ступень ордена";

      return `
        <article
          class="rank-card ${isCurrent ? "rank-card--current" : ""} ${isNext ? "rank-card--next" : ""}"
          style="${escapeHtml(rankThemeStyle(rank))}"
        >
          <div class="rank-card__crest-block">
            <div class="rank-card__crest">${escapeHtml(rank.crest)}</div>
            <span class="rank-card__sigil">${escapeHtml(rank.sigil || "Герб ордена")}</span>
          </div>
          <div class="rank-card__copy">
            <span class="rank-card__state">${escapeHtml(stateLabel)}</span>
            <h3>${escapeHtml(rank.title)}</h3>
            <p class="rank-card__threshold">${escapeHtml(rank.thresholdLabel)}</p>
            <p>${escapeHtml(rank.description)}</p>
            <p class="rank-card__motto">${escapeHtml(rank.motto || "")}</p>
            <span class="rank-card__meta">${escapeHtml(rank.nextThresholdLabel)}</span>
          </div>
        </article>
      `;
    })
    .join("");

  return `
    <article class="panel panel--wide">
      <div class="panel__header">
        <p class="section-tag">Путь возвышения</p>
        <h2>Лестница званий ордена</h2>
      </div>
      <p class="panel__intro">
        Здесь собраны все ступени ордена: видно, где вы стоите сейчас, какая вершина ждёт дальше и как выглядит весь путь братства целиком.
      </p>
      <div class="rank-summary-grid">
        <article class="rank-summary-card">
          <span class="rank-summary-card__label">Текущая ступень</span>
          <strong>${escapeHtml(memberRankTitle(state.me))}</strong>
          <p>${escapeHtml(memberRankStage(state.me))}</p>
        </article>
        <article class="rank-summary-card">
          <span class="rank-summary-card__label">Следующий рубеж</span>
          <strong>${escapeHtml(memberNextRankTitle(state.me))}</strong>
          <p>${escapeHtml(memberRankProgress(state.me))}</p>
        </article>
        <article class="rank-summary-card">
          <span class="rank-summary-card__label">Завет славы</span>
          <strong>Сила летописи</strong>
          <p>${escapeHtml(memberRankFutureHint(state.me))}</p>
        </article>
      </div>
      <div class="rank-ladder">
        ${ladder}
      </div>
    </article>
  `;
}

function renderReviewPanel() {
  const pending = state.dashboard.pendingReviewCycles || [];
  const pendingCards = pending
    .map(
      (cycle) => `
        <form class="review-form" data-cycle-review="${escapeHtml(cycle.id)}">
          <div class="review-form__head">
            <div>
              <strong>${escapeHtml(cycle.assignees.map((member) => member.displayName).join(" и "))}</strong>
              <span>${formatDate(cycle.plannedCleaningDate)}</span>
            </div>
            <span class="status-pill status-pill--ghost">${escapeHtml(cycle.outcome.shortTitle)}</span>
          </div>
          <div class="star-rating" aria-label="Оценка обряда">
            ${[5, 4, 3, 2, 1]
              .map(
                (value) => `
                  <input id="review-${escapeHtml(cycle.id)}-${value}" type="radio" name="rating" value="${value}" ${value === 5 ? "checked" : ""} />
                  <label for="review-${escapeHtml(cycle.id)}-${value}" title="${value}">${"★"}</label>
                `,
              )
              .join("")}
          </div>
          <label>
            <span>Слово хрониста</span>
            <textarea name="comment" rows="3" placeholder="Например: обряд проведён стройно, сияние зала держится до сих пор"></textarea>
          </label>
          <button class="button button--primary" type="submit" ${state.busy ? "disabled" : ""}>Вынести вердикт</button>
        </form>
      `,
    )
    .join("");
  const items = state.dashboard.recentFeedback
    .map(
      (entry) => `
        <li class="list-card">
          <div class="list-card__head">
            <strong>${escapeHtml(entry.targetName)}</strong>
            <span>${renderStarString(entry.rating)}</span>
          </div>
          ${entry.comment ? `<p>${escapeHtml(entry.comment)}</p>` : ""}
          <div class="list-card__meta-row">
            <span class="list-card__meta">Автор: ${escapeHtml(entry.authorName)}</span>
            <span class="list-card__meta">${escapeHtml(entry.cycleOutcome?.shortTitle || "Вердикт вынесен")}</span>
          </div>
        </li>
      `,
    )
    .join("");

  return `
    <article class="panel panel--wide">
      <div class="panel__header">
        <p class="section-tag">Зал вердиктов</p>
        <h2>Слава обряда и голос круга</h2>
      </div>
      <div class="review-grid">
        <div>
          <p class="panel__intro">
            После того как оба героя поставят печати завершения, круг получает право вынести общий вердикт обряду.
          </p>
          ${
            pendingCards
              ? `<div class="review-stack">${pendingCards}</div>`
              : '<p class="panel__intro">Сейчас нет обрядов, которые ждут вашего вердикта.</p>'
          }
        </div>
        <div>
          ${
            items
              ? `<ul class="list-stack">${items}</ul>`
              : '<p class="panel__intro">Первые свидетельства появятся, как только круг оценит завершённый обряд.</p>'
          }
        </div>
      </div>
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
              <span class="member-cell__meta">${escapeHtml(memberRankStage(member))}</span>
            </div>
          </td>
          <td>
            <div class="member-cell">
              <strong>${escapeHtml(memberNextRankTitle(member))}</strong>
              <span class="member-cell__meta">${escapeHtml(memberRankProgress(member))}</span>
            </div>
          </td>
          <td>${member.dutyCount}</td>
          <td>
            <div class="member-cell">
              <strong>${member.averageRating === null ? "—" : member.averageRating.toFixed(1)}</strong>
              <span class="member-cell__meta">${escapeHtml(getOutcomeTitleFromRating(member.averageRating))}</span>
            </div>
          </td>
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
      <p class="panel__intro">
        Здесь видно звание каждого соратника, его текущую ступень и рубеж до следующего возвышения.
      </p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Сан</th>
              <th>Звание</th>
              <th>Следующий рубеж</th>
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
  const canInviteMembers = Boolean(state.me.permissions?.canManageMembers);
  const intro = canInviteMembers
    ? "Призывайте новых соратников в круг, следите за устройством братства и созывайте следующий обряд. Новые походы весь круг вписывает сам, а летопись разошлёт знамения автоматически."
    : "Как Сенешаль Совета, вы можете созывать новые обряды и править летопись походов, но свиток братства пополняет только Магистр.";
  const inviteBlock = canInviteMembers
    ? `
      <div class="admin-grid admin-grid--single">
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
      </div>
    `
    : `
      <div class="admin-grid admin-grid--single">
        <article class="admin-form">
          <h3>Сан Сенешаля</h3>
          <p>
            Этот сан получает сильнейший по славе соратник, кроме действующего Магистра. Сенешаль
            помогает вести обряды и летописи походов, но не призывает новых имён в круг.
          </p>
        </article>
      </div>
    `;

  return `
    <article class="panel panel--wide panel--admin">
      <div class="panel__header">
        <p class="section-tag">Зал совета</p>
        <h2>${state.me.role === "admin" ? "Повеления Магистра" : "Печать Сенешаля"}</h2>
      </div>
      <p class="panel__intro">
        ${intro}
      </p>
      ${inviteBlock}

      <div class="admin-banner">
        <div>
          <p class="section-tag">Воля Совета</p>
          <h3>Созвать новый обряд</h3>
          <p>
            Система выберет пару без перекосов, постарается не повторять прошлое назначение, сведёт сильнейшего героя
            с тем, кому нужнее опыт, и обойдёт дни с походами у стола.
          </p>
        </div>
        <button id="generate-cycle-button" class="button button--primary" type="button" ${
          state.busy ? "disabled" : ""
        }>Созвать обряд</button>
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
  document.querySelector("[data-steward-election-start]")?.addEventListener("click", onStartStewardElection);
  document.querySelectorAll("[data-steward-election-vote]").forEach((button) => {
    button.addEventListener("click", onCastStewardElectionVote);
  });
  document.querySelectorAll("[data-game-edit-start]").forEach((button) => {
    button.addEventListener("click", onStartEditGameEvent);
  });
  document.querySelectorAll("[data-game-edit-cancel]").forEach((button) => {
    button.addEventListener("click", onCancelEditGameEvent);
  });
  document.querySelectorAll("[data-game-update]").forEach((form) => {
    form.addEventListener("submit", onUpdateGameEvent);
  });
  document.querySelectorAll("[data-game-delete]").forEach((button) => {
    button.addEventListener("click", onDeleteGameEvent);
  });
  document.querySelectorAll("[data-cycle-complete]").forEach((button) => {
    button.addEventListener("click", onCompleteCycle);
  });
  document.querySelectorAll("[data-cycle-review]").forEach((form) => {
    form.addEventListener("submit", onSubmitReview);
  });
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
    state.notice = "Печать входа отправлена. Проверь почтовый свиток.";
    state.error = "";
    render();
  });
}

async function onVerifyCode(event) {
  event.preventDefault();
  await withBusy(async () => {
    await api("/api/auth/verify-code", {
      method: "POST",
      body: {
        email: state.pendingEmail,
        code: state.loginCode,
      },
    });

    state.pendingEmail = "";
    state.loginCode = "";
    state.debugCode = "";
    state.notice = "Печать признана. Врата открыты.";
    state.error = "";
    await hydrateDashboard({ retries: 1, retryDelayMs: 150 });
    render();
  });
}

async function refreshDashboard() {
  await withBusy(async () => {
    await hydrateDashboard();
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
    await hydrateDashboard();
    state.notice = "Имя внесено в свиток братства.";
    state.error = "";
    render();
  });
}

async function onCreateGameEvent(event) {
  event.preventDefault();
  await withBusy(async () => {
    const formData = new FormData(event.currentTarget);
    await api("/api/game-events", {
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
    state.editingGameEventId = "";
    await hydrateDashboard();
    state.notice = "Событие вписано в летопись, а круг получил почтовое знамение.";
    state.error = "";
    render();
  });
}

function onStartEditGameEvent(event) {
  state.editingGameEventId = String(event.currentTarget?.dataset?.gameEditStart || "").trim();
  state.notice = "";
  state.error = "";
  render();
}

function onCancelEditGameEvent() {
  state.editingGameEventId = "";
  state.notice = "";
  state.error = "";
  render();
}

async function onUpdateGameEvent(event) {
  event.preventDefault();
  const gameEventId = String(event.currentTarget?.dataset?.gameUpdate || "").trim();
  if (!gameEventId) {
    return;
  }

  await withBusy(async () => {
    const formData = new FormData(event.currentTarget);
    await api(`/api/game-events/${gameEventId}`, {
      method: "PUT",
      body: {
        title: formData.get("title"),
        eventDate: formData.get("eventDate"),
        startsAt: formData.get("startsAt"),
        endsAt: formData.get("endsAt"),
        notes: formData.get("notes"),
      },
    });
    state.editingGameEventId = "";
    await hydrateDashboard();
    state.notice = "Запись в своде приключений переписана.";
    state.error = "";
    render();
  });
}

async function onDeleteGameEvent(event) {
  const gameEventId = String(event.currentTarget?.dataset?.gameDelete || "").trim();
  if (!gameEventId) {
    return;
  }

  if (!window.confirm("Изгладить это событие из свода приключений?")) {
    return;
  }

  await withBusy(async () => {
    await api(`/api/game-events/${gameEventId}`, {
      method: "DELETE",
    });
    if (state.editingGameEventId === gameEventId) {
      state.editingGameEventId = "";
    }
    await hydrateDashboard();
    state.notice = "Событие изглажено из летописи походов.";
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
    await hydrateDashboard();
    state.notice = "Новый обряд созван, а героям уже ушли свитки с назначением.";
    state.error = "";
    render();
  });
}

async function onStartStewardElection() {
  await withBusy(async () => {
    await api("/api/admin/steward-election/start", {
      method: "POST",
      body: {},
    });
    await hydrateDashboard();
    state.notice = "Выборный собор открыт, а совет уже получил почтовые вести.";
    state.error = "";
    render();
  });
}

async function onCastStewardElectionVote(event) {
  const candidateId = String(event.currentTarget?.dataset?.stewardElectionVote || "").trim();
  if (!candidateId) {
    return;
  }

  await withBusy(async () => {
    const response = await api("/api/council/steward-election/vote", {
      method: "POST",
      body: {
        candidateId,
      },
    });
    await hydrateDashboard();
    state.notice =
      response.resolution?.status === "completed"
        ? "Большинство найдено. Совет назвал нового Сенешаля."
        : response.resolution?.status === "runoff"
          ? "Круг завершился без большинства. Летопись открыла новый круг и вновь известила совет."
          : "Голос внесён в летопись собора.";
    state.error = "";
    render();
  });
}

async function onCompleteCycle(event) {
  const cycleId = String(event.currentTarget?.dataset?.cycleComplete || "").trim();
  if (!cycleId) {
    return;
  }

  await withBusy(async () => {
    const response = await api(`/api/cycles/${cycleId}/complete`, {
      method: "POST",
      body: {},
    });
    await hydrateDashboard();
    state.notice = response.justCompleted
      ? "Обряд закрыт двумя печатями. Кругу уже разосланы просьбы вынести вердикт."
      : "Ваша печать завершения внесена. Летопись ждёт знак второго героя.";
    state.error = "";
    render();
  });
}

async function onSubmitReview(event) {
  event.preventDefault();
  const cycleId = String(event.currentTarget?.dataset?.cycleReview || "").trim();
  if (!cycleId) {
    return;
  }

  await withBusy(async () => {
    const formData = new FormData(event.currentTarget);
    await api(`/api/cycles/${cycleId}/feedback`, {
      method: "POST",
      body: {
        rating: Number(formData.get("rating") || 0),
        comment: String(formData.get("comment") || "").trim(),
      },
    });
    await hydrateDashboard();
    state.notice = "Вердикт круга внесён в летопись.";
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
    if (error?.status === 401) {
      resetSessionState();
      state.error = "Печать угасла или не закрепилась. Войдите в зал ещё раз.";
    } else {
      state.error = error.message || "Чары дали сбой.";
    }
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
    credentials: "same-origin",
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
    const error = new Error(
      payload.error || `Запрос завершился со статусом ${response.status}.`,
    );
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

async function hydrateDashboard(options = {}) {
  const { retries = 0, retryDelayMs = 0 } = options;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const payload = await api("/api/dashboard", { allow401: true });
    if (payload?.me) {
      syncDashboard(payload);
      return payload;
    }

    if (attempt < retries) {
      await sleep(retryDelayMs);
    }
  }

  const error = new Error("Печать допуска ещё не закрепилась в летописи.");
  error.status = 401;
  throw error;
}

function resetSessionState() {
  state.me = null;
  state.dashboard = null;
  state.pendingEmail = "";
  state.loginCode = "";
  state.debugCode = "";
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getStats() {
  const memberCount = state.dashboard?.roster?.length || 0;
  const cycleCount = state.dashboard?.recentCycles?.length || 0;
  const gameCount = state.dashboard?.upcomingGames?.length || 0;
  const pendingReviewCount = state.dashboard?.pendingReviewCycles?.length || 0;
  const ratings = (state.dashboard?.roster || [])
    .map((member) => member.averageRating)
    .filter((value) => typeof value === "number");

  return {
    memberCount,
    cycleCount,
    gameCount,
    pendingReviewCount,
    averageRating: ratings.length
      ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1)
      : "—",
  };
}

function syncDashboard(dashboard) {
  state.dashboard = dashboard;
  if (dashboard?.me) {
    state.me = dashboard.me;
  }
}

function roleLabel(role) {
  if (role === "admin") {
    return "Магистр Совета";
  }
  if (role === "steward") {
    return "Сенешаль Совета";
  }
  return "Соратник круга";
}

function isCouncilMember(member) {
  return Boolean(member?.permissions?.canManageCycles);
}

function formatRatingValue(value) {
  return value === null || value === undefined ? "0.0" : Number(value).toFixed(1);
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

function memberRankStage(member) {
  return member?.rank?.stageLabel || "Ступень пока не открыта.";
}

function memberNextRankTitle(member) {
  return member?.rank?.nextTitle || "Высший сан братства";
}

function memberRankFutureHint(member) {
  return member?.rank?.futureRatingHint || "Слава ордена ещё только собирается.";
}

function getRankLadder() {
  return state.config?.rankLadder || [];
}

function rankThemeStyle(rank) {
  const theme = rank?.theme;
  if (!theme) {
    return "";
  }

  return [
    `--rank-panel-start:${theme.panelStart}`,
    `--rank-panel-end:${theme.panelEnd}`,
    `--rank-crest-start:${theme.crestStart}`,
    `--rank-crest-end:${theme.crestEnd}`,
    `--rank-accent:${theme.accent}`,
    `--rank-glow:${theme.glow}`,
  ].join(";");
}

function renderSceneIllustration(kind) {
  if (kind === "dashboard") {
    return `
      <svg viewBox="0 0 520 280" class="scene-illustration" aria-hidden="true">
        <defs>
          <linearGradient id="scene-bg-dashboard" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#1f1515" />
            <stop offset="58%" stop-color="#47221b" />
            <stop offset="100%" stop-color="#9b3e20" />
          </linearGradient>
          <linearGradient id="scene-gold-dashboard" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#f1d19a" />
            <stop offset="100%" stop-color="#a85d2f" />
          </linearGradient>
        </defs>
        <rect width="520" height="280" rx="28" fill="url(#scene-bg-dashboard)" />
        <circle cx="118" cy="86" r="44" fill="rgba(241,209,154,0.18)" />
        <path d="M75 196c36-66 84-102 150-102s114 36 150 102" fill="none" stroke="rgba(241,209,154,0.28)" stroke-width="14" stroke-linecap="round" />
        <path d="M112 218h296" stroke="rgba(255,250,244,0.22)" stroke-width="10" stroke-linecap="round" />
        <path d="M168 192v-80l58-30 58 30v80" fill="none" stroke="url(#scene-gold-dashboard)" stroke-width="10" stroke-linejoin="round" />
        <path d="M214 194v-48h24v48" fill="none" stroke="#f7ead6" stroke-width="10" stroke-linejoin="round" />
        <path d="M303 89c18 17 28 42 28 69" fill="none" stroke="rgba(255,250,244,0.34)" stroke-width="8" stroke-linecap="round" />
        <path d="M359 90c18 17 28 42 28 69" fill="none" stroke="rgba(255,250,244,0.2)" stroke-width="8" stroke-linecap="round" />
        <text x="46" y="242" fill="#f7ead6" font-family="Georgia, serif" font-size="28">Зал летописей</text>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 520 280" class="scene-illustration" aria-hidden="true">
      <defs>
        <linearGradient id="scene-bg-entry" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#151213" />
          <stop offset="58%" stop-color="#362019" />
          <stop offset="100%" stop-color="#7a2816" />
        </linearGradient>
        <linearGradient id="scene-gold-entry" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f3d49a" />
          <stop offset="100%" stop-color="#b7602d" />
        </linearGradient>
      </defs>
      <rect width="520" height="280" rx="28" fill="url(#scene-bg-entry)" />
      <path d="M102 214h316" stroke="rgba(255,248,239,0.22)" stroke-width="10" stroke-linecap="round" />
      <path d="M160 196V84l100-48 100 48v112" fill="none" stroke="url(#scene-gold-entry)" stroke-width="12" stroke-linejoin="round" />
      <path d="M225 198v-54h70v54" fill="none" stroke="#fff3e0" stroke-width="12" stroke-linejoin="round" />
      <circle cx="260" cy="92" r="18" fill="rgba(243,212,154,0.82)" />
      <path d="M117 108c16-15 34-24 56-28" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="8" stroke-linecap="round" />
      <path d="M347 80c24 8 44 23 59 45" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="8" stroke-linecap="round" />
      <text x="44" y="242" fill="#fff3e0" font-family="Georgia, serif" font-size="28">Печать входа</text>
    </svg>
  `;
}

function cycleStatusLabel(cycle) {
  if (cycle.status === "completed") {
    return "Обряд завершён";
  }
  if (cycle.myAssignmentCompleted) {
    return "Ждёт второго знака";
  }
  return "Обряд в пути";
}

function cycleStatusTone(cycle) {
  if (cycle.status === "completed") {
    return "done";
  }
  if (cycle.myAssignmentCompleted) {
    return "waiting";
  }
  return "live";
}

function renderStarString(rating) {
  return `${"★".repeat(Number(rating || 0))}${"☆".repeat(Math.max(0, 5 - Number(rating || 0)))}`;
}

function getOutcomeTitleFromRating(averageRating) {
  if (averageRating === null || averageRating === undefined) {
    return "Пока без вердикта";
  }
  if (averageRating >= 4.8) {
    return "Легендарный";
  }
  if (averageRating >= 4.4) {
    return "Образцовый";
  }
  if (averageRating >= 3.8) {
    return "Крепкий";
  }
  if (averageRating >= 3) {
    return "Шаткий";
  }
  return "Под сомнением";
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
