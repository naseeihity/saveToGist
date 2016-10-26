'use strict';

// 获取右键菜单传来的值的函数
function getSelectionMessage(message, sender, sendResponse){
  // 插入gist来自哪里的信息
  // TODO: 可以定制,可以选择是否添加
  const copyFrom = `

---------------------------F--R--O--M------------------------------
${message.tab.url}
-------------------------------------------------------------------`;
  // gist内容的信息,与github gist的api已知
  let gist = {
    description: 'a description of this gist',
    public: true,
    'files': {
      'aGist': {
        'content': message.text + copyFrom
      }
    }
  };

  // 拿到token
  chrome.storage.sync.get('savetogistToken', (result) => {
      const token = result.savetogistToken;
      // 展示模态框,供用户修改相关信息
      showModal(gist, token);
  });

  // 成功的回调
  sendResponse({message:'Success!'});
}

function createModal() {
  // 使用ES6的模板字符串创建弹窗界面
  const modal = $(`<div class="gistModal" id="gistModal">
      <div class="gistModal_content">
        <form action="" class="gistModal_form" id="gistModal_form" name="gistModal_form">
          <input
            type="text"
            id="gist_filename"
            class="gist_filename"
            name="gist_filename"
            placeholder="Filename including extension..."
          />
          <textarea rows="2"
            type="text"
            id="gist_description"
            class="gist_description"
            name="gist_description"
            placeholder="Gist description..."
          />
          <div class="flexbox">
            <label class="gist_public_label">
              <input
                type="checkbox"
                id="gist_public"
                class="gist_public"
                name="gist_public"
                checked
              />
              public
            </label>
            <button class="btnDone">
              Done!
            </button>
          </div>
        </form>
        <p class="infotips">If you leave it blank, we will use default values.</p>
        <span class="closeBtn" id="closeBtn">X</span>
        <div class="modal_loader" id="modal_loader">
          <div class="modal_spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
          </div>
        </div>
      </div>
    </div>`);

  return modal;
}

// 单例化创建弹出过程
function getSingle(fn) {
  let result;
  return () => {
    return result || (result = fn.apply(this, arguments));
  };
}
var createSingleModal = getSingle(createModal);

function showModal(gist, token) {
  // 创建并插入弹框
  const modal = createSingleModal();
  $('body').append(modal);
  // 处理保存请求
  $('form.gistModal_form').submit(function(e){
    e.preventDefault();
    // 使按钮不可重复点击
    $('.btnDone').prop('disabled', true);
    // 得到生成的gist的url
    // TODO: 以后可以用来展示
    let gistUrl;
    //取到修改的值
    const filename = $('#gist_filename').val().trim(),
          description = $('#gist_description').val().trim(),
          isPublic = $('#gist_public').prop('checked');
    // 更新gist的值
    gist.description = description || gist.description;
    gist.public = isPublic;
    if(filename) {
      gist.files[filename] = gist.files['aGist'];
      delete gist.files['aGist'];
    }
    // 发送中显示loading动画
    showLoader();
    // 发送到接口
    sendToGist(gist, token, (result) => {
      if (result === '') {
        console.log('send failed');
      } else {
        gistUrl = result;
      }
      // 关闭弹窗
      closeModal();
    });
  });

  // 关闭按钮的事件注册
  $('#closeBtn').on('click', function(event) {
    event.preventDefault();
    closeModal();
  });
}

// 显示loading
function showLoader() {
  const loader = $('#modal_loader');
  loader.addClass('show');
}

// 关闭弹窗
function closeModal() {
  const modal = $('#gistModal');
  modal.remove();
}

// 发送gist到接口
function sendToGist(gist, token, callback) {
  const URL = 'https://api.github.com/gists';
  const tokenHeader = `token ${token}`;
  // 将js对象转为json字符串
  const data = JSON.stringify(gist);
  let gistUrl = '';
  // 注意将token放在header里
  $.ajax({
    url: URL,
    type: 'POST',
    headers: {
      'Authorization': tokenHeader,
    },
    data: data,
    success: (res) => {
      gistUrl = res.html_url;
      callback(gistUrl);
    },
    error: (err) => {
      callback(gistUrl);
    }
  });
}

// 注册事件监听,获取通过邮件菜单传来的值
chrome.runtime.onMessage.addListener(getSelectionMessage);
