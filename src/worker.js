import { readFileSync } from "node:fs";

const appScript = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const indexDocument = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const stylesSheet = readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
const brandMarkSvg = readFileSync(new URL("../public/assets/brand/dutyguild-mark.svg", import.meta.url), "utf8");
const brandMarkPng = readFileSync(new URL("../public/assets/brand/dutyguild-mark.png", import.meta.url));
const staticAssets = new Map([
  [
    "/assets/brand/dutyguild-mark.svg",
    {
      body: brandMarkSvg,
      contentType: "image/svg+xml",
      cacheControl: "public, max-age=86400",
    },
  ],
  [
    "/assets/brand/dutyguild-mark.png",
    {
      body: brandMarkPng,
      contentType: "image/png",
      cacheControl: "public, max-age=86400",
    },
  ],
  [
    "/assets/fantasy-scenes/castle-at-dusk.jpg",
    {
      body: readFileSync(new URL("../public/assets/fantasy-scenes/castle-at-dusk.jpg", import.meta.url)),
      contentType: "image/jpeg",
      cacheControl: "public, max-age=86400",
    },
  ],
  [
    "/assets/fantasy-scenes/castle-dragon-battle.jpg",
    {
      body: readFileSync(new URL("../public/assets/fantasy-scenes/castle-dragon-battle.jpg", import.meta.url)),
      contentType: "image/jpeg",
      cacheControl: "public, max-age=86400",
    },
  ],
  [
    "/assets/fantasy-scenes/enchanted-forest.jpg",
    {
      body: readFileSync(new URL("../public/assets/fantasy-scenes/enchanted-forest.jpg", import.meta.url)),
      contentType: "image/jpeg",
      cacheControl: "public, max-age=86400",
    },
  ],
]);

const EMAIL_SCENES = Object.freeze({
  citadel: {
    path: "/assets/fantasy-scenes/castle-at-dusk.jpg",
    alt: "Парящий замок над туманной долиной",
  },
  siege: {
    path: "/assets/fantasy-scenes/castle-dragon-battle.jpg",
    alt: "Дракон осаждает объятую огнём крепость",
  },
  wildwood: {
    path: "/assets/fantasy-scenes/enchanted-forest.jpg",
    alt: "Зачарованный лес с водяной мельницей и мостками",
  },
});

const FAVICON_SVG = brandMarkSvg;

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

const RITUAL_OUTCOME_LADDER = Object.freeze([
  {
    id: "legendary",
    minRating: 4.8,
    title: "Легендарный обряд",
    shortTitle: "Легендарный",
    description: "Зал сияет так, словно над ним прошёл благословенный шторм света.",
    accent: "#d6a54b",
    glow: "rgba(214, 165, 75, 0.24)",
  },
  {
    id: "exemplary",
    minRating: 4.4,
    title: "Образцовый обряд",
    shortTitle: "Образцовый",
    description: "Сильное, чистое исполнение, достойное быть примером для круга.",
    accent: "#b7552d",
    glow: "rgba(183, 85, 45, 0.22)",
  },
  {
    id: "steadfast",
    minRating: 3.8,
    title: "Крепкий обряд",
    shortTitle: "Крепкий",
    description: "Обряд проведён уверенно: зал спокоен, летопись довольна.",
    accent: "#8b6c48",
    glow: "rgba(139, 108, 72, 0.18)",
  },
  {
    id: "wavering",
    minRating: 3,
    title: "Шаткий обряд",
    shortTitle: "Шаткий",
    description: "Обряд состоялся, но круг ждёт более собранного исполнения в следующий раз.",
    accent: "#8a4b3a",
    glow: "rgba(138, 75, 58, 0.18)",
  },
  {
    id: "troubled",
    minRating: 0,
    title: "Обряд под сомнением",
    shortTitle: "Под сомнением",
    description: "Залу нужна более твёрдая рука и больше согласованности пары.",
    accent: "#6c2f29",
    glow: "rgba(108, 47, 41, 0.2)",
  },
]);

const SERVICE_DEED_LIBRARY = Object.freeze({
  trash: {
    id: "trash",
    label: "Изгнать сор из зала",
    shortLabel: "Изгнание сора",
    description:
      "Унести сор, коробки и всё лишнее за порог, чтобы зал снова дышал легко.",
  },
  dust: {
    id: "dust",
    label: "Прогнать пыль вихрем",
    shortLabel: "Охота на пыль",
    description:
      "Пройтись вихрем чистоты по полу и углам, чтобы пыль не задерживалась в зале.",
  },
  order: {
    id: "order",
    label: "Вернуть реликвии на места",
    shortLabel: "Возвращение реликвий",
    description:
      "Разложить коробки, свитки и прочие реликвии круга по их законным местам.",
  },
});

const SERVICE_DEED_ACHIEVEMENTS = Object.freeze([
  {
    id: "ash_bearer",
    icon: "ash_bearer",
    hidden: false,
    rarity: "ember",
    deedType: "trash",
    threshold: 1,
    title: "Пеплоносец",
    description: "Вы впервые вынесли сор за стены ордена и очистили путь для новых свершений.",
    criteria: "Зачесть «Изгнание сора» 1 раз.",
  },
  {
    id: "cinder_caravan",
    icon: "cinder_caravan",
    hidden: false,
    rarity: "bronze",
    deedType: "trash",
    threshold: 5,
    title: "Караван золы",
    description: "Сор уже не задерживается в зале: вы умеете проводить его за ворота без лишней суеты.",
    criteria: "Зачесть «Изгнание сора» 5 раз.",
  },
  {
    id: "ember_exorcist",
    icon: "ember_exorcist",
    hidden: false,
    rarity: "silver",
    deedType: "trash",
    threshold: 10,
    title: "Изгоняющий сор",
    description: "Лишнее отступает перед вами быстро и без права остаться в летописи зала.",
    criteria: "Зачесть «Изгнание сора» 10 раз.",
  },
  {
    id: "gate_of_cinders",
    icon: "gate_of_cinders",
    hidden: false,
    rarity: "gold",
    deedType: "trash",
    threshold: 20,
    title: "Владыка пепельных врат",
    description: "Вы сделали вынос сора частью порядка ордена, а не редким героическим порывом.",
    criteria: "Зачесть «Изгнание сора» 20 раз.",
  },
  {
    id: "dust_hunter",
    icon: "dust_hunter",
    hidden: false,
    rarity: "ember",
    deedType: "dust",
    threshold: 1,
    title: "Охотник на пыль",
    description: "Первый вихрь уже поднят, и пыль в зале впервые поняла, что ей здесь не рады.",
    criteria: "Зачесть «Охоту на пыль» 1 раз.",
  },
  {
    id: "whirl_keeper",
    icon: "whirl_keeper",
    hidden: false,
    rarity: "bronze",
    deedType: "dust",
    threshold: 5,
    title: "Хранитель вихря",
    description: "Вы умеете поддерживать чистое дыхание зала не рывком, а устойчивой привычкой.",
    criteria: "Зачесть «Охоту на пыль» 5 раз.",
  },
  {
    id: "hall_tempest",
    icon: "hall_tempest",
    hidden: false,
    rarity: "silver",
    deedType: "dust",
    threshold: 10,
    title: "Буревестник зала",
    description: "Ваш вихрь проходит по залу как уверенный шторм, после которого остаётся только порядок.",
    criteria: "Зачесть «Охоту на пыль» 10 раз.",
  },
  {
    id: "storm_of_purity",
    icon: "storm_of_purity",
    hidden: false,
    rarity: "gold",
    deedType: "dust",
    threshold: 20,
    title: "Шторм чистоты",
    description: "Редкая пыль осмелится задержаться там, где вы уже двадцать раз поднимали вихрь.",
    criteria: "Зачесть «Охоту на пыль» 20 раз.",
  },
  {
    id: "relic_keeper",
    icon: "relic_keeper",
    hidden: false,
    rarity: "ember",
    deedType: "order",
    threshold: 1,
    title: "Хранитель реликвий",
    description: "Вы впервые вернули священный беспорядок обратно под власть полок и ящиков.",
    criteria: "Зачесть «Возвращение реликвий» 1 раз.",
  },
  {
    id: "shelf_chronicler",
    icon: "shelf_chronicler",
    hidden: false,
    rarity: "bronze",
    deedType: "order",
    threshold: 5,
    title: "Летописец полок",
    description: "Вещи всё чаще находят свои места, а зал перестаёт хранить безымянные завалы.",
    criteria: "Зачесть «Возвращение реликвий» 5 раз.",
  },
  {
    id: "vault_marshal",
    icon: "vault_marshal",
    hidden: false,
    rarity: "silver",
    deedType: "order",
    threshold: 10,
    title: "Маршал кладовых",
    description: "Коробки, книги и реликвии строятся по местам, когда вы проходите по залу с твёрдой рукой.",
    criteria: "Зачесть «Возвращение реликвий» 10 раз.",
  },
  {
    id: "master_of_order",
    icon: "master_of_order",
    hidden: false,
    rarity: "gold",
    deedType: "order",
    threshold: 20,
    title: "Архитектор порядка",
    description: "Вы не просто раскладываете вещи: вы удерживаете саму геометрию орденского зала.",
    criteria: "Зачесть «Возвращение реликвий» 20 раз.",
  },
]);

