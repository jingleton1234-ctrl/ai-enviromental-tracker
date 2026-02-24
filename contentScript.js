const AI_DOMAIN_PATTERNS = [
  { label: "OpenAI (ChatGPT)", hosts: [/chat\.openai\.com/i, /openai\.com/i] },
  { label: "Anthropic Claude", hosts: [/claude\.ai/i, /anthropic\.com/i] },
  { label: "Google Gemini", hosts: [/gemini\.google\.com/i, /bard\.google\.com/i, /ai\.google/i] },
  { label: "Microsoft Copilot", hosts: [/copilot\.microsoft\.com/i, /bing\.com/i] },
  { label: "Perplexity", hosts: [/perplexity\.ai/i] },
  { label: "Hugging Face", hosts: [/huggingface\.co/i] },
  { label: "Poe", hosts: [/poe\.com/i] },
  { label: "Character.AI", hosts: [/character\.ai/i] },
  { label: "Inflection Pi", hosts: [/pi\.ai/i] },
  { label: "Notion AI", hosts: [/notion\.so/i] },
  { label: "GitHub Copilot", hosts: [/github\.com/i, /copilot\.github\.com/i] }
];

const AI_KEYWORDS = [
  { label: "OpenAI (ChatGPT)", pattern: /ChatGPT|GPT-4|GPT-3\.5|OpenAI/i },
  { label: "Anthropic Claude", pattern: /Claude|Anthropic/i },
  { label: "Google Gemini", pattern: /Gemini|Bard/i },
  { label: "Microsoft Copilot", pattern: /Copilot|Bing AI/i },
  { label: "Perplexity", pattern: /Perplexity/i },
  { label: "Poe", pattern: /Poe AI/i },
  { label: "Character.AI", pattern: /Character\.ai/i },
  { label: "Inflection Pi", pattern: /Inflection|Pi AI/i },
  { label: "Notion AI", pattern: /Notion AI/i },
  { label: "GitHub Copilot", pattern: /GitHub Copilot/i }
];

const TOPIC_RULES = [
  {
    topic: "Programming",
    terms: [
      { phrase: "python", weight: 3.2 }, { phrase: "javascript", weight: 3.2 }, { phrase: "typescript", weight: 3.2 },
      { phrase: "sql", weight: 2.8 }, { phrase: "api", weight: 2.6 }, { phrase: "debug", weight: 2.6 },
      { phrase: "bug", weight: 2.2 }, { phrase: "backend", weight: 2.2 }, { phrase: "frontend", weight: 2.2 },
      { phrase: "function", weight: 1.5 }, { phrase: "code", weight: 1.2 }, { phrase: "coding", weight: 1.2 }
    ]
  },
  {
    topic: "Education",
    terms: [
      { phrase: "homework", weight: 3.1 }, { phrase: "university", weight: 2.9 }, { phrase: "exam", weight: 2.8 },
      { phrase: "teacher", weight: 2.6 }, { phrase: "study", weight: 2.3 }, { phrase: "lesson", weight: 2.3 },
      { phrase: "school", weight: 2.1 }, { phrase: "learn", weight: 1.4 }, { phrase: "curriculum", weight: 2.4 }
    ]
  },
  {
    topic: "Business",
    terms: [
      { phrase: "revenue", weight: 3.0 }, { phrase: "marketing", weight: 2.8 }, { phrase: "kpi", weight: 2.8 },
      { phrase: "sales", weight: 2.6 }, { phrase: "customer", weight: 2.4 }, { phrase: "strategy", weight: 2.3 },
      { phrase: "startup", weight: 2.2 }, { phrase: "meeting", weight: 1.6 }, { phrase: "roadmap", weight: 2.2 }
    ]
  },
  {
    topic: "Health",
    terms: [
      { phrase: "symptom", weight: 3.0 }, { phrase: "doctor", weight: 2.8 }, { phrase: "therapy", weight: 2.8 },
      { phrase: "exercise", weight: 2.5 }, { phrase: "workout", weight: 2.5 }, { phrase: "diet", weight: 2.4 },
      { phrase: "sleep", weight: 2.3 }, { phrase: "health", weight: 1.8 }, { phrase: "nutrition", weight: 2.2 }
    ]
  },
  {
    topic: "Finance",
    terms: [
      { phrase: "budget", weight: 2.8 }, { phrase: "tax", weight: 2.8 }, { phrase: "invest", weight: 2.6 },
      { phrase: "stock", weight: 2.6 }, { phrase: "crypto", weight: 2.4 }, { phrase: "loan", weight: 2.4 },
      { phrase: "interest rate", weight: 3.0 }, { phrase: "savings", weight: 2.2 }, { phrase: "portfolio", weight: 2.4 }
    ]
  },
  {
    topic: "Travel",
    terms: [
      { phrase: "itinerary", weight: 3.1 }, { phrase: "flight", weight: 2.8 }, { phrase: "hotel", weight: 2.7 },
      { phrase: "visa", weight: 2.6 }, { phrase: "destination", weight: 2.4 }, { phrase: "booking", weight: 2.3 },
      { phrase: "trip", weight: 1.8 }, { phrase: "tour", weight: 1.8 }, { phrase: "airport", weight: 2.2 }
    ]
  },
  {
    topic: "Writing",
    terms: [
      { phrase: "essay", weight: 2.8 }, { phrase: "rewrite", weight: 2.7 }, { phrase: "grammar", weight: 2.6 },
      { phrase: "outline", weight: 2.4 }, { phrase: "email", weight: 2.2 }, { phrase: "blog", weight: 2.1 },
      { phrase: "script", weight: 2.0 }, { phrase: "story", weight: 2.0 }, { phrase: "proofread", weight: 2.5 }
    ]
  },
  {
    topic: "Lifestyle",
    terms: [
      { phrase: "recipe", weight: 2.8 }, { phrase: "cooking", weight: 2.6 }, { phrase: "fashion", weight: 2.4 },
      { phrase: "shopping", weight: 2.3 }, { phrase: "hobby", weight: 2.2 }, { phrase: "movie", weight: 2.0 },
      { phrase: "music", weight: 2.0 }, { phrase: "game", weight: 1.8 }, { phrase: "wellness", weight: 2.1 }
    ]
  }
];
const TOPIC_SCORE_MIN_FOR_CONFIDENT_MATCH = 2.2;
const TOPIC_SCORE_TIE_MARGIN = 0.65;

const PROVIDER_LABEL_TO_KEY = {
  "OpenAI (ChatGPT)": "chatgpt",
  "Google Gemini": "gemini",
  "Microsoft Copilot": "copilot",
  "Anthropic Claude": "claude",
  "Perplexity": "perplexity"
};

const MODEL_CONTEXT_SELECTORS = [
  "header",
  "nav",
  "[role='navigation']",
  "[role='banner']",
  "[data-testid*='model']",
  "[data-testid*='mode']",
  "[aria-label*='model' i]",
  "[aria-label*='mode' i]",
  "button",
  "[role='button']"
];
const MODEL_CONTEXT_SLICE_LIMIT = 6000;

const PROVIDER_MODEL_RULES = {
  chatgpt: [
    { model: "Thinking", confidence: 0.95, patterns: [/\bthinking\b/i] },
    { model: "Instant", confidence: 0.95, patterns: [/\binstant\b/i] }
  ],
  gemini: [
    { model: "Pro", confidence: 0.95, patterns: [/\bpro\b/i] },
    { model: "Thinking", confidence: 0.95, patterns: [/\bthinking\b/i] },
    { model: "Fast", confidence: 0.95, patterns: [/\bfast\b/i, /\bflash\b/i] }
  ],
  copilot: [
    { model: "Think Deeper", confidence: 0.95, patterns: [/\bthink\s+deeper\b/i] },
    { model: "Study and Learn", confidence: 0.95, patterns: [/\bstudy\s+and\s+learn\b/i] },
    { model: "Search", confidence: 0.9, patterns: [/\bsearch\b/i] },
    { model: "Smart", confidence: 0.9, patterns: [/\bsmart\b/i] }
  ],
  claude: [
    { model: "Opus", confidence: 0.95, patterns: [/\bopus\b/i] },
    { model: "Sonnet", confidence: 0.95, patterns: [/\bsonnet\b/i] },
    { model: "Haiku", confidence: 0.95, patterns: [/\bhaiku\b/i] }
  ],
  perplexity: [
    { model: "Sonar", confidence: 0.95, patterns: [/\bsonar\b/i] },
    { model: "Model", confidence: 0.7, patterns: [/\bmodel\b/i] }
  ]
};

