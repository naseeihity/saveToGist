'use strict';

function getSelectionMessage(message, sender, sendResponse){
  let gist = {
    url: message.tab.url,
    description: 'a description of this gist',
    public: true,
    "files": {
      "demo.js": {
        "content": message.text
      }
    }
  };
  console.log(gist);
  chrome.storage.sync.get('savetogistToken', (result) => {
      let token = result.savetogistToken;
      showModal(gist, token);
  });

  sendResponse({message:'Success!'});
}

function showModal(gist, token) {
  // 弹框输入 description,public,filename
  sendToGist(gist, token);
}

function showSuccessModal() {

}

function sendToGist(gist, token) {
  const URL = `https://api.github.com/gists`;
  const tokenHeader = `token ${token}`;
  const data = JSON.stringify(gist);
  console.log(data);
  $.ajax({
    url: URL,
    type: 'POST',
    headers: {
      'Authorization': tokenHeader,
    },
    data: data,
    success: (res) => {
      alert("success!");
    },
    error: (err) => {
      console.log(err);
    }
  });
}

chrome.runtime.onMessage.addListener(getSelectionMessage);
