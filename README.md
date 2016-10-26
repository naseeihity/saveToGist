# saveToGist
A chrome extension to save code to github gist quickly.

最近才发现了Github的Gist功能,用来整理一些有用的代码简直不要太好用,但是每次看到好的代码都要复制,打开gist页面,再粘贴,再一步步发布,实在不要太麻烦,于是萌生了制作这个Chrome插件的想法,让你不用跳出页面就能保存优雅的代码.

当然,除了代码之外,你在浏览网页时看到的任何觉得有价值的内容(文字)都可以保存到Gist,以供自己以后查阅,同时也能很方便地分享给他人.

## UI & Usage

#### Link to Github first:
**before link**![](./img/readme1.png)  **after link** ![](./img/readme2.png)

#### 选中文字后从右键菜单中调用
![](./img/readme3.png)
![](./img/readme4.png)
你可以在这里修改`文件名`,`文件描述`,`是否public`

#### 点击DONE!
![](./img/readme5.png)
经过一个短暂的CSS loading动画,选中的内容就被保存到[Github Gist](https://gist.github.com/)了.

## Run as a Developer
- Getting Start
```
$ git clone https://github.com/naseeihity/saveToGist.git
$ cd saveToGist
$ npm i
$ gulp wathch
# Make a production version extension if you need
$ gulp build
```

- open `chrome://extensions/` with chrome
- drop file `app` to the page you opened
- run as the Usage

## TODO List
- 注册成为谷歌开者(没有信用卡不能注册不能上线插件T T)
- 增加option页面,用户可以配置一些默认值
- link github成功后显示用户信息,可以选择更换用户
- saveToList成功后返回该gist的url,方便用户查看
- Gist 代码格式化(important)

## Thanks To
[generator-chrome-extension](https://github.com/yeoman/generator-chrome-extension) :一个脚手架,通过他可以快捷地初始化一个Chrome-extension项目,支持部分ES6语法

[SpinKit](https://github.com/tobiasahlin/SpinKit): 优雅的CSS3 loading动画

## Author
[Coaco](http://www.gaococ.com/)