'use strict';

chrome.runtime.onInstalled.addListener(details => {
  chrome.contextMenus.create({
    type: 'normal',
    title: 'SendToGist',
    id: 'main',
    contexts: ['selection']
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    alert(info.selectionText);
  })
});

console.log('\'Allo \'Allo! Event Page for Browser Action');