const BANNER_ID = "ai-detector-banner";
const BANNER_POSITION_KEY = "bannerPosition";
const TEXT_SLICE_LIMIT = 8000;
const AI_OUTPUT_SELECTORS = [
  "[data-testid='conversation-turns']",
  "[data-testid='chat-messages']",
  "[data-qa='chat_history']",
  ".conversation",
  ".chat-history",
  ".markdown",
  "main",
  "[role='main']"
];
const USER_INPUT_SELECTORS = [
  "textarea",
  "input",
  "[contenteditable='true']",
  "[role='textbox']",
  "[data-testid='composer']",
  "[data-testid='chat-input']",
  "[aria-label*='message']",
  ".prompt-editor",
  "form"
];
const IMPACT_CONSTANTS = {
  energyWhPerToken: 0.00083, // 0.00083 Wh/token
  co2gPerToken: 0.00043, // 0.43 mg/token converted to g/token
  waterMlPerToken: 0.01 // 0.01 ml/token
};
let latestDetection = null;
let latestModelDetection = {
  provider: "unknown",
  model: "unknown",
  confidence: 0
};
let latestTokenEstimate = 0;
let mutationObserver = null;
let awaitingResponse = false;
let conversationStarted = false;
let sessionId = null;
let sessionIdPromise = null;
let userId = null;
let userIdPromise = null;
let interactionId = null;
let interactionNumber = null;
let interactionNumberPromise = null;
let interactionCounter = 0;
let lastOutputFingerprint = "";
let latestImpactMetrics = { energyWh: 0, co2g: 0, waterL: 0 };
let extensionEnabled = true;
let detectionScheduled = false;
let resourceObserver = null;
let pendingNetworkResponse = false;
let latestInputTokenEstimate = 0;
let latestDraftInputTokenEstimate = 0;
let latestPromptInputText = "";
let latestImpactPrompt = "";
let latestAiOutputText = "";
const DAILY_TOTALS_KEY = "dailyTotals";
const DAILY_TOKEN_GOAL_KEY = "dailyTokenGoal";
const ALL_TIME_TOKEN_TOTAL_KEY = "allTimeTokenTotal";
const ALL_TIME_TOTALS_KEY = "allTimeTotals";
const CONVERSATION_SESSION_MAP_KEY = "conversationSessionMap";
const PARTICIPANT_ID_KEY = "participantId";
const METRICS_AUTO_UNLOCK_AT_LOCAL_MS = new Date(2026, 1, 20, 14, 17, 0, 0).getTime();
const formatUnlockLabel = (timestampMs) => {
  const date = new Date(timestampMs);
  const datePart = date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  const timePart = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit"
  });
  return `${datePart} at ${timePart}`;
};
const METRICS_UNLOCK_LABEL = formatUnlockLabel(METRICS_AUTO_UNLOCK_AT_LOCAL_MS);
const DAILY_TOTALS_RETENTION_DAYS = 60;
const IMPACT_PROMPT_STATE_KEY = "impactPromptState";
const IMPACT_PROMPT_VERSION = 2;
const IMPACT_PROMPT_CACHE_TTL_MS = 1500;
const INTERACTION_LOG_DEBOUNCE_MS = 1500;
const OUTPUT_SETTLE_GRACE_MS = 4000;
const EQUIVALENT_BOX_HEIGHT_PX = 56;
const QUICK_FOLLOWUP_WINDOW_MS = 30000;
const QUICK_FOLLOWUP_ALERT_THRESHOLD = 2;
const QUICK_FOLLOWUP_ALERT_REPEAT_INTERVAL = 3;
const NEW_CHAT_DAILY_NUDGE_THRESHOLD = 2;
const PROMPT_MARK_DEDUP_WINDOW_MS = 800;
const QUICK_FOLLOWUP_NUDGE_ID = "ai-detector-quick-followup-nudge";
const NEW_CHAT_NUDGE_ID = "ai-detector-new-chat-nudge";
const BANNER_EDGE_PADDING_PX = 8;
const NEW_CHAT_NUDGE_STATE_KEY = "newChatNudgeState";
const THINKING_GUARD_PROVIDERS = new Set(["gemini", "copilot", "claude", "perplexity"]);
const THINKING_STATUS_PATTERNS = [
  /\bthinking\b/i,
  /\bsearching\b/i,
  /\banalyz(?:ing|e)\b/i,
  /\breasoning\b/i,
  /\bgathering\b/i,
  /\bworking on it\b/i,
  /\bthought for\b/i,
  /\blet me think\b/i
];
let impactPromptCache = {
  dayKey: "",
  fetchedAt: 0,
  todayTotals: null,
  state: null
};
let pendingInteractionLogTimers = new Map();
let sentInteractionIds = new Set();
let interactionPromptSubmittedAtById = new Map();
let lastLoggedOutputTokensBySession = new Map();
let lastOutputUpdateAt = 0;
let lastPromptSubmittedAt = 0;
let lastPromptMarkAt = 0;
let quickFollowupCountInSession = 0;
let quickFollowupNextAlertCount = QUICK_FOLLOWUP_ALERT_THRESHOLD + 1;
let quickFollowupNudgeTimer = null;
let newChatNudgeTimer = null;
let bannerPositionInitialized = false;
let environmentalMetricsVisible = false;
let latestQuickFollowupMeta = {
  isQuickFollowup: false,
  deltaMs: null,
  quickFollowupCountInSession: 0
};
let currentConversationSessionKey = null;


const IMPACT_PROMPT_LIBRARY = {
  energyWh: [
    {
      threshold: 0.000001,
      prompts: [
        "1 minute of phone use",
        "a tiny burst of phone activity"
      ]
    },
    {
      threshold: 0.2,
      prompts: [
        "sending a few dozen emails",
        "a short period of smartphone standby"
      ]
    },
    {
      threshold: 0.5,
      prompts: [
        "lighting a single LED for 30 minutes"
      ]
    },
    {
      threshold: 1,
      prompts: [
        "playing music on wireless earbuds for 1–2 hours",
        "powering a wifi wouter for 10 minutes"
      ]
    },
    {
      threshold: 5,
      prompts: [
        "lighting an LED bulb for 1-2 hours",
        "about one full smartphone charge"
      ]
    },
    {
      threshold: 20,
      prompts: [
        "laptop use for 1-2 hours",
        "boiling one cup of water"
      ]
    },
    {
      threshold: 100,
      prompts: [
        "a Wi-Fi router for about a day",
        "watching TV for about 2 hours"
      ]
    },
    {
      threshold: 250,
      prompts: [
        "powering a Wi-Fi router for 2 days",
        "typical single washing-machine cycle"
      ]
    },
    {
      threshold: 500,
      prompts: [
        "running a desktop computer for a day",
        "cooking a meal on an electric hob (single ring, briefly)"
      ]
    },
    {
      threshold: 1000,
      prompts: [
        "using an electric heater for ~1 hour",
        "average daily fridge power consumption"
      ]
    }
  ],


co2g: [
  {
    threshold: 1,
    prompts: [
      "a candle burning for a couple of minutes",
      "a few seconds of breathing"
    ]
  },
  {
    threshold: 5,
    prompts: [
      "a candle burning for 20 minutes",
    ]
  },
  {
    threshold: 50,
    prompts: [
      "streaming video for about an hour",
      "smoking 3–4 cigarettes"
    ]
  },
  {
    threshold: 250,
    prompts: [
      "a short 15-minute car journey",
      "a one-way bus trip across town"
    ]
  },
  {
    threshold: 500,
    prompts: [
      "driving about 3 km by car",
      "a return bus journey across town"
    ]
  },
  {
    threshold: 750,
    prompts: [
      "a cheeseburger's production footprint"
    ]
  },
  {
    threshold: 1000,
    prompts: [
      "driving ~6 km by car",
      "about 4.8 kWh of UK grid electricity"
    ]
  }
],


waterMl: [
    {
      threshold: 0.1,
      prompts: [
        "a few drops of water",
        "less than a quarter teaspoon"
      ]
    },
    {
      threshold: 1,
      prompts: [
        "about a fifth of a teaspoon",
        "a small drop"
      ]
    },
    {
      threshold: 5,
      prompts: [
        "about one teaspoon of water",
      ]
    },
    {
      threshold: 15,
      prompts: [
        "about one tablespoon of water",
        "a small spoonful"
      ]
    },
    {
      threshold: 50,
      prompts: [
        "a shot glass of water",
        "a small espresso cup"
      ]
    },
    {
      threshold: 250,
      prompts: [
        "a standard drinking glass",
        "a small carton of juice"
      ]
    },
    {
      threshold: 500,
      prompts: [
        "a standard water bottle",
        "two large glasses of water"
      ]
    },
    {
      threshold: 1000,
      prompts: [
        "a large 1-litre bottle",
        "about four glasses of water"
      ]
    },
    {
      threshold: 8000,
      prompts: [
        "a single toilet flush",
        "a large bucket of water"
      ]
    },
    {
      threshold: 50000,
      prompts: [
        "a short shower",
        "about 50 washing-up bowls"
      ]
    },
    {
      threshold: 150000,
      prompts: [
        "a full bath",
        "roughly 600 glasses of water"
      ]
    }
  ]
};


const matchesSelectorList = (node, selectors) => {
  if (!node || !selectors || selectors.length === 0) {
    return false;
  }
  return selectors.some((selector) => {
    if (!selector) {
      return false;
    }
    if (typeof node.matches === "function" && node.matches(selector)) {
      return true;
    }
    if (typeof node.closest === "function") {
      const match = node.closest(selector);
      if (match) {
        return true;
      }
    }
    return false;
  });
};

const isUserInputElement = (node) => matchesSelectorList(node, USER_INPUT_SELECTORS);
const USER_INPUT_TEXT_SELECTORS = USER_INPUT_SELECTORS.filter((selector) => selector !== "form");

const createImpactMetrics = (tokenCount = 0) => {
  const safeTokens = Number.isFinite(tokenCount) && tokenCount > 0 ? tokenCount : 0;
  return {
    energyWh: +(safeTokens * IMPACT_CONSTANTS.energyWhPerToken).toFixed(6),
    co2g: +(safeTokens * IMPACT_CONSTANTS.co2gPerToken).toFixed(6),
    waterL: +((safeTokens * IMPACT_CONSTANTS.waterMlPerToken) / 1000).toFixed(6)
  };
};

const resetImpactMetrics = () => {
  latestImpactMetrics = createImpactMetrics(0);
};

const formatImpactValue = (value) => {
  if (!Number.isFinite(value) || value <= 0) {
    return "0";
  }
  if (value >= 10) {
    return value.toFixed(1);
  }
  if (value >= 1) {
    return value.toFixed(2);
  }
  if (value >= 0.01) {
    return value.toFixed(3);
  }
  return value.toFixed(6).replace(/\.?0+$/, "");
};

const formatWaterMl = (valueInLiters) => {
  const mlValue = (Number(valueInLiters) || 0) * 1000;
  return formatImpactValue(mlValue);
};

const pickRandom = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }
  return items[Math.floor(Math.random() * items.length)] || "";
};

const escapeForRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const readInputText = (node) => {
  if (!node) {
    return "";
  }
  if (typeof node.value === "string" && node.value.trim()) {
    return node.value.trim();
  }
  const text = typeof node.textContent === "string" ? node.textContent : "";
  return text.trim();
};

