'use strict';

// 一些全局变量
const CRIED_ID = '79b284688b1aa407d535';
var link = document.getElementById('link');
var info = document.getElementById('info');
var username = document.getElementById('username');
var loading = document.getElementById('loading');

// github OAuth认证
function linkGithub(e) {
  e.preventDefault();

  // 获得认证Url
  const target = e.target;
  const url = target.href + CRIED_ID;

  // 初始化弹出窗口信息
  const height = 580,
      width = 400;
  const top = (window.screen.availHeight - 30 - height) / 2;
  const left = (window.screen.availWidth - 10 - width) / 2;
  const position = `height=${height},width=${width},top=${top},left=${left},resizable=no`;

  window.open(url,'github',position);
}

// 拿到token后改变Dom
function domChange(usertoken) {
  // 获得请求Github用户信息的URL
  const token = usertoken;
  const GITHUB_API = 'https://api.github.com/user?';
  const url = `${GITHUB_API}access_token=${token}`;

  // 请求用户信息,以判断token是否有效
  // 以后可以做更丰富的用户信息展示
  ajax(url, (result) => {

    const resultObj = JSON.parse(result);
    const user_name = resultObj.name || '';
    // 如果可以拿到用户名,则证明token有效
    if (user_name !== '') {
      loading.classList.add('hide');
      link.classList.add('hide');
      info.classList.remove('hide');
      // 展示用户信息
      username.innerHTML = user_name;
    } else {
      // token无效,则初始化dom,用户可以重新连接
      initDom();
      //输出错误信息
      console.log(resultObj);
    }
  });
}

//初始化Dom
function initDom() {
  loading.classList.add('hide');
  link.classList.remove('hide');
  info.classList.add('hide');
}

// 简单的ajax封装
function ajax(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();
  xhr.onreadystatechange = () =>{
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.responseText);
      } else {
        callback(xhr.status);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 检查是否已经拿到过token
  chrome.storage.sync.get('savetogistToken', (result) => {
      //如果没有值就初始化Dom
      !result.savetogistToken && initDom();
      //如果有值就将Dom改为拿到后的欢迎界面
      result.savetogistToken && domChange(result.savetogistToken);
  });

  // 事件监听获取token
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const type = message.type,
          token = message.token;
    if (type === 'Send token' && token && token !== '') {
      // 将token存入chrome.storage
      chrome.storage.sync.set({'savetogistToken': token}, () => {
          // 保存成功后改变界面
          domChange(token);
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
  });

  link.addEventListener('click', linkGithub);

});