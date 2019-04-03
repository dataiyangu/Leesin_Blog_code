title: hexo next主题深度优化(二)，懒加载
author: Leesin.Dong
top: 9999998
tags:
  - hexo
categories:
  - hexo
date: 2018-12-18 20:15:00
---
# ![upload successful](../images/my_blog_26.png)
> * 关于next注意中加入懒加载机制的文章，让你的博客如丝般顺滑。



<!--more-->


# tip：没有耐心的可以直接看：正式在hexo next中加入懒加载（最下面）
# 废话
本来想全部优化完，一起写博客的，大半夜的也不想太累，可是可能因为年纪大了吧（23了），怕隔天给忘记了，到时候回头找错误岂不是浪费更多的时间，索性，今天拖着疲惫的大脑，写下这篇博文吧~
# 背景
本人的博客mmmmmm.me （目前可能还是问题很多的，不介意的可以稍微看一下）  pjax基本优化完了，目前我涉及到的，现在想优化一下网站的加载速度，因为我的网站刚进去的时候白屏大半天，然后浏览器的转盘转半天，（就是刷新那个标识了，不会表达），之后就是一堆查看通过浏览器的审查模式看network，发现首页的大图片占了很久的响应时间，之后发现我的hexo后台管理工具，hexo-admin（一个很方便的博客发布工具，有兴趣的看我另一篇博客，网上一搜一大堆），每次直接复制粘贴进去，它默认保存的是png格式的，关于jpg和png的区别，希望大家也了解一下，使得我的图片好几兆，我就手动复制成jpg格式的，但是还是不行的呀，这个时候，就上网查各种优化，发现，有个懒加载这个东东，客观往下看。
# 懒加载简单介绍
>何为懒加载，简言之就是在html加载的时候，若果img标签的src是有内容的，在加载的过程中，img标签就回去请求这个图片，知道加载完，我们的浏览器的刷新那个图标才会停止转动，也就是才算请求玩，这个时候懒加载就应运而生。懒加载能够在你鼠标不懂得时候只加载目前电脑窗口内需要展示的图片，电脑屏幕内部需要展示的图片就暂时不加载，对于图片比较多的网站是不是很实用呢？

关于懒加载的语法简单介绍一下：
## 引入js

```js
 <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript" src="jquery.lazyload.js"></script>
```
   
## 重点！敲黑板了！！！
修改图片属性（增加data-original属性，去掉src属性）

```js
    <img alt="" width="640" height="480" data-original="img/example.jpg" />

```

## 完善懒加载函数

```js
 <script>
    $(function() {
        $("img").lazyload();
    });
  <script>
```   

## 懒加载函数可配置的参数
备注：这里必须设置图片的width和height,否则插件可能无法正常工作。

　　上面是最简单的调用，但是一般而言，我们还有一些特殊的需求，比如想要提前一点点加载，避免网络过慢时加载缓慢，加载隐藏图片等等，lazyload都为我们提供相应的参数。

　　1.设置临界点

　　　　默认情况下图片会出现在屏幕时加载. 如果你想提前加载图片, 可以设置threshold 选项, 如：设置 threshold 为 200 令图片在距离屏幕 200 像素时提前加载.
　　　　

    $("img").lazyload({
        threshold : 200
    });

　　2.使用特效

　　　　默认情况下，图像完全加载并调用show()。你可以使用任何你想要的效果。下面的代码使用fadeIn （淡入效果）

```js
    $("img").lazyload({
        effect : "fadeIn"
    });
```

　　3.当图片不连续时

　　滚动页面的时候, Lazy Load 会循环为加载的图片. 在循环中检测图片是否在可视区域内. 默认情况下在找到第一张不在可见区域的图片时停止循环. 图片被认为是流式分布的, 图片在页面中的次序和 HTML 代码中次序相同. 但是在一些布局中, 这样的假设是不成立的. 不过你可以通过 failurelimit 选项来控制加载行为.

```js
    $("img").lazyload({
        failure_limit : 20
    });
    　　
```