const findNearestInput = (node) => {
  if (!(node instanceof Element)) {
    return null;
  }
  const inputSelector = USER_INPUT_TEXT_SELECTORS.join(",");
  if (matchesSelectorList(node, USER_INPUT_TEXT_SELECTORS)) {
    return node;
  }
  const directMatch = typeof node.closest === "function" ? node.closest(inputSelector) : null;
  if (directMatch) {
    return directMatch;
  }
  const form = typeof node.closest === "function" ? node.closest("form") : null;
  if (form) {
    return form.querySelector(inputSelector);
  }
  return null;
};

const collectInputCandidates = (sourceNode = null) => {
  const candidates = [];
  const seen = new Set();
  const addCandidate = (node) => {
    if (!node || seen.has(node)) {
      return;
    }
    seen.add(node);
    candidates.push(node);
  };

  addCandidate(findNearestInput(sourceNode));
  addCandidate(findNearestInput(document.activeElement));
  document.querySelectorAll(USER_INPUT_TEXT_SELECTORS.join(",")).forEach((node) => {
    addCandidate(node);
  });
  return candidates;
};

const captureInputSnapshot = (sourceNode = null) => {
  const candidates = collectInputCandidates(sourceNode);
  for (const node of candidates) {
    const text = readInputText(node);
    if (text) {
      return { text, tokens: estimateTokensFromText(text) };
    }
  }
  return { text: "", tokens: 0 };
};

const captureInputTokenCount = (sourceNode = null) => {
  return captureInputSnapshot(sourceNode).tokens;
};

const clampBannerPosition = (left, top, width, height) => {
  const maxLeft = Math.max(BANNER_EDGE_PADDING_PX, window.innerWidth - width - BANNER_EDGE_PADDING_PX);
  const maxTop = Math.max(BANNER_EDGE_PADDING_PX, window.innerHeight - height - BANNER_EDGE_PADDING_PX);
  return {
    left: Math.min(Math.max(left, BANNER_EDGE_PADDING_PX), maxLeft),
    top: Math.min(Math.max(top, BANNER_EDGE_PADDING_PX), maxTop)
  };
};

const applyBannerPosition = (banner, left, top) => {
  if (!banner) {
    return;
  }
  const rect = banner.getBoundingClientRect();
  const clamped = clampBannerPosition(
    Number(left) || 0,
    Number(top) || 0,
    rect.width || 0,
    rect.height || 0
  );
  banner.style.left = `${Math.round(clamped.left)}px`;
  banner.style.top = `${Math.round(clamped.top)}px`;
  banner.style.right = "auto";
  banner.style.bottom = "auto";
};

const saveBannerPosition = (banner) => {
  if (!banner || !chrome?.storage?.local) {
    return;
  }
  const rect = banner.getBoundingClientRect();
  try {
    chrome.storage.local.set({
      [BANNER_POSITION_KEY]: {
        left: Math.round(rect.left),
        top: Math.round(rect.top)
      }
    });
  } catch (_error) {
    // Ignore transient context invalidation during extension reload/update.
  }
};

const loadBannerPosition = (banner) => {
  if (!banner || bannerPositionInitialized || !chrome?.storage?.local) {
    return;
  }
  bannerPositionInitialized = true;
  chrome.storage.local.get({ [BANNER_POSITION_KEY]: null }, (data) => {
    const position = data?.[BANNER_POSITION_KEY];
    if (!position || !Number.isFinite(position.left) || !Number.isFinite(position.top)) {
      return;
    }
    applyBannerPosition(banner, position.left, position.top);
  });
};

const enableBannerDragging = (banner) => {
  if (!banner || banner.dataset.dragReady === "true") {
    return;
  }
  banner.dataset.dragReady = "true";
  let dragState = null;

  const stopDrag = () => {
    if (!dragState) {
      return;
    }
    const previousPointerId = dragState.pointerId;
    dragState = null;
    if (Number.isFinite(previousPointerId) && typeof banner.releasePointerCapture === "function") {
      try {
        banner.releasePointerCapture(previousPointerId);
      } catch (_error) {
        // Ignore release errors when pointer capture is already lost.
      }
    }
    saveBannerPosition(banner);
  };

  banner.addEventListener("pointerdown", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !target.closest("[data-banner-drag-handle='true']")) {
      return;
    }
    const rect = banner.getBoundingClientRect();
    applyBannerPosition(banner, rect.left, rect.top);
    dragState = {
      pointerId: event.pointerId,
      startLeft: rect.left,
      startTop: rect.top,
      startX: event.clientX,
      startY: event.clientY
    };
    if (typeof banner.setPointerCapture === "function") {
      try {
        banner.setPointerCapture(event.pointerId);
      } catch (_error) {
        // Ignore capture failures and continue without capture.
      }
    }
    event.preventDefault();
  });

  banner.addEventListener("pointermove", (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) {
      return;
    }
    const nextLeft = dragState.startLeft + (event.clientX - dragState.startX);
    const nextTop = dragState.startTop + (event.clientY - dragState.startY);
    applyBannerPosition(banner, nextLeft, nextTop);
    event.preventDefault();
  });

  banner.addEventListener("pointerup", stopDrag);
  banner.addEventListener("pointercancel", stopDrag);
};

const ensureBanner = () => {
  let banner = document.getElementById(BANNER_ID);
  if (!banner) {
    banner = document.createElement("div");
    banner.id = BANNER_ID;
    banner.style.position = "fixed";
    banner.style.right = "24px";
    banner.style.bottom = "36px";
    banner.style.zIndex = "2147483647";
    banner.style.padding = "16px 18px";
    banner.style.borderRadius = "14px";
    banner.style.background = "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.92))";
    banner.style.border = "1px solid rgba(148, 163, 184, 0.4)";
    banner.style.color = "#e2e8f0";
    banner.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    banner.style.fontSize = "14px";
    banner.style.fontWeight = "500";
    banner.style.lineHeight = "1.45";
    banner.style.display = "flex";
    banner.style.flexDirection = "column";
    banner.style.rowGap = "5px";
    banner.style.boxShadow = "0 12px 30px rgba(15, 23, 42, 0.45)";
    banner.style.pointerEvents = "auto";
    banner.style.backdropFilter = "blur(6px)";
    banner.style.width = "min(300px, calc(100vw - 48px))";
    banner.style.boxSizing = "border-box";
    banner.style.whiteSpace = "pre-line";
    document.documentElement.appendChild(banner);
    enableBannerDragging(banner);
    loadBannerPosition(banner);
    window.addEventListener("resize", () => {
      const liveBanner = document.getElementById(BANNER_ID);
      if (!liveBanner) {
        return;
      }
      const rect = liveBanner.getBoundingClientRect();
      if (!Number.isFinite(rect.left) || !Number.isFinite(rect.top)) {
        return;
      }
      applyBannerPosition(liveBanner, rect.left, rect.top);
      saveBannerPosition(liveBanner);
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey && isUserInputElement(event.target)) {
        const draftTokens = captureInputTokenCount(event.target);
        latestDraftInputTokenEstimate = draftTokens;
        latestInputTokenEstimate = draftTokens;
      }
    }, true);
  }
  return banner;
};

const showBanner = () => {
  const banner = ensureBanner();
  banner.style.display = "flex";
};

const hideBanner = () => {
  const banner = document.getElementById(BANNER_ID);
  if (banner) {
    banner.style.display = "none";
  }
};

const ensureQuickFollowupNudge = () => {
  let nudge = document.getElementById(QUICK_FOLLOWUP_NUDGE_ID);
  if (!nudge) {
    nudge = document.createElement("div");
    nudge.id = QUICK_FOLLOWUP_NUDGE_ID;
    nudge.style.position = "fixed";
    nudge.style.right = "24px";
    nudge.style.top = "50%";
    nudge.style.zIndex = "2147483647";
    nudge.style.padding = "10px 12px";
    nudge.style.borderRadius = "10px";
    nudge.style.background = "rgba(15, 23, 42, 0.95)";
    nudge.style.border = "1px solid rgba(148, 163, 184, 0.45)";
    nudge.style.color = "#e2e8f0";
    nudge.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    nudge.style.fontSize = "12px";
    nudge.style.lineHeight = "1.35";
    nudge.style.maxWidth = "280px";
    nudge.style.pointerEvents = "none";
    nudge.style.boxShadow = "0 10px 24px rgba(15, 23, 42, 0.45)";
    nudge.style.opacity = "0";
    nudge.style.transform = "translateY(-50%) translateX(120%)";
    nudge.style.transition = "opacity 180ms ease, transform 220ms ease";
    nudge.textContent = "Try to reduce quick follow-up prompts. This will help limit resource consumption.";
    document.documentElement.appendChild(nudge);
  }
  return nudge;
};

const hideQuickFollowupNudge = () => {
  const nudge = document.getElementById(QUICK_FOLLOWUP_NUDGE_ID);
  if (nudge) {
    nudge.style.opacity = "0";
    nudge.style.transform = "translateY(-50%) translateX(120%)";
  }
  if (quickFollowupNudgeTimer) {
    clearTimeout(quickFollowupNudgeTimer);
    quickFollowupNudgeTimer = null;
  }
};

const showQuickFollowupNudge = () => {
  const nudge = ensureQuickFollowupNudge();
  nudge.style.opacity = "1";
  nudge.style.transform = "translateY(-50%) translateX(0)";
  if (quickFollowupNudgeTimer) {
    clearTimeout(quickFollowupNudgeTimer);
  }
  quickFollowupNudgeTimer = setTimeout(() => {
    nudge.style.opacity = "0";
    nudge.style.transform = "translateY(-50%) translateX(120%)";
    quickFollowupNudgeTimer = null;
  }, 6500);
};

