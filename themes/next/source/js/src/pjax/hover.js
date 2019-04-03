// 为了将左侧的小乖乖们自动隐藏出现

function outArticle() {
  $(".eye").animate({left: 0},
    {duration:500, easing:"easeOutBounce",complete:function () {
      }}
  );

  // $(".eye").css("left",0)
  $(".header_left").animate({left: 0},
    {duration:500, easing:"easeOutBounce",complete:function () {
      }}
  );
  // $(".header_left").css("left",0)

  $(".aplayer-body").animate({left: "-66px"},
    {duration:80, easing:"easeOutBounce",complete:function () {
      }}
  );
  // $(".aplayer-body").css("left","-66px")
}


function inArticle(){
  $(".eye").animate({left: "-18px"},
    {duration:500, easing:"easeOutBounce",complete:function () {
      }}
  );

  // $(".eye").css("left","-18px")

  $(".header_left").animate({left: "-18px"},
    {duration:500, easing:"easeOutBounce",complete:function () {
      }}
  );
  // $(".header_left").css("left","-18px")
  if (($(".header_left").css("width")).indexOf("80")!= -1) {
    $(".header_sidebar").click()
  }
  if ($(".eye1").css("display")=="block"){
    $(".eye2").click()
  }
  if ($(".aplayer-body").css("left").indexOf("-84") == -1 | $(".aplayer-body").css("left").indexOf("-66") == -1){
    if ($(".aplayer-narrow").length!=1){
      $(".aplayer-miniswitcher").click()

      $(".aplayer-body").animate({left: "-84px"},
        {duration:80, easing:"easeOutBounce",complete:function () {
          }}
      );
      // $(".aplayer-body").css("left","-84px")
    }
  }

    $(".aplayer-body").animate({left: "-84px"},
      {duration:80, easing:"easeOutBounce",complete:function () {
        }}
    );
    // $(".aplayer-body").css("left","-84px")


}


function hover_sidebar() {





  var out_id = 0;
  $( ".hover_sidebar" ).hover( function() {
    out_id = setTimeout( function() {
      //当触发hover就开始自动在1秒后执行相应代码
      outArticle()

    }, 1000 );
  }, function() {
    clearTimeout( out_id );//当在1秒内退出了hover事件就取消计时代码

  } );


  var in_id = 0;
  $( "#posts").hover( function() {
    in_id = setTimeout( function() {
      //当触发hover就开始自动在1秒后执行相应代码


      inArticle()

    }, 1000 );
  }, function() {
    clearTimeout( in_id );//当在1秒内退出了hover事件就取消计时代码
  } );

}


hover_sidebar()

$(function () {
  setTimeout(inArticle,2000)
});
