// Handle left-click (redirect to homepage)
chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.url) return;

  try {
    let url = new URL(tab.url);
    let homepage = `${url.protocol}//${url.hostname}`;
    chrome.tabs.update(tab.id, { url: homepage });
  } catch (e) {
    console.error("Error parsing URL:", e);
  }
});

// Add right-click context menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "redirectToMainDomain",
    title: "Go to Main Domain",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "backToTop",
    title: "Back to Top",
    contexts: ["action"]
  });
});

// Handle right-click context menu actions
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab || !tab.id || !tab.url) return;

  if (info.menuItemId === "redirectToMainDomain") {
    try {
      let url = new URL(tab.url);
      let domainParts = url.hostname.split(".");

      if (domainParts.length > 2) {
        let mainDomain = domainParts.slice(-2).join(".");
        let newUrl = `${url.protocol}//${mainDomain}`;
        chrome.tabs.update(tab.id, { url: newUrl });
      }
    } catch (e) {
      console.error("Error parsing URL:", e);
    }
  }

  if (info.menuItemId === "backToTop") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  }
});