const ensureNewChatNudge = () => {
  let nudge = document.getElementById(NEW_CHAT_NUDGE_ID);
  if (!nudge) {
    nudge = document.createElement("div");
    nudge.id = NEW_CHAT_NUDGE_ID;
    nudge.style.position = "fixed";
    nudge.style.right = "24px";
    nudge.style.top = "calc(50% + 86px)";
    nudge.style.zIndex = "2147483647";
    nudge.style.padding = "10px 12px";
    nudge.style.borderRadius = "10px";
    nudge.style.background = "rgba(15, 23, 42, 0.95)";
    nudge.style.border = "1px solid rgba(148, 163, 184, 0.45)";
    nudge.style.color = "#e2e8f0";
    nudge.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    nudge.style.fontSize = "12px";
    nudge.style.lineHeight = "1.35";
    nudge.style.maxWidth = "320px";
    nudge.style.pointerEvents = "none";
    nudge.style.boxShadow = "0 10px 24px rgba(15, 23, 42, 0.45)";
    nudge.style.opacity = "0";
    nudge.style.transform = "translateY(-50%) translateX(120%)";
    nudge.style.transition = "opacity 180ms ease, transform 220ms ease";
    nudge.textContent = "Continuing the previous conversation may reduce repetition and token usage.";
    document.documentElement.appendChild(nudge);
  }
  return nudge;
};

const hideNewChatNudge = () => {
  const nudge = document.getElementById(NEW_CHAT_NUDGE_ID);
  if (nudge) {
    nudge.style.opacity = "0";
    nudge.style.transform = "translateY(-50%) translateX(120%)";
  }
  if (newChatNudgeTimer) {
    clearTimeout(newChatNudgeTimer);
    newChatNudgeTimer = null;
  }
};

const showNewChatNudge = () => {
  const nudge = ensureNewChatNudge();
  nudge.style.opacity = "1";
  nudge.style.transform = "translateY(-50%) translateX(0)";
  if (newChatNudgeTimer) {
    clearTimeout(newChatNudgeTimer);
  }
  newChatNudgeTimer = setTimeout(() => {
    nudge.style.opacity = "0";
    nudge.style.transform = "translateY(-50%) translateX(120%)";
    newChatNudgeTimer = null;
  }, 6500);
};

const trackNewChatStartAndMaybeNudge = () => {
  const todayKey = getIsoLocalDate();
  if (!chrome?.storage?.local) {
    return;
  }
  chrome.storage.local.get({ [NEW_CHAT_NUDGE_STATE_KEY]: { dayKey: todayKey, count: 0 } }, (data) => {
    const stateRaw = data?.[NEW_CHAT_NUDGE_STATE_KEY];
    const priorCount = stateRaw && stateRaw.dayKey === todayKey ? Number(stateRaw.count) || 0 : 0;
    const nextCount = priorCount + 1;
    chrome.storage.local.set({ [NEW_CHAT_NUDGE_STATE_KEY]: { dayKey: todayKey, count: nextCount } }, () => {
      if (nextCount > NEW_CHAT_DAILY_NUDGE_THRESHOLD) {
        showNewChatNudge();
      }
    });
  });
};

const isMetricsAutoUnlocked = (date = new Date()) => date.getTime() >= METRICS_AUTO_UNLOCK_AT_LOCAL_MS;

const refreshEnvironmentalMetricsVisibility = () => {
  environmentalMetricsVisible = isMetricsAutoUnlocked();
  return environmentalMetricsVisible;
};

const renderBannerText = (label, tokenCount, impactMetrics, promptText = "", modelDetection = null) => {
  showBanner();
  const banner = ensureBanner();
  const detectedLabel = label ? `AI detected: ${label}` : "AI detected: None";
  const tokenLabel = `Tokens: ${tokenCount ?? 0}`;
  const metrics = impactMetrics || createImpactMetrics(tokenCount);
  const showEnvironmentalMetrics = refreshEnvironmentalMetricsVisibility();
  const metricItems = [];
  if (showEnvironmentalMetrics) {
    metricItems.push(tokenLabel);
    metricItems.push(
      `Electricity consumed: ${formatImpactValue(metrics.energyWh)} Wh`,
      `CO2 produced: ${formatImpactValue(metrics.co2g)} g`,
      `Water consumed: ${formatWaterMl(metrics.waterL)} ml`
    );
  } else {
    metricItems.push(`Environmental metrics are hidden until ${METRICS_UNLOCK_LABEL}.`);
  }

  banner.replaceChildren();

  const dragHandle = document.createElement("div");
  dragHandle.dataset.bannerDragHandle = "true";
  dragHandle.textContent = "Drag to move";
  dragHandle.style.marginBottom = "4px";
  dragHandle.style.paddingBottom = "4px";
  dragHandle.style.borderBottom = "1px dashed rgba(148, 163, 184, 0.35)";
  dragHandle.style.fontSize = "11px";
  dragHandle.style.letterSpacing = "0.03em";
  dragHandle.style.textTransform = "uppercase";
  dragHandle.style.color = "#cbd5e1";
  dragHandle.style.cursor = "grab";
  dragHandle.style.userSelect = "none";
  banner.appendChild(dragHandle);

  const detectedEl = document.createElement("div");
  detectedEl.textContent = detectedLabel;
  detectedEl.style.marginBottom = "6px";
  banner.appendChild(detectedEl);

  const metricsGroup = document.createElement("div");
  metricsGroup.style.display = "flex";
  metricsGroup.style.flexDirection = "column";
  metricsGroup.style.rowGap = "2px";
  banner.appendChild(metricsGroup);

  metricItems.forEach((line) => {
    const lineEl = document.createElement("div");
    lineEl.textContent = line;
    metricsGroup.appendChild(lineEl);
  });

  if (showEnvironmentalMetrics && promptText) {
    const equivalentBox = document.createElement("div");
    equivalentBox.textContent = `Equivalent: ${promptText}`;
    equivalentBox.style.marginTop = "8px";
    equivalentBox.style.padding = "7px 9px";
    equivalentBox.style.borderRadius = "9px";
    equivalentBox.style.background = "rgba(15, 23, 42, 0.45)";
    equivalentBox.style.border = "1px solid rgba(148, 163, 184, 0.35)";
    equivalentBox.style.minHeight = `${EQUIVALENT_BOX_HEIGHT_PX}px`;
    equivalentBox.style.maxHeight = `${EQUIVALENT_BOX_HEIGHT_PX}px`;
    equivalentBox.style.overflow = "hidden";
    equivalentBox.style.boxSizing = "border-box";
    banner.appendChild(equivalentBox);
  }

  banner.dataset.detected = label ? "true" : "false";
};

const resolveImpactPrompt = (impactMetrics, callback) => {
  if (!chrome?.storage?.local) {
    callback(latestImpactPrompt);
    return;
  }

  const todayKey = getIsoLocalDate();
  const fallbackState = {
    version: IMPACT_PROMPT_VERSION,
    dayKey: todayKey,
    energyWh: 0,
    co2g: 0,
    waterL: 0,
    lastPrompt: ""
  };

  const now = Date.now();
  const useCachedContext = impactPromptCache.dayKey === todayKey
    && impactPromptCache.todayTotals
    && impactPromptCache.state
    && now - impactPromptCache.fetchedAt < IMPACT_PROMPT_CACHE_TTL_MS;

  const continueWithContext = (todayTotals, state) => {
    impactPromptCache = {
      dayKey: todayKey,
      fetchedAt: Date.now(),
      todayTotals,
      state
    };

    const metricValues = {
      energyWh: Number(impactMetrics?.energyWh) || 0,
      co2g: Number(impactMetrics?.co2g) || 0,
      waterMl: (Number(impactMetrics?.waterL) || 0) * 1000
    };

    const nextState = { ...state };
    const matchedMilestones = [];

    Object.entries(IMPACT_PROMPT_LIBRARY).forEach(([metricName, milestones]) => {
      const metricValue = Number(metricValues[metricName]) || 0;
      let bestMatch = null;
      milestones.forEach((entry) => {
        if (metricValue >= entry.threshold) {
          if (!bestMatch || entry.threshold > bestMatch.threshold) {
            bestMatch = entry;
          }
        }
      });
      if (bestMatch) {
        matchedMilestones.push({ metricName, entry: bestMatch });
      }
    });

    if (matchedMilestones.length > 0) {
      matchedMilestones.forEach(({ metricName, entry }) => {
        nextState[metricName] = entry.threshold;
      });
      const candidatePrompts = matchedMilestones.flatMap(({ entry }) => entry.prompts || []);
      const selected = pickRandom(candidatePrompts);
      if (selected) {
        nextState.lastPrompt = selected;
        latestImpactPrompt = selected;
        impactPromptCache = {
          dayKey: todayKey,
          fetchedAt: Date.now(),
          todayTotals,
          state: nextState
        };
        chrome.storage.local.set({ [IMPACT_PROMPT_STATE_KEY]: nextState }, () => callback(selected));
        return;
      }
    }

    latestImpactPrompt = "";
    callback("");
  };

  if (useCachedContext) {
    continueWithContext(impactPromptCache.todayTotals, impactPromptCache.state);
    return;
  }

  chrome.storage.local.get({ [DAILY_TOTALS_KEY]: {}, [IMPACT_PROMPT_STATE_KEY]: fallbackState }, (data) => {
    const totals = data?.[DAILY_TOTALS_KEY] && typeof data[DAILY_TOTALS_KEY] === "object"
      ? data[DAILY_TOTALS_KEY]
      : {};
    const todayTotals = totals?.[todayKey] && typeof totals[todayKey] === "object" ? totals[todayKey] : {};
    const storedStateRaw = data?.[IMPACT_PROMPT_STATE_KEY] && typeof data[IMPACT_PROMPT_STATE_KEY] === "object"
      ? data[IMPACT_PROMPT_STATE_KEY]
      : fallbackState;
    const state = storedStateRaw.dayKey === todayKey && Number(storedStateRaw.version) === IMPACT_PROMPT_VERSION
      ? {
          version: IMPACT_PROMPT_VERSION,
          dayKey: todayKey,
          energyWh: Number(storedStateRaw.energyWh) || 0,
          co2g: Number(storedStateRaw.co2g) || 0,
          waterL: Number(storedStateRaw.waterL) || 0,
          lastPrompt: typeof storedStateRaw.lastPrompt === "string" ? storedStateRaw.lastPrompt : ""
        }
      : { ...fallbackState };
    continueWithContext(todayTotals, state);
  });
};

