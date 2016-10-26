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
  // 右键菜单发送选中文本到content_script
  if (info.menuItemId === 'saveToGist') {
    sendSelectedTxt(info, tab);
  }

});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const type = message.type;
    if (type === 'Send token') {
      const token = message.token;
      if (token && token !== '') {
        // 将token存入chrome.storage
        chrome.storage.sync.set({'savetogistToken': token}, () => {
          console.log("get token");
        });
        // 调用回调函数传回成功信息
        sendResponse({
          content: 'Success',
          type: 'Get token'
        });
      } else {
        sendResponse({
          content: 'Error',
          type: 'Get Error'
        });
      }
    }

  });

function sendSelectedTxt(info, tab) {
  const text = info.selectionText;
  const tabId = tab.id;

  chrome.tabs.sendMessage(tabId, {text: text,tab: tab},(res) => {
    console.log(res.message);
  });
}
