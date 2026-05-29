// Service worker — required by Manifest V3.
// Handles extension lifecycle events.

chrome.runtime.onInstalled.addListener(() => {
  console.log('SafeVault extension ready');
});