const updateBanner = (label, tokenCount, impactMetrics) => {
  const metrics = impactMetrics || createImpactMetrics(tokenCount);
  const detectedLabel = label ? `AI detected: ${label}` : "AI detected: None";
  const tokenLabel = `Tokens: ${tokenCount ?? 0}`;
  const modelDetection = latestModelDetection;

  renderBannerText(label, tokenCount, metrics, latestImpactPrompt, modelDetection);
  resolveImpactPrompt(metrics, (promptText) => {
    if (label !== latestDetection) {
      return;
    }
    latestImpactPrompt = promptText || "";
    renderBannerText(label, tokenCount, metrics, latestImpactPrompt, modelDetection);
  });

  if (label && sessionId && interactionId) {
    const promptSubmission = interactionPromptSubmittedAtById.get(interactionId) || null;
    scheduleInteractionLog({
      metrics: metrics,
      tokenCount: tokenCount,
      inputTokenCount: latestInputTokenEstimate,
      userText: latestPromptInputText,
      aiOutputText: latestAiOutputText,
      tokenLabel: tokenLabel,
      detectedLabel: detectedLabel,
      modelProvider: modelDetection?.provider || "unknown",
      modelName: modelDetection?.model || "unknown",
      quickFollowupWithin30s: !!latestQuickFollowupMeta?.isQuickFollowup,
      sessionId: sessionId,
      interactionId: interactionId,
      promptSubmittedAt: promptSubmission?.iso || null
    });
  }
};

const getOrCreateUserId = () => {
  if (userId) {
    return Promise.resolve(userId);
  }
  if (userIdPromise) {
    return userIdPromise;
  }

  userIdPromise = new Promise((resolve) => {
    if (!chrome?.storage?.local) {
      resolve(null);
      return;
    }

    chrome.storage.local.get({ [PARTICIPANT_ID_KEY]: "" }, (data) => {
      if (chrome.runtime?.lastError) {
        resolve(null);
        return;
      }
      const participantId = String(data?.[PARTICIPANT_ID_KEY] ?? "").trim();
      if (participantId) {
        userId = participantId;
        resolve(userId);
        return;
      }
      resolve(null);
    });
  }).finally(() => {
    userIdPromise = null;
  });

  return userIdPromise;
};

const getIsoLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toDailyGoalValue = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric) : null;
};

const getDailyTokenGoalForLogging = () => {
  if (!chrome?.storage?.local) {
    return Promise.resolve("not set");
  }
  return new Promise((resolve) => {
    chrome.storage.local.get({ [DAILY_TOKEN_GOAL_KEY]: null }, (data) => {
      if (chrome.runtime?.lastError) {
        resolve("not set");
        return;
      }
      const goalValue = toDailyGoalValue(data?.[DAILY_TOKEN_GOAL_KEY]);
      resolve(goalValue === null ? "not set" : goalValue);
    });
  });
};

const pruneOldDailyTotals = (dailyTotals) => {
  const totals = dailyTotals && typeof dailyTotals === "object" ? { ...dailyTotals } : {};
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (DAILY_TOTALS_RETENTION_DAYS - 1));

  Object.keys(totals).forEach((dateKey) => {
    const dateValue = new Date(`${dateKey}T00:00:00`);
    if (!Number.isFinite(dateValue.getTime()) || dateValue < cutoff) {
      delete totals[dateKey];
    }
  });
  return totals;
};

const addUsageToDailyTotals = (usage) => {
  if (!chrome?.storage?.local) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    chrome.storage.local.get(
      {
        [DAILY_TOTALS_KEY]: {},
        [ALL_TIME_TOKEN_TOTAL_KEY]: 0,
        [ALL_TIME_TOTALS_KEY]: { tokensTotal: 0, tokensOutTotal: 0, energyWh: 0, co2g: 0, waterL: 0 }
      },
      (data) => {
        if (chrome.runtime?.lastError) {
          resolve();
          return;
        }

      const dateKey = getIsoLocalDate();
      const currentTotals = data?.[DAILY_TOTALS_KEY] && typeof data[DAILY_TOTALS_KEY] === "object"
        ? { ...data[DAILY_TOTALS_KEY] }
        : {};
      const todayTotals = currentTotals[dateKey] || {
        tokensIn: 0,
        tokensOut: 0,
        tokensTotal: 0,
        wh: 0,
        co2_g: 0,
        water_L: 0,
        interactions: 0,
        modelCounts: {}
      };

      const existingModelCounts = todayTotals?.modelCounts && typeof todayTotals.modelCounts === "object"
        ? { ...todayTotals.modelCounts }
        : {};
      const modelLabelRaw = typeof usage?.modelName === "string" ? usage.modelName.trim() : "";
      const modelLabel = modelLabelRaw || "Unknown";
      existingModelCounts[modelLabel] = (Number(existingModelCounts[modelLabel]) || 0)
        + ((Number(usage?.interactions) || 0) > 0 ? (Number(usage?.interactions) || 0) : 0);

      const nextTotals = {
        tokensIn: +(todayTotals.tokensIn + (Number(usage?.tokensIn) || 0)).toFixed(6),
        tokensOut: +(todayTotals.tokensOut + (Number(usage?.tokensOut) || 0)).toFixed(6),
        tokensTotal: +(todayTotals.tokensTotal + (Number(usage?.tokensTotal) || 0)).toFixed(6),
        wh: +(todayTotals.wh + (Number(usage?.wh) || 0)).toFixed(6),
        co2_g: +(todayTotals.co2_g + (Number(usage?.co2_g) || 0)).toFixed(6),
        water_L: +(todayTotals.water_L + (Number(usage?.water_L) || 0)).toFixed(6),
        interactions: (Number(todayTotals.interactions) || 0) + (Number(usage?.interactions) || 0),
        modelCounts: existingModelCounts
      };

      currentTotals[dateKey] = nextTotals;
      const prunedTotals = pruneOldDailyTotals(currentTotals);
      const nextAllTimeTokens = +(
        (Number(data?.[ALL_TIME_TOKEN_TOTAL_KEY]) || 0)
        + (Number(usage?.tokensOut) || 0)
      ).toFixed(6);
      const allTimeTotals = data?.[ALL_TIME_TOTALS_KEY] && typeof data[ALL_TIME_TOTALS_KEY] === "object"
        ? data[ALL_TIME_TOTALS_KEY]
        : {};
      const nextAllTimeTotals = {
        tokensTotal: +(Number(allTimeTotals?.tokensTotal || 0) + (Number(usage?.tokensTotal) || 0)).toFixed(6),
        tokensOutTotal: +(Number(allTimeTotals?.tokensOutTotal || 0) + (Number(usage?.tokensOut) || 0)).toFixed(6),
        energyWh: +(Number(allTimeTotals?.energyWh || 0) + (Number(usage?.wh) || 0)).toFixed(6),
        co2g: +(Number(allTimeTotals?.co2g || 0) + (Number(usage?.co2_g) || 0)).toFixed(6),
        waterL: +(Number(allTimeTotals?.waterL || 0) + (Number(usage?.water_L) || 0)).toFixed(6)
      };

        // Update daily totals at the same moment we record/send an interaction.
        chrome.storage.local.set(
          {
            [DAILY_TOTALS_KEY]: prunedTotals,
            [ALL_TIME_TOKEN_TOTAL_KEY]: nextAllTimeTokens,
            [ALL_TIME_TOTALS_KEY]: nextAllTimeTotals
          },
          () => resolve()
        );
      }
    );
  });
};

const logSessionData = async (data) => {
  const resolvedUserIdRaw = await getOrCreateUserId();
  const resolvedUserId = resolvedUserIdRaw || "anonymous";
  const dailyTokenGoal = await getDailyTokenGoalForLogging();
  const resolvedSessionId = sessionIdPromise
    ? await sessionIdPromise
    : (sessionId || createSessionUuid());
  sessionId = resolvedSessionId;
  const resolvedInteractionNumber = interactionNumberPromise
    ? await interactionNumberPromise
    : interactionNumber;
  const inputTokens = Number.isFinite(data?.inputTokenCount)
    ? Number(data.inputTokenCount)
    : 0;
  const outputTokens = Number(data?.tokenCount) || 0;
  const previousOutputTokens = Number(lastLoggedOutputTokensBySession.get(resolvedSessionId)) || 0;
  lastLoggedOutputTokensBySession.set(resolvedSessionId, outputTokens);
  const tokenRatioOutIn = inputTokens > 0 ? +(outputTokens / inputTokens).toFixed(6) : null;
  const promptTopicAnalysis = detectTopicFromText(data?.userText || latestPromptInputText || "");
  const responseTopicAnalysis = detectTopicFromText(data?.aiOutputText || latestAiOutputText || "");
  const combinedTopicAnalysis = detectCombinedTopic(promptTopicAnalysis, responseTopicAnalysis);
  const energyWh = Number(data?.metrics?.energyWh) || 0;
  const co2g = Number(data?.metrics?.co2g) || 0;
  const waterMl = +((Number(data?.metrics?.waterL) || 0) * 1000).toFixed(6);
  const modelProvider = data?.modelProvider || latestModelDetection?.provider || "unknown";
  const modelName = data?.modelName || latestModelDetection?.model || "unknown";
  const promptSubmittedAtIso = typeof data?.promptSubmittedAt === "string" && data.promptSubmittedAt.trim()
    ? data.promptSubmittedAt.trim()
    : null;
  const nowMs = Date.now();
  const sentAtIso = new Date(nowMs).toISOString();
  const promptSubmittedAtMs = promptSubmittedAtIso ? Date.parse(promptSubmittedAtIso) : NaN;
  const thinkingTimeSec = Number.isFinite(promptSubmittedAtMs)
    ? +Math.max(0, (nowMs - promptSubmittedAtMs) / 1000).toFixed(3)
    : null;
  const {
    userText: _ignoredUserText,
    aiOutputText: _ignoredAiOutputText,
    modelConfidence: _ignoredModelConfidence,
    model_confidence: _ignoredModelConfidenceSnake,
    modelDetectionConfidence: _ignoredModelDetectionConfidence,
    confidence: _ignoredRawConfidence,
    ...safeData
  } = data || {};
  const payload = {
    ...safeData,
    metrics: {
      energyWh: energyWh,
      co2g: co2g,
      waterMl: waterMl
    },
    userId: resolvedUserId,
    sessionId: data?.sessionId || resolvedSessionId,
    interactionId: data?.interactionId || interactionId,
    interactionNumber: resolvedInteractionNumber,
    timestamp: sentAtIso,
    sentAt: sentAtIso,
    promptSubmittedAt: promptSubmittedAtIso,
    thinkingTimeSec: thinkingTimeSec,
    tokenCountIn: inputTokens,
    tokenCountOut: outputTokens,
    tokenRatioOutIn: tokenRatioOutIn,
    tokensIn: inputTokens,
    tokensOut: outputTokens,
    dailyTokenGoal: dailyTokenGoal,
    water_ml: waterMl,
    water_L: waterMl,
    topic: combinedTopicAnalysis.topic,
    topicScore: combinedTopicAnalysis.score,
    modelProvider: modelProvider,
    modelName: modelName
  };
  addUsageToDailyTotals({
    tokensIn: inputTokens,
    tokensOut: outputTokens,
    tokensTotal: outputTokens + inputTokens,
    wh: Number(data?.metrics?.energyWh) || 0,
    co2_g: Number(data?.metrics?.co2g) || 0,
    water_L: Number(data?.metrics?.waterL) || 0,
    modelName: modelName,
    interactions: 1
  });
  try {
    chrome.runtime.sendMessage(
      {
        type: "ai-detector:log",
        payload
      },
      (response) => {
        if (chrome.runtime?.lastError) {
          console.error("Error logging session data:", chrome.runtime.lastError.message);
          return;
        }
        if (!response?.ok) {
          console.error("Error logging session data:", response?.error || "Unknown error");
        }
      }
    );
  } catch (error) {
    console.error("Error logging session data:", String(error));
  }
};

