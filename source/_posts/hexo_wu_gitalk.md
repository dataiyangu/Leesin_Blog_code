title: hexo next主题深度优化(五)，评论系统换成gittalk
author: Leesin.Dong
top: 9999995
tags:
  - hexo
categories:
  - hexo
date: 2018-12-18 20:19:00
---
# ![upload successful](../images/my_blog_6.png)

> * 一篇关于next主题中加入gitalk评论系统的文章，让你的博客的来客如江水滔滔连绵不绝，又如黄河之水一发不可收拾。

<!--more-->


# 背景：
之前一直用的是来必力的评论系统，还不错，但是因为我加入了pjax，能力有限，虽然降来必力的js重现，但是每次返回到首页都会报错id notfound  ，阅读了来必力的api，全是并没有找到很多好的答案。遂换成gittalk的评论系统。
# 开始：
## 新建comments_git.js
注：配置文件中的详细，自己网上查查。
```

if($('#gitalk-container').length>0){
  var gitalk = new Gitalk({

    // gitalk的主要参数
clientID: `Github Application clientID`,
clientSecret: `Github Application clientSecret`,
repo: `Github 仓库名`,//存储你评论 issue 的 Github 仓库名（建议直接用 GitHub Page 的仓库名）
owner: 'Github 用户名',
admin: ['Github 用户名'], //这个仓库的管理员，可以有多个，用数组表示，一般写自己,
id: 'window.location.pathname', //页面的唯一标识，gitalk 会根据这个标识自动创建的issue的标签,我们使用页面的相对路径作为标识


  });
  gitalk.render('gitalk-container');

}
```
## 找到comments.swig在最后一个endif之前
（目录：themes/next/layout/_partials/comments.swig）
```
<div id="gitalk-container"></div>
```
## 引入代码
_layour.swig
```
<script src="/js/src/pjax/comments/comments.gitalk.js"></script>
```
在这里引入而不再require引入的原因，就像我的另一篇文章，define只能定义一次，引不进去。
main.js
```
//
require.config({
  paths: {

    "music": "/dist/music",
    "aplayer": "/js/src/aplayer",
    "backgroudLine": "/js/src/backgroudLine",
    "category": "/js/src/category",
    "jquery.share.min":"/js/src/pjax/share/jquery.share.min",
    /*不显示图标的话替换fonts*/
    "share":"/js/src/pjax/share",
    "css":"/js/src/pjax/css",
    "comments":"/js/src/pjax/comments_git",
  },

  shim: {
    'share': {
      deps: [
        'css!/js/src/pjax/share/share.min','jquery.share.min'
      ]
    },
    'comments': {
      deps: [
        'css!https://unpkg.com/gitalk/dist/gitalk'
      ]
    }
  }
});
require(['backgroudLine','music','aplayer','category','jquery.share.min','share','css','comments'], function (){
});
```
如果没有用require的直接在_layout.swig
```
 <link rel="stylesheet" href="https://imsun.github.io/gitment/style/default.css">
 <script src="https://imsun.github.io/gitment/dist/gitment.browser.js"></script>
 //再引入comments_git.js
 <script src="xxxxxxxxxx/comments_git.js">
```
# pjax加入gitalk
同样重新调用comments_git.js即可
# 遇到的问题
## 所有的页面共享的一个评论issue
这个好像到现在的版本，人家已经优化的很好了。
注意上年的comments_git.js
中的配置id 改为location.pathname，即
```
id: location.pathname
```
意思是，根据目录创建不同的iss
## 本地4000启动报错401 没有权限
push到远端就没问题了。
## 未找到相关的Issues 进行评论，请联系xxx初始化创建
这个issue每次需要管理员，即作者你创建，怎么创建呢？在你自己的博客进入评论，登录自己的github账号，访问没有创建issues的博客，就初始化了。
这样岂不是很麻烦？
解决博客：https://link.jianshu.com/?t=https%3A%2F%2Fdraveness.me%2Fgit-comments-initialize
这个方法，我试过，没有成功，时间有限，就不深追了~
tips：里面的sitmap地图，如果是next地图在网址:https://你的博客地址/sitemap.xml
以后有时间或者能力允许的话，可能会写一个类似爬虫的脚本，完成这一操作~
### 发现自己的留言板明明评论了却不显示
原因：自己加入了pjax导致
手动刷新的地址是：https://mmmmmm.me/message/
pjax刷新的地址是：https://mmmmmm.me/message
因为gitalk创建issues是根据地址来创建的，所以不同的地址当然issues是不一样的啊。