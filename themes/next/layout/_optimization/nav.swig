<script>
$(function(){
$(".header").css("background-image",
"url('https://res.cloudinary.com/dqxtn0ick/image/upload/v1542285471/header/home.jpg')");
})
</script>


{#pjax没有包住header，不论怎么弄个pjax处理的话，都不会切换图片，这里保留这里的逻辑#}
{#
{% if is_home() %}
<script>
$(function(){
$(".header").css("background-image",
"url('https://res.cloudinary.com/dqxtn0ick/image/upload/v1542285471/header/home.jpg')");
})
</script>

{% elseif is_post() %}
<script>
$(function(){
$(".header").css("background-image",
"url('https://res.cloudinary.com/dqxtn0ick/image/upload/v1542285471/header/building.jpg')");
})
</script>

{% else %}
<script>
$(function(){
$(".header").css("background-image",
"url('https://res.cloudinary.com/dqxtn0ick/image/upload/v1542285471/header/tags.jpg')");
})
</script>
{% endif %}
#}
