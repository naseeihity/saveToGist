'use strict';

function getSelectionMessage(message, sender, sendResponse){
  const copyFrom = `

---------------------------F--R--O--M------------------------------
${message.tab.url}
-------------------------------------------------------------------`;
  let gist = {
    description: 'a description of this gist',
    public: true,
    "files": {
      "aGist": {
        "content": message.text + copyFrom
      }
    }
  };

  chrome.storage.sync.get('savetogistToken', (result) => {
      let token = result.savetogistToken;
      showModal(gist, token);
  });

  sendResponse({message:'Success!'});
}

function showModal(gist, token) {
  // 弹框输入 description,public,filename
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
            <label>
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
      </div>
    </div>`);
  // 弹出编辑弹框
    $('body').append(modal);
  // 处理保存请求
    $("form.gistModal_form").submit(function(e){
      e.preventDefault();
      $('.btnDone').prop('disabled', true);
      let gistUrl;
      //取到修改的值
      const filename = $('#gist_filename').val().trim();
      const description = $('#gist_description').val().trim();
      const isPublic = $('#gist_public').prop('checked');

      gist.description = description || gist.description;
      gist.public = isPublic;
      if(filename) {
        gist.files[filename] = gist.files["aGist"];
        delete gist.files["aGist"];
      }
      sendToGist(gist, token, (result) => {
        gistUrl = result;
        closeModal();
      });
    });

    $('#closeBtn').on('click', function(event) {
      event.preventDefault();
      closeModal();
    });
}

function closeModal() {
  const modal = $('#gistModal');
  modal.remove();
}

function sendToGist(gist, token, callback) {
  const URL = `https://api.github.com/gists`;
  const tokenHeader = `token ${token}`;
  const data = JSON.stringify(gist);
  let gistUrl = '';

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
      console.log(err);
    }
  });
}

chrome.runtime.onMessage.addListener(getSelectionMessage);
