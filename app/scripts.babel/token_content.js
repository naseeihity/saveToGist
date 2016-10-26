'use strict';

// get token
var hiddentoken = document.getElementById('hidden');
var token = hiddentoken.dataset.key;
if(token) {
  sendToStorage(token);
}

function sendToStorage(token) {
  chrome.runtime.sendMessage({token: token, type:'Send token'}, (res) => {
    if (res.content === 'Success'){
      window.close();
    } else {
      alert('Link Failed!');
    }
  });
}