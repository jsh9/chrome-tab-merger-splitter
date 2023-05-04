chrome.commands.onCommand.addListener(async (command) => {
  const currentTab = await getCurrentTab();
  const windows = await chrome.windows.getAll({ populate: true });
  const currentWindow = windows.find((win) => win.id === currentTab.windowId);

  switch (command) {
    case 'merge_tab':
      if (windows.length > 1 && currentWindow.tabs.length === 1) {
        const otherWindow = windows.find((win) => win.id !== currentTab.windowId);
        const movedTab = await chrome.tabs.move(
          currentTab.id,
          { windowId: otherWindow.id, index: -1 },
        );
        chrome.tabs.update(movedTab.id, { active: true });
      }
      break;

    case 'split_tab':
      if (currentWindow.tabs.length > 1) {
        chrome.windows.create({ tabId: currentTab.id });
      }
      break;

    default:
      break;
  }
});

async function getCurrentTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}
