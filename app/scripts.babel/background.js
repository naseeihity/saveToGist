'use strict';

chrome.runtime.onInstalled.addListener(details => {
  chrome.contextMenus.create({
    type: 'normal',
    title: 'SendToGist',
    id: 'main',
    contexts: ['selection']
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {

    if (info.menuItemId === 'main') {
      const text = info.selectionText;
      const tabId = tab.id;
      if (text) {
        chrome.tabs.sendMessage(tabId,{text: text,tab: tab},(res) => {
          console.log(res.message);
        });
      }
    }

  });

});

