'use strict';

var hiddentoken = document.getElementById('hidden');
var token = hiddentoken.dataset.key;
if(token) {
  sendToBackground(token);
}

function sendToBackground(token) {
  chrome.runtime.sendMessage({token: token}, function(res){
    if (res === 'Success'){
      window.close();
    } else {
      console.log('Something wrong!');
    }
  });
}