'use strict';

const CRIED_ID = '79b284688b1aa407d535';
var link = document.getElementById('link');
link.addEventListener('click', function(e){
  e.preventDefault();
  var target = e.target;
  var url = target.href + CRIED_ID;
  var height = 580,
      width = 400;
  var top = (window.screen.availHeight - 30 - height) / 2;
  var left = (window.screen.availWidth - 10 - width) / 2;
  var position = `height=${height},width=${width},top=${top},left=${left},resizable=no`;
  window.open(url,'github',position);
})
