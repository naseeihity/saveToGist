'use strict';

//Event Page中所有的事件监听函数必须在顶层
chrome.runtime.onInstalled.addListener(() => {
  // 注册右键菜单,在有选中文本时弹出
  chrome.contextMenus.create({
    type: 'normal',
    title: 'saveToGist',
    id: 'saveToGist',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {

  if (info.menuItemId === 'saveToGist') {
    sendSelectedTxt(info, tab);
  }

});

function sendSelectedTxt(info, tab) {
  const text = info.selectionText;
  const tabId = tab.id;

  chrome.tabs.sendMessage(tabId, {text: text,tab: tab},(res) => {
    console.log(res.message);
  });
}
