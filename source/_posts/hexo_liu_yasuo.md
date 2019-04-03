title: hexo next主题深度优化(六)，使用hexo-neat插件压缩页面，大幅度提升页面性能和响应速度
author: Leesin.Dong
top: 9999994
tags:
  - hexo
categories:
  - hexo
date: 2018-12-18 20:20:00
---
# ![upload successful](../images/my_blog_5.png)

> * 一篇关于next主题中加入发布压缩的插件，是不是速度又上了一个台阶？还有sei？

<!--more-->
# 隆重感谢：
https://blog.csdn.net/lewky_liu/article/details/82432003
https://blog.csdn.net/qq_21808961/article/details/84639472
# 背景
hexo 的文章是通过md格式的文件经过swig转换成的html，生成的html会有很多空格，而且自己写的js以及css中会有很多的空格和注释。
js和java不一样，注释也会影响一部分的性能，空格同样是的。
经过上网查阅，发现hexo有自带的压缩插件。
# 开始
## 试水
gulp
上网查阅资料，自己尝试过。
npm下载插件都下载中断了，可能我操作有误，有兴趣的小伙伴可以试一试。
## 成功的案例
### 安装插件，执行命令。
```
npm install hexo-neat --save
```
### hexo _config.yml文件添加
```
# hexo-neat
# 博文压缩
neat_enable: true
# 压缩html
neat_html:
  enable: true
  exclude:
# 压缩css  
neat_css:
  enable: true
  exclude:
    - '**/*.min.css'
# 压缩js
neat_js:
  enable: true
  mangle: true
  output:
  compress:
  exclude:
    - '**/*.min.js'
    - '**/jquery.fancybox.pack.js'
    - '**/index.js'  
```
### 坑
#### 跳过压缩文件的正确配置方式
如果按照官方插件的文档说明来配置exclude，你会发现完全不起作用。这是因为配置的文件路径不对，压缩时找不到你配置的文件，自然也就无法跳过了。你需要给这些文件指定正确的路径，万能的配置方式如下：
neat_css:
  enable: true
  exclude:
    - '**/*.min.css'
#### 压缩html时不要跳过.md文件
.md文件就是我们写文章时的markdown文件，如果跳过压缩.md文件，而你又刚好在文章中使用到了NexT自带的tab标签，那么当hexo在生成静态页面时就会发生解析错误。这会导致使用到了tab标签的页面生成失败而无法访问。
#### 压缩html时不要跳过.swig文件
.swig文件是模板引擎文件，简单的说hexo可以通过这些文件来生成对应的页面。如果跳过这些文件，那么你将会发现，你的所有页面完全没有起到压缩的效果，页面源代码里依然存在着一大堆空白。
#### 点击的桃心效果消失
```
# 压缩js
neat_js:
  enable: true
  mangle: true
  output:
  compress:
  exclude:
    - '**/*.min.js'
    - '**/jquery.fancybox.pack.js'
    - '**/index.js'  
    - '**/love.js'
```
#### gitalk js文件报错
  在上面的代码底部加入如下代码

```
- '**/comments.gitalk.js'
  ```
####  jquery pjax min js报错
我这里的 jquery pjax min js是指的加入pjax前需要以来的两个cdn文件，一个是jq，一个是它，我将它下载到了本地，不要在意这些细节~
  同样加入如下代码
  ```
  - '**/jquery_pjax_min_js.js'
  ```