/*点击文章后滚动到顶部*/
function article_top() {
    function top(){
      var pathname = window.location.pathname
      var total = $(".header").innerHeight();
        // $(".header").css("padding-top")+
        // $(".header").css("padding-left")+
        // $(".header").css("padding-right")+
        // $(".header").css("padding-bottom");
      if (pathname.indexOf("html")>0) {

        $("html,article").animate({scrollTop:total},300)
      }
    }
    setTimeout(top,800);

  }
  
  article_top();
