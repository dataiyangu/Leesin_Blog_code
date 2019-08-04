$(function () {
  var oTop1 = $(document).scrollTop();
  function handleScroll() {
    //进行滚动时的相关处理
    var oTop2 = $(document).scrollTop();
    if (oTop2 > oTop1 ){
        //向下滑动隐藏
        $(".header_nav").css("background-color", "");
        $(".header_nav").stop().animate({top: "-50px"}, 80);
        $(".a_tag").stop().animate({top: "-50px"}, 80);
        // $(".header_nav").slideUp(300);
        // $(".a_tag").slideUp(300);
        $(".a_tag a").css("color", "#fff");
    } else if (oTop2<=2) {
      //滑到了顶部
      // $(".header_nav").css("opacity","0");
      $(".a_tag a").css("color","#fff");
      $(".header_nav").stop().animate({"opacity":'0'},80);
    } else {
      //向上滑动出现
      $(".header_nav").css("background-color","# ");
      $(".header_nav").stop().animate({top:'0px'},80);
      $(".a_tag").stop().animate({top:'0px'},80);
      // $(".header_nav").slideDown(300);
      // $(".a_tag").slideDown(300);
      $(".header_nav").css("opacity","0.9");
      $(".a_tag a").css("color","#666");

    }
    oTop1 = $(document).scrollTop();
  }

  var throttled = _.throttle(handleScroll, 100);
  $(window).scroll(throttled);

  //下面这里的废弃，因为这种不防抖，上面的能够防抖
  // var oTop1 = $(document).scrollTop();
  //   $(window).scroll(function () {
    // var oTop2 = $(document).scrollTop();
    // if (oTop2 > oTop1 ){
    //   if(fs) {
    //     //向下滑动隐藏
    //     $(".header_nav").css("background-color", "");
    //     // $(".header_nav").addClass("hide").removeClass("show");
    //     // $(".a_tag").addClass("hide").removeClass("show");
    //     $(".header_nav").stop().animate({top: "-50px"}, 200);
    //     $(".a_tag").stop().animate({top: "-50px"}, 200);
    //     // $(".header_nav").css("top","-50px");
    //     // $(".a_tag").css("top","-50px");
    //     // $(".header_nav").slideUp(300);
    //     // $(".a_tag").slideUp(300);
    //     $(".a_tag a").css("color", "#fff");
    //   }
    // } else if (oTop2<=2) {
    //   //滑到了顶部
    //   $(".header_nav").css("opacity","0");
    //   $(".a_tag a").css("color","#fff");
    //
    // } else {
    //   //向上滑动出现
    //   $(".header_nav").css("background-color","# ");
    //   // $(".header_nav").addClass("show").removeClass("hide");
    //   // $(".a_tag").addClass("show").removeClass("hide");
    //   $(".header_nav").stop().animate({top:'0px'},200);
    //   $(".a_tag").stop().animate({top:'0px'},200);
    //   // $(".header_nav").css("top","0px");
    //   // $(".a_tag").css("top","0px");
    //   // $(".header_nav").slideDown(300);
    //   // $(".a_tag").slideDown(300);
    //   $(".header_nav").css("opacity","0.9");
    //   $(".a_tag a").css("color","#666");
    //   fs = true;
    //
    // }
    // oTop1 = $(document).scrollTop();
  // });
});

