const LOG_ENDPOINT = "https://script.google.com/macros/s/AKfycbx8OiVVixfrD0SEQ8B1HFIoM1ZSzQBFLmsYWPZG2n2B-XffST_fJK6HELrI6d642COe/exec";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.type !== "ai-detector:log") {
    return;
  }

  fetch(LOG_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(message.payload || {})
  })
    .then(() => {
      sendResponse({ ok: true });
    })
    .catch((error) => {
      sendResponse({ ok: false, error: String(error) });
    });

  return true;
});