const scheduleInteractionLog = (data) => {
  const interactionKey = data?.interactionId;
  if (!interactionKey || sentInteractionIds.has(interactionKey)) {
    return;
  }

  const queueLogAttempt = () => {
    const timer = setTimeout(() => {
      pendingInteractionLogTimers.delete(interactionKey);
      if (sentInteractionIds.has(interactionKey)) {
        return;
      }

      const recentlyUpdated = lastOutputUpdateAt > 0
        && Date.now() - lastOutputUpdateAt < OUTPUT_SETTLE_GRACE_MS;
      const provider = data?.modelProvider || latestModelDetection?.provider || "unknown";
      const stillThinking = isLikelyThinkingStatusText(provider, data?.aiOutputText || latestAiOutputText || "");

      if (recentlyUpdated || pendingNetworkResponse || awaitingResponse || stillThinking) {
        queueLogAttempt();
        return;
      }

      sentInteractionIds.add(interactionKey);
      if (sentInteractionIds.size > 1000) {
        const first = sentInteractionIds.values().next();
        if (!first.done) {
          sentInteractionIds.delete(first.value);
        }
      }
      logSessionData(data);
      interactionPromptSubmittedAtById.delete(interactionKey);
    }, INTERACTION_LOG_DEBOUNCE_MS);

    pendingInteractionLogTimers.set(interactionKey, timer);
  };

  const previousTimer = pendingInteractionLogTimers.get(interactionKey);
  if (previousTimer) {
    clearTimeout(previousTimer);
  }
  queueLogAttempt();
};

const resetConversationState = () => {
  awaitingResponse = false;
  conversationStarted = false;
  lastOutputFingerprint = "";
  lastOutputUpdateAt = 0;
  latestTokenEstimate = 0;
  latestInputTokenEstimate = 0;
  latestDraftInputTokenEstimate = 0;
  latestPromptInputText = "";
  latestAiOutputText = "";
  resetImpactMetrics();
  latestDetection = null;
  latestModelDetection = { provider: "unknown", model: "unknown", confidence: 0 };
  pendingNetworkResponse = false;
  lastPromptSubmittedAt = 0;
  lastPromptMarkAt = 0;
  quickFollowupCountInSession = 0;
  quickFollowupNextAlertCount = QUICK_FOLLOWUP_ALERT_THRESHOLD + 1;
  lastLoggedOutputTokensBySession.clear();
  interactionPromptSubmittedAtById.clear();
  latestQuickFollowupMeta = {
    isQuickFollowup: false,
    deltaMs: null,
    quickFollowupCountInSession: 0
  };
  hideQuickFollowupNudge();
  hideNewChatNudge();
};

const applyEnabledState = (enabled) => {
  const nextState = enabled !== false;
  extensionEnabled = nextState;
  if (!extensionEnabled) {
    resetConversationState();
    hideBanner();
  } else {
    showBanner();
    queueDetection();
  }
};

const loadInitialEnabledState = () => {
  if (!chrome?.storage?.local) {
    applyEnabledState(true);
    return;
  }
  chrome.storage.local.get({ aiDetectorEnabled: true }, (data) => {
    applyEnabledState(data.aiDetectorEnabled !== false);
  });
};

const loadInitialMetricsVisibilityState = () => {
  refreshEnvironmentalMetricsVisibility();
  queueDetection();
};

const registerStorageListeners = () => {
  if (!chrome?.storage?.onChanged) {
    return;
  }
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") {
      return;
    }
    if (Object.prototype.hasOwnProperty.call(changes, "aiDetectorEnabled")) {
      applyEnabledState(changes.aiDetectorEnabled.newValue !== false);
    }
    if (Object.prototype.hasOwnProperty.call(changes, PARTICIPANT_ID_KEY)) {
      const nextParticipantId = String(changes[PARTICIPANT_ID_KEY].newValue ?? "").trim();
      userId = nextParticipantId || null;
      userIdPromise = null;
    }
  });
};

const findByDomain = () => {
  const host = (location.hostname || "").toLowerCase();
  const url = (location.href || "").toLowerCase();
  for (const entry of AI_DOMAIN_PATTERNS) {
    if (entry.hosts.some((regex) => regex.test(host) || regex.test(url))) {
      return entry.label;
    }
  }
  return null;
};

const findByKeywords = () => {
  const body = document.body;
  if (!body) return null;
  const sample = (body.innerText || "").slice(0, TEXT_SLICE_LIMIT);
  for (const entry of AI_KEYWORDS) {
    if (entry.pattern.test(sample)) {
      return entry.label;
    }
  }
  return null;
};

const isSkippableNode = (node) => isUserInputElement(node);

const extractNodeText = (node) => {
  if (!node) {
    return "";
  }
  if ("value" in node && typeof node.value === "string" && node.value.trim()) {
    return node.value;
  }
  if (typeof node.innerText === "string") {
    return node.innerText;
  }
  return "";
};

const collectModelContextText = () => {
  if (!document.body) {
    return "";
  }

  const samples = [];
  const seen = new Set();
  const appendSample = (value) => {
    const text = typeof value === "string" ? value.trim() : "";
    if (!text || seen.has(text)) {
      return;
    }
    seen.add(text);
    samples.push(text);
  };

  MODEL_CONTEXT_SELECTORS.forEach((selector) => {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach((node, index) => {
      if (index >= 8) {
        return;
      }
      appendSample(node.innerText || "");
      if (typeof node.getAttribute === "function") {
        appendSample(node.getAttribute("aria-label") || "");
        appendSample(node.getAttribute("title") || "");
        appendSample(node.getAttribute("data-testid") || "");
      }
    });
  });

  const scopedText = samples.join(" ").slice(0, MODEL_CONTEXT_SLICE_LIMIT);
  if (scopedText.trim()) {
    return scopedText;
  }

  return (document.body.innerText || "").slice(0, TEXT_SLICE_LIMIT);
};

const detectModelFromPage = (providerLabel) => {
  const provider = PROVIDER_LABEL_TO_KEY[providerLabel] || "unknown";
  if (provider === "unknown") {
    return { provider, model: "unknown", confidence: 0 };
  }

  const rules = PROVIDER_MODEL_RULES[provider] || [];
  const contextText = collectModelContextText();
  let bestMatch = null;

  rules.forEach((rule) => {
    const patterns = Array.isArray(rule.patterns) ? rule.patterns : [];
    patterns.forEach((pattern) => {
      if (pattern.test(contextText)) {
        if (!bestMatch || (Number(rule.confidence) || 0) > (Number(bestMatch.confidence) || 0)) {
          bestMatch = {
            provider,
            model: rule.model || "unknown",
            confidence: Number(rule.confidence) || 0
          };
        }
      }
    });
  });

  if (bestMatch) {
    return bestMatch;
  }

  // ChatGPT "Auto" is often implicit and not shown as a visible label.
  if (provider === "chatgpt") {
    return { provider, model: "Auto", confidence: 0.35 };
  }

  return { provider, model: "unknown", confidence: 0 };
};

const getDocumentTextWithoutInputs = () => {
  if (!document.body) {
    return "";
  }
  let text = document.body.innerText || "";
  if (!text.trim()) {
    return text;
  }

  const skipNodes = document.querySelectorAll(USER_INPUT_SELECTORS.join(","));
  skipNodes.forEach((node) => {
    const snippet = extractNodeText(node).trim();
    if (!snippet || snippet.length > 500) {
      return;
    }
    const pattern = new RegExp(escapeForRegex(snippet), "g");
    text = text.replace(pattern, " ");
  });

  return text;
};

const collectAiOutputText = () => {
  if (!document.body) {
    return "";
  }

  for (const selector of AI_OUTPUT_SELECTORS) {
    const nodes = document.querySelectorAll(selector);
    if (nodes.length) {
      let text = "";
      nodes.forEach((node) => {
        if (!node || isSkippableNode(node)) {
          return;
        }
        const snippet = extractNodeText(node);
        if (snippet) {
          text += `\n${snippet}`;
        }
      });
      if (text.trim()) {
        return text;
      }
    }
  }

  return getDocumentTextWithoutInputs();
};

