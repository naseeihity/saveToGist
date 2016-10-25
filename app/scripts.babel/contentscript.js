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
  const modal = $(`<div class="gistModal">
      <div class="gistModal_content">
        <form action="" class="gistModal_form">
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
        <span class="closeBtn">X</span>
      </div>
    </div>`);
    $('body').append(modal);
    $("form.gistModal_form").submit(function(e){
      e.preventDefault();
    });
  // sendToGist(gist, token);
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
