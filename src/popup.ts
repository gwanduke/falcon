let enabledEl = document.getElementById("enabled") as HTMLInputElement;

chrome.storage.sync.get("enabled", ({ enabled }) => {
  enabledEl.checked = enabled;
});

enabledEl.addEventListener("click", async () => {
  chrome.storage.sync.get("enabled", ({ enabled }) => {
    chrome.storage.sync.set({
      enabled: !enabled,
    });
  });
});