const normalizeText = (text) => (text || "").replace(/\s+/g, " ").trim();

const extractTailSlice = (text, maxChars = 500) => {
  const normalized = normalizeText(text);
  if (!normalized) {
    return "";
  }
  return normalized.slice(Math.max(0, normalized.length - maxChars));
};

const isLikelyThinkingStatusText = (provider, rawOutputText) => {
  if (!THINKING_GUARD_PROVIDERS.has(provider)) {
    return false;
  }
  const tail = extractTailSlice(rawOutputText, 500);
  if (!tail) {
    return false;
  }
  const tailWordCount = tail.split(" ").filter(Boolean).length;
  if (tailWordCount > 80) {
    return false;
  }
  return THINKING_STATUS_PATTERNS.some((pattern) => pattern.test(tail));
};

const estimateTokensFromText = (text) => {
  if (!text) {
    return 0;
  }
  const sanitized = text.replace(/\s+/g, " ").trim();
  if (!sanitized) {
    return 0;
  }
  const charBased = Math.round(sanitized.length / 4);
  const wordBased = sanitized.split(" ").filter(Boolean).length;
  return Math.max(charBased, wordBased);
};

const buildTopicRegex = (phrase) => {
  const escaped = escapeForRegex(phrase.trim()).replace(/\s+/g, "\\s+");
  return new RegExp(`\\b${escaped}\\b`, "gi");
};

const countRegexMatches = (text, pattern) => {
  if (!text || !pattern) {
    return 0;
  }
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
};

const stemTopicToken = (token) => {
  const word = String(token || "").toLowerCase();
  if (!word) {
    return "";
  }
  if (word.length > 5 && word.endsWith("ies")) {
    return `${word.slice(0, -3)}y`;
  }
  if (word.length > 5 && word.endsWith("ing")) {
    return word.slice(0, -3);
  }
  if (word.length > 4 && word.endsWith("ed")) {
    return word.slice(0, -2);
  }
  if (word.length > 4 && word.endsWith("es")) {
    return word.slice(0, -2);
  }
  if (word.length > 3 && word.endsWith("s")) {
    return word.slice(0, -1);
  }
  return word;
};

