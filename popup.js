const statusEl = document.getElementById("status");
const tokenEl = document.getElementById("token-count");
const metricEnergyEl = document.getElementById("metric-energy");
const metricCo2El = document.getElementById("metric-co2");
const metricWaterEl = document.getElementById("metric-water");
const toggleButtonEl = document.getElementById("toggle-extension");

const defaultMetricValue = "--";
let extensionEnabled = true;

const updateStatus = (message) => {
  statusEl.textContent = message;
};

const updateTokens = (count) => {
  if (!tokenEl) {
    return;
  }
  const formatted = Number.isFinite(count) && count > 0 ? count : "--";
  tokenEl.textContent = `Tokens detected: ${formatted}`;
};

const formatMetric = (value, unit) => {
  if (!Number.isFinite(value) || value <= 0) {
    return `${defaultMetricValue} ${unit}`;
  }
  let formatted;
  if (value >= 10) {
    formatted = value.toFixed(1);
  } else if (value >= 1) {
    formatted = value.toFixed(2);
  } else if (value >= 0.01) {
    formatted = value.toFixed(3);
  } else {
    formatted = value.toExponential(2);
  }
  return `${formatted} ${unit}`;
};

const updateImpactMetrics = (impact) => {
  const metrics = impact || { energyWh: 0, co2g: 0, waterL: 0 };
  if (metricEnergyEl) {
    metricEnergyEl.textContent = formatMetric(metrics.energyWh, "Wh");
  }
  if (metricCo2El) {
    metricCo2El.textContent = formatMetric(metrics.co2g, "g");
  }
  if (metricWaterEl) {
    metricWaterEl.textContent = formatMetric(metrics.waterL, "L");
  }
};

const resetImpactMetrics = () => updateImpactMetrics(null);

const updateToggleButton = (enabled) => {
  extensionEnabled = enabled !== false;
  if (!toggleButtonEl) {
    return;
  }
  toggleButtonEl.classList.toggle("enabled", extensionEnabled);
  toggleButtonEl.classList.toggle("disabled", !extensionEnabled);
  toggleButtonEl.textContent = extensionEnabled ? "Turn off detector" : "Turn on detector";
};

const renderResult = (label, tokens, impact, enabledState) => {
  updateToggleButton(enabledState);
  if (!extensionEnabled) {
    updateStatus("Detector is paused.");
    updateTokens(null);
    resetImpactMetrics();
    return;
  }

  updateStatus(label ? label : "None detected yet.");
  updateTokens(tokens);
  updateImpactMetrics(impact);
};

const notifyActiveTabOfToggle = (enabled) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const [tab] = tabs;
    if (!tab || !tab.id) {
      return;
    }
    chrome.tabs.sendMessage(tab.id, { type: "ai-detector:setEnabled", enabled }, () => {
      // ignore errors; content script may not be ready yet
    });
  });
};

const persistToggleState = (nextState) => {
  chrome.storage.local.set({ aiDetectorEnabled: nextState }, () => {
    updateToggleButton(nextState);
    notifyActiveTabOfToggle(nextState);
    if (!nextState) {
      updateStatus("Detector is paused.");
      updateTokens(null);
      resetImpactMetrics();
    } else {
      requestDetection();
    }
  });
};

const loadToggleState = (callback) => {
  chrome.storage.local.get({ aiDetectorEnabled: true }, (data) => {
    const enabled = data.aiDetectorEnabled !== false;
    updateToggleButton(enabled);
    if (typeof callback === "function") {
      callback(enabled);
    }
  });
};

const requestDetection = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) {
      updateStatus(`Error: ${chrome.runtime.lastError.message}`);
      updateTokens(null);
      resetImpactMetrics();
      return;
    }

    const [tab] = tabs;
    if (!tab || !tab.id) {
      updateStatus("No active tab detected.");
      updateTokens(null);
      resetImpactMetrics();
      return;
    }

    chrome.tabs.sendMessage(tab.id, { type: "ai-detector:getStatus" }, (response) => {
      if (chrome.runtime.lastError) {
        updateStatus("Waiting for AI detector to initialize on this tab.");
        updateTokens(null);
        resetImpactMetrics();
        return;
      }

      renderResult(
        response && response.detected ? response.detected : null,
        response?.tokens ?? null,
        response?.impact ?? null,
        response?.enabled
      );
    });
  });
};

const initialize = () => {
  loadToggleState(() => requestDetection());
  if (toggleButtonEl) {
    toggleButtonEl.addEventListener("click", () => {
      persistToggleState(!extensionEnabled);
    });
  }
};

document.addEventListener("DOMContentLoaded", initialize);