const ACHIEVEMENT_LIBRARY = Object.freeze([
  {
    id: "initiated",
    icon: "initiated",
    hidden: false,
    rarity: "ember",
    title: "Принят в круг",
    description: "Имя внесено в свиток братства, а врата ордена больше не закрыты.",
    criteria: "Получить одобрение Совета и впервые войти в летопись.",
  },
  {
    id: "first_oath",
    icon: "first_oath",
    hidden: false,
    rarity: "ember",
    title: "Первая клятва",
    description: "Первый завершённый обряд закрепил ваше место среди хранителей порядка.",
    criteria: "Завершить 1 обряд.",
  },
  {
    id: "first_verdict",
    icon: "first_verdict",
    hidden: false,
    rarity: "ember",
    title: "Первый вердикт хрониста",
    description: "Вы впервые оставили голос в летописи и помогли кругу вынести общий суд.",
    criteria: "Оставить 1 звёздный вердикт.",
  },
  {
    id: "pathfinder",
    icon: "pathfinder",
    hidden: false,
    rarity: "ember",
    title: "Знамя похода",
    description: "Вы первым подняли знамя приключения и созвали круг к столу.",
    criteria: "Вписать в свод 1 встречу или поход.",
  },
  {
    id: "third_bell",
    icon: "third_bell",
    hidden: false,
    rarity: "bronze",
    title: "Три удара колокола",
    description: "Круг уже знает вашу руку и не удивляется, когда жребий зовёт именно вас.",
    criteria: "Завершить 3 обряда.",
  },
  {
    id: "open_ledger",
    icon: "open_ledger",
    hidden: false,
    rarity: "bronze",
    title: "Открытая книга",
    description: "Поля летописи перестали быть пустыми: ваши заметки начали направлять круг.",
    criteria: "Оставить 3 вердикта с текстовой пометкой.",
  },
  {
    id: "chorus_of_witnesses",
    icon: "chorus_of_witnesses",
    hidden: false,
    rarity: "bronze",
    title: "Хор свидетелей",
    description: "Круг уже не раз отметил ваш труд, и голоса свидетелей сложились в уверенный строй.",
    criteria: "Собрать 5 свидетельств о ритуалах.",
  },
  {
    id: "dawn_crossing",
    icon: "dawn_crossing",
    hidden: false,
    rarity: "bronze",
    title: "На границе суток",
    description: "Поход протянулся за полночь и не оборвался на пороге нового дня.",
    criteria: "Вписать 1 событие, которое уходит за полночь.",
  },
  {
    id: "scribe_of_circle",
    icon: "scribe_of_circle",
    hidden: false,
    rarity: "bronze",
    title: "Хронист круга",
    description: "Ваше перо уже не молчит: оно регулярно направляет славу и память ордена.",
    criteria: "Оставить 5 звёздных вердиктов.",
  },
  {
    id: "steady_hand",
    icon: "steady_hand",
    hidden: false,
    rarity: "silver",
    title: "Надёжная рука зала",
    description: "Служение стало привычной силой: на вас можно опереться без лишних слов.",
    criteria: "Завершить 7 обрядов.",
  },
  {
    id: "hall_host",
    icon: "hall_host",
    hidden: false,
    rarity: "silver",
    title: "Хозяин длинного стола",
    description: "Вы не просто приходите на встречи, а помогаете ордену держать ритм походов.",
    criteria: "Вписать в свод 4 встречи или похода.",
  },
  {
    id: "laureled_name",
    icon: "laureled_name",
    hidden: false,
    rarity: "silver",
    title: "Лавры круга",
    description: "Высокая слава перестала быть случайной удачей и стала вашим устойчивым именем.",
    criteria: "Держать славу 4.7+ при минимум 5 свидетельствах.",
  },
  {
    id: "steady_chorus",
    icon: "steady_chorus",
    hidden: false,
    rarity: "silver",
    title: "Стройный хор",
    description: "Вы не только служите, но и умеете раз за разом поддерживать живой голос летописи.",
    criteria: "Завершить 5 обрядов и оставить 3 вердикта с пометкой.",
  },
  {
    id: "silver_quill",
    icon: "silver_quill",
    hidden: false,
    rarity: "silver",
    title: "Серебряное перо",
    description: "Ваше слово стало заметным инструментом круга, а не случайной строкой на полях.",
    criteria: "Оставить 10 звёздных вердиктов.",
  },
  {
    id: "golden_standard",
    icon: "golden_standard",
    hidden: false,
    rarity: "gold",
    title: "Золотой стандарт",
    description: "Круг выносит вам высокий вердикт снова и снова, и имя это уже замечают.",
    criteria: "Набрать славу 4.5+ при минимум 3 свидетельствах.",
  },
  {
    id: "torchbearer",
    icon: "torchbearer",
    hidden: false,
    rarity: "gold",
    title: "Факелоносец обряда",
    description: "Ваш факел уже не зажигают за вас: вы сами удерживаете свет ритуала, когда он нужен кругу.",
    criteria: "Завершить 12 обрядов.",
  },
  {
    id: "road_captain",
    icon: "road_captain",
    hidden: false,
    rarity: "gold",
    title: "Капитан походов",
    description: "Вы умеете не только прийти, но и собрать компанию, время и дорогу в один уверенный путь.",
    criteria: "Вписать в свод 8 встреч или походов.",
  },
  {
    id: "seal_of_council",
    icon: "seal_of_council",
    hidden: false,
    rarity: "gold",
    title: "Печать совета",
    description: "Вы несёте один из управных санов ордена и вправе направлять его ход.",
    criteria: "Стать Магистром или Сенешалем Совета.",
  },
  {
    id: "circle_pillar",
    icon: "circle_pillar",
    hidden: false,
    rarity: "gold",
    title: "Столп круга",
    description: "В служении, летописи и походах ваше имя уже звучит как одна из опор ордена.",
    criteria: "Завершить 10 обрядов, оставить 5 вердиктов и вписать 4 события.",
  },
  {
    id: "hall_warden",
    icon: "hall_warden",
    hidden: false,
    rarity: "mythic",
    title: "Оплот ордена",
    description: "Круг видит в вас не просто опытного соратника, а настоящую стену, на которую можно положиться.",
    criteria: "Завершить 20 обрядов.",
  },
  ...SERVICE_DEED_ACHIEVEMENTS,
  {
    id: "midnight_oil",
    icon: "midnight_oil",
    hidden: true,
    rarity: "mythic",
    title: "После полуночи",
    description: "Не каждый поход умеет трижды дотянуться до нового дня. Этот след уже пахнет легендой.",
    criteria: "Вписать 3 события, которые уходят за полночь.",
  },
  {
    id: "voice_in_margins",
    icon: "voice_in_margins",
    hidden: true,
    rarity: "mythic",
    title: "Шёпот на полях",
    description: "Ваши пометки не теряются в летописи: они становятся её живым голосом.",
    criteria: "Оставить 7 вердиктов с текстовым комментарием.",
  },
  {
    id: "legendary_ritualist",
    icon: "legendary_ritualist",
    hidden: true,
    rarity: "mythic",
    title: "Белое пламя",
    description: "Легендарные исходы не случаются сами собой. Их зажигают те, кто держит меру без дрожи.",
    criteria: "Провести 3 обряда с легендарным исходом.",
  },
  {
    id: "unbroken_glow",
    icon: "unbroken_glow",
    hidden: true,
    rarity: "mythic",
    title: "Нерушимое сияние",
    description: "Служение, слава и признание круга сошлись в одну линию без излома.",
    criteria: "Завершить 10 обрядов и удержать славу 4.8+ при 10 свидетельствах.",
  },
  {
    id: "north_star",
    icon: "north_star",
    hidden: true,
    rarity: "mythic",
    title: "Полярная звезда ордена",
    description: "Ваше имя не просто в числе лучших: на него равняются как на единственный яркий ориентир.",
    criteria: "Стать единоличным лидером по славе при значении 4.7+ и минимум 5 свидетельствах.",
  },
  {
    id: "dragon_chronicler",
    icon: "dragon_chronicler",
    hidden: true,
    rarity: "mythic",
    title: "Драконье перо",
    description: "Ваши записи стали столь многочисленны и точны, что ими уже можно осветить целую кампанию.",
    criteria: "Оставить 15 вердиктов, из них 10 с текстовой пометкой.",
  },
  {
    id: "eclipse_route",
    icon: "eclipse_route",
    hidden: true,
    rarity: "mythic",
    title: "Тропа затмения",
    description: "Ваши походы знают, как долго горит стол и как далеко может уйти дорога за грань обычного вечера.",
    criteria: "Вписать 10 событий, из них 2 через полночь.",
  },
  {
    id: "white_sigil",
    icon: "white_sigil",
    hidden: true,
    rarity: "mythic",
    title: "Белая печать",
    description: "Когда высокий сан встречает высокую славу, орден ставит особую печать, которую знают только свои.",
    criteria: "Нести сан Магистра или Сенешаля и держать славу 4.6+ при 5 свидетельствах.",
  },
  {
    id: "ember_archivist",
    icon: "ember_archivist",
    hidden: true,
    rarity: "mythic",
    title: "Пепельный архив",
    description: "В ваших руках уже и служение, и запись, и зов к новым походам сложились в один цельный свод.",
    criteria: "Завершить 20 обрядов, оставить 10 вердиктов и вписать 6 событий.",
  },
  {
    id: "stormglass",
    icon: "stormglass",
    hidden: true,
    rarity: "mythic",
    title: "Грозовое стекло",
    description: "Слишком чистая линия славы для обычной удачи: будто сам шторм застыл внутри кристалла и служит вам.",
    criteria: "Завершить 12 обрядов и держать славу 4.9+ при 12 свидетельствах.",
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

  const legacyCalendarFeedMatch = pathname.match(/^\/calendar\/([^/]+)\.ics$/);
  if (
    request.method === "GET" &&
    (pathname === "/calendar.ics" || pathname === "/calendar/events.ics" || legacyCalendarFeedMatch)
  ) {
    return handleCalendarFeed(env);
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
    return json({ member: decorateSelfMember(memberToClient(member), env) });
  }

  if (pathname === "/api/dashboard" && request.method === "GET") {
    const member = await requireMember(request, env);
    if (member instanceof Response) {
      return member;
    }
    return json(await buildDashboard(env, member));
  }

  if (pathname === "/api/admin/members" && request.method === "GET") {
    const member = await requireCouncil(request, env);
    if (member instanceof Response) {
      return member;
    }
    return json({
      members: await loadCouncilRoster(env),
    });
  }

  if (pathname === "/api/admin/members" && request.method === "POST") {
    const member = await requireAdmin(request, env);
    if (member instanceof Response) {
      return member;
    }
    return handleCreateMember(request, env);
  }

  if (pathname === "/api/deeds" && request.method === "POST") {
    const member = await requireMember(request, env);
    if (member instanceof Response) {
      return member;
    }
    return handleCreateServiceDeed(request, env, member);
  }

  const deedMatch = pathname.match(/^\/api\/deeds\/([^/]+)$/);
  if (deedMatch && request.method === "PUT") {
    const member = await requireAdmin(request, env);
    if (member instanceof Response) {
      return member;
    }
    return handleCorrectServiceDeed(request, env, member, deedMatch[1]);
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

  const gameEventMatch = pathname.match(/^\/api\/game-events\/([^/]+)$/);
  if (gameEventMatch && request.method === "PUT") {
    const member = await requireMember(request, env);
    if (member instanceof Response) {
      return member;
    }
    return handleUpdateGameEvent(request, env, member, gameEventMatch[1]);
  }

  if (gameEventMatch && request.method === "DELETE") {
    const member = await requireMember(request, env);
    if (member instanceof Response) {
      return member;
    }
    return handleDeleteGameEvent(env, member, gameEventMatch[1]);
  }

  if (pathname === "/api/admin/cycles/generate" && request.method === "POST") {
    const member = await requireCouncil(request, env);
    if (member instanceof Response) {
      return member;
    }
    return handleGenerateCycle(env, member);
  }

  if (pathname === "/api/admin/steward-election/start" && request.method === "POST") {
    const member = await requireAdmin(request, env);
    if (member instanceof Response) {
      return member;
    }
    return handleStartStewardElection(env, member);
  }

  if (pathname === "/api/council/steward-election/vote" && request.method === "POST") {
    const member = await requireMember(request, env);
    if (member instanceof Response) {
      return member;
    }
    return handleStewardElectionVote(request, env, member);
  }

  const completionMatch = pathname.match(/^\/api\/cycles\/([^/]+)\/complete$/);
  if (completionMatch && request.method === "POST") {
    const member = await requireMember(request, env);
    if (member instanceof Response) {
      return member;
    }
    return handleCycleCompletion(env, member, completionMatch[1]);
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
    return json({ error: "Введите корректный доверенный email." }, 400);
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
            : "Печать входа не удалось отправить письмом. Попробуйте ещё раз немного позже.",
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
      member: decorateSelfMember(memberToClient(member), env),
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

  const memberRow = await first(env, "SELECT * FROM members WHERE email = ? LIMIT 1", [email]);

  return json({
    ok: true,
    member: memberRow ? memberToClient(memberRow) : null,
  });
}

async function handleCreateServiceDeed(request, env, actor) {
  const body = await readJson(request);
  const deedType = normalizeServiceDeedType(body?.deedType);
  const quantity = normalizePositiveInteger(body?.quantity);
  const notes = String(body?.notes || "").trim();
  const now = new Date().toISOString();

  if (!deedType) {
    return json({ error: "Выберите, какое именно деяние вписывается в книгу служений." }, 400);
  }

  if (!quantity || quantity > 20) {
    return json({ error: "Укажите меру деяния от 1 до 20." }, 400);
  }

  await run(
    env,
    `
      INSERT INTO service_deeds (
        id,
        member_id,
        deed_type,
        reported_quantity,
        effective_quantity,
        notes,
        created_by_member_id,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [crypto.randomUUID(), actor.id, deedType, quantity, quantity, notes, actor.id, now],
  );

  return json({ ok: true });
}

async function handleCorrectServiceDeed(request, env, actor, deedId) {
  const deed = await first(
    env,
    `
      SELECT *
      FROM service_deeds
      WHERE id = ?
      LIMIT 1
    `,
    [deedId],
  );

  if (!deed) {
    return json({ error: "Такое деяние не найдено в книге служений." }, 404);
  }

  const body = await readJson(request);
  const effectiveQuantity = normalizePositiveInteger(body?.effectiveQuantity);
  const correctionNote = String(body?.correctionNote || "").trim();
  const now = new Date().toISOString();

  if (!effectiveQuantity || effectiveQuantity > 50) {
    return json({ error: "Магистр может зачесть меру от 1 до 50." }, 400);
  }

  if (
    Number(deed.effective_quantity || 0) === effectiveQuantity &&
    String(deed.correction_note || "") === correctionNote
  ) {
    return json({ ok: true, unchanged: true });
  }

  await run(
    env,
    `
      UPDATE service_deeds
      SET effective_quantity = ?,
          correction_note = ?,
          corrected_by_member_id = ?,
          corrected_at = ?,
          updated_at = ?
      WHERE id = ?
    `,
    [effectiveQuantity, correctionNote, actor.id, now, now, deedId],
  );

  return json({ ok: true });
}

async function handleCreateGameEvent(request, env, actor) {
  const body = await readJson(request);
  const title = String(body?.title || "").trim();
  const eventDate = String(body?.eventDate || "").trim();
  const endDate = String(body?.endDate || body?.eventDate || "").trim();
  const startsAt = normalizeTime(body?.startsAt);
  const endsAt = normalizeTime(body?.endsAt);
  const notes = String(body?.notes || "").trim();
  const now = new Date().toISOString();

  if (!title || !isDateOnly(eventDate) || !isDateOnly(endDate)) {
    return json({ error: "Заполните название события, день начала и день завершения." }, 400);
  }

  if (endDate < eventDate) {
    return json({ error: "День завершения не может быть раньше дня начала." }, 400);
  }

  if (startsAt && endsAt && endDate === eventDate && endsAt <= startsAt) {
    return json(
      { error: "Если встреча уходит за полночь, укажите следующий день завершения." },
      400,
    );
  }

  const eventId = crypto.randomUUID();

  await run(
    env,
    `
      INSERT INTO game_events (
        id,
        title,
        event_date,
        end_date,
        starts_at,
        ends_at,
        notes,
        status,
        created_by_member_id,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?)
    `,
    [eventId, title, eventDate, endDate, startsAt, endsAt, notes, actor.id, now],
  );

  await notifyGameEventCreated(env, actor, {
    id: eventId,
    title,
    eventDate,
    endDate,
    startsAt,
    endsAt,
    notes,
    status: "confirmed",
    updatedAt: now,
  });

  return json({ ok: true });
}

async function handleUpdateGameEvent(request, env, actor, gameEventId) {
  const gameEvent = await first(
    env,
    `
      SELECT *
      FROM game_events
      WHERE id = ?
      LIMIT 1
    `,
    [gameEventId],
  );

  if (!gameEvent || gameEvent.status === "cancelled") {
    return json({ error: "Такое событие не найдено в летописи." }, 404);
  }

  if (!(await canManageGameEvent(env, actor, gameEvent))) {
    return json({ error: "Править это событие может только его хронист или совет." }, 403);
  }

  const body = await readJson(request);
  const title = String(body?.title || "").trim();
  const eventDate = String(body?.eventDate || "").trim();
  const endDate = String(body?.endDate || body?.eventDate || "").trim();
  const startsAt = normalizeTime(body?.startsAt);
  const endsAt = normalizeTime(body?.endsAt);
  const notes = String(body?.notes || "").trim();
  const previousEvent = normalizeGameEventRecord(gameEvent);

  if (!title || !isDateOnly(eventDate) || !isDateOnly(endDate)) {
    return json({ error: "Заполните название события, день начала и день завершения." }, 400);
  }

  if (endDate < eventDate) {
    return json({ error: "День завершения не может быть раньше дня начала." }, 400);
  }

  if (startsAt && endsAt && endDate === eventDate && endsAt <= startsAt) {
    return json(
      { error: "Если встреча уходит за полночь, укажите следующий день завершения." },
      400,
    );
  }

  const nextEvent = {
    ...previousEvent,
    title,
    eventDate,
    endDate,
    startsAt,
    endsAt,
    notes,
    status: "confirmed",
  };

  if (!didGameEventChange(previousEvent, nextEvent)) {
    return json({ ok: true, unchanged: true });
  }

  const now = new Date().toISOString();
  await run(
    env,
    `
      UPDATE game_events
      SET title = ?,
          event_date = ?,
          end_date = ?,
          starts_at = ?,
          ends_at = ?,
          notes = ?,
          status = 'confirmed',
          cancelled_at = NULL,
          updated_at = ?
      WHERE id = ?
    `,
    [title, eventDate, endDate, startsAt, endsAt, notes, now, gameEventId],
  );

  await notifyGameEventUpdated(env, actor, previousEvent, {
    ...nextEvent,
    updatedAt: now,
    createdByMemberId: gameEvent.created_by_member_id,
  });

  return json({ ok: true });
}

async function handleDeleteGameEvent(env, actor, gameEventId) {
  const gameEvent = await first(
    env,
    `
      SELECT *
      FROM game_events
      WHERE id = ?
      LIMIT 1
    `,
    [gameEventId],
  );

  if (!gameEvent || gameEvent.status === "cancelled") {
    return json({ error: "Такое событие не найдено в летописи." }, 404);
  }

  if (!(await canManageGameEvent(env, actor, gameEvent))) {
    return json(
      { error: "Убрать это событие из летописи может только его хронист, Магистр или Сенешаль." },
      403,
    );
  }

  const cancelledAt = new Date().toISOString();
  await run(
    env,
    `
      UPDATE game_events
      SET status = 'cancelled',
          cancelled_at = ?,
          updated_at = ?
      WHERE id = ?
    `,
    [cancelledAt, cancelledAt, gameEventId],
  );

  await notifyGameEventCancelled(env, actor, {
    ...normalizeGameEventRecord(gameEvent),
    status: "cancelled",
    cancelledAt,
    updatedAt: cancelledAt,
  });

  return json({ ok: true });
}

async function loadServiceDeedLedger(env) {
  const rows = await all(
    env,
    `
      SELECT
        d.id,
        d.member_id,
        d.deed_type,
        d.reported_quantity,
        d.effective_quantity,
        d.notes,
        d.correction_note,
        d.created_at,
        d.updated_at,
        d.corrected_at,
        d.created_by_member_id,
        d.corrected_by_member_id,
        member.display_name AS member_name,
        creator.display_name AS created_by_name,
        corrector.display_name AS corrected_by_name
      FROM service_deeds d
      JOIN members member ON member.id = d.member_id
      LEFT JOIN members creator ON creator.id = d.created_by_member_id
      LEFT JOIN members corrector ON corrector.id = d.corrected_by_member_id
      ORDER BY d.created_at DESC, d.id DESC
      LIMIT 60
    `,
  );

  return rows.map((row) => ({
    id: row.id,
    memberId: row.member_id,
    memberName: row.member_name,
    deedType: row.deed_type,
    reportedQuantity: Number(row.reported_quantity || 0),
    effectiveQuantity: Number(row.effective_quantity || 0),
    notes: row.notes || "",
    correctionNote: row.correction_note || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    correctedAt: row.corrected_at || null,
    createdByMemberId: row.created_by_member_id,
    createdByName: row.created_by_name || row.member_name,
    correctedByMemberId: row.corrected_by_member_id || null,
    correctedByName: row.corrected_by_name || null,
  }));
}

async function loadServiceDeedSummary(env, memberId) {
  const [overallRows, memberRows, leaderboardRows] = await Promise.all([
    all(
      env,
      `
        SELECT deed_type, SUM(effective_quantity) AS total
        FROM service_deeds
        GROUP BY deed_type
      `,
    ),
    all(
      env,
      `
        SELECT deed_type, SUM(effective_quantity) AS total
        FROM service_deeds
        WHERE member_id = ?
        GROUP BY deed_type
      `,
      [memberId],
    ),
    all(
      env,
      `
        SELECT
          m.id,
          m.display_name,
          COALESCE(SUM(d.effective_quantity), 0) AS total
        FROM members m
        LEFT JOIN service_deeds d ON d.member_id = m.id
        WHERE m.status = 'active'
        GROUP BY m.id
        ORDER BY total DESC, m.display_name ASC
      `,
    ),
  ]);

  return {
    overall: mapServiceDeedTotals(overallRows),
    mine: mapServiceDeedTotals(memberRows),
    leaderboard: leaderboardRows.map((row) => ({
      memberId: row.id,
      displayName: row.display_name,
      total: Number(row.total || 0),
    })),
  };
}

async function handleStartStewardElection(env, actor) {
  const activeElection = await getActiveStewardElection(env);
  if (activeElection) {
    return json(
      { error: "Выборный собор уже открыт. Сначала завершите текущий круг голосования." },
      400,
    );
  }

  const roster = await loadRoster(env);
  const candidates = pickInitialStewardCandidates(roster);
  const uniqueLeader = pickAutomaticStewardLeader(roster);

  if (uniqueLeader) {
    await ensureAutomaticSteward(env, roster);
    return json({
      ok: true,
      autoAssigned: true,
      stewardMemberId: uniqueLeader.id,
      message: "В летописи уже появился явный лидер по славе. Сенешаль назначен без собора.",
    });
  }

  if (!candidates.length) {
    return json(
      { error: "Сейчас некого выдвинуть: в круге нет активных соратников вне Магистра." },
      400,
    );
  }

  const electionId = crypto.randomUUID();
  await run(
    env,
    `
      INSERT INTO council_elections (id, role, status, round_number, launched_by_member_id)
      VALUES (?, 'steward', 'active', 1, ?)
    `,
    [electionId, actor.id],
  );

  await insertElectionCandidates(env, electionId, 1, candidates);

  const voters = await loadElectionVoterRoster(env);
  const requiredVotes = getElectionMajorityCount(voters.length);

  await notifyCouncilElectionStage(env, {
    kind: "steward-election-started",
    subject: "Duty Guild: Магистр открыл выборный собор",
    kicker: "Выборный собор",
    title: "Открыт круг избрания Сенешаля",
    lead: "Магистр открыл собор круга, чтобы весь орден назвал того, кто понесёт печать Сенешаля рядом с ним.",
    rows: [
      ["Круг голосования", "Первый круг"],
      ["Созвал собор", actor.display_name],
      ["Кандидаты", formatCandidateNames(candidates)],
      ["Нужно для избрания", `${requiredVotes} из ${voters.length || 1} голос${pluralizeRussian(requiredVotes, ["", "а", "ов"])}`],
    ],
    note:
      "Если ни одно имя не соберёт большинства голосов круга, летопись сама откроет следующий круг и сузит выбор до 2-3 сильнейших претендентов.",
  });

  return json({ ok: true, electionId });
}

async function handleStewardElectionVote(request, env, actor) {
  const activeElection = await getActiveStewardElection(env);
  if (!activeElection) {
    return json({ error: "Сейчас нет открытого выборного собора." }, 400);
  }

  const body = await readJson(request);
  const candidateId = String(body?.candidateId || "").trim();
  if (!candidateId) {
    return json({ error: "Выберите кандидата, прежде чем отдавать голос." }, 400);
  }

  const candidate = await first(
    env,
    `
      SELECT member_id
      FROM council_election_candidates
      WHERE election_id = ?
        AND round_number = ?
        AND member_id = ?
      LIMIT 1
    `,
    [activeElection.id, activeElection.round_number, candidateId],
  );

  if (!candidate) {
    return json({ error: "Такое имя не участвует в текущем круге выборов." }, 404);
  }

  if (candidate.member_id === actor.id) {
    return json({ error: "Отдать голос самому себе нельзя." }, 400);
  }

  await run(
    env,
    `
      INSERT INTO council_election_votes (
        id,
        election_id,
        round_number,
        voter_member_id,
        candidate_member_id
      )
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (election_id, round_number, voter_member_id)
      DO UPDATE SET
        candidate_member_id = EXCLUDED.candidate_member_id,
        created_at = CURRENT_TIMESTAMP
    `,
    [crypto.randomUUID(), activeElection.id, activeElection.round_number, actor.id, candidateId],
  );

  const resolution = await resolveStewardElectionRound(env, activeElection.id);
  return json({ ok: true, resolution });
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

async function handleCycleCompletion(env, actor, cycleId) {
  const cycle = await first(
    env,
    `
      SELECT *
      FROM cleaning_cycles
      WHERE id = ?
      LIMIT 1
    `,
    [cycleId],
  );

  if (!cycle) {
    return json({ error: "Такой обряд не найден в летописи." }, 404);
  }

  const assignment = await first(
    env,
    `
      SELECT *
      FROM cycle_assignments
      WHERE cycle_id = ? AND member_id = ?
      LIMIT 1
    `,
    [cycleId, actor.id],
  );

  if (!assignment) {
    return json({ error: "Только назначенные герои могут засвидетельствовать завершение обряда." }, 403);
  }

  if (cycle.status === "completed") {
    return json({
      ok: true,
      cycle: await hydrateCycle(env, cycle, actor.id),
      justCompleted: false,
    });
  }

  const now = new Date().toISOString();
  await run(
    env,
    `
      UPDATE cycle_assignments
      SET completed_at = COALESCE(completed_at, ?)
      WHERE id = ?
    `,
    [now, assignment.id],
  );

  const assignments = await all(
    env,
    `
      SELECT
        a.id,
        a.member_id,
        a.completed_at,
        m.email,
        m.display_name
      FROM cycle_assignments a
      JOIN members m ON m.id = a.member_id
      WHERE a.cycle_id = ?
      ORDER BY a.assignment_order ASC
    `,
    [cycleId],
  );

  const everyoneConfirmed =
    assignments.length > 0 && assignments.every((row) => Boolean(row.completed_at));
  let justCompleted = false;

  if (everyoneConfirmed) {
    const completionUpdate = await run(
      env,
      `
        UPDATE cleaning_cycles
        SET status = 'completed', completed_at = COALESCE(completed_at, ?)
        WHERE id = ? AND status != 'completed'
      `,
      [now, cycleId],
    );

    if (Number(completionUpdate?.meta?.rowCount || 0) > 0) {
      for (const row of assignments) {
        await run(
          env,
          `
            UPDATE members
            SET duty_count = duty_count + 1, updated_at = ?
            WHERE id = ?
          `,
          [now, row.member_id],
        );
      }

      justCompleted = true;
      await notifyReviewRequest(env, cycleId, assignments);
    }
  }

  return json({
    ok: true,
    cycle: await hydrateCycle(
      env,
      await first(env, "SELECT * FROM cleaning_cycles WHERE id = ? LIMIT 1", [cycleId]),
      actor.id,
    ),
    justCompleted,
  });
}

async function handleFeedbackSubmission(request, env, actor, cycleId) {
  const body = await readJson(request);
  const comment = String(body?.comment || "").trim();
  const rating = Number(body?.rating);

  if (Number.isNaN(rating)) {
    return json({ error: "Укажите силу оценки обряда." }, 400);
  }

  if (rating < 1 || rating > 5) {
    return json({ error: "Оценка должна быть от 1 до 5." }, 400);
  }

  const cycle = await first(
    env,
    `
      SELECT *
      FROM cleaning_cycles
      WHERE id = ?
      LIMIT 1
    `,
    [cycleId],
  );

  if (!cycle) {
    return json({ error: "Обряд не найден в летописи." }, 404);
  }

  if (cycle.status !== "completed") {
    return json({ error: "Свидетельства принимаются только после завершения обряда обоими героями." }, 400);
  }

  const actorAssignment = await first(
    env,
    `
      SELECT id
      FROM cycle_assignments
      WHERE cycle_id = ? AND member_id = ?
      LIMIT 1
    `,
    [cycleId, actor.id],
  );

  if (actorAssignment) {
    return json({ error: "Назначенные герои не оценивают собственный обряд." }, 403);
  }

  await run(
    env,
    `
      INSERT INTO cycle_reviews (id, cycle_id, author_member_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (cycle_id, author_member_id)
      DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, created_at = CURRENT_TIMESTAMP
    `,
    [crypto.randomUUID(), cycleId, actor.id, rating, comment],
  );

  return json({ ok: true });
}

async function buildDashboard(env, member) {
  const today = todayInTimeZone(getConfig(env).timeZone);
  const [
    currentCycleRow,
    nextCycleRow,
    recentCycleRows,
    pendingReviewRows,
    upcomingGames,
    feedback,
    rawRoster,
    currentStewardMemberId,
    achievementStats,
    serviceDeedLedger,
    serviceDeedSummary,
  ] = await Promise.all([
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
        SELECT *
        FROM cleaning_cycles c
        WHERE c.status = 'completed'
          AND NOT EXISTS (
            SELECT 1
            FROM cycle_assignments a
            WHERE a.cycle_id = c.id
              AND a.member_id = ?
          )
          AND NOT EXISTS (
            SELECT 1
            FROM cycle_reviews r
            WHERE r.cycle_id = c.id
              AND r.author_member_id = ?
          )
        ORDER BY COALESCE(c.completed_at, c.created_at) DESC
        LIMIT 4
      `,
      [member.id, member.id],
    ),
    all(
      env,
      `
        SELECT
          g.id,
          g.title,
          g.event_date,
          g.end_date,
          g.starts_at,
          g.ends_at,
          g.notes,
          g.status,
          g.created_by_member_id,
          creator.display_name AS created_by_name
        FROM game_events g
        LEFT JOIN members creator ON creator.id = g.created_by_member_id
        WHERE COALESCE(g.end_date, g.event_date) >= ? AND g.status != 'cancelled'
        ORDER BY g.event_date ASC, COALESCE(g.starts_at, '23:59') ASC
        LIMIT 8
      `,
      [today],
    ),
    all(
      env,
      `
        SELECT
          r.id,
          r.cycle_id,
          r.rating,
          r.comment,
          r.created_at,
          author.display_name AS author_name
        FROM cycle_reviews r
        JOIN members author ON author.id = r.author_member_id
        ORDER BY r.created_at DESC
        LIMIT 8
      `,
    ),
    loadRoster(env),
    getCurrentStewardMemberId(env),
    loadMemberAchievementStats(env, member.id),
    loadServiceDeedLedger(env),
    loadServiceDeedSummary(env, member.id),
  ]);

  const roster = decorateCouncilRoster(rawRoster, currentStewardMemberId);
  const meBase = roster.find((entry) => entry.id === member.id) || memberToClient(member);
  const me = decorateSelfMember(meBase, env);
  const councilElection = await loadCouncilElectionState(
    env,
    me,
    roster,
    currentStewardMemberId,
  );

  const feedbackCycles = await Promise.all(
    feedback.map(async (row) =>
      hydrateCycle(
        env,
        await first(env, "SELECT * FROM cleaning_cycles WHERE id = ? LIMIT 1", [row.cycle_id]),
        member.id,
      ),
    ),
  );

  const currentCycle = currentCycleRow
    ? await hydrateCycle(env, currentCycleRow, member.id)
    : null;
  const nextCycle = nextCycleRow
    ? await hydrateCycle(env, nextCycleRow, member.id)
    : null;
  const recentCycles = await Promise.all(
    recentCycleRows.map((row) => hydrateCycle(env, row, member.id)),
  );
  const pendingReviewCycles = await Promise.all(
    pendingReviewRows.map((row) => hydrateCycle(env, row, member.id)),
  );
  const upcomingGamesClient = upcomingGames.map((row) => ({
    id: row.id,
    title: row.title,
    eventDate: row.event_date,
    endDate: row.end_date || row.event_date,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    notes: row.notes,
    status: row.status,
    createdByMemberId: row.created_by_member_id,
    createdByName: row.created_by_name,
    canManage: canManageGameEventLocally(me, row),
  }));
  const recentFeedback = feedback.map((row, index) => ({
    id: row.id,
    rating: Number(row.rating),
    comment: row.comment,
    createdAt: row.created_at,
    authorName: row.author_name,
    targetName:
      feedbackCycles[index]?.assignees?.map((entry) => entry.displayName).join(" и ") ||
      "Созванная пара",
    cycleOutcome: feedbackCycles[index]?.outcome || null,
  }));
  const rosterWithAchievements = await attachRosterAchievements(env, roster, {
    currentCycle,
    upcomingGames: upcomingGamesClient,
    preloadedStats: new Map([[member.id, achievementStats]]),
  });
  const meWithAchievements =
    rosterWithAchievements.find((entry) => entry.id === member.id) || decorateSelfMember(me, env);
  const achievementCodex = buildAchievementCodex(env, {
    member: meWithAchievements,
    roster: rosterWithAchievements,
    currentCycle,
    upcomingGames: upcomingGamesClient,
    achievementStats,
  });

  return {
    me: decorateSelfMember(meWithAchievements, env),
    currentCycle,
    nextCycle,
    recentCycles,
    pendingReviewCycles,
    upcomingGames: upcomingGamesClient,
    recentFeedback,
    roster: rosterWithAchievements,
    councilElection,
    achievementCodex,
    serviceDeedLedger,
    serviceDeedSummary,
  };
}

async function loadMemberAchievementStats(env, memberId) {
  const [
    reviewRows,
    eventRows,
    completedCycleDates,
    ratingTimeline,
    legendaryCycleDates,
    stewardRecord,
    serviceDeedRows,
  ] = await Promise.all([
    all(
      env,
      `
        SELECT
          created_at,
          comment
        FROM cycle_reviews
        WHERE author_member_id = ?
        ORDER BY created_at ASC
      `,
      [memberId],
    ),
    all(
      env,
      `
        SELECT
          created_at,
          event_date,
          COALESCE(end_date, event_date) AS end_date
        FROM game_events
        WHERE created_by_member_id = ?
        ORDER BY created_at ASC
      `,
      [memberId],
    ),
    all(
      env,
      `
        SELECT COALESCE(c.completed_at, c.created_at) AS happened_at
        FROM cleaning_cycles c
        JOIN cycle_assignments a ON a.cycle_id = c.id
        WHERE a.member_id = ?
          AND c.status = 'completed'
        ORDER BY COALESCE(c.completed_at, c.created_at) ASC
      `,
      [memberId],
    ),
    all(
      env,
      `
        SELECT r.created_at, r.rating
        FROM cycle_reviews r
        JOIN cycle_assignments a ON a.cycle_id = r.cycle_id
        JOIN cleaning_cycles c ON c.id = a.cycle_id
        WHERE a.member_id = ?
          AND c.status = 'completed'
        ORDER BY r.created_at ASC
      `,
      [memberId],
    ),
    all(
      env,
      `
        SELECT COALESCE(c.completed_at, c.created_at) AS happened_at
        FROM cleaning_cycles c
        JOIN cycle_assignments a ON a.cycle_id = c.id
        LEFT JOIN cycle_reviews r ON r.cycle_id = c.id
        WHERE a.member_id = ?
          AND c.status = 'completed'
        GROUP BY c.id, c.completed_at, c.created_at
        HAVING AVG(r.rating) >= 4.8 AND COUNT(r.id) > 0
        ORDER BY COALESCE(c.completed_at, c.created_at) ASC
      `,
      [memberId],
    ),
    first(
      env,
      `
        SELECT COALESCE(completed_at, started_at) AS happened_at
        FROM council_elections
        WHERE role = 'steward'
          AND status = 'completed'
          AND winner_member_id = ?
        ORDER BY COALESCE(completed_at, started_at) DESC
        LIMIT 1
      `,
      [memberId],
    ),
    all(
      env,
      `
        SELECT deed_type, effective_quantity, created_at
        FROM service_deeds
        WHERE member_id = ?
        ORDER BY created_at ASC, id ASC
      `,
      [memberId],
    ),
  ]);

  const reviewDates = reviewRows.map((row) => row.created_at).filter(Boolean);
  const commentedReviewDates = reviewRows
    .filter((row) => String(row.comment || "").trim())
    .map((row) => row.created_at)
    .filter(Boolean);
  const eventDates = eventRows.map((row) => row.created_at).filter(Boolean);
  const overnightEventDates = eventRows
    .filter((row) => row.end_date && row.end_date > row.event_date)
    .map((row) => row.created_at)
    .filter(Boolean);
  const serviceDeedStats = buildServiceDeedAchievementStats(serviceDeedRows);

  return {
    authoredReviewsCount: reviewDates.length,
    commentedReviewsCount: commentedReviewDates.length,
    createdEventsCount: eventDates.length,
    overnightEventsCount: overnightEventDates.length,
    reviewDates,
    commentedReviewDates,
    completedCycleDates: completedCycleDates.map((row) => row.happened_at).filter(Boolean),
    ratingTimeline: ratingTimeline.map((row) => ({
      happenedAt: row.created_at,
      rating: Number(row.rating || 0),
    })),
    legendaryCycleDates: legendaryCycleDates.map((row) => row.happened_at).filter(Boolean),
    legendaryCyclesCount: legendaryCycleDates.length,
    eventDates,
    overnightEventDate: overnightEventDates[0] || null,
    overnightEventDates,
    stewardGrantedAt: stewardRecord?.happened_at || null,
    serviceDeedTotals: serviceDeedStats.totals,
    serviceDeedMilestones: serviceDeedStats.milestones,
  };
}

async function attachRosterAchievements(env, roster, { currentCycle, upcomingGames, preloadedStats } = {}) {
  const statMap = new Map(preloadedStats || []);
  const statsEntries = await Promise.all(
    roster.map(async (member) => {
      if (statMap.has(member.id)) {
        return [member.id, statMap.get(member.id)];
      }

      return [member.id, await loadMemberAchievementStats(env, member.id)];
    }),
  );

  for (const [memberId, stats] of statsEntries) {
    statMap.set(memberId, stats);
  }

  return roster.map((member) => {
    const codex = buildAchievementCodex(env, {
      member,
      roster,
      currentCycle,
      upcomingGames,
      achievementStats: statMap.get(member.id) || {},
    });
    const publicAchievements = codex.publicAchievements.filter((entry) => entry.earned);

    return {
      ...member,
      publicAchievements,
      publicAchievementCount: publicAchievements.length,
    };
  });
}

function buildAchievementCodex(env, context) {
  const viewerCanSeeHidden = canViewHiddenAchievements(context.member, env);
  const resolvedAchievements = ACHIEVEMENT_LIBRARY.map((entry) =>
    resolveAchievementState(entry, context),
  );
  const publicAchievements = resolvedAchievements.filter((entry) => !entry.hidden);
  const allHiddenAchievements = resolvedAchievements.filter((entry) => entry.hidden);
  const hiddenAchievements = viewerCanSeeHidden
    ? allHiddenAchievements
    : [];

  return {
    canViewHidden: viewerCanSeeHidden,
    publicCount: publicAchievements.length,
    publicEarnedCount: publicAchievements.filter((entry) => entry.earned).length,
    hiddenCount: hiddenAchievements.length,
    hiddenTotalCount: allHiddenAchievements.length,
    hiddenEarnedCount: hiddenAchievements.filter((entry) => entry.earned).length,
    publicAchievements,
    hiddenAchievements,
  };
}

function resolveAchievementState(definition, context) {
  const dutyCount = Number(context.member?.dutyCount || 0);
  const averageRating =
    context.member?.averageRating === null || context.member?.averageRating === undefined
      ? null
      : Number(context.member.averageRating);
  const feedbackCount = Number(context.member?.feedbackCount || 0);
  const authoredReviewsCount = Number(context.achievementStats?.authoredReviewsCount || 0);
  const commentedReviewsCount = Number(context.achievementStats?.commentedReviewsCount || 0);
  const createdEventsCount = Number(context.achievementStats?.createdEventsCount || 0);
  const overnightEventsCount = Number(context.achievementStats?.overnightEventsCount || 0);
  const legendaryCyclesCount = Number(context.achievementStats?.legendaryCyclesCount || 0);
  const effectiveRole = String(context.member?.role || "member");
  const isUniqueRatingLeader = isUniqueRatingLeaderForMember(context.member, context.roster);
  const ratingLabel = formatRatingLabel(averageRating);
  const completedCycleDates = context.achievementStats?.completedCycleDates || [];
  const reviewDates = context.achievementStats?.reviewDates || [];
  const commentedReviewDates = context.achievementStats?.commentedReviewDates || [];
  const eventDates = context.achievementStats?.eventDates || [];
  const overnightEventDate = context.achievementStats?.overnightEventDate || null;
  const overnightEventDates = context.achievementStats?.overnightEventDates || [];
  const legendaryCycleDates = context.achievementStats?.legendaryCycleDates || [];
  const stewardGrantedAt = context.achievementStats?.stewardGrantedAt || null;
  const serviceDeedTotals = context.achievementStats?.serviceDeedTotals || {};
  const serviceDeedMilestones = context.achievementStats?.serviceDeedMilestones || {};
  const ratingDates = (context.achievementStats?.ratingTimeline || [])
    .map((entry) => entry.happenedAt)
    .filter(Boolean);
  const goldenStandardAt = findRatingMilestoneDate(
    context.achievementStats?.ratingTimeline || [],
    4.5,
    3,
  );
  const laureledNameAt = findRatingMilestoneDate(
    context.achievementStats?.ratingTimeline || [],
    4.7,
    5,
  );
  const whiteSigilAt = findRatingMilestoneDate(
    context.achievementStats?.ratingTimeline || [],
    4.6,
    5,
  );
  const unbrokenGlowRatingAt = findRatingMilestoneDate(
    context.achievementStats?.ratingTimeline || [],
    4.8,
    10,
  );
  const stormglassRatingAt = findRatingMilestoneDate(
    context.achievementStats?.ratingTimeline || [],
    4.9,
    12,
  );

  let earned = false;
  let progressLabel = "Знамение ещё не раскрыто.";
  let earnedAt = null;

  if (definition.deedType) {
    const deedTotal = Number(serviceDeedTotals?.[definition.deedType] || 0);
    const milestoneDate =
      serviceDeedMilestones?.[definition.deedType]?.[String(definition.threshold)] || null;
    earned = deedTotal >= Number(definition.threshold || 0);
    progressLabel = `${Math.min(deedTotal, Number(definition.threshold || 0))} из ${definition.threshold} зачтённых свершений.`;
    earnedAt = milestoneDate;

    return {
      ...definition,
      earned,
      earnedAt,
      progressLabel,
      stateLabel: earned ? "Обретено" : "Ждёт раскрытия",
    };
  }

  switch (definition.id) {
    case "initiated":
      earned = true;
      progressLabel = "Печать допуска уже признана, имя внесено в братский свиток.";
      earnedAt = context.member?.approvedAt || context.member?.createdAt || null;
      break;
    case "first_oath":
      earned = dutyCount >= 1;
      progressLabel = `${Math.min(dutyCount, 1)} из 1 завершённого обряда.`;
      earnedAt = nthItem(completedCycleDates, 1);
      break;
    case "third_bell":
      earned = dutyCount >= 3;
      progressLabel = `${Math.min(dutyCount, 3)} из 3 завершённых обрядов.`;
      earnedAt = nthItem(completedCycleDates, 3);
      break;
    case "open_ledger":
      earned = commentedReviewsCount >= 3;
      progressLabel = `${Math.min(commentedReviewsCount, 3)} из 3 вердиктов с пометкой.`;
      earnedAt = nthItem(commentedReviewDates, 3);
      break;
    case "chorus_of_witnesses":
      earned = feedbackCount >= 5;
      progressLabel = `Свидетельств ${Math.min(feedbackCount, 5)} из 5.`;
      earnedAt = nthItem(ratingDates, 5);
      break;
    case "dawn_crossing":
      earned = overnightEventsCount >= 1;
      progressLabel = `${Math.min(overnightEventsCount, 1)} из 1 похода за грань полуночи.`;
      earnedAt = overnightEventDate;
      break;
    case "steady_hand":
      earned = dutyCount >= 7;
      progressLabel = `${Math.min(dutyCount, 7)} из 7 завершённых обрядов.`;
      earnedAt = nthItem(completedCycleDates, 7);
      break;
    case "first_verdict":
      earned = authoredReviewsCount >= 1;
      progressLabel = `${Math.min(authoredReviewsCount, 1)} из 1 вынесенного вердикта.`;
      earnedAt = nthItem(reviewDates, 1);
      break;
    case "scribe_of_circle":
      earned = authoredReviewsCount >= 5;
      progressLabel = `${Math.min(authoredReviewsCount, 5)} из 5 вынесенных вердиктов.`;
      earnedAt = nthItem(reviewDates, 5);
      break;
    case "pathfinder":
      earned = createdEventsCount >= 1;
      progressLabel = `${Math.min(createdEventsCount, 1)} из 1 вписанного события.`;
      earnedAt = nthItem(eventDates, 1);
      break;
    case "hall_host":
      earned = createdEventsCount >= 4;
      progressLabel = `${Math.min(createdEventsCount, 4)} из 4 вписанных событий.`;
      earnedAt = nthItem(eventDates, 4);
      break;
    case "laureled_name":
      earned = averageRating !== null && averageRating >= 4.7 && feedbackCount >= 5;
      progressLabel = `Слава ${ratingLabel} из 4.7 · свидетельств ${Math.min(feedbackCount, 5)} из 5.`;
      earnedAt = laureledNameAt;
      break;
    case "steady_chorus":
      earned = dutyCount >= 5 && commentedReviewsCount >= 3;
      progressLabel = `Обряды ${Math.min(dutyCount, 5)} из 5 · пометки ${Math.min(commentedReviewsCount, 3)} из 3.`;
      earnedAt = latestOf(nthItem(completedCycleDates, 5), nthItem(commentedReviewDates, 3));
      break;
    case "silver_quill":
      earned = authoredReviewsCount >= 10;
      progressLabel = `${Math.min(authoredReviewsCount, 10)} из 10 вынесенных вердиктов.`;
      earnedAt = nthItem(reviewDates, 10);
      break;
    case "golden_standard":
      earned = averageRating !== null && averageRating >= 4.5 && feedbackCount >= 3;
      progressLabel = `Слава ${ratingLabel} из 4.5 · свидетельств ${Math.min(feedbackCount, 3)} из 3.`;
      earnedAt = goldenStandardAt;
      break;
    case "torchbearer":
      earned = dutyCount >= 12;
      progressLabel = `${Math.min(dutyCount, 12)} из 12 завершённых обрядов.`;
      earnedAt = nthItem(completedCycleDates, 12);
      break;
    case "road_captain":
      earned = createdEventsCount >= 8;
      progressLabel = `${Math.min(createdEventsCount, 8)} из 8 вписанных событий.`;
      earnedAt = nthItem(eventDates, 8);
      break;
    case "seal_of_council":
      earned = effectiveRole === "admin" || effectiveRole === "steward";
      progressLabel = earned
        ? `Сан признан: ${effectiveRole === "admin" ? "Магистр Совета" : "Сенешаль Совета"}.`
        : "Нужен управный сан Совета.";
      earnedAt =
        effectiveRole === "admin"
          ? context.member?.approvedAt || context.member?.createdAt || null
          : stewardGrantedAt;
      break;
    case "circle_pillar":
      earned = dutyCount >= 10 && authoredReviewsCount >= 5 && createdEventsCount >= 4;
      progressLabel = `Обряды ${Math.min(dutyCount, 10)} из 10 · вердикты ${Math.min(authoredReviewsCount, 5)} из 5 · походы ${Math.min(createdEventsCount, 4)} из 4.`;
      earnedAt = latestOf(
        nthItem(completedCycleDates, 10),
        nthItem(reviewDates, 5),
        nthItem(eventDates, 4),
      );
      break;
    case "hall_warden":
      earned = dutyCount >= 20;
      progressLabel = `${Math.min(dutyCount, 20)} из 20 завершённых обрядов.`;
      earnedAt = nthItem(completedCycleDates, 20);
      break;
    case "midnight_oil":
      earned = overnightEventsCount >= 3;
      progressLabel = `${Math.min(overnightEventsCount, 3)} из 3 походов через полночь.`;
      earnedAt = nthItem(overnightEventDates, 3);
      break;
    case "voice_in_margins":
      earned = commentedReviewsCount >= 7;
      progressLabel = `${Math.min(commentedReviewsCount, 7)} из 7 вердиктов с комментарием.`;
      earnedAt = nthItem(commentedReviewDates, 7);
      break;
    case "legendary_ritualist":
      earned = legendaryCyclesCount >= 3;
      progressLabel = `${Math.min(legendaryCyclesCount, 3)} из 3 легендарных исходов.`;
      earnedAt = nthItem(legendaryCycleDates, 3);
      break;
    case "unbroken_glow":
      earned =
        dutyCount >= 10 &&
        averageRating !== null &&
        averageRating >= 4.8 &&
        feedbackCount >= 10;
      progressLabel = `Обряды ${Math.min(dutyCount, 10)} из 10 · слава ${ratingLabel} из 4.8 · свидетельств ${Math.min(feedbackCount, 10)} из 10.`;
      earnedAt = latestOf(nthItem(completedCycleDates, 10), unbrokenGlowRatingAt);
      break;
    case "north_star":
      earned =
        averageRating !== null &&
        averageRating >= 4.7 &&
        feedbackCount >= 5 &&
        isUniqueRatingLeader;
      progressLabel = `Слава ${ratingLabel} из 4.7 · свидетельств ${Math.min(feedbackCount, 5)} из 5 · лидерство ${isUniqueRatingLeader ? "единоличное" : "ещё делится"}.`;
      earnedAt = laureledNameAt;
      break;
    case "dragon_chronicler":
      earned = authoredReviewsCount >= 15 && commentedReviewsCount >= 10;
      progressLabel = `Вердикты ${Math.min(authoredReviewsCount, 15)} из 15 · пометки ${Math.min(commentedReviewsCount, 10)} из 10.`;
      earnedAt = latestOf(nthItem(reviewDates, 15), nthItem(commentedReviewDates, 10));
      break;
    case "eclipse_route":
      earned = createdEventsCount >= 10 && overnightEventsCount >= 2;
      progressLabel = `Походы ${Math.min(createdEventsCount, 10)} из 10 · ночные ${Math.min(overnightEventsCount, 2)} из 2.`;
      earnedAt = latestOf(nthItem(eventDates, 10), nthItem(overnightEventDates, 2));
      break;
    case "white_sigil":
      earned =
        (effectiveRole === "admin" || effectiveRole === "steward") &&
        averageRating !== null &&
        averageRating >= 4.6 &&
        feedbackCount >= 5;
      progressLabel = `Сан ${effectiveRole === "admin" || effectiveRole === "steward" ? "признан" : "ещё не дарован"} · слава ${ratingLabel} из 4.6 · свидетельств ${Math.min(feedbackCount, 5)} из 5.`;
      earnedAt = latestOf(
        effectiveRole === "admin"
          ? context.member?.approvedAt || context.member?.createdAt || null
          : stewardGrantedAt,
        whiteSigilAt,
      );
      break;
    case "ember_archivist":
      earned = dutyCount >= 20 && authoredReviewsCount >= 10 && createdEventsCount >= 6;
      progressLabel = `Обряды ${Math.min(dutyCount, 20)} из 20 · вердикты ${Math.min(authoredReviewsCount, 10)} из 10 · походы ${Math.min(createdEventsCount, 6)} из 6.`;
      earnedAt = latestOf(
        nthItem(completedCycleDates, 20),
        nthItem(reviewDates, 10),
        nthItem(eventDates, 6),
      );
      break;
    case "stormglass":
      earned =
        dutyCount >= 12 &&
        averageRating !== null &&
        averageRating >= 4.9 &&
        feedbackCount >= 12;
      progressLabel = `Обряды ${Math.min(dutyCount, 12)} из 12 · слава ${ratingLabel} из 4.9 · свидетельств ${Math.min(feedbackCount, 12)} из 12.`;
      earnedAt = latestOf(nthItem(completedCycleDates, 12), stormglassRatingAt);
      break;
    default:
      progressLabel = "Путь к этому знамению пока не раскрыт.";
  }

  return {
    ...definition,
    earned,
    earnedAt,
    progressLabel,
    stateLabel: earned ? "Знамение раскрыто" : "Пока не раскрыто",
  };
}

function canViewHiddenAchievements(member, env) {
  const viewers = getHiddenAchievementViewerEmails(env);
  return viewers.includes(normalizeEmail(member?.email));
}

function getHiddenAchievementViewerEmails(env) {
  const configured = parseEmailList(env.HIDDEN_ACHIEVEMENT_VIEWERS, []);
  if (configured.length) {
    return configured;
  }

  return parseEmailList(env.ADMIN_BOOTSTRAP_EMAILS, []).slice(0, 1);
}

function isUniqueRatingLeaderForMember(member, roster) {
  const ratedMembers = (roster || []).filter(
    (entry) => entry.averageRating !== null && Number(entry.feedbackCount || 0) >= 5,
  );
  if (!ratedMembers.length || member?.averageRating === null || member?.averageRating === undefined) {
    return false;
  }

  const topRating = ratedMembers.reduce(
    (highest, entry) => Math.max(highest, Number(entry.averageRating || 0)),
    0,
  );
  const leaders = ratedMembers.filter(
    (entry) => Number(entry.averageRating || 0) === topRating,
  );
  return leaders.length === 1 && leaders[0].id === member.id;
}

function nthItem(items, position) {
  const index = Number(position || 0) - 1;
  return index >= 0 && Array.isArray(items) ? items[index] || null : null;
}

function latestOf(...timestamps) {
  const defined = timestamps.filter(Boolean);
  if (!defined.length) {
    return null;
  }

  return defined.reduce((latest, current) =>
    new Date(latest).getTime() >= new Date(current).getTime() ? latest : current,
  );
}

function findRatingMilestoneDate(timeline, threshold, requiredCount) {
  let total = 0;
  let count = 0;

  for (const entry of timeline || []) {
    total += Number(entry.rating || 0);
    count += 1;
    if (count >= requiredCount && total / count >= threshold) {
      return entry.happenedAt || null;
    }
  }

  return null;
}

async function handleCalendarFeed(env) {
  const feedBody = await buildCalendarFeed(env);
  return new Response(feedBody, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Content-Disposition": 'inline; filename="duty-guild-calendar.ics"',
    },
  });
}

async function buildCalendarFeed(env) {
  const config = getConfig(env);
  const today = todayInTimeZone(config.timeZone);
  const cancelledLookbackDate = addDays(today, -14);
  const gameRows = await all(
    env,
    `
      SELECT
        id,
        title,
        event_date,
        COALESCE(end_date, event_date) AS end_date,
        starts_at,
        ends_at,
        notes,
        status,
        created_at,
        updated_at,
        cancelled_at
      FROM game_events
      WHERE (
        status != 'cancelled'
        AND COALESCE(end_date, event_date) >= ?
      ) OR (
        status = 'cancelled'
        AND COALESCE(end_date, event_date) >= ?
      )
      ORDER BY event_date ASC, COALESCE(starts_at, '23:59') ASC
      LIMIT 60
    `,
    [today, cancelledLookbackDate],
  );

  const calendarEvents = gameRows
    .map((row) => buildGameEventCalendarEntry(env, row, config.timeZone))
    .filter(Boolean);

  const nowStamp = formatIcsDateTimeUtc(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "PRODID:-//Duty Guild//Calendar//RU",
    `X-WR-CALNAME:${escapeIcsText("Duty Guild — походы круга")}`,
    `X-WR-CALDESC:${escapeIcsText("Общий календарный свиток походов и встреч Duty Guild.")}`,
    `X-WR-TIMEZONE:${escapeIcsText(config.timeZone)}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT6H",
    "X-PUBLISHED-TTL:PT6H",
    ...calendarEvents.flatMap((entry) => renderIcsEvent(entry, nowStamp)),
    "END:VCALENDAR",
    "",
  ];

  return lines.map(foldIcsLine).join("\r\n");
}

function buildGameEventCalendarEntry(env, event, timeZone) {
  if (!event) {
    return null;
  }

  const endDate = event.end_date || event.event_date;
  const isCancelled = event.status === "cancelled";
  const entry = {
    uid: `game-${event.id}@dutyguild.ru`,
    summary: event.title,
    description: [
      isCancelled ? "Статус: событие отменено." : null,
      `Когда: ${formatEventSchedule({
        eventDate: event.event_date,
        endDate,
        startsAt: event.starts_at,
        endsAt: event.ends_at,
      })}`,
      event.notes ? `Пометка хрониста: ${event.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    url: getAppOrigin(env),
    status: isCancelled ? "cancelled" : "confirmed",
    lastModifiedUtc: parseStoredTimestamp(
      event.updated_at || event.cancelled_at || event.created_at,
    ),
  };

  if (!event.starts_at) {
    entry.allDayStart = event.event_date;
    entry.allDayEndExclusive = addDays(endDate, 1);
    return entry;
  }

  entry.startsAtUtc = zonedDateTimeToUtc(event.event_date, event.starts_at, timeZone);
  if (event.ends_at) {
    entry.endsAtUtc = zonedDateTimeToUtc(endDate, event.ends_at, timeZone);
  }

  return entry;
}

function renderIcsEvent(entry, stamp) {
  const lines = [
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(entry.uid)}`,
    `DTSTAMP:${stamp}`,
    `LAST-MODIFIED:${formatIcsDateTimeUtc(entry.lastModifiedUtc || new Date())}`,
    `SUMMARY:${escapeIcsText(entry.summary)}`,
    `DESCRIPTION:${escapeIcsText(entry.description || "")}`,
    `URL:${escapeIcsText(entry.url || "")}`,
    `STATUS:${entry.status === "cancelled" ? "CANCELLED" : "CONFIRMED"}`,
  ];

  if (entry.allDayStart && entry.allDayEndExclusive) {
    lines.push(`DTSTART;VALUE=DATE:${formatIcsDate(entry.allDayStart)}`);
    lines.push(`DTEND;VALUE=DATE:${formatIcsDate(entry.allDayEndExclusive)}`);
  } else if (entry.startsAtUtc) {
    lines.push(`DTSTART:${formatIcsDateTimeUtc(entry.startsAtUtc)}`);
    if (entry.endsAtUtc) {
      lines.push(`DTEND:${formatIcsDateTimeUtc(entry.endsAtUtc)}`);
    }
  }

  if (entry.status !== "cancelled") {
    lines.push(...renderIcsDisplayAlarm(entry.summary, "P2D"));
    lines.push(...renderIcsDisplayAlarm(entry.summary, "P1D"));
  }
  lines.push("END:VEVENT");
  return lines;
}

function renderIcsDisplayAlarm(summary, duration) {
  const title = String(summary || "Событие Duty Guild").trim() || "Событие Duty Guild";
  return [
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcsText(`Напоминание Duty Guild: ${title}`)}`,
    `TRIGGER:-${duration}`,
    "END:VALARM",
  ];
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
        m.created_at,
        m.approved_at,
        COUNT(r.id) AS feedback_count,
        ROUND(AVG(r.rating), 2) AS average_rating
      FROM members m
      LEFT JOIN cycle_assignments a ON a.member_id = m.id
      LEFT JOIN cycle_reviews r ON r.cycle_id = a.cycle_id
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

async function loadCouncilRoster(env) {
  return decorateCouncilRoster(await loadRoster(env), await getCurrentStewardMemberId(env));
}

function decorateCouncilRoster(roster, stewardMemberId = null) {
  return roster
    .map((member) => decorateCouncilMember(member, stewardMemberId))
    .sort(compareCouncilMembers);
}

function decorateCouncilMember(member, stewardMemberId) {
  const effectiveRole =
    member.baseRole === "admin" || member.role === "admin"
      ? "admin"
      : member.id === stewardMemberId
        ? "steward"
        : "member";

  return {
    ...member,
    role: effectiveRole,
    permissions: getCouncilPermissions(effectiveRole),
  };
}

function compareCouncilMembers(left, right) {
  const order = {
    admin: 0,
    steward: 1,
    member: 2,
  };
  const leftWeight = order[left.role] ?? 99;
  const rightWeight = order[right.role] ?? 99;

  if (leftWeight !== rightWeight) {
    return leftWeight - rightWeight;
  }

  return left.displayName.localeCompare(right.displayName, "ru");
}

function getCouncilPermissions(role) {
  return {
    canManageMembers: role === "admin",
    canManageCycles: role === "admin" || role === "steward",
    canManageAllEvents: role === "admin" || role === "steward",
    canManageDeeds: role === "admin",
  };
}

async function getEffectiveMemberRole(env, member) {
  if (!member) {
    return "member";
  }
  if (member.role === "admin") {
    return "admin";
  }

  const stewardMemberId = await getCurrentStewardMemberId(env);
  return member.id === stewardMemberId ? "steward" : "member";
}

async function getCurrentStewardMemberId(env) {
  return ensureAutomaticSteward(env);
}

async function getLatestCompletedStewardRecord(env) {
  return first(
    env,
    `
      SELECT
        e.id,
        e.winner_member_id,
        e.round_number,
        e.started_at,
        e.completed_at,
        winner.display_name AS winner_name
      FROM council_elections e
      JOIN members m ON m.id = e.winner_member_id
      LEFT JOIN members winner ON winner.id = e.winner_member_id
      WHERE e.role = 'steward'
        AND e.status = 'completed'
        AND e.winner_member_id IS NOT NULL
        AND m.status = 'active'
        AND m.role = 'member'
      ORDER BY COALESCE(e.completed_at, e.started_at) DESC, e.started_at DESC
      LIMIT 1
    `,
  );
}

async function ensureAutomaticSteward(env, knownRoster = null) {
  const roster = knownRoster || (await loadRoster(env));
  const activeElection = await getActiveStewardElection(env);
  const latestCompleted = await getLatestCompletedStewardRecord(env);
  const currentWinnerId = latestCompleted?.winner_member_id || null;
  const uniqueLeader = pickAutomaticStewardLeader(roster);

  if (!uniqueLeader) {
    return currentWinnerId;
  }

  if (uniqueLeader.id === currentWinnerId) {
    if (activeElection) {
      await run(
        env,
        `
          UPDATE council_elections
          SET status = 'cancelled',
              completed_at = COALESCE(completed_at, CURRENT_TIMESTAMP)
          WHERE id = ?
        `,
        [activeElection.id],
      );
    }
    return uniqueLeader.id;
  }

  if (activeElection) {
    await run(
      env,
      `
        UPDATE council_elections
        SET status = 'cancelled',
            completed_at = COALESCE(completed_at, CURRENT_TIMESTAMP)
        WHERE id = ?
      `,
      [activeElection.id],
    );
  }

  const electionId = crypto.randomUUID();
  await run(
    env,
    `
      INSERT INTO council_elections (
        id,
        role,
        status,
        round_number,
        winner_member_id,
        completed_at
      )
      VALUES (?, 'steward', 'completed', 0, ?, CURRENT_TIMESTAMP)
    `,
    [electionId, uniqueLeader.id],
  );

  await notifyCouncilElectionStage(env, {
    kind: "steward-auto-appointed",
    subject: "Duty Guild: летопись назвала нового Сенешаля",
    kicker: "Знамение славы",
    title: "Сенешаль назначен силой летописи",
    lead: "В круге появился единоличный лидер по славе ритуалов, и летопись сама возложила на него печать Сенешаля.",
    rows: [
      ["Новый Сенешаль", uniqueLeader.displayName],
      ["Слава", formatRatingLabel(uniqueLeader.averageRating)],
      ["Служений", String(uniqueLeader.dutyCount)],
    ],
    note:
      "Пока этот соратник держит вершину славы единолично, сан Сенешаля остаётся за ним без нового голосования.",
    extraMemberIds: [uniqueLeader.id],
  });

  return uniqueLeader.id;
}

async function getActiveStewardElection(env) {
  return first(
    env,
    `
      SELECT
        e.*,
        launcher.display_name AS launched_by_name
      FROM council_elections e
      LEFT JOIN members launcher ON launcher.id = e.launched_by_member_id
      WHERE e.role = 'steward'
        AND e.status = 'active'
      ORDER BY e.started_at DESC
      LIMIT 1
    `,
  );
}

async function loadCouncilElectionState(env, viewer, roster, currentStewardMemberId = null) {
  const stewardMemberId =
    currentStewardMemberId === undefined || currentStewardMemberId === null
      ? await getCurrentStewardMemberId(env)
      : currentStewardMemberId;
  const currentSteward = stewardMemberId
    ? roster.find((member) => member.id === stewardMemberId) || null
    : null;
  const lastCompletedElection = await getLatestCompletedStewardRecord(env);
  const activeElection = await getActiveStewardElection(env);
  const hasRatingTie = !pickAutomaticStewardLeader(roster) && pickInitialStewardCandidates(roster).length > 1;

  const summary = {
    currentSteward: currentSteward
      ? {
          id: currentSteward.id,
          displayName: currentSteward.displayName,
          rankTitle: currentSteward.rank?.title || "",
          averageRating: currentSteward.averageRating,
        }
      : null,
    canStartElection: Boolean(viewer?.permissions?.canManageMembers) && hasRatingTie,
    activeElection: null,
    lastCompletedElection: lastCompletedElection
      ? {
          id: lastCompletedElection.id,
          roundNumber: Number(lastCompletedElection.round_number || 1),
          completedAt: lastCompletedElection.completed_at,
          winnerName: lastCompletedElection.winner_name || "Неизвестный соратник",
        }
      : null,
  };

  if (!activeElection) {
    return summary;
  }

  const [candidateRows, voteRows] = await Promise.all([
    all(
      env,
      `
        SELECT
          member_id,
          rating_snapshot,
          feedback_count_snapshot,
          duty_count_snapshot
        FROM council_election_candidates
        WHERE election_id = ?
          AND round_number = ?
        ORDER BY created_at ASC
      `,
      [activeElection.id, activeElection.round_number],
    ),
    all(
      env,
      `
        SELECT voter_member_id, candidate_member_id
        FROM council_election_votes
        WHERE election_id = ?
          AND round_number = ?
      `,
      [activeElection.id, activeElection.round_number],
    ),
  ]);

  const rosterById = new Map(roster.map((member) => [member.id, member]));
  const voters = roster.filter((member) => member.status === "active");
  const votesByCandidate = new Map();
  for (const vote of voteRows) {
    votesByCandidate.set(
      vote.candidate_member_id,
      Number(votesByCandidate.get(vote.candidate_member_id) || 0) + 1,
    );
  }

  const myVoteCandidateId = viewer
    ? voteRows.find((vote) => vote.voter_member_id === viewer.id)?.candidate_member_id || null
    : null;
  const votedMemberIds = new Set(voteRows.map((vote) => vote.voter_member_id));
  const candidates = candidateRows
    .map((candidate) => {
      const member = rosterById.get(candidate.member_id);
      const ratingValue =
        candidate.rating_snapshot === null || candidate.rating_snapshot === undefined
          ? member?.averageRating ?? null
          : Number(candidate.rating_snapshot);

      return {
        id: candidate.member_id,
        displayName: member?.displayName || "Неизвестный соратник",
        rankTitle: member?.rank?.title || "Соратник круга",
        averageRating: ratingValue,
        feedbackCount: Number(candidate.feedback_count_snapshot || member?.feedbackCount || 0),
        dutyCount: Number(candidate.duty_count_snapshot || member?.dutyCount || 0),
        voteCount: Number(votesByCandidate.get(candidate.member_id) || 0),
        isMyVote: myVoteCandidateId === candidate.member_id,
        canReceiveVote: Boolean(viewer) && viewer.id !== candidate.member_id,
      };
    })
    .sort(compareElectionCandidates);

  return {
    ...summary,
    activeElection: {
      id: activeElection.id,
      roundNumber: Number(activeElection.round_number || 1),
      startedAt: activeElection.started_at,
      launchedByName: activeElection.launched_by_name || "Неизвестный Магистр",
      voterCount: voters.length,
      requiredVotes: getElectionMajorityCount(voters.length),
      votesCast: voteRows.length,
      allMembersVoted:
        voters.length > 0 &&
        voters.every((member) => votedMemberIds.has(member.id)),
      myVoteCandidateId,
      canVote: Boolean(viewer),
      candidates,
    },
  };
}

function pickInitialStewardCandidates(roster) {
  const eligibleMembers = roster.filter((member) => member.status === "active" && member.baseRole !== "admin");
  if (!eligibleMembers.length) {
    return [];
  }

  const topRating = eligibleMembers.reduce(
    (highest, member) => Math.max(highest, getElectionRatingScore(member.averageRating)),
    Number.NEGATIVE_INFINITY,
  );

  return eligibleMembers
    .filter((member) => getElectionRatingScore(member.averageRating) === topRating)
    .sort((left, right) => left.displayName.localeCompare(right.displayName, "ru"))
    .map(buildElectionCandidateSnapshot);
}

function pickAutomaticStewardLeader(roster) {
  const candidates = pickInitialStewardCandidates(roster);
  return candidates.length === 1 ? candidates[0] : null;
}

function buildElectionCandidateSnapshot(member) {
  return {
    id: member.id,
    displayName: member.displayName,
    averageRating: member.averageRating,
    feedbackCount: Number(member.feedbackCount || 0),
    dutyCount: Number(member.dutyCount || 0),
  };
}

async function insertElectionCandidates(env, electionId, roundNumber, candidates) {
  for (const candidate of candidates) {
    await run(
      env,
      `
        INSERT INTO council_election_candidates (
          id,
          election_id,
          round_number,
          member_id,
          rating_snapshot,
          feedback_count_snapshot,
          duty_count_snapshot
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        crypto.randomUUID(),
        electionId,
        roundNumber,
        candidate.id,
        candidate.averageRating,
        candidate.feedbackCount,
        candidate.dutyCount,
      ],
    );
  }
}

async function resolveStewardElectionRound(env, electionId) {
  const election = await first(
    env,
    `
      SELECT *
      FROM council_elections
      WHERE id = ?
        AND status = 'active'
      LIMIT 1
    `,
    [electionId],
  );

  if (!election) {
    return { status: "settled" };
  }

  const currentStewardMemberId = await getCurrentStewardMemberId(env);
  const voters = await loadElectionVoterRoster(env, currentStewardMemberId);
  const [candidateRows, voteRows] = await Promise.all([
    all(
      env,
      `
        SELECT
          c.member_id,
          c.rating_snapshot,
          c.feedback_count_snapshot,
          c.duty_count_snapshot,
          m.display_name
        FROM council_election_candidates c
        JOIN members m ON m.id = c.member_id
        WHERE c.election_id = ?
          AND c.round_number = ?
        ORDER BY c.created_at ASC
      `,
      [election.id, election.round_number],
    ),
    all(
      env,
      `
        SELECT voter_member_id, candidate_member_id
        FROM council_election_votes
        WHERE election_id = ?
          AND round_number = ?
      `,
      [election.id, election.round_number],
    ),
  ]);

  const votesByCandidate = new Map();
  for (const vote of voteRows) {
    votesByCandidate.set(
      vote.candidate_member_id,
      Number(votesByCandidate.get(vote.candidate_member_id) || 0) + 1,
    );
  }

  const rankedCandidates = candidateRows
    .map((candidate) => ({
      id: candidate.member_id,
      displayName: candidate.display_name,
      averageRating:
        candidate.rating_snapshot === null || candidate.rating_snapshot === undefined
          ? null
          : Number(candidate.rating_snapshot),
      feedbackCount: Number(candidate.feedback_count_snapshot || 0),
      dutyCount: Number(candidate.duty_count_snapshot || 0),
      voteCount: Number(votesByCandidate.get(candidate.member_id) || 0),
    }))
    .sort(compareElectionCandidates);

  const requiredVotes = getElectionMajorityCount(voters.length);
  const winner = rankedCandidates.find((candidate) => candidate.voteCount >= requiredVotes);

  if (winner) {
    const previousStewardMemberId = currentStewardMemberId;
    await run(
      env,
      `
        UPDATE council_elections
        SET status = 'completed',
            winner_member_id = ?,
            completed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [winner.id, election.id],
    );

    await notifyCouncilElectionStage(env, {
      kind: "steward-election-completed",
      subject: "Duty Guild: круг избрал Сенешаля",
      kicker: "Итог выборов",
      title: "Сенешаль назван кругом",
      lead: "Голоса сошлись, и теперь у Магистра есть избранный соратник, которому доверена печать Сенешаля.",
      rows: [
        ["Избранный Сенешаль", winner.displayName],
        ["Круг голосования", `Круг ${Number(election.round_number || 1)}`],
        ["Голоса круга", `${winner.voteCount} из ${voters.length || 1}`],
      ],
      note:
        "Новый Сенешаль уже может править свод походов и помогать Магистру созывать новые обряды.",
      extraMemberIds: [winner.id, previousStewardMemberId].filter(Boolean),
    });

    return { status: "completed", winnerMemberId: winner.id };
  }

  const votedMemberIds = new Set(voteRows.map((vote) => vote.voter_member_id));
  const allMembersVoted =
    voters.length > 0 &&
    voters.every((member) => votedMemberIds.has(member.id));

  if (!allMembersVoted) {
    return { status: "pending", votesCast: voteRows.length, requiredVotes };
  }

  const nextRoundNumber = Number(election.round_number || 1) + 1;
  const runoffCandidates = pickRunoffCandidates(rankedCandidates);

  await run(
    env,
    `
      UPDATE council_elections
      SET round_number = ?
      WHERE id = ?
    `,
    [nextRoundNumber, election.id],
  );
  await insertElectionCandidates(env, election.id, nextRoundNumber, runoffCandidates);

  await notifyCouncilElectionStage(env, {
    kind: "steward-election-runoff",
    subject: "Duty Guild: летопись открыла новый круг голосования",
    kicker: "Следующий круг",
    title: "Большинство не найдено",
    lead: "Прошлый круг не дал имени, за которое высказалось бы более половины круга. Летопись открывает новый круг среди сильнейших претендентов.",
    rows: [
      ["Новый круг", `Круг ${nextRoundNumber}`],
      ["Кандидаты", formatCandidateNames(runoffCandidates)],
      ["Нужно для избрания", `${requiredVotes} из ${voters.length || 1}`],
    ],
    note:
      "За себя голосовать по-прежнему нельзя. Если голоса снова разойдутся, летопись удержит лишь сильнейшие имена и откроет ещё один круг.",
  });

  return {
    status: "runoff",
    roundNumber: nextRoundNumber,
    candidateCount: runoffCandidates.length,
  };
}

function compareElectionCandidates(left, right) {
  if (right.voteCount !== left.voteCount) {
    return right.voteCount - left.voteCount;
  }
  const rightRating = getElectionRatingScore(right.averageRating);
  const leftRating = getElectionRatingScore(left.averageRating);
  if (rightRating !== leftRating) {
    return rightRating - leftRating;
  }
  if (right.feedbackCount !== left.feedbackCount) {
    return right.feedbackCount - left.feedbackCount;
  }
  if (right.dutyCount !== left.dutyCount) {
    return right.dutyCount - left.dutyCount;
  }
  return left.displayName.localeCompare(right.displayName, "ru");
}

function pickRunoffCandidates(candidates) {
  return [...candidates]
    .sort(compareElectionCandidates)
    .slice(0, Math.min(3, candidates.length))
    .map((candidate) => ({
      id: candidate.id,
      displayName: candidate.displayName,
      averageRating: candidate.averageRating,
      feedbackCount: candidate.feedbackCount,
      dutyCount: candidate.dutyCount,
    }));
}

function getElectionRatingScore(value) {
  return value === null || value === undefined ? 0 : Number(value);
}

function getElectionMajorityCount(voterCount) {
  return Math.floor(Number(voterCount || 0) / 2) + 1;
}

async function loadElectionVoterRoster(env, currentStewardMemberId = null) {
  const roster = decorateCouncilRoster(
    await loadRoster(env),
    currentStewardMemberId ?? (await getCurrentStewardMemberId(env)),
  );
  return roster.filter((member) => member.status === "active");
}

function formatCandidateNames(candidates) {
  return candidates.map((candidate) => candidate.displayName).join(", ");
}

function formatRatingLabel(value) {
  return value === null || value === undefined ? "0.0" : Number(value).toFixed(1);
}

async function requireCouncil(request, env) {
  const member = await requireMember(request, env);
  if (member instanceof Response) {
    return member;
  }

  const effectiveRole = await getEffectiveMemberRole(env, member);
  if (effectiveRole !== "admin" && effectiveRole !== "steward") {
    return json(
      { error: "Это право принадлежит только Магистру или Сенешалю." },
      403,
    );
  }

  return member;
}

async function canManageGameEvent(env, actor, gameEvent) {
  const effectiveRole = await getEffectiveMemberRole(env, actor);
  return canManageGameEventLocally({ ...actor, role: effectiveRole }, gameEvent);
}

function canManageGameEventLocally(actor, gameEvent) {
  if (!actor || !gameEvent) {
    return false;
  }
  if (actor.role === "admin" || actor.role === "steward") {
    return true;
  }
  return actor.id === gameEvent.created_by_member_id;
}

async function hydrateCycle(env, cycleRow, viewerMemberId = null) {
  if (!cycleRow) {
    return null;
  }

  const assigneeRows = await all(
    env,
    `
      SELECT
        m.id,
        m.email,
        m.display_name,
        m.role,
        m.status,
        m.duty_count,
        a.completed_at,
        a.assignment_order
      FROM cycle_assignments a
      JOIN members m ON m.id = a.member_id
      WHERE a.cycle_id = ?
      ORDER BY a.assignment_order ASC, m.display_name ASC
    `,
    [cycleRow.id],
  );

  const reviewRows = await all(
    env,
    `
      SELECT
        r.id,
        r.author_member_id,
        r.rating,
        r.comment,
        r.created_at,
        author.display_name AS author_name
      FROM cycle_reviews r
      JOIN members author ON author.id = r.author_member_id
      WHERE r.cycle_id = ?
      ORDER BY r.created_at DESC
    `,
    [cycleRow.id],
  );

  const assignees = assigneeRows.map((member) => ({
    ...memberToClient(member),
    completedAt: member.completed_at || null,
    assignmentOrder: Number(member.assignment_order || 0),
  }));
  const averageRating = reviewRows.length
    ? Number(
        (
          reviewRows.reduce((sum, row) => sum + Number(row.rating || 0), 0) /
          reviewRows.length
        ).toFixed(2),
      )
    : null;
  const viewerAssignment = viewerMemberId
    ? assignees.find((entry) => entry.id === viewerMemberId) || null
    : null;
  const viewerReview = viewerMemberId
    ? reviewRows.find((entry) => entry.author_member_id === viewerMemberId) || null
    : null;

  return {
    id: cycleRow.id,
    startsOn: cycleRow.starts_on,
    endsOn: cycleRow.ends_on,
    plannedCleaningDate: cycleRow.planned_cleaning_date,
    status: cycleRow.status,
    notes: cycleRow.notes || "",
    createdAt: cycleRow.created_at,
    completedAt: cycleRow.completed_at || null,
    feedbackRequestedAt: cycleRow.feedback_requested_at || null,
    assignees,
    reviewCount: reviewRows.length,
    averageRating,
    outcome: getRitualOutcome(averageRating, reviewRows.length),
    reviews: reviewRows.map((row) => ({
      id: row.id,
      authorMemberId: row.author_member_id,
      authorName: row.author_name,
      rating: Number(row.rating),
      comment: row.comment,
      createdAt: row.created_at,
    })),
    isAssignedToMe: Boolean(viewerAssignment),
    myAssignmentCompleted: Boolean(viewerAssignment?.completedAt),
    canMarkComplete:
      Boolean(viewerAssignment) &&
      cycleRow.status === "scheduled" &&
      !viewerAssignment?.completedAt,
    canReview:
      Boolean(viewerMemberId) &&
      cycleRow.status === "completed" &&
      !viewerAssignment &&
      !viewerReview,
    myReview: viewerReview
      ? {
          id: viewerReview.id,
          rating: Number(viewerReview.rating),
          comment: viewerReview.comment,
          createdAt: viewerReview.created_at,
        }
      : null,
    allAssigneesCompleted:
      assignees.length > 0 && assignees.every((entry) => Boolean(entry.completedAt)),
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
      error: "Следующий обряд уже вписан в летопись и ждёт своего часа.",
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
      SELECT event_date, COALESCE(end_date, event_date) AS end_date
      FROM game_events
      WHERE event_date <= ? AND COALESCE(end_date, event_date) >= ? AND status != 'cancelled'
    `,
    [endsOn, startsOn],
  );
  const gameDates = new Set();
  for (const row of gameRows) {
    for (const date of eachDateInRange(row.event_date, row.end_date || row.event_date)) {
      gameDates.add(date);
    }
  }

  const members = await all(
    env,
    `
      SELECT
        m.id,
        m.email,
        m.display_name,
        m.role,
        m.status,
        m.duty_count,
        m.calendar_token,
        COUNT(r.id) AS review_count,
        ROUND(AVG(r.rating), 2) AS average_rating
      FROM members m
      LEFT JOIN cycle_assignments a ON a.member_id = m.id
      LEFT JOIN cycle_reviews r ON r.cycle_id = a.cycle_id
      WHERE m.status = 'active'
      GROUP BY m.id
      ORDER BY m.display_name ASC
    `,
  );

  if (members.length < config.dutyTeamSize) {
    return {
      ok: false,
      error: "Недостаточно активных соратников, чтобы собрать новую пару обряда.",
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
      calendarToken: row.calendar_token,
      dutyCount: Number(row.duty_count || 0),
      averageRating:
        row.average_rating === null || row.average_rating === undefined
          ? null
          : Number(row.average_rating),
      reviewCount: Number(row.review_count || 0),
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

    const delivery = await sendAssignmentEmail(env, {
      email: assignee.email,
      displayName: assignee.displayName,
      startsOn,
      endsOn,
      plannedCleaningDate,
      calendarUrl: buildCalendarSubscriptionUrl(env, assignee.calendarToken),
      calendarWebcalUrl: buildCalendarSubscriptionWebcalUrl(env, assignee.calendarToken),
      counterpartName:
        assignees.find((entry) => entry.id !== assignee.id)?.displayName || "парный соратник",
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

  const fairnessRanked = candidatePool
    .map((member) => {
      const score = scoreDutyCandidate(member, recentlyAssignedIds, unavailableIds);
      return { ...member, score, tieBreaker: randomInteger(1_000_000) };
    })
    .sort(compareByScoreThenTieBreaker);

  if (targetCount <= 1 || fairnessRanked.length <= 1) {
    return fairnessRanked.slice(0, targetCount);
  }

  const apprenticeWindow = fairnessRanked.slice(0, Math.min(4, fairnessRanked.length));
  const apprenticeCandidate = apprenticeWindow
    .filter((member) => member.averageRating !== null)
    .sort((left, right) => {
      if (left.averageRating !== right.averageRating) {
        return left.averageRating - right.averageRating;
      }
      return compareByScoreThenTieBreaker(left, right);
    })[0];

  const firstAssignee = apprenticeCandidate || fairnessRanked[0];
  const remainingPool = candidatePool.filter((member) => member.id !== firstAssignee.id);

  if (!remainingPool.length) {
    return [firstAssignee];
  }

  const ratedCount = candidatePool.filter((member) => member.averageRating !== null).length;
  const mentorRanked = remainingPool
    .map((member) => ({
      ...member,
      score:
        ratedCount >= 2 && firstAssignee.averageRating !== null
          ? scoreMentorCandidate(member, recentlyAssignedIds, unavailableIds)
          : scoreDutyCandidate(member, recentlyAssignedIds, unavailableIds),
      tieBreaker: randomInteger(1_000_000),
    }))
    .sort(compareByScoreThenTieBreaker);

  return [firstAssignee, mentorRanked[0]].filter(Boolean);
}

function scoreDutyCandidate(member, recentlyAssignedIds, unavailableIds) {
  let score = Number(member.dutyCount || 0);

  if (member.averageRating !== null && member.averageRating !== undefined) {
    score -= Math.max(0, 4.2 - Number(member.averageRating)) * 0.35;
  }
  if (recentlyAssignedIds.has(member.id)) {
    score += 3.2;
  }
  if (unavailableIds.has(member.id)) {
    score += 20;
  }

  return score;
}

function scoreMentorCandidate(member, recentlyAssignedIds, unavailableIds) {
  let score = Number(member.dutyCount || 0);

  if (member.averageRating !== null && member.averageRating !== undefined) {
    score -= Number(member.averageRating) * 0.55;
  }
  if (recentlyAssignedIds.has(member.id)) {
    score += 3.4;
  }
  if (unavailableIds.has(member.id)) {
    score += 20;
  }

  return score;
}

function compareByScoreThenTieBreaker(left, right) {
  if (left.score !== right.score) {
    return left.score - right.score;
  }
  return left.tieBreaker - right.tieBreaker;
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
        m.display_name,
        m.calendar_token
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
      calendarUrl: buildCalendarSubscriptionUrl(env, row.calendar_token),
      calendarWebcalUrl: buildCalendarSubscriptionWebcalUrl(env, row.calendar_token),
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
        m.calendar_token,
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
    baseRole: member.role,
    status: member.status,
    dutyCount,
    createdAt: member.created_at || null,
    approvedAt: member.approved_at || member.created_at || null,
    rank,
  };
}

function decorateSelfMember(member, env) {
  return {
    ...member,
    calendarSubscriptionUrl: buildCalendarSubscriptionUrl(env),
    calendarSubscriptionWebcalUrl: buildCalendarSubscriptionWebcalUrl(env),
  };
}

function buildCalendarSubscriptionUrl(env) {
  return new URL("/calendar/events.ics", getAppOrigin(env)).toString();
}

function buildCalendarSubscriptionWebcalUrl(env) {
  const httpsUrl = buildCalendarSubscriptionUrl(env);
  if (!httpsUrl) {
    return null;
  }

  const url = new URL(httpsUrl);
  url.protocol = "webcal:";
  return url.toString();
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
        ? "Пока звание растёт от числа завершённых обрядов. Слава уже влияет на выбор пары и позже сможет усилить путь звания."
        : "Слава уже влияет на жребий пары и со временем сможет усилить само восхождение по званиям.",
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

function getRitualOutcome(averageRating, reviewCount) {
  if (averageRating === null || averageRating === undefined || reviewCount <= 0) {
    return {
      id: "awaiting",
      title: "Летопись ожидает свидетельств",
      shortTitle: "Ожидает отзывов",
      description: "Обряд завершён, но круг ещё не вынес свой вердикт.",
      accent: "#6e5b4d",
      glow: "rgba(110, 91, 77, 0.18)",
      reviewCount,
      averageRating: null,
    };
  }

  const found =
    RITUAL_OUTCOME_LADDER.find((entry) => Number(averageRating) >= entry.minRating) ||
    RITUAL_OUTCOME_LADDER[RITUAL_OUTCOME_LADDER.length - 1];

  return {
    ...found,
    reviewCount,
    averageRating: Number(averageRating),
  };
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
    "Совет ордена развернул врата.",
    `Ваша печать входа: ${details.code}`,
    `Сила печати угаснет: ${details.expiresAt}.`,
    "",
    "Если вы не призывали печать, просто проигнорируйте это письмо.",
  ].join("\n");

  return sendEmail(env, {
    to: details.email,
    subject: "Duty Guild: печать входа",
    text,
    html: renderEmailShell(env, {
      kicker: "Печать входа",
      title: "Врата ордена распахнуты",
      lead: "Одноразовая печать уже ждёт. Останется лишь подтвердить её на сайте и войти в летопись.",
      sceneKey: "wildwood",
      bodyHtml: `
        <div style="margin:24px 0;padding:20px 22px;border-radius:20px;background:linear-gradient(180deg,#fff8ef,#f3e2cf);border:1px solid #ead2b0;text-align:center;">
          <div style="font-size:13px;letter-spacing:0.22em;text-transform:uppercase;color:#9e5b2e;">Печать входа</div>
          <div style="margin-top:8px;font-size:38px;letter-spacing:0.22em;font-weight:800;color:#6a2419;">${escapeHtml(details.code)}</div>
          <div style="margin-top:10px;color:#6d584c;font-size:14px;">Сила печати угаснет: ${escapeHtml(details.expiresAt)}</div>
        </div>
      `,
      ctaLabel: "Войти в Duty Guild",
      ctaHref: getAppOrigin(env),
    }),
    debugCode: details.code,
  });
}

async function sendAssignmentEmail(env, details) {
  const text = [
    `${details.displayName}, приветствую.`,
    "",
    "Орден призвал вас к новому обряду порядка.",
    `Ваш парный соратник: ${details.counterpartName}`,
    `Промежуток обряда: ${details.startsOn} - ${details.endsOn}`,
    `День свершения: ${details.plannedCleaningDate}`,
    "",
    "Ритуал зачтётся только после того, как оба участника подтвердят завершение на сайте.",
    details.calendarUrl ? `Подписной календарь ордена: ${details.calendarUrl}` : null,
    details.calendarWebcalUrl ? `Ссылка для подписки: ${details.calendarWebcalUrl}` : null,
    details.calendarWebcalUrl ? "Обновление календарного свитка: примерно каждые 5 минут." : null,
  ]
    .filter(Boolean)
    .join("\n");

  return sendEmail(env, {
    to: details.email,
    subject: "Duty Guild: орден призвал вас к обряду",
    text,
    html: renderEmailShell(env, {
      kicker: "Новый обряд",
      title: "Совет назвал ваш клинок",
      lead: "Вы внесены в пару, которой предстоит провести следующий обряд порядка и вернуть залу должный блеск.",
      sceneKey: "siege",
      bodyHtml: renderEmailDetailRows([
        ["Парный соратник", details.counterpartName],
        ["Промежуток обряда", `${details.startsOn} - ${details.endsOn}`],
        ["День свершения", details.plannedCleaningDate],
      ]) + `
        <p style="margin:18px 0 0;color:#5e4b41;line-height:1.65;">
          Подвиг зачтётся только тогда, когда оба участника отметят завершение обряда в летописи.
        </p>
      ` + renderCalendarSubscriptionCallout(details.calendarUrl, details.calendarWebcalUrl),
      ctaLabel: "Открыть летопись",
      ctaHref: getAppOrigin(env),
    }),
  });
}

async function sendReminderEmail(env, details) {
  const text = [
    `${details.displayName}, приветствую.`,
    "",
    "Сегодня настал день свершения вашего обряда.",
    `Промежуток обряда: ${details.startsOn} - ${details.endsOn}.`,
    `День свершения: ${details.plannedCleaningDate}`,
    "",
    "Не забудьте после завершения подтвердить обряд в летописи.",
    details.calendarUrl ? `Подписной календарь ордена: ${details.calendarUrl}` : null,
    details.calendarWebcalUrl ? `Ссылка для подписки: ${details.calendarWebcalUrl}` : null,
    details.calendarWebcalUrl ? "Обновление календарного свитка: примерно каждые 5 минут." : null,
  ]
    .filter(Boolean)
    .join("\n");

  return sendEmail(env, {
    to: details.email,
    subject: "Duty Guild: день обряда настал",
    text,
    html: renderEmailShell(env, {
      kicker: "Напоминание ордена",
      title: "День обряда уже здесь",
      lead: "Летопись напоминает: сегодня вашей паре предстоит исполнить возложенный обет.",
      sceneKey: "siege",
      bodyHtml: renderEmailDetailRows([
        ["Промежуток обряда", `${details.startsOn} - ${details.endsOn}`],
        ["День свершения", details.plannedCleaningDate],
      ]) + renderCalendarSubscriptionCallout(details.calendarUrl, details.calendarWebcalUrl),
      ctaLabel: "Подтвердить после свершения",
      ctaHref: getAppOrigin(env),
    }),
  });
}

async function sendReviewRequestEmail(env, details) {
  const text = [
    `${details.displayName}, приветствую.`,
    "",
    "Два героя завершили обряд порядка, и летопись ждёт голос круга.",
    `Пара обряда: ${details.assigneeNames.join(" и ")}`,
    `День свершения: ${details.plannedCleaningDate}`,
    "",
    "Откройте Duty Guild и оцените обряд по шкале от 1 до 5 звёзд.",
  ].join("\n");

  return sendEmail(env, {
    to: details.email,
    subject: "Duty Guild: летопись просит оценить обряд",
    text,
    html: renderEmailShell(env, {
      kicker: "Глас летописи",
      title: "Круг ждёт ваш вердикт",
      lead: "Обряд завершён, и теперь сила славы зависит от того, как круг оценит исполнение пары.",
      sceneKey: "citadel",
      bodyHtml:
        renderEmailDetailRows([
          ["Пара обряда", details.assigneeNames.join(" и ")],
          ["День свершения", details.plannedCleaningDate],
        ]) +
        `
          <div style="margin-top:20px;padding:18px 20px;border-radius:20px;background:#1f1615;color:#f8efe5;text-align:center;">
            <div style="font-size:13px;letter-spacing:0.22em;text-transform:uppercase;color:#ddb778;">Оценка обряда</div>
            <div style="margin-top:10px;font-size:30px;letter-spacing:0.22em;color:#f0c26d;">★ ★ ★ ★ ★</div>
            <div style="margin-top:10px;color:#d5c0b2;line-height:1.6;">
              Войдите в Duty Guild и поставьте от одной до пяти звёзд. Зачёт общий для всей пары.
            </div>
          </div>
        `,
      ctaLabel: "Оценить обряд",
      ctaHref: getAppOrigin(env),
    }),
  });
}

async function sendGameEventEmail(env, details) {
  const meta = getGameEventEmailMeta(details);
  const detailRows = meta.rows(details);
  const detailNotes = meta.notes(details);
  const text = [
    `${details.displayName}, приветствую.`,
    "",
    meta.leadText,
    ...detailRows.map(([label, value]) => `${label}: ${value}`),
    ...detailNotes,
    details.calendarUrl ? `Подписной календарь ордена: ${details.calendarUrl}` : null,
    details.calendarWebcalUrl ? `Ссылка для подписки: ${details.calendarWebcalUrl}` : null,
    details.calendarWebcalUrl ? "Обновление календарного свитка: примерно каждые 5 минут." : null,
  ]
    .filter(Boolean)
    .join("\n");

  return sendEmail(env, {
    to: details.email,
    subject: meta.subject,
    text,
    html: renderEmailShell(env, {
      kicker: meta.kicker,
      title: meta.title,
      lead: meta.leadHtml,
      sceneKey: meta.sceneKey,
      bodyHtml:
        renderEmailDetailRows(detailRows) +
        renderGameEventEmailNotesHtml(detailNotes) +
        renderCalendarSubscriptionCallout(details.calendarUrl, details.calendarWebcalUrl),
      ctaLabel: meta.ctaLabel,
      ctaHref: getAppOrigin(env),
    }),
  });
}

async function sendCouncilElectionEmail(env, details) {
  const text = [
    `${details.displayName}, приветствую.`,
    "",
    details.lead,
    ...details.rows.map(([label, value]) => `${label}: ${value}`),
    "",
    details.note,
  ].join("\n");

  return sendEmail(env, {
    to: details.email,
    subject: details.subject,
    text,
    html: renderEmailShell(env, {
      kicker: details.kicker,
      title: details.title,
      lead: details.lead,
      sceneKey: "citadel",
      bodyHtml:
        renderEmailDetailRows(details.rows) +
        `
          <p style="margin:18px 0 0;color:#5e4b41;line-height:1.65;">
            ${escapeHtml(details.note)}
          </p>
        `,
      ctaLabel: details.ctaLabel || "Открыть зал совета",
      ctaHref: getAppOrigin(env),
    }),
  });
}

async function notifyCouncilElectionStage(env, details) {
  const recipients = await loadCouncilNotificationRecipients(env);

  for (const recipient of recipients) {
    const delivery = await sendCouncilElectionEmail(env, {
      email: recipient.email,
      displayName: recipient.display_name,
      subject: details.subject,
      kicker: details.kicker,
      title: details.title,
      lead: details.lead,
      rows: details.rows,
      note: details.note,
      ctaLabel: details.ctaLabel,
    });

    await logNotification(env, {
      kind: details.kind,
      memberId: recipient.id,
      deliveryStatus: delivery.mode,
    });
  }
}

async function loadCouncilNotificationRecipients(env) {
  return all(
    env,
    `
      SELECT id, email, display_name
      FROM members
      WHERE status = 'active'
      ORDER BY display_name ASC
    `,
  );
}

async function notifyReviewRequest(env, cycleId, assignments) {
  const cycle = await first(env, "SELECT * FROM cleaning_cycles WHERE id = ? LIMIT 1", [cycleId]);

  if (!cycle) {
    return;
  }

  const now = new Date().toISOString();
  await run(
    env,
    `
      UPDATE cleaning_cycles
      SET feedback_requested_at = COALESCE(feedback_requested_at, ?)
      WHERE id = ?
    `,
    [now, cycleId],
  );

  const recipients = await all(
    env,
    `
      SELECT id, email, display_name
      FROM members
      WHERE status = 'active'
      ORDER BY display_name ASC
    `,
  );
  const assigneeIds = new Set(assignments.map((row) => row.member_id));
  const assigneeNames = assignments.map((row) => row.display_name);

  for (const recipient of recipients) {
    if (assigneeIds.has(recipient.id)) {
      continue;
    }

    const delivery = await sendReviewRequestEmail(env, {
      email: recipient.email,
      displayName: recipient.display_name,
      assigneeNames,
      plannedCleaningDate: cycle.planned_cleaning_date,
    });

    await logNotification(env, {
      kind: "cycle-review-request",
      cycleId,
      memberId: recipient.id,
      deliveryStatus: delivery.mode,
    });
  }
}

async function notifyGameEventCreated(env, actor, event) {
  const recipients = await loadGameEventNotificationRecipients(env);
  const scheduleLabel = formatEventSchedule({
    eventDate: event.eventDate,
    endDate: event.endDate,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
  });

  for (const recipient of recipients) {
    const delivery = await sendGameEventEmail(env, {
      email: recipient.email,
      displayName: recipient.display_name,
      variant: "created",
      title: event.title,
      scheduleLabel,
      notes: event.notes,
      actorName: actor.display_name,
      calendarUrl: buildCalendarSubscriptionUrl(env),
      calendarWebcalUrl: buildCalendarSubscriptionWebcalUrl(env),
    });

    await logNotification(env, {
      kind: "game-event-created",
      memberId: recipient.id,
      deliveryStatus: delivery.mode,
    });
  }
}

async function notifyGameEventUpdated(env, actor, previousEvent, nextEvent) {
  const recipients = await loadGameEventNotificationRecipients(env);
  const scheduleLabel = formatEventSchedule(nextEvent);
  const previousScheduleLabel = formatEventSchedule(previousEvent);

  for (const recipient of recipients) {
    const delivery = await sendGameEventEmail(env, {
      email: recipient.email,
      displayName: recipient.display_name,
      variant: "updated",
      title: nextEvent.title,
      previousTitle: previousEvent.title,
      scheduleLabel,
      previousScheduleLabel,
      notes: nextEvent.notes,
      previousNotes: previousEvent.notes,
      actorName: actor.display_name,
      calendarUrl: buildCalendarSubscriptionUrl(env),
      calendarWebcalUrl: buildCalendarSubscriptionWebcalUrl(env),
    });

    await logNotification(env, {
      kind: "game-event-updated",
      memberId: recipient.id,
      deliveryStatus: delivery.mode,
    });
  }
}

async function notifyGameEventCancelled(env, actor, event) {
  const recipients = await loadGameEventNotificationRecipients(env);
  const scheduleLabel = formatEventSchedule(event);

  for (const recipient of recipients) {
    const delivery = await sendGameEventEmail(env, {
      email: recipient.email,
      displayName: recipient.display_name,
      variant: "cancelled",
      title: event.title,
      scheduleLabel,
      notes: event.notes,
      actorName: actor.display_name,
      calendarUrl: buildCalendarSubscriptionUrl(env),
      calendarWebcalUrl: buildCalendarSubscriptionWebcalUrl(env),
    });

    await logNotification(env, {
      kind: "game-event-cancelled",
      memberId: recipient.id,
      deliveryStatus: delivery.mode,
    });
  }
}

async function loadGameEventNotificationRecipients(env) {
  return all(
    env,
    `
      SELECT id, email, display_name
      FROM members
      WHERE status = 'active'
      ORDER BY display_name ASC
    `,
  );
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

function renderEmailShell(env, details) {
  const appOrigin = getAppOrigin(env);
  const scene = getEmailScene(env, details.sceneKey);
  const brandMarkUrl = getBrandMarkUrl(env);
  const ctaBlock =
    details.ctaLabel && details.ctaHref
      ? `
        <div style="margin-top:28px;">
          <a
            href="${escapeHtml(details.ctaHref)}"
            style="display:inline-block;padding:14px 22px;border-radius:999px;background:linear-gradient(135deg,#b43e22,#d46c3f);color:#fff9f2;text-decoration:none;font-weight:700;letter-spacing:0.04em;"
          >
            ${escapeHtml(details.ctaLabel)}
          </a>
        </div>
      `
      : "";
  const headerStyle = scene
    ? `padding:22px 22px;background:#130f10 url('${escapeHtml(scene.src)}') center center / cover no-repeat;color:#fffaf4;`
    : "padding:26px 28px;background:linear-gradient(120deg,#130f10,#2b1816 55%,#7f2212);color:#fffaf4;";
  const headerInnerStyle = scene
    ? "padding:24px 24px;border-radius:22px;background:linear-gradient(120deg,rgba(19,15,16,0.84),rgba(43,24,22,0.76) 55%,rgba(127,34,18,0.78));box-shadow:inset 0 0 0 1px rgba(255,244,230,0.08);"
    : "";

  return `
    <div style="margin:0;padding:24px 12px;background:#16110f;font-family:'Trebuchet MS','Segoe UI',sans-serif;color:#231b17;">
      <div style="max-width:680px;margin:0 auto;border-radius:28px;overflow:hidden;background:linear-gradient(180deg,#f8f1e7 0%,#f0e4d4 100%);border:1px solid #d8c1a5;box-shadow:0 24px 48px rgba(0,0,0,0.18);">
        <div style="${headerStyle}">
          <div style="${headerInnerStyle}">
            <div style="display:flex;align-items:center;gap:14px;">
              <img
                src="${escapeHtml(brandMarkUrl)}"
                alt="Герб Duty Guild"
                width="48"
                height="48"
                style="display:block;width:48px;height:48px;filter:drop-shadow(0 10px 16px rgba(0,0,0,0.32));"
              />
              <div>
                <div style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#f0d39f;">${escapeHtml(details.kicker || "Duty Guild")}</div>
                <div style="margin-top:4px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.05;">${escapeHtml(details.title)}</div>
              </div>
            </div>
            <p style="margin:18px 0 0;color:rgba(255,249,242,0.9);font-size:16px;line-height:1.7;">${escapeHtml(details.lead || "")}</p>
          </div>
        </div>
        <div style="padding:28px;">
          ${details.bodyHtml || ""}
          ${ctaBlock}
        </div>
        <div style="padding:18px 28px;border-top:1px solid #e0cfbb;background:#efe3d4;color:#6d584c;font-size:13px;line-height:1.6;">
          Duty Guild хранит хроники круга и зовёт обратно в летопись по адресу
          <a href="${escapeHtml(appOrigin)}" style="color:#8f311c;text-decoration:none;">${escapeHtml(appOrigin)}</a>.
        </div>
      </div>
    </div>
  `;
}

function getEmailScene(env, key) {
  const scene = EMAIL_SCENES[key];
  if (!scene) {
    return null;
  }

  return {
    src: new URL(scene.path, getAppOrigin(env)).toString(),
    alt: scene.alt,
  };
}

function getBrandMarkUrl(env) {
  return new URL("/assets/brand/dutyguild-mark.png", getAppOrigin(env)).toString();
}

function renderEmailDetailRows(rows) {
  return `
    <div style="display:grid;gap:12px;">
      ${rows
        .map(
          ([label, value]) => `
            <div style="padding:14px 16px;border-radius:18px;background:#fffaf4;border:1px solid #ead9c3;">
              <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9e5b2e;">${escapeHtml(label)}</div>
              <div style="margin-top:6px;font-size:16px;color:#2c201a;font-weight:700;">${escapeHtml(value)}</div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderCalendarSubscriptionCallout(calendarUrl, calendarWebcalUrl) {
  if (!calendarUrl) {
    return "";
  }

  const subscriptionLinks = [
    calendarWebcalUrl
      ? `<a href="${escapeHtml(calendarWebcalUrl)}" style="color:#8f311c;text-decoration:none;font-weight:700;">Подписаться на календарь</a>`
      : null,
    `<a href="${escapeHtml(calendarUrl)}" style="color:#8f311c;text-decoration:none;font-weight:700;">Открыть .ics-свиток</a>`,
  ]
    .filter(Boolean)
    .join(" · ");

  return `
    <div style="margin-top:18px;padding:16px 18px;border-radius:18px;background:#f6ecdf;border:1px solid #ead9c3;color:#5e4b41;line-height:1.65;">
      <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9e5b2e;">Календарный свиток</div>
      <div style="margin-top:8px;">
        Это общий календарный свиток Duty Guild. Им можно делиться с друзьями и союзниками круга. Новые записи появляются в нём примерно каждые 5 минут, а напоминания уже вложены за 2 дня и за 1 день до события.
      </div>
      <div style="margin-top:10px;">${subscriptionLinks}</div>
    </div>
  `;
}

function getGameEventEmailMeta(details) {
  switch (details.variant) {
    case "updated":
      return {
        subject: "Duty Guild: событие круга изменилось",
        kicker: "Летопись обновлена",
        title: "Маршрут похода переписан",
        leadText: "В летопись внесены изменения по уже объявленному событию круга.",
        leadHtml:
          "В летопись внесены изменения по уже объявленному событию круга. Календарный свиток подтянет новую версию в ближайшие минуты.",
        sceneKey: "citadel",
        ctaLabel: "Открыть свод походов",
        rows(current) {
          return [
            ["Название", current.title],
            ["Когда теперь", current.scheduleLabel],
            ["Переписал хронику", current.actorName],
          ];
        },
        notes(current) {
          const items = [];
          if (current.previousTitle && current.previousTitle !== current.title) {
            items.push(`Прежнее название: ${current.previousTitle}`);
          }
          if (
            current.previousScheduleLabel &&
            current.previousScheduleLabel !== current.scheduleLabel
          ) {
            items.push(`Прежнее время: ${current.previousScheduleLabel}`);
          }
          if (current.previousNotes !== current.notes) {
            if (current.previousNotes) {
              items.push(`Прежняя пометка хрониста: ${current.previousNotes}`);
            }
            if (current.notes) {
              items.push(`Новая пометка хрониста: ${current.notes}`);
            }
          } else if (current.notes) {
            items.push(`Пометка хрониста: ${current.notes}`);
          }
          return items;
        },
      };
    case "cancelled":
      return {
        subject: "Duty Guild: событие круга отменено",
        kicker: "Запись снята",
        title: "Поход снят со свода",
        leadText: "Событие круга отменено и больше не требует места в ваших планах.",
        leadHtml:
          "Событие круга отменено. Календарный свиток отметит это и снимет поход с будущих сборов.",
        sceneKey: "siege",
        ctaLabel: "Открыть летопись",
        rows(current) {
          return [
            ["Название", current.title],
            ["Когда было назначено", current.scheduleLabel],
            ["Кто отменил", current.actorName],
          ];
        },
        notes(current) {
          return current.notes ? [`Последняя пометка хрониста: ${current.notes}`] : [];
        },
      };
    case "created":
    default:
      return {
        subject: "Duty Guild: в летопись внесено новое событие",
        kicker: "Новая запись летописи",
        title: "Круг соберётся вновь",
        leadText: "В летопись внесено новое событие круга.",
        leadHtml:
          "В свод событий внесена новая встреча. Теперь орден сможет не сталкивать её с обрядами.",
        sceneKey: "wildwood",
        ctaLabel: "Открыть летопись",
        rows(current) {
          return [
            ["Название", current.title],
            ["Когда", current.scheduleLabel],
            ["Вписал хронист", current.actorName],
          ];
        },
        notes(current) {
          return current.notes ? [`Пометка хрониста: ${current.notes}`] : [];
        },
      };
  }
}

function renderGameEventEmailNotesHtml(notes) {
  const items = (notes || []).filter(Boolean);
  if (!items.length) {
    return "";
  }

  return items
    .map(
      (note) =>
        `<p style="margin:18px 0 0;color:#5e4b41;line-height:1.65;">${escapeHtml(note)}</p>`,
    )
    .join("");
}

function getAppOrigin(env) {
  return String(env.PUBLIC_APP_ORIGIN || "https://dutyguild.ru").trim();
}

function normalizeGameEventRecord(event) {
  return {
    id: event.id,
    title: String(event.title || "").trim(),
    eventDate: String(event.event_date || event.eventDate || "").trim(),
    endDate: String(event.end_date || event.endDate || event.event_date || event.eventDate || "").trim(),
    startsAt: normalizeTime(event.starts_at || event.startsAt),
    endsAt: normalizeTime(event.ends_at || event.endsAt),
    notes: String(event.notes || "").trim(),
    status: String(event.status || "confirmed").trim(),
    createdByMemberId: event.created_by_member_id || event.createdByMemberId || null,
    createdAt: event.created_at || event.createdAt || null,
    updatedAt: event.updated_at || event.updatedAt || null,
    cancelledAt: event.cancelled_at || event.cancelledAt || null,
  };
}

function didGameEventChange(previousEvent, nextEvent) {
  return [
    "title",
    "eventDate",
    "endDate",
    "startsAt",
    "endsAt",
    "notes",
    "status",
  ].some((field) => (previousEvent?.[field] || null) !== (nextEvent?.[field] || null));
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
  if (staticAssets.has(pathname)) {
    return staticAssets.get(pathname);
  }

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

function normalizePositiveInteger(value) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function normalizeServiceDeedType(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return SERVICE_DEED_LIBRARY[normalized] ? normalized : null;
}

function mapServiceDeedTotals(rows = []) {
  const totals = Object.fromEntries(
    Object.keys(SERVICE_DEED_LIBRARY).map((deedType) => [deedType, 0]),
  );

  for (const row of rows) {
    const deedType = normalizeServiceDeedType(row?.deed_type || row?.deedType);
    if (!deedType) {
      continue;
    }
    totals[deedType] += Number(row?.total || row?.effective_quantity || row?.effectiveQuantity || 0);
  }

  return totals;
}

function buildServiceDeedAchievementStats(rows = []) {
  const totals = mapServiceDeedTotals();
  const thresholds = [...new Set(SERVICE_DEED_ACHIEVEMENTS.map((entry) => Number(entry.threshold)))]
    .filter((value) => Number.isFinite(value))
    .sort((left, right) => left - right);
  const milestones = Object.fromEntries(
    Object.keys(SERVICE_DEED_LIBRARY).map((deedType) => [deedType, {}]),
  );

  for (const row of rows) {
    const deedType = normalizeServiceDeedType(row?.deed_type || row?.deedType);
    if (!deedType) {
      continue;
    }

    totals[deedType] += Number(row?.effective_quantity || row?.effectiveQuantity || 0);
    const happenedAt = row?.created_at || row?.createdAt || null;
    for (const threshold of thresholds) {
      const thresholdKey = String(threshold);
      if (!milestones[deedType][thresholdKey] && totals[deedType] >= threshold && happenedAt) {
        milestones[deedType][thresholdKey] = happenedAt;
      }
    }
  }

  return {
    totals,
    milestones,
  };
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

function parseEmailList(value, fallback = []) {
  const items = String(value || "")
    .split(",")
    .map((chunk) => normalizeEmail(chunk))
    .filter(Boolean);

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

function eachDateInRange(startsOn, endsOn) {
  const dates = [];
  for (let date = startsOn; date <= endsOn; date = addDays(date, 1)) {
    dates.push(date);
  }
  return dates;
}

function dateToUtcDate(dateOnly) {
  const [year, month, day] = dateOnly.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function formatEventSchedule(event) {
  const startDate = event?.eventDate;
  const endDate = event?.endDate || startDate;
  const startsAt = event?.startsAt || null;
  const endsAt = event?.endsAt || null;

  if (!startDate) {
    return "Дата пока не назначена";
  }

  const startDateLabel = formatHumanDate(startDate);
  const endDateLabel = formatHumanDate(endDate);

  if (startDate === endDate) {
    if (startsAt && endsAt) {
      return `${startDateLabel}, ${startsAt} - ${endsAt}`;
    }
    if (startsAt) {
      return `${startDateLabel}, с ${startsAt}`;
    }
    if (endsAt) {
      return `${startDateLabel}, до ${endsAt}`;
    }
    return startDateLabel;
  }

  const startLabel = startsAt ? `${startDateLabel}, ${startsAt}` : startDateLabel;
  const endLabel = endsAt ? `${endDateLabel}, ${endsAt}` : endDateLabel;
  return `${startLabel} - ${endLabel}`;
}

function formatHumanDate(dateOnly) {
  if (!dateOnly) {
    return "Дата пока не назначена";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(dateToUtcDate(dateOnly));
}

function escapeIcsText(value) {
  return String(value || "")
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll(/\r?\n/g, "\\n");
}

function foldIcsLine(line) {
  const value = String(line || "");
  if (value.length <= 73) {
    return value;
  }

  const parts = [];
  for (let index = 0; index < value.length; index += 73) {
    parts.push(index === 0 ? value.slice(index, index + 73) : ` ${value.slice(index, index + 73)}`);
  }
  return parts.join("\r\n");
}

function formatIcsDate(dateOnly) {
  return String(dateOnly || "").replaceAll("-", "");
}

function formatIcsDateTimeUtc(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function parseStoredTimestamp(value) {
  if (!value) {
    return new Date();
  }

  const raw = String(value).trim();
  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(raw)
    ? `${raw.replace(" ", "T")}Z`
    : raw;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function zonedDateTimeToUtc(dateOnly, timeValue, timeZone) {
  const [year, month, day] = String(dateOnly || "").split("-").map(Number);
  const [hours, minutes] = String(timeValue || "00:00").split(":").map(Number);
  const desiredUtcEquivalent = Date.UTC(year, month - 1, day, hours, minutes, 0);
  let guess = new Date(desiredUtcEquivalent);

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const actual = getZonedDateTimeParts(guess, timeZone);
    const actualUtcEquivalent = Date.UTC(
      actual.year,
      actual.month - 1,
      actual.day,
      actual.hour,
      actual.minute,
      actual.second,
    );
    const diff = desiredUtcEquivalent - actualUtcEquivalent;
    if (diff === 0) {
      break;
    }
    guess = new Date(guess.getTime() + diff);
  }

  return guess;
}

function getZonedDateTimeParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
