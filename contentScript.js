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

const BANNER_ID = "ai-detector-banner";
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
  energyWhPerToken: 0.0005, // ~0.5 Wh per 1k tokens
  co2gPerToken: 0.0002, // ~0.2 g CO2 per 1k tokens
  waterLPerToken: 0.0001 // ~0.1 L per 1k tokens
};
let latestDetection = null;
let latestTokenEstimate = 0;
let mutationObserver = null;
let awaitingResponse = false;
let conversationStarted = false;
let sessionId = null;
let lastOutputFingerprint = "";
let latestImpactMetrics = { energyWh: 0, co2g: 0, waterL: 0 };
let extensionEnabled = true;
let detectionScheduled = false;
let resourceObserver = null;
let pendingNetworkResponse = false;
let lastUserText = null;

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

const createImpactMetrics = (tokenCount = 0) => {
  const safeTokens = Number.isFinite(tokenCount) && tokenCount > 0 ? tokenCount : 0;
  return {
    energyWh: +(safeTokens * IMPACT_CONSTANTS.energyWhPerToken).toFixed(6),
    co2g: +(safeTokens * IMPACT_CONSTANTS.co2gPerToken).toFixed(6),
    waterL: +(safeTokens * IMPACT_CONSTANTS.waterLPerToken).toFixed(6)
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
  return value.toExponential(2);
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
    banner.style.padding = "20px 24px";
    banner.style.borderRadius = "18px";
    banner.style.background = "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.92))";
    banner.style.border = "1px solid rgba(148, 163, 184, 0.4)";
    banner.style.color = "#e2e8f0";
    banner.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    banner.style.fontSize = "15px";
    banner.style.fontWeight = "500";
    banner.style.lineHeight = "1.45";
    banner.style.display = "flex";
    banner.style.flexDirection = "column";
    banner.style.rowGap = "6px";
    banner.style.boxShadow = "0 12px 30px rgba(15, 23, 42, 0.45)";
    banner.style.pointerEvents = "none";
    banner.style.backdropFilter = "blur(6px)";
    banner.style.maxWidth = "340px";
    banner.style.whiteSpace = "pre-line";
    document.documentElement.appendChild(banner);
    window.addEventListener('focus', (e) => {
      const findEditableElement = document.querySelector('[contenteditable="true"]');
      window.addEventListener('keydown', (e) => {
        if (e.key == 'Enter' && e.shiftKey === false) {
          lastUserText = findEditableElement.textContent.trim();
        }
      });
    });
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

const updateBanner = (label, tokenCount, impactMetrics) => {
  showBanner();
  const banner = ensureBanner();
  const detectedLabel = label ? `AI detected: ${label}` : "AI detected: None";
  const tokenLabel = `Tokens: ${tokenCount ?? 0}`;
  const metrics = impactMetrics || createImpactMetrics(tokenCount);
  const lines = [
    detectedLabel,
    tokenLabel,
    `Electricity consumed: ${formatImpactValue(metrics.energyWh)} Wh`,
    `CO2 produced: ${formatImpactValue(metrics.co2g)} g`,
    `Water consumed: ${formatImpactValue(metrics.waterL)} L`
  ];
  banner.textContent = lines.join("\n");
  banner.dataset.detected = label ? "true" : "false";

  if (label && sessionId) {
    logSessionData({ metrics: metrics, tokenCount: tokenCount, tokenLabel: tokenLabel, detectedLabel: detectedLabel });
  }
};

const logSessionData = (data) => {
  const endpoint = `https://josh.rewrit.es/${sessionId}`;
  const method = 'POST';
  data.userText = lastUserText;
  const body = JSON.stringify(data);
  fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body }).then(response => {
    console.log(response);
  }).catch(error => {
    console.error('Error logging session data:', error);
  });
};

const resetConversationState = () => {
  awaitingResponse = false;
  conversationStarted = false;
  lastOutputFingerprint = "";
  latestTokenEstimate = 0;
  resetImpactMetrics();
  latestDetection = null;
  pendingNetworkResponse = false;
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

const registerStorageListeners = () => {
  if (!chrome?.storage?.onChanged) {
    return;
  }
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local" || !Object.prototype.hasOwnProperty.call(changes, "aiDetectorEnabled")) {
      return;
    }
    applyEnabledState(changes.aiDetectorEnabled.newValue !== false);
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

const escapeForRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
        return text.slice(0, TEXT_SLICE_LIMIT);
      }
    }
  }

  return getDocumentTextWithoutInputs().slice(0, TEXT_SLICE_LIMIT);
};

const normalizeText = (text) => (text || "").replace(/\s+/g, " ").trim();

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

const markAwaitingResponse = () => {
  awaitingResponse = true;
  pendingNetworkResponse = false;
};

const handlePromptSubmit = (event) => {
  if (isUserInputElement(event.target)) {
    markAwaitingResponse();
  }
};

const handlePromptKeydown = (event) => {
  if (event.key !== "Enter" || event.shiftKey) {
    return;
  }
  if (isUserInputElement(event.target)) {
    markAwaitingResponse();
  }
};

const handlePromptClick = (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) {
    return;
  }
  const sendButton = target.closest(
    "[data-testid='send-button'], [data-testid='composer-send'], [aria-label*='send'], button[type='submit']"
  );
  if (sendButton) {
    markAwaitingResponse();
  }
};

const registerPromptListeners = () => {
  document.addEventListener("submit", handlePromptSubmit, true);
  document.addEventListener("keydown", handlePromptKeydown, true);
  document.addEventListener("click", handlePromptClick, true);
};

const createSessionUuid = () => {
  return crypto.randomUUID();
}

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

  const requiresNetworkTrigger = conversationStarted || awaitingResponse;
  if (requiresNetworkTrigger && !pendingNetworkResponse) {
    return;
  }

  const domainMatch = findByDomain();
  const keywordMatch = domainMatch || findByKeywords();
  latestDetection = keywordMatch;
  if (!latestDetection) {
    latestTokenEstimate = 0;
    resetImpactMetrics();
    updateBanner(null, latestTokenEstimate, latestImpactMetrics);
    return;
  }

  const rawOutput = collectAiOutputText();
  const normalizedOutput = normalizeText(rawOutput);
  const hasOutput = !!normalizedOutput;
  const hasNewOutput = hasOutput && normalizedOutput !== lastOutputFingerprint;

  if (!hasOutput) {
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
      lastOutputFingerprint = normalizedOutput;
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
    sessionId = createSessionUuid();
    awaitingResponse = false;
  }

  if (!hasNewOutput) {
    pendingNetworkResponse = false;
    awaitingResponse = false;
    return;
  }

  lastOutputFingerprint = normalizedOutput;
  latestTokenEstimate = estimateTokensFromText(rawOutput);
  latestImpactMetrics = createImpactMetrics(latestTokenEstimate);
  updateBanner(latestDetection, latestTokenEstimate, latestImpactMetrics);
  awaitingResponse = false;
  pendingNetworkResponse = false;
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
      tokens: latestTokenEstimate,
      impact: latestImpactMetrics,
      enabled: extensionEnabled
    });
    return;
  }
  if (message.type === "ai-detector:setEnabled") {
    applyEnabledState(message.enabled !== false);
    sendResponse({ enabled: extensionEnabled });
  }
});
