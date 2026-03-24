const state = {
  config: null,
  me: null,
  dashboard: null,
  page: "home",
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

const SCENE_LIBRARY = {
  citadel: {
    src: "/assets/fantasy-scenes/castle-at-dusk.jpg",
    alt: "Парящий замок над туманной долиной и зелёными берегами",
    kicker: "Знамение твердыни",
    title: "Парящий бастион",
    blurb: "Высокие залы, нависающие над бездной, напоминают: летопись держится на дисциплине не хуже, чем любая крепость на магии.",
  },
  siege: {
    src: "/assets/fantasy-scenes/castle-dragon-battle.jpg",
    alt: "Дракон поливает огнём осаждённую крепость среди дыма и пламени",
    kicker: "Знамение осады",
    title: "Драконья осада",
    blurb: "Так выглядит час, когда круг не прячет трудности под ковёр, а встречает их прямо, вместе и без суеты.",
  },
  wildwood: {
    src: "/assets/fantasy-scenes/enchanted-forest.jpg",
    alt: "Зачарованный лес с мельницей, мостками и светящимися огнями у воды",
    kicker: "Знамение чащи",
    title: "Шепчущий бор",
    blurb: "Не всякая сила приходит с боевым кличем: иногда порядок рождается в тихих рощах, где каждый знает своё место.",
  },
};

const ACHIEVEMENT_ICON_LIBRARY = Object.freeze({
  initiated: `
    <circle cx="32" cy="32" r="18"></circle>
    <path d="M32 12l3.5 8.5L44 24l-8.5 3.5L32 36l-3.5-8.5L20 24l8.5-3.5Z"></path>
  `,
  first_oath: `
    <path d="M32 11c-5 6-8 12-8 17 0 6 3.6 10 8 10s8-4 8-10c0-5-3-11-8-17Z"></path>
    <path d="M23 46h18"></path>
    <path d="M27 52h10"></path>
  `,
  third_bell: `
    <path d="M20 22c0-7 5-12 12-12s12 5 12 12"></path>
    <path d="M20 22v8l-4 6h32l-4-6v-8"></path>
    <path d="M26 44h12"></path>
    <path d="M18 14h4"></path>
    <path d="M42 14h4"></path>
    <path d="M30 8h4"></path>
  `,
  steady_hand: `
    <path d="M18 34l8-16 8 6 12-10"></path>
    <path d="M18 46h28"></path>
    <path d="M22 26l4 4"></path>
    <path d="M34 24l4 4"></path>
  `,
  first_verdict: `
    <path d="M18 46l10-10"></path>
    <path d="M26 20l18 18"></path>
    <path d="M30 16l4-4 14 14-4 4"></path>
    <path d="M16 48l8-2-6-6Z"></path>
  `,
  scribe_of_circle: `
    <path d="M18 18h12c4 0 6 2 8 5 2-3 4-5 8-5h2v28h-2c-4 0-6 2-8 5-2-3-4-5-8-5H18Z"></path>
    <path d="M32 23v23"></path>
  `,
  pathfinder: `
    <path d="M18 46l10-28 18 8-10 28Z"></path>
    <path d="M28 18l3-7 5 5-5 2"></path>
    <circle cx="34" cy="34" r="4"></circle>
  `,
  hall_host: `
    <path d="M20 22h10v14a5 5 0 0 1-10 0Z"></path>
    <path d="M30 24h5a4 4 0 0 1 0 8h-5"></path>
    <path d="M38 26h8v10a4 4 0 0 1-8 0Z"></path>
    <path d="M18 46h30"></path>
  `,
  golden_standard: `
    <path d="M32 11l6 12 13 2-9.5 9.5 2.2 13.5L32 42l-11.7 6 2.2-13.5L13 25l13-2Z"></path>
  `,
  seal_of_council: `
    <path d="M32 10l14 8v16l-14 8-14-8V18Z"></path>
    <path d="M24 28h16"></path>
    <path d="M28 22h8"></path>
    <path d="M28 34h8"></path>
  `,
  midnight_oil: `
    <path d="M40 14a12 12 0 1 0 8 20A14 14 0 1 1 40 14Z"></path>
    <path d="M20 46h16"></path>
    <path d="M24 46V31"></path>
    <path d="M24 31c4 2 6 5 6 8s-2 5-6 5"></path>
  `,
  voice_in_margins: `
    <path d="M18 48l10-10"></path>
    <path d="M26 20l18 18"></path>
    <path d="M30 16l4-4 14 14-4 4"></path>
    <path d="M18 18h10"></path>
    <path d="M16 26h8"></path>
    <path d="M14 34h8"></path>
  `,
  legendary_ritualist: `
    <path d="M32 10c-8 7-12 15-12 22 0 8 5 13 12 13s12-5 12-13c0-7-4-15-12-22Z"></path>
    <path d="M32 18c-3 4-5 8-5 11 0 3 2 5 5 5s5-2 5-5c0-3-2-7-5-11Z"></path>
  `,
  unbroken_glow: `
    <circle cx="32" cy="28" r="14"></circle>
    <path d="M20 46h24"></path>
    <path d="M24 52h16"></path>
    <path d="M32 10V6"></path>
    <path d="M45 15l3-3"></path>
    <path d="M19 15l-3-3"></path>
  `,
  north_star: `
    <path d="M32 10l4.5 13.5L50 28l-13.5 4.5L32 46l-4.5-13.5L14 28l13.5-4.5Z"></path>
    <circle cx="32" cy="28" r="4"></circle>
    <path d="M32 46v8"></path>
  `,
});

const PAGE_DEFINITIONS = Object.freeze([
  {
    id: "home",
    label: "Главная",
    kicker: "Зал летописей",
    title: (member) => `${member.displayName}, хроники открыты`,
    lead:
      "Перед вами короткий свод того, что требует внимания прямо сейчас: активные обеты, ближайший следующий обряд и общая картина круга.",
  },
  {
    id: "rituals",
    label: "Обряды",
    kicker: "Путь обряда",
    title: () => "Обряды, вердикты и недавние свершения",
    lead:
      "Здесь собраны завершённые свершения, звёздные вердикты и всё, что связано с ритуалами порядка и их исходом.",
  },
  {
    id: "adventures",
    label: "Походы",
    kicker: "Свод походов",
    title: () => "Сходки у стола и карта будущих встреч",
    lead:
      "В этом разделе круг ведёт грядущие партии, правит записи хронистов и следит, чтобы события не сталкивались с обрядами.",
  },
  {
    id: "circle",
    label: "Круг",
    kicker: "Свиток братства",
    title: () => "Звания, слава и имена круга",
    lead:
      "Здесь виден весь состав братства, путь возвышения каждого соратника и общая лестница званий ордена.",
  },
  {
    id: "achievements",
    label: "Знамения",
    kicker: "Книга достижений",
    title: () => "Открытые знаки, тайные трофеи и путь славы",
    lead:
      "Здесь собраны все знамения ордена: видимые для круга достижения и сокрытые трофеи, которые открываются только самым внимательным глазам.",
  },
  {
    id: "council",
    label: "Совет",
    kicker: "Собор круга",
    title: () => "Сенешаль, собор и палата повелений",
    lead:
      "Здесь решается судьба печати Сенешаля, открываются выборные круги и, когда нужно, Магистр отдаёт новые повеления.",
  },
]);

const BRAND_MARK_SRC = "/assets/brand/dutyguild-mark.svg";
const EMBER_FIELD = Object.freeze([
  { originX: "11%", originY: "5vh", travelX: "13vw", travelY: "-34vh", duration: "12.8s", delay: "-1.10s", size: "3px", opacity: "0.74", blur: "0.08px", scaleEnd: "0.96", rotation: "9deg" },
  { originX: "11.8%", originY: "6vh", travelX: "19vw", travelY: "-48vh", duration: "12.8s", delay: "-1.24s", size: "5px", opacity: "0.9", blur: "0.16px", scaleEnd: "1.2", rotation: "14deg" },
  { originX: "12.4%", originY: "5.4vh", travelX: "24vw", travelY: "-58vh", duration: "12.8s", delay: "-1.37s", size: "4px", opacity: "0.84", blur: "0.12px", scaleEnd: "1.06", rotation: "20deg" },
  { originX: "10.7%", originY: "5.8vh", travelX: "16vw", travelY: "-41vh", duration: "12.8s", delay: "-1.52s", size: "2px", opacity: "0.62", blur: "0.04px", scaleEnd: "0.86", rotation: "6deg" },
  { originX: "13.2%", originY: "6.2vh", travelX: "27vw", travelY: "-64vh", duration: "12.8s", delay: "-5.78s", size: "6px", opacity: "0.94", blur: "0.24px", scaleEnd: "1.28", rotation: "24deg" },
  { originX: "12%", originY: "5.6vh", travelX: "18vw", travelY: "-44vh", duration: "12.8s", delay: "-5.92s", size: "3px", opacity: "0.7", blur: "0.08px", scaleEnd: "0.94", rotation: "11deg" },
  { originX: "11.4%", originY: "5vh", travelX: "15vw", travelY: "-37vh", duration: "12.8s", delay: "-6.04s", size: "2px", opacity: "0.58", blur: "0.03px", scaleEnd: "0.78", rotation: "4deg" },
  { originX: "13.8%", originY: "6vh", travelX: "22vw", travelY: "-53vh", duration: "12.8s", delay: "-6.18s", size: "4px", opacity: "0.82", blur: "0.14px", scaleEnd: "1.02", rotation: "17deg" },
  { originX: "12.8%", originY: "5.2vh", travelX: "17vw", travelY: "-39vh", duration: "12.8s", delay: "-10.42s", size: "3px", opacity: "0.68", blur: "0.06px", scaleEnd: "0.88", rotation: "8deg" },
  { originX: "11.2%", originY: "6.1vh", travelX: "21vw", travelY: "-50vh", duration: "12.8s", delay: "-10.56s", size: "4px", opacity: "0.8", blur: "0.12px", scaleEnd: "1.04", rotation: "15deg" },
  { originX: "13.5%", originY: "5.7vh", travelX: "29vw", travelY: "-67vh", duration: "12.8s", delay: "-10.72s", size: "5px", opacity: "0.92", blur: "0.2px", scaleEnd: "1.26", rotation: "27deg" },
  { originX: "10.5%", originY: "5.3vh", travelX: "14vw", travelY: "-33vh", duration: "12.8s", delay: "-10.86s", size: "2px", opacity: "0.54", blur: "0.03px", scaleEnd: "0.74", rotation: "5deg" },
]);

const root = document.querySelector("#app");
window.addEventListener("hashchange", syncPageFromLocation);

boot().catch((error) => {
  console.error(error);
  state.loading = false;
  state.error = error.message || "Не удалось открыть зал ордена Duty Guild.";
  render();
});

async function boot() {
  state.config = await api("/api/config");
  syncPageFromLocation();

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
      <div class="ember-field" aria-hidden="true">
        ${renderEmberField()}
      </div>
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

function renderEmberField() {
  return EMBER_FIELD.map(
    (ember, index) => `
      <span
        class="ember ember--${index % 3}"
        style="
          --ember-origin-x:${ember.originX};
          --ember-origin-y:${ember.originY};
          --ember-travel-x:${ember.travelX};
          --ember-travel-y:${ember.travelY};
          --ember-duration:${ember.duration};
          --ember-delay:${ember.delay};
          --ember-size:${ember.size};
          --ember-opacity:${ember.opacity};
          --ember-blur:${ember.blur};
          --ember-scale-end:${ember.scaleEnd};
          --ember-rotation:${ember.rotation};
        "
      ></span>
    `,
  ).join("");
}

function renderSiteHeader() {
  const appName = escapeHtml(state.config?.appName || "Duty Guild");
  const userLabel = state.me
    ? renderHeaderUserMenu()
    : '<span class="header-user__meta">Закрытый зал ордена</span>';

  return `
    <header class="site-header">
      <div class="site-header__inner">
        <div class="brand-lockup">
          <div class="brand-mark">
            <img class="brand-mark__image" src="${BRAND_MARK_SRC}" alt="Герб Duty Guild" />
          </div>
          <div class="brand-copy">
            <span class="brand-kicker">Обет порядка</span>
            <strong class="brand-title">${appName}</strong>
          </div>
        </div>
        ${userLabel}
      </div>
    </header>
  `;
}

function renderHeaderUserMenu() {
  const member = state.me;
  if (!member) {
    return "";
  }

  return `
    <div class="header-user">
      <button class="header-user__trigger" type="button" aria-haspopup="true">
        <span class="header-user__name">${escapeHtml(member.displayName)}</span>
      </button>
      <div class="header-user__card">
        <div class="header-user__card-head">
          <strong>${escapeHtml(member.displayName)}</strong>
          <span>${escapeHtml(memberRankTitle(member))}</span>
        </div>
        <div class="header-user__details">
          <div class="header-user__detail">
            <span class="header-user__detail-label">Сан</span>
            <span>${escapeHtml(roleLabel(member.role))}</span>
          </div>
          <div class="header-user__detail">
            <span class="header-user__detail-label">Звание</span>
            <span>${escapeHtml(memberRankTitle(member))}</span>
          </div>
          <div class="header-user__detail">
            <span class="header-user__detail-label">Почта</span>
            <span>${escapeHtml(member.email)}</span>
          </div>
        </div>
        <p class="header-user__hint">${escapeHtml(memberRankProgress(member))}</p>
        <button id="logout-button" class="button button--primary header-user__logout" type="button">Покинуть зал</button>
      </div>
    </div>
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
      <article class="feature-card feature-card--entry">
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
            ${renderSceneIllustration("wildwood")}
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
  const page = getCurrentPageDefinition();
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
          <p class="section-tag">${escapeHtml(page.kicker)}</p>
          <h1>${escapeHtml(page.title(state.me))}</h1>
          <p class="feature-card__lead">${escapeHtml(page.lead)}</p>
        </div>
      </article>
      ${renderPageNavigation()}
      ${renderDashboardPage(state.page, { stats, currentCycle, nextCycle })}
    </section>
  `;
}

function renderPageNavigation() {
  return `
    <nav class="page-nav" aria-label="Разделы летописи">
      ${getAvailablePages()
        .map(
          (page) => `
            <a
              class="page-nav__link ${state.page === page.id ? "page-nav__link--active" : ""}"
              href="#${escapeHtml(page.id)}"
              ${state.page === page.id ? 'aria-current="page"' : ""}
            >
              ${escapeHtml(page.label)}
            </a>
          `,
        )
        .join("")}
    </nav>
  `;
}

function renderDashboardPage(pageId, context) {
  if (pageId === "rituals") {
    return `
      <section class="content-grid">
        ${renderCyclePanel(
          "Следующий обряд",
          state.dashboard.nextCycle,
          "Следующий обряд ещё не вписан в летопись.",
          "panel--wide",
        )}
        ${renderReviewPanel()}
        ${renderRecentRitualsPanel()}
      </section>
    `;
  }

  if (pageId === "adventures") {
    return `
      <section class="content-grid">
        ${renderAdventurePanel()}
      </section>
    `;
  }

  if (pageId === "circle") {
    return `
      <section class="content-grid">
        ${renderRankGuidePanel()}
        ${renderRosterPanel()}
      </section>
    `;
  }

  if (pageId === "achievements") {
    return `
      <section class="content-grid">
        ${renderAchievementCodexPanel()}
      </section>
    `;
  }

  if (pageId === "council") {
    return `
      <section class="content-grid">
        ${renderCouncilElectionPanel()}
        ${state.me.permissions?.canManageCycles ? renderAdminPanel() : ""}
      </section>
    `;
  }

  return `
    ${renderStatsBand(context.stats)}
    <section class="content-grid">
      ${context.currentCycle}
      ${renderUpcomingAdventuresPreviewPanel()}
    </section>
  `;
}

function renderStatsBand(stats) {
  return `
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
  `;
}

function renderCyclePanel(title, cycle, emptyText, panelClass = "") {
  const panelClasses = ["panel", panelClass].filter(Boolean).join(" ");
  if (!cycle) {
    return `
      <article class="${panelClasses}">
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
    <article class="${panelClasses}">
      <div class="panel__header">
        <p class="section-tag">${escapeHtml(title)}</p>
        <h2>${formatDate(cycle.plannedCleaningDate)}</h2>
      </div>
      <p class="panel__intro">
        Промежуток обряда: ${formatDate(cycle.startsOn)} - ${formatDate(cycle.endsOn)}
      </p>
      <div class="status-row">
        <span class="status-pill status-pill--${escapeHtml(cycleStatusTone(cycle))}">${escapeHtml(cycleStatusLabel(cycle))}</span>
        <span class="status-pill status-pill--ghost">${escapeHtml(cycle.status === "completed" ? cycle.outcome.shortTitle : "Вердикт ещё не вынесен")}</span>
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
        <div class="adventure-side">
          ${renderAdventureCalendarCard()}
          <form id="game-event-form" class="stack-form adventure-form">
            <h3>Вписать новое событие</h3>
            <label>
              <span>Название</span>
              <input name="title" placeholder="Root: реванш за лесной трон" />
            </label>
            <div class="split-fields">
              <label>
                <span>День начала</span>
                <input name="eventDate" type="date" />
              </label>
              <label>
                <span>День завершения</span>
                <input name="endDate" type="date" />
              </label>
            </div>
            <div class="split-fields">
              <label>
                <span>Время начала</span>
                <input name="startsAt" type="time" />
              </label>
              <label>
                <span>Время завершения</span>
                <input name="endsAt" type="time" />
              </label>
            </div>
            <p class="panel__aside-note">
              Если партия уходит за полночь, укажите следующий день завершения.
            </p>
            <label>
              <span>Пометка хрониста</span>
              <textarea name="notes" rows="3" placeholder="Например: кто ведёт партию, сколько героев зовётся и нужен ли большой стол"></textarea>
            </label>
            <button class="button button--secondary" type="submit" ${state.busy ? "disabled" : ""}>Внести в летопись</button>
          </form>
        </div>
      </div>
    </article>
  `;
}

function renderAdventureCalendarCard() {
  if (!state.me?.calendarSubscriptionUrl) {
    return "";
  }

  return `
    <article class="adventure-calendar-card">
      <p class="section-tag">Календарный свиток</p>
      <h3>Подписка на события ордена</h3>
      <p>
        В этом свитке живут только походы и встречи круга. Подпишитесь на него один раз, и новые даты будут подтягиваться в ваш календарь примерно каждые 5 минут.
      </p>
      <div class="button-row">
        ${
          state.me.calendarSubscriptionWebcalUrl
            ? `<a class="button button--secondary" href="${escapeHtml(state.me.calendarSubscriptionWebcalUrl)}">Подписаться на календарь</a>`
            : ""
        }
        <button class="button button--primary" type="button" data-calendar-copy="true">Скопировать ссылку</button>
      </div>
      <p class="panel__aside-note">
        Свиток общий. Его можно передавать друзьям и союзникам круга. Напоминания уже вложены: за 2 дня и за 1 день до события.
      </p>
    </article>
  `;
}

function renderUpcomingAdventuresPreviewPanel() {
  const upcomingGames = state.dashboard?.upcomingGames || [];
  const previewItems = upcomingGames
    .slice(0, 3)
    .map(
      (event) => `
        <li class="list-card">
          <div class="list-card__head">
            <strong>${escapeHtml(event.title)}</strong>
            <span>${formatEventDate(event)}</span>
          </div>
          ${
            event.notes
              ? `<p>${escapeHtml(event.notes)}</p>`
              : '<p>Хронист пока не оставил пометок, но знамя похода уже поднято.</p>'
          }
          <div class="list-card__meta-row">
            <span class="list-card__meta">Вписал в свод: ${escapeHtml(event.createdByName || "Неизвестный хронист")}</span>
          </div>
        </li>
      `,
    )
    .join("");

  if (!previewItems) {
    return `
      <article class="panel">
        <div class="panel__header">
          <p class="section-tag">Предстоящие приключения</p>
          <h2>Горизонт пока тих</h2>
        </div>
        <p class="panel__intro">
          Когда в летописи нет новых походов, это верный знак: пора выбрать вечер, собрать круг и наметить следующее приключение.
        </p>
        <p class="panel__aside-note">
          Мудрость ордена: даже великая сага начинается с одного вписанного вечера.
        </p>
      </article>
    `;
  }

  return `
    <article class="panel">
      <div class="panel__header">
        <p class="section-tag">Предстоящие приключения</p>
        <h2>Ближайшие встречи круга</h2>
      </div>
      <p class="panel__intro">
        Здесь собраны ближайшие походы, чтобы орден сразу видел, какие вечера уже зовут к столу.
      </p>
      <ul class="list-stack">${previewItems}</ul>
      ${
        upcomingGames.length > 3
          ? '<p class="panel__aside-note">Остальные встречи уже ждут вас в полном своде походов.</p>'
          : ""
      }
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
          Править
        </button>
        <button
          class="button button--danger"
          type="button"
          data-game-delete="${escapeHtml(event.id)}"
          ${state.busy ? "disabled" : ""}
        >
          Убрать со свода
        </button>
      </div>
    `
    : "";

  const editor = isEditing
    ? `
      <form class="stack-form event-edit-form" data-game-update="${escapeHtml(event.id)}">
        <div class="event-edit-form__header">
          <strong>Правка записи</strong>
          <button
            class="button button--secondary"
            type="button"
            data-game-edit-cancel="${escapeHtml(event.id)}"
            ${state.busy ? "disabled" : ""}
          >
            Отмена
          </button>
        </div>
        <label>
          <span>Название</span>
          <input name="title" value="${escapeHtml(event.title)}" />
        </label>
        <label>
          <span>День начала</span>
          <input name="eventDate" type="date" value="${escapeHtml(event.eventDate)}" />
        </label>
        <label>
          <span>День завершения</span>
          <input name="endDate" type="date" value="${escapeHtml(event.endDate || event.eventDate)}" />
        </label>
        <div class="split-fields">
          <label>
            <span>Время начала</span>
            <input name="startsAt" type="time" value="${escapeHtml(event.startsAt || "")}" />
          </label>
          <label>
            <span>Время завершения</span>
            <input name="endsAt" type="time" value="${escapeHtml(event.endsAt || "")}" />
          </label>
        </div>
        <p class="panel__aside-note">
          Если встреча уходит за полночь, укажите следующий день завершения.
        </p>
        <label>
          <span>Пометка хрониста</span>
          <textarea name="notes" rows="3">${escapeHtml(event.notes || "")}</textarea>
        </label>
        <button class="button button--primary" type="submit" ${state.busy ? "disabled" : ""}>
          Сохранить
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
        <p>Круг ещё не назвал соратника, который понесёт этот сан.</p>
      </article>
    `;

  const latestOutcome = election.lastCompletedElection
    ? `
      <article class="election-summary-card">
        <span class="rank-summary-card__label">Последний исход</span>
        <strong>${escapeHtml(election.lastCompletedElection.winnerName)}</strong>
        <p>${
          Number(election.lastCompletedElection.roundNumber || 0) > 0
            ? `Кругов понадобилось: ${escapeHtml(String(election.lastCompletedElection.roundNumber || 1))}`
            : "Назначен силой явного лидерства по славе."
        }</p>
        <p class="election-summary-card__meta">${escapeHtml(formatDateTime(election.lastCompletedElection.completedAt))}</p>
      </article>
    `
    : `
      <article class="election-summary-card">
        <span class="rank-summary-card__label">Последний исход</span>
        <strong>Первый собор впереди</strong>
        <p>Как только Магистр откроет собор, здесь появится имя первого избранного Сенешаля.</p>
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
          В первый круг попадут все соратники, которые делят вершину славы. Голосовать смогут все активные члены ордена, за себя голосовать нельзя, а письма уйдут только после открытия собора.
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
            <span class="status-pill status-pill--${activeElection.allMembersVoted ? "waiting" : "live"}">
              Голосов: ${escapeHtml(String(activeElection.votesCast))} из ${escapeHtml(String(activeElection.voterCount))}
            </span>
          </div>
        </div>
        <p class="panel__intro">
          Собор созвал ${escapeHtml(activeElection.launchedByName)}. Для избрания нужно больше половины голосов всего круга.
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
        <p class="section-tag">Собор круга</p>
        <h2>Печать Сенешаля и воля круга</h2>
      </div>
      <p class="panel__intro">
        Если вершину славы делят несколько соратников, Магистр открывает собор, и весь круг решает исход голосами.
        Когда в летописи появляется единоличный лидер по славе, печать Сенешаля переходит к нему сама.
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
            <li>Для избрания нужно больше половины голосов всего круга.</li>
            <li>Если круг не выявил победителя, летопись оставит 2-3 сильнейших имени и откроет новый круг.</li>
            <li>Каждый шаг собора сопровождается письмами для всего ордена.</li>
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
    : '<span class="member-cell__meta">Голосовать может любой активный соратник круга.</span>';

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
    <article class="panel panel--wide">
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

function renderAchievementCodexPanel() {
  const codex = state.dashboard?.achievementCodex;
  if (!codex) {
    return "";
  }

  const publicCards = codex.publicAchievements
    .map((achievement) => renderAchievementCard(achievement))
    .join("");
  const hiddenCards = codex.hiddenAchievements
    .map((achievement) => renderAchievementCard(achievement))
    .join("");

  return `
    <article class="panel panel--wide achievement-panel">
      <div class="panel__header">
        <p class="section-tag">Книга достижений</p>
        <h2>Знамения ордена и тайные трофеи</h2>
      </div>
      <p class="panel__intro">
        ${
          codex.canViewHidden
            ? "Здесь живут все пятнадцать знаков ордена: открытые знамения для круга и сокрытые трофеи, доступные только вашему взгляду."
            : "Здесь живут открытые знамения ордена: вехи служения, славы и походов, которые видит весь круг."
        }
      </p>
      <div class="achievement-summary-grid">
        <article class="achievement-summary-card">
          <span class="achievement-summary-card__label">Открытые знамения</span>
          <strong>${escapeHtml(String(codex.publicEarnedCount))} / ${escapeHtml(String(codex.publicCount))}</strong>
          <p>Видны всему кругу и раскрываются по мере службы, славы и походов.</p>
        </article>
        <article class="achievement-summary-card">
          <span class="achievement-summary-card__label">${escapeHtml(codex.canViewHidden ? "Сокрытые трофеи" : "Глубина книги")}</span>
          <strong>${escapeHtml(codex.canViewHidden ? `${codex.hiddenEarnedCount} / ${codex.hiddenCount}` : "Не всё видно")}</strong>
          <p>${
            codex.canViewHidden
              ? "Эти знаки открыты только вашему взору и не показываются остальным соратникам."
              : "Летопись показывает только те страницы, которые положено видеть всему кругу."
          }</p>
        </article>
        <article class="achievement-summary-card">
          <span class="achievement-summary-card__label">Общий размах</span>
          <strong>${escapeHtml(String(codex.publicEarnedCount + codex.hiddenEarnedCount))}</strong>
          <p>Столько знаков уже откликнулось на ваш путь в ордене.</p>
        </article>
      </div>
      <section class="achievement-section">
        <div class="achievement-section__head">
          <div>
            <p class="section-tag">Открытый свод</p>
            <h3>Знамения, видимые всему кругу</h3>
          </div>
          <span class="status-pill status-pill--ghost">${escapeHtml(String(codex.publicCount))} знаков</span>
        </div>
        <div class="achievement-grid">
          ${publicCards}
        </div>
      </section>
      ${
        codex.canViewHidden
          ? `
            <section class="achievement-section achievement-section--hidden">
              <div class="achievement-section__head">
                <div>
                  <p class="section-tag">Тайный раздел</p>
                  <h3>Сокрытые трофеи Магистра</h3>
                </div>
                <span class="status-pill status-pill--ghost">${escapeHtml(String(codex.hiddenCount))} тайных знаков</span>
              </div>
              <p class="panel__aside-note">
                Эти страницы открыты только вам. Для остального круга они просто не существуют.
              </p>
              <div class="achievement-grid achievement-grid--hidden">
                ${hiddenCards}
              </div>
            </section>
          `
          : ""
      }
    </article>
  `;
}

function renderAchievementCard(achievement) {
  const classes = [
    "achievement-card",
    achievement.earned ? "achievement-card--earned" : "",
    achievement.hidden ? "achievement-card--hidden" : "",
    achievement.rarity ? `achievement-card--${achievement.rarity}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <article class="${classes}">
      <div class="achievement-card__icon-shell">
        ${renderAchievementIcon(achievement.icon, achievement.title)}
      </div>
      <div class="achievement-card__copy">
        <div class="achievement-card__head">
          <div>
            <span class="achievement-card__eyebrow">${escapeHtml(achievement.hidden ? "Скрытый трофей" : "Знамение ордена")}</span>
            <h3>${escapeHtml(achievement.title)}</h3>
          </div>
          <span class="status-pill ${achievement.earned ? "status-pill--done" : "status-pill--ghost"}">${escapeHtml(achievement.stateLabel)}</span>
        </div>
        <p>${escapeHtml(achievement.description)}</p>
        <div class="achievement-card__details">
          <div>
            <span class="achievement-card__label">Критерий</span>
            <span>${escapeHtml(achievement.criteria)}</span>
          </div>
          <div>
            <span class="achievement-card__label">Прогресс</span>
            <span>${escapeHtml(achievement.progressLabel)}</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderAchievementIcon(iconId, title) {
  const body = ACHIEVEMENT_ICON_LIBRARY[iconId] || ACHIEVEMENT_ICON_LIBRARY.initiated;
  return `
    <svg class="achievement-icon" viewBox="0 0 64 64" aria-hidden="true" role="img" focusable="false">
      <title>${escapeHtml(title)}</title>
      <g fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
        ${body}
      </g>
    </svg>
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
    : "Как Сенешаль, вы можете созывать новые обряды и править летопись походов, но свиток братства пополняет только Магистр.";
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
          <p class="section-tag">Воля круга</p>
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

  document.querySelector("#logout-button")?.addEventListener("click", onLogout);
  document.querySelector("#generate-cycle-button")?.addEventListener("click", onGenerateCycle);
  document.querySelector("#invite-member-form")?.addEventListener("submit", onInviteMember);
  document.querySelector("#game-event-form")?.addEventListener("submit", onCreateGameEvent);
  document.querySelector("[data-calendar-copy]")?.addEventListener("click", onCopyCalendarLink);
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
  const form = event.currentTarget;
  await withBusy(async () => {
    const formData = new FormData(form);
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

async function onLogout() {
  await withBusy(async () => {
    await api("/api/auth/logout", { method: "POST" });
    state.me = null;
    state.dashboard = null;
    state.page = "home";
    state.notice = "Вы покинули зал ордена.";
    state.error = "";
    render();
  });
}

async function onInviteMember(event) {
  event.preventDefault();
  const form = event.currentTarget;
  await withBusy(async () => {
    const formData = new FormData(form);
    await api("/api/admin/members", {
      method: "POST",
      body: {
        displayName: formData.get("displayName"),
        email: formData.get("email"),
        role: formData.get("role"),
      },
    });
    form.reset();
    await hydrateDashboard();
    state.notice = "Имя внесено в свиток братства.";
    state.error = "";
    render();
  });
}

async function onCreateGameEvent(event) {
  event.preventDefault();
  const form = event.currentTarget;
  await withBusy(async () => {
    const formData = new FormData(form);
    await api("/api/game-events", {
      method: "POST",
      body: {
        title: formData.get("title"),
        eventDate: formData.get("eventDate"),
        endDate: formData.get("endDate") || formData.get("eventDate"),
        startsAt: formData.get("startsAt"),
        endsAt: formData.get("endsAt"),
        notes: formData.get("notes"),
      },
    });
    form.reset();
    state.editingGameEventId = "";
    await hydrateDashboard();
    state.notice = "Событие вписано в летопись, а круг получил почтовое знамение.";
    state.error = "";
    render();
  });
}

async function onCopyCalendarLink() {
  const calendarUrl = String(state.me?.calendarSubscriptionUrl || "").trim();
  if (!calendarUrl) {
    state.error = "Свиток календаря пока не раскрыт.";
    state.notice = "";
    render();
    return;
  }

  try {
    await navigator.clipboard.writeText(calendarUrl);
    state.notice = "Ссылка на общий календарный свиток скопирована.";
    state.error = "";
    render();
  } catch {
    state.error = "Не удалось скопировать ссылку. Попробуйте ещё раз.";
    state.notice = "";
    render();
  }
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
  const form = event.currentTarget;
  const gameEventId = String(form?.dataset?.gameUpdate || "").trim();
  if (!gameEventId) {
    return;
  }

  await withBusy(async () => {
    const formData = new FormData(form);
    await api(`/api/game-events/${gameEventId}`, {
      method: "PUT",
      body: {
        title: formData.get("title"),
        eventDate: formData.get("eventDate"),
        endDate: formData.get("endDate") || formData.get("eventDate"),
        startsAt: formData.get("startsAt"),
        endsAt: formData.get("endsAt"),
        notes: formData.get("notes"),
      },
    });
    state.editingGameEventId = "";
    await hydrateDashboard();
    state.notice = "Запись в своде приключений обновлена.";
    state.error = "";
    render();
  });
}

async function onDeleteGameEvent(event) {
  const gameEventId = String(event.currentTarget?.dataset?.gameDelete || "").trim();
  if (!gameEventId) {
    return;
  }

  if (!window.confirm("Убрать это событие из свода приключений?")) {
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
    state.notice = "Событие убрано из свода приключений.";
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
    const response = await api("/api/admin/steward-election/start", {
      method: "POST",
      body: {},
    });
    await hydrateDashboard();
    state.notice = response.autoAssigned
      ? "В летописи уже есть явный лидер по славе. Печать Сенешаля возложена автоматически."
      : "Выборный собор открыт, а круг уже получил почтовые вести.";
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
        ? "Большинство найдено. Круг назвал нового Сенешаля."
        : response.resolution?.status === "runoff"
          ? "Круг завершился без большинства. Летопись открыла новый круг и вновь известила весь орден."
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
  const form = event.currentTarget;
  const cycleId = String(form?.dataset?.cycleReview || "").trim();
  if (!cycleId) {
    return;
  }

  await withBusy(async () => {
    const formData = new FormData(form);
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
  state.page = "home";
  state.pendingEmail = "";
  state.loginCode = "";
  state.debugCode = "";
}

function syncPageFromLocation() {
  state.page = resolvePageFromHash(window.location.hash);
  if (!state.loading) {
    render();
  }
}

function resolvePageFromHash(hashValue) {
  const normalized = String(hashValue || "")
    .replace(/^#\/?/, "")
    .trim()
    .toLowerCase();
  const allowed = new Set(PAGE_DEFINITIONS.map((page) => page.id));
  return allowed.has(normalized) ? normalized : "home";
}

function getAvailablePages() {
  return PAGE_DEFINITIONS;
}

function getCurrentPageDefinition() {
  return (
    PAGE_DEFINITIONS.find((page) => page.id === state.page) ||
    PAGE_DEFINITIONS[0]
  );
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
  const scene = SCENE_LIBRARY[kind] || SCENE_LIBRARY.citadel;
  return `
    <figure class="scene-card scene-card--${escapeHtml(kind)}">
      <img
        class="scene-illustration"
        src="${escapeHtml(scene.src)}"
        alt="${escapeHtml(scene.alt)}"
        loading="lazy"
        decoding="async"
      />
      <figcaption class="scene-card__caption">
        <span class="scene-card__tag">${escapeHtml(scene.kicker)}</span>
        <strong>${escapeHtml(scene.title)}</strong>
        <span>${escapeHtml(scene.blurb)}</span>
      </figcaption>
    </figure>
  `;
}

function cycleStatusLabel(cycle) {
  if (cycle.status === "completed") {
    return "Обряд завершён";
  }
  if (cycle.myAssignmentCompleted) {
    return "Ждёт второго знака";
  }
  return "Обряд совершается";
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
  const startDateLabel = formatDate(event.eventDate);
  const endDateLabel = formatDate(event.endDate || event.eventDate);

  if (event.eventDate !== (event.endDate || event.eventDate)) {
    const startLabel = event.startsAt ? `${startDateLabel}, ${event.startsAt}` : startDateLabel;
    const endLabel = event.endsAt ? `${endDateLabel}, ${event.endsAt}` : endDateLabel;
    return `${startLabel} - ${endLabel}`;
  }

  if (event.startsAt && event.endsAt) {
    return `${startDateLabel}, ${event.startsAt} - ${event.endsAt}`;
  }

  if (event.startsAt) {
    return `${startDateLabel}, с ${event.startsAt}`;
  }

  if (event.endsAt) {
    return `${startDateLabel}, до ${event.endsAt}`;
  }

  return startDateLabel;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