将 failurelimit 设为 20 ，当插件找到 20 个不在可见区域的图片时停止搜索.

　　4.加载隐藏图片

　　当界面有很多隐藏图片的时候并希望加载他们的时候则使用kip_invisible 属性，将其设置为false

 

```js
   $("img").lazyload({ 
        skip_invisible : false
    });

```

　　到这里，上面的方法已经基本满足常规的懒加载使用了，还有特殊的使用，可查看官网API。

	
#  正式在hexo next中加入懒加载

之前尝试过很多方法：
## 1：
如上查看相关的懒加载api文档，自定义懒加载函数，但是忽略了，img中需要data-original，并且去掉src属性，之后发现然后弥补，想要通过js的方式动态的给我的img加入这个属性，然后去掉src属性，但是js加入的前提是加载完dom模型，加载完dom模型的前提是src中的内容已经加载了，所以是不行的，故尝试修改html，next主题中没有html事swig文件，img中的内容是通过js渲染出来的。故放弃。
## 2：
上谷歌查看，发现可以：

```js
    npm install hexo-lazyload --save

```

然后修改_config.yml文件

   

```js
 lazyload:
      enable: true
      # className: #可选 e.g. .J-lazyload-img
      # loadingImg: #可选 eg. .../images/loading.png
```

可是我发现貌似是不行的，反正报各种错，网上好像是有人成功的。这个方法待定，附上原博客地址，感兴趣的可以研究。
http://www.zhaojun.im/hexo-lazyload/
## 3：按我的步骤来，不要问为什么。
我自己成功的方法：
在主题文件夹下的scripts文件夹里，写一个 js 文件，名字不限，xxxx.js,比如wohaoshuai.js

```js

    use strict';
    var cheerio = require('cheerio'); 
      
    function lazyloadImg(source) {
        var LZ= cheerio.load(source, {
            decodeEntities: false
        });
        //遍历所有 img 标签，添加data-original属性
        LZ('img').each(function(index, element) {
            var oldsrc = LZ(element).attr('src');
            if (oldsrc) {
                LZ(element).removeAttr('src');
                LZ(element).attr({
                    
                     'data-original': oldsrc
                });
                
            }
        });
        return LZ.html();
    }
    //在渲染之前，更改 img 标签
    hexo.extend.filter.register('after_render:html', lazyloadImg);
```

然后网上是说在header或者footer中引入js

```js
     <script type="text/javascript" src="http://libs.baidu.com/jquery/1.11.1/jquery.min.js"></script>
     //也可替换其他的lazyload源
    <script type="text/javascript" src="http://apps.bdimg.com/libs/jquery-lazyload/1.9.5/jquery.lazyload.min.js"></script>
        <script type="text/javascript">
          $(function() {  
          //对所有 img 标签进行懒加载        
              $("img").lazyload({
              //设置占位图，我这里选用了一个 loading 的加载动画
                placeholder:"/img/loading.gif",
                //加载效果
                  effect:"fadeIn"
                });
              });
        </script>
```

但是我发现hexo next主题中有个themes/next/source/js/src/utils.js文件。
找到这个方法：

  

```js
  lazyLoadPostsImages: function () {
        // $('#posts').find('img').lazyload({
        //   placeholder: '../images/loading.gif',
        //   effect: 'fadeIn',
        //   threshold : 0
        // });
        $('img').lazyload({
           placeholder: '../images/loading.gif',
          effect: 'fadeIn',
          threshold : 100,
          failure_limit : 20,
          skip_invisible : false
        });
      },
```

  
修改内容即可，之前是注释掉的内容，意思是只对article中的内容进行懒加载，可是我需要的是全局的都懒加载，因为上面的scripts中的js已经将全局的img都替换了标签内容，不全局懒加载的话会有的不显示，
然后就是这两个配置：
 	   

```js

     threshold : 100,
      ailure_limit : 20,
```

意思上面有关懒加载的说的很清楚了，为了解决有的图片可能会不显示。