const buildTopicStemCounts = (normalizedText) => {
  const stemCounts = new Map();
  const matches = normalizedText.match(/[a-z0-9]+(?:'[a-z0-9]+)?/gi) || [];
  for (const token of matches) {
    const stem = stemTopicToken(token);
    if (!stem) {
      continue;
    }
    stemCounts.set(stem, (stemCounts.get(stem) || 0) + 1);
  }
  return stemCounts;
};

const detectTopicFromText = (text) => {
  const normalized = (text || "").toLowerCase().replace(/\s+/g, " ").trim();
  if (!normalized) {
    return { topic: "Uncategorized", score: 0, confidence: 0, matchedTerms: [] };
  }
  const stemCounts = buildTopicStemCounts(normalized);

  const ranked = TOPIC_RULES.map(({ topic, terms }) => {
    const termList = Array.isArray(terms) ? terms : [];
    let score = 0;
    let hits = 0;
    const matchedTerms = [];

    termList.forEach(({ phrase, weight }) => {
      const term = String(phrase || "").trim().toLowerCase();
      if (!term) {
        return;
      }
      const isMultiWordTerm = /\s/.test(term);
      const matchCount = isMultiWordTerm
        ? countRegexMatches(normalized, buildTopicRegex(term))
        : (stemCounts.get(stemTopicToken(term)) || 0);
      if (matchCount <= 0) {
        return;
      }
      const safeWeight = Number(weight) || 1;
      score += safeWeight * matchCount;
      hits += matchCount;
      matchedTerms.push(term);
    });

    return {
      topic,
      score,
      hits,
      uniqueTerms: matchedTerms.length,
      matchedTerms
    };
  }).sort((a, b) => b.score - a.score);

  const top = ranked[0] || { topic: "Uncategorized", score: 0, hits: 0, uniqueTerms: 0, matchedTerms: [] };
  const runnerUpScore = ranked[1]?.score || 0;
  const hasStrongScore = top.score >= TOPIC_SCORE_MIN_FOR_CONFIDENT_MATCH;
  const hasBreadthSignal = top.uniqueTerms >= 2 && top.score >= (TOPIC_SCORE_MIN_FOR_CONFIDENT_MATCH - 0.4);
  const hasClearMargin = top.score - runnerUpScore >= TOPIC_SCORE_TIE_MARGIN;
  const hasSoftMargin = top.uniqueTerms >= 3 && (top.score - runnerUpScore) >= Math.max(0.3, TOPIC_SCORE_TIE_MARGIN * 0.5);
  const isConfidentMatch = (hasStrongScore || hasBreadthSignal) && (hasClearMargin || hasSoftMargin);

  if (!isConfidentMatch) {
    return {
      topic: "Uncategorized",
      score: +top.score.toFixed(3),
      confidence: (hasStrongScore || hasBreadthSignal) ? 0.35 : 0,
      matchedTerms: top.matchedTerms.slice(0, 6)
    };
  }

  const confidence = Math.max(0.35, Math.min(0.99, top.score / (top.score + 3)));
  return {
    topic: top.topic,
    score: +top.score.toFixed(3),
    confidence: +confidence.toFixed(3),
    matchedTerms: top.matchedTerms.slice(0, 6)
  };
};

const detectCombinedTopic = (promptAnalysis, responseAnalysis) => {
  const prompt = promptAnalysis || { topic: "Uncategorized", score: 0, confidence: 0 };
  const response = responseAnalysis || { topic: "Uncategorized", score: 0, confidence: 0 };
  const combinedScoreByTopic = new Map();

  if (prompt.topic && prompt.topic !== "Uncategorized") {
    combinedScoreByTopic.set(prompt.topic, (combinedScoreByTopic.get(prompt.topic) || 0) + (Number(prompt.score) || 0) * 1.05);
  }
  if (response.topic && response.topic !== "Uncategorized") {
    combinedScoreByTopic.set(response.topic, (combinedScoreByTopic.get(response.topic) || 0) + (Number(response.score) || 0) * 1.2);
  }

  if (combinedScoreByTopic.size === 0) {
    return { topic: "Uncategorized", score: 0, confidence: 0, source: "none" };
  }

  const ranked = Array.from(combinedScoreByTopic.entries())
    .map(([topic, score]) => ({ topic, score }))
    .sort((a, b) => b.score - a.score);
  const top = ranked[0];
  const runnerUpScore = ranked[1]?.score || 0;
  const confidence = Math.max(
    Number(prompt.confidence) || 0,
    Number(response.confidence) || 0,
    Math.min(0.99, top.score / (top.score + 3))
  );
  const source = prompt.topic === top.topic && response.topic === top.topic
    ? "prompt+response"
    : (response.topic === top.topic ? "response" : "prompt");

  if (top.score < TOPIC_SCORE_MIN_FOR_CONFIDENT_MATCH || (top.score - runnerUpScore) < TOPIC_SCORE_TIE_MARGIN) {
    return {
      topic: "Uncategorized",
      score: +top.score.toFixed(3),
      confidence: +Math.min(confidence, 0.35).toFixed(3),
      source: "ambiguous"
    };
  }

  return {
    topic: top.topic,
    score: +top.score.toFixed(3),
    confidence: +confidence.toFixed(3),
    source
  };
};

const markAwaitingResponse = (sourceNode = null) => {
  const now = Date.now();
  if (lastPromptMarkAt > 0 && now - lastPromptMarkAt <= PROMPT_MARK_DEDUP_WINDOW_MS) {
    return;
  }
  lastPromptMarkAt = now;

  const deltaMs = lastPromptSubmittedAt > 0 ? now - lastPromptSubmittedAt : null;
  const isQuickFollowup = Number.isFinite(deltaMs) && deltaMs > 0 && deltaMs <= QUICK_FOLLOWUP_WINDOW_MS;
  if (isQuickFollowup) {
    quickFollowupCountInSession += 1;
  }
  latestQuickFollowupMeta = {
    isQuickFollowup,
    deltaMs,
    quickFollowupCountInSession
  };
  lastPromptSubmittedAt = now;

  if (isQuickFollowup && quickFollowupCountInSession >= quickFollowupNextAlertCount) {
    showQuickFollowupNudge();
    quickFollowupNextAlertCount += QUICK_FOLLOWUP_ALERT_REPEAT_INTERVAL;
  }

  const inputSnapshot = captureInputSnapshot(sourceNode);
  latestPromptInputText = inputSnapshot.text || latestPromptInputText || "";
  latestInputTokenEstimate = Math.max(inputSnapshot.tokens, latestDraftInputTokenEstimate, 0);
  awaitingResponse = true;
  pendingNetworkResponse = false;
  interactionId = crypto.randomUUID();
  interactionPromptSubmittedAtById.set(interactionId, {
    ms: now,
    iso: new Date(now).toISOString()
  });
  if (interactionPromptSubmittedAtById.size > 1000) {
    const first = interactionPromptSubmittedAtById.keys().next();
    if (!first.done) {
      interactionPromptSubmittedAtById.delete(first.value);
    }
  }
  sessionIdPromise = resolveSessionIdForCurrentConversation().then((resolvedSession) => {
    sessionId = resolvedSession.sessionId;
    if (resolvedSession.isNewConversation) {
      trackNewChatStartAndMaybeNudge();
    }
    return resolvedSession.sessionId;
  });
  interactionNumberPromise = nextInteractionNumber().then((number) => {
    interactionNumber = number;
    return number;
  });
};

const handlePromptInput = (event) => {
  if (!isUserInputElement(event.target)) {
    return;
  }
  const snapshot = captureInputSnapshot(event.target);
  latestDraftInputTokenEstimate = snapshot.tokens;
  latestPromptInputText = snapshot.text || latestPromptInputText || "";
};

const handlePromptSubmit = (event) => {
  if (isUserInputElement(event.target)) {
    markAwaitingResponse(event.target);
  }
};

const handlePromptKeydown = (event) => {
  if (event.key !== "Enter" || event.shiftKey) {
    return;
  }
  if (isUserInputElement(event.target)) {
    markAwaitingResponse(event.target);
  }
};

const handlePromptClick = (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) {
    return;
  }
  const newChatTrigger = target.closest("button, a");
  if (newChatTrigger && isChatGptPage()) {
    const triggerLabel = [
      newChatTrigger.getAttribute("aria-label"),
      newChatTrigger.getAttribute("title"),
      newChatTrigger.textContent
    ]
      .filter(Boolean)
      .join(" ")
      .trim()
      .toLowerCase();
    if (triggerLabel.includes("new chat")) {
      currentConversationSessionKey = null;
      sessionId = null;
    }
  }
  const sendButton = target.closest(
    "[data-testid='send-button'], [data-testid='composer-send'], [aria-label*='send'], button[type='submit']"
  );
  if (sendButton) {
    markAwaitingResponse(sendButton);
  }
};

const registerPromptListeners = () => {
  document.addEventListener("submit", handlePromptSubmit, true);
  document.addEventListener("keydown", handlePromptKeydown, true);
  document.addEventListener("click", handlePromptClick, true);
  document.addEventListener("input", handlePromptInput, true);
};

const createSessionUuid = () => {
  return crypto.randomUUID();
}

const isChatGptPage = () => {
  const host = (location.hostname || "").toLowerCase();
  return host.includes("chatgpt.com") || host.includes("chat.openai.com");
};

const getChatGptConversationSessionKey = () => {
  if (!isChatGptPage()) {
    return null;
  }
  const path = location.pathname || "";
  const match = path.match(/\/c\/([^/?#]+)/i);
  if (match && match[1]) {
    return `chatgpt:c:${match[1]}`;
  }
  if (currentConversationSessionKey && currentConversationSessionKey.startsWith("chatgpt:draft:")) {
    return currentConversationSessionKey;
  }
  return `chatgpt:draft:${crypto.randomUUID()}`;
};

const getConversationSessionMap = () => {
  if (!chrome?.storage?.local) {
    return Promise.resolve({});
  }
  return new Promise((resolve) => {
    chrome.storage.local.get({ [CONVERSATION_SESSION_MAP_KEY]: {} }, (data) => {
      if (chrome.runtime?.lastError) {
        resolve({});
        return;
      }
      const map = data?.[CONVERSATION_SESSION_MAP_KEY];
      if (!map || typeof map !== "object") {
        resolve({});
        return;
      }
      resolve({ ...map });
    });
  });
};

const setConversationSessionMap = (map) => {
  if (!chrome?.storage?.local) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    chrome.storage.local.set({ [CONVERSATION_SESSION_MAP_KEY]: map }, () => resolve());
  });
};

const resolveSessionIdForCurrentConversation = async () => {
  const conversationKey = getChatGptConversationSessionKey();
  if (!conversationKey) {
    let isNewConversation = false;
    if (!sessionId) {
      sessionId = createSessionUuid();
      isNewConversation = true;
    }
    return { sessionId, isNewConversation };
  }

  const previousKey = currentConversationSessionKey;
  currentConversationSessionKey = conversationKey;
  const conversationMap = await getConversationSessionMap();

  let isNewConversation = false;
  if (!conversationMap[conversationKey]) {
    const isPromotingDraftToConversation = conversationKey.startsWith("chatgpt:c:")
      && previousKey
      && previousKey.startsWith("chatgpt:draft:")
      && !!sessionId;
    conversationMap[conversationKey] = isPromotingDraftToConversation
      ? sessionId
      : createSessionUuid();
    isNewConversation = !isPromotingDraftToConversation;
    await setConversationSessionMap(conversationMap);
  }

  sessionId = conversationMap[conversationKey];
  return { sessionId, isNewConversation };
};

const nextInteractionNumber = async () => {
  const resolvedUserId = await getOrCreateUserId();
  if (!resolvedUserId) {
    interactionCounter += 1;
    return interactionCounter;
  }
  if (!chrome?.storage?.local) {
    interactionCounter += 1;
    return interactionCounter;
  }
  return new Promise((resolve) => {
    chrome.storage.local.get(
      { interactionCounter: 0, interactionCounterUserId: null },
      (data) => {
        if (chrome.runtime?.lastError) {
          interactionCounter += 1;
          resolve(interactionCounter);
          return;
        }
        let counter = Number.isFinite(data?.interactionCounter)
          ? data.interactionCounter
          : 0;
        if (data?.interactionCounterUserId !== resolvedUserId) {
          counter = 0;
        }
        counter += 1;
        chrome.storage.local.set(
          { interactionCounter: counter, interactionCounterUserId: resolvedUserId },
          () => {
            if (chrome.runtime?.lastError) {
              interactionCounter += 1;
              resolve(interactionCounter);
              return;
            }
            interactionCounter = counter;
            resolve(counter);
          }
        );
      }
    );
  });
};

const queueDetection = () => {
  if (detectionScheduled || !extensionEnabled) {
    return;
  }
  detectionScheduled = true;
  requestAnimationFrame(() => {
    detectionScheduled = false;
    runDetection();
  });
};

const runDetection = () => {
  if (!extensionEnabled) {
    hideBanner();
    return;
  }

  const domainMatch = findByDomain();
  const keywordMatch = domainMatch || findByKeywords();
  latestDetection = keywordMatch;
  if (!latestDetection) {
    latestModelDetection = { provider: "unknown", model: "unknown", confidence: 0 };
    latestTokenEstimate = 0;
    resetImpactMetrics();
    updateBanner(null, latestTokenEstimate, latestImpactMetrics);
    return;
  }
  latestModelDetection = detectModelFromPage(latestDetection);
  const providerKey = latestModelDetection?.provider || "unknown";

  const rawOutput = collectAiOutputText();
  const normalizedOutput = normalizeText(rawOutput);
  const hasOutput = !!normalizedOutput;
  const hasNewOutput = hasOutput && normalizedOutput !== lastOutputFingerprint;
  const isThinkingStatus = isLikelyThinkingStatusText(providerKey, rawOutput);

  if (!hasOutput) {
    latestAiOutputText = "";
    if (!awaitingResponse) {
      conversationStarted = false;
      lastOutputFingerprint = "";
    }
    latestTokenEstimate = 0;
    resetImpactMetrics();
    updateBanner(latestDetection, latestTokenEstimate, latestImpactMetrics);
    pendingNetworkResponse = false;
    awaitingResponse = false;
    return;
  }

  if (!conversationStarted) {
    if (!awaitingResponse) {
      if (!hasNewOutput) {
        return;
      }
      lastOutputFingerprint = normalizedOutput;
      lastOutputUpdateAt = Date.now();
      // Before the user submits the first prompt in this session, keep visible
      // counters at zero to avoid showing stale/bootstrapped page content.
      latestTokenEstimate = 0;
      resetImpactMetrics();
      updateBanner(latestDetection, latestTokenEstimate, latestImpactMetrics);
      return;
    }

    if (!hasNewOutput) {
      latestTokenEstimate = 0;
      resetImpactMetrics();
      updateBanner(latestDetection, latestTokenEstimate, latestImpactMetrics);
      return;
    }

    conversationStarted = true;
    awaitingResponse = isThinkingStatus;
  }

  if (!hasNewOutput) {
    if (awaitingResponse && isThinkingStatus) {
      pendingNetworkResponse = true;
      return;
    }
    pendingNetworkResponse = false;
    awaitingResponse = false;
    return;
  }

  lastOutputFingerprint = normalizedOutput;
  latestAiOutputText = rawOutput;
  lastOutputUpdateAt = Date.now();
  latestTokenEstimate = estimateTokensFromText(rawOutput);
  latestImpactMetrics = createImpactMetrics(latestTokenEstimate);
  updateBanner(latestDetection, latestTokenEstimate, latestImpactMetrics);
  awaitingResponse = isThinkingStatus;
  pendingNetworkResponse = isThinkingStatus;
};

const registerResourceObserver = () => {
  if (resourceObserver || typeof PerformanceObserver === "undefined") {
    return;
  }

  const observerCallback = (list) => {
    const entries = list?.getEntries();
    if (!entries || !entries.length) {
      return;
    }
    pendingNetworkResponse = true;
    queueDetection();
  };

  try {
    resourceObserver = new PerformanceObserver(observerCallback);
    resourceObserver.observe({ type: "resource", buffered: true });
  } catch (firstError) {
    try {
      resourceObserver = new PerformanceObserver(observerCallback);
      resourceObserver.observe({ entryTypes: ["resource"] });
    } catch (secondError) {
      resourceObserver = null;
    }
  }
};

const startObserving = () => {
  if (mutationObserver || !document.documentElement) {
    return;
  }
  mutationObserver = new MutationObserver(() => queueDetection());
  mutationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: false
  });
};

const init = () => {
  ensureBanner();
  getOrCreateUserId();
  loadInitialMetricsVisibilityState();
  loadInitialEnabledState();
  registerStorageListeners();
  queueDetection();
  startObserving();
  registerPromptListeners();
  registerResourceObserver();
  window.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      queueDetection();
    }
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || !message.type) {
    return;
  }
  if (message.type === "ai-detector:getStatus") {
    sendResponse({
      detected: latestDetection,
      modelDetection: latestModelDetection,
      tokens: latestTokenEstimate,
      impact: latestImpactMetrics,
      enabled: extensionEnabled
    });
    return;
  }
  if (message.type === "ai-detector:setEnabled") {
    applyEnabledState(message.enabled !== false);
    sendResponse({ enabled: extensionEnabled });
    return;
  }
  if (message.type === "ai-detector:refreshMetricsVisibility") {
    refreshEnvironmentalMetricsVisibility();
    queueDetection();
    sendResponse({ ok: true });
  }
});
