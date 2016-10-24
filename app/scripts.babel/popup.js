'use strict';

const CRIED_ID = '79b284688b1aa407d535';
var link = document.getElementById('link');
var info = document.getElementById('info');
var username = document.getElementById('username');
link.addEventListener('click', linkGithub);

function linkGithub(e) {
  e.preventDefault();
  var target = e.target;
  var url = target.href + CRIED_ID;
  var height = 580,
      width = 400;
  var top = (window.screen.availHeight - 30 - height) / 2;
  var left = (window.screen.availWidth - 10 - width) / 2;
  var position = `height=${height},width=${width},top=${top},left=${left},resizable=no`;
  window.open(url,'github',position);
}

function domChange(usertoken) {
  const token = usertoken;
  const GITHUB_API = 'https://api.github.com/user?';
  const url = `${GITHUB_API}access_token=${token}`;
  ajax(url, (result) => {
    var resultObj = JSON.parse(result);
    var user_name = resultObj.name || '';
    if (user_name !== '') {
      link.classList.add('hide');
      info.classList.remove('hide');
      username.innerHTML = user_name;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('savetogistToken', (result) => {
      result.savetogistToken && domChange(result.savetogistToken);
  });

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if (message.token !== '') {
      sendResponse('Success');
      const token = message.token;
      chrome.storage.sync.set({'savetogistToken': token}, function() {
          domChange(token);
      });
    } else {
      sendResponse('Error');
    }
  });

});

function ajax(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.send();
  xhr.onreadystatechange = () =>{
    if (xhr.readyState === 4) {
      callback(xhr.responseText);
    }
  }
}