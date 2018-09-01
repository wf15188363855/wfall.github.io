/**
 * Created by ASUS on 2018/8/28.
 */
/*tittle标签滚动变化文字*/
var tx = new Array (
    "鲸落TV",
    "免费看超清院线电影",
    "免费看所有平台VIP视频",
    "任意你想看的东西",
    "尽在www.wfall.cn");
var txcount=5;
var i=1;
var wo=0;
var ud=1;
//定义i、wo、ud三者的初值
function animatetitle()
{
    window.document.title=tx[wo].substr(0, i)+"_";
    if (ud==0) i--;
    if (ud==1) i++;
    if (i==-1) {ud=1;i=0;wo++;wo=wo%txcount;}
    if (i==tx[wo].length+10) {ud=0;i=tx[wo].length;}

    parent.window.document.title=tx[wo].substr(0, i)+"_";
    setTimeout("animatetitle()",100);
}
animatetitle();
document.addEventListener("visibilitychange",function(){document.title=document.hidden?"出BUG了，快看！":"一点点白"});


//hover显示二维码事件
$(".mphone").hover(function(){
    $(this).parent().parent().parent().children(".mphone-img").css("display","block");
},function(){
    $(this).parent().parent().parent().children(".mphone-img").css("display","none");
});


//搜索框功能
$(function(){
    var aa;
    $("#j_search_btn").click(function () {
        var rel = $("#show_class").attr('rel');
        if(rel == "baidu"){
            aa = "https://www.baidu.com/s?wd="
        }else if(rel == "zhihu"){
            aa = "https://www.zhihu.com/search?type=content&q="
        }else if(rel == "taobao"){
            aa = "https://s.taobao.com/search?q="
        }else if(rel == "tianmao"){
            aa = "https://list.tmall.com/search_product.htm?q="
        }
        window.open(aa+$("#j_search_word").val());
    })
});

//顶部站内搜索alert
function siteSearch() {
    alert("请您同时按“Ctrl+F”。\n\n然后在弹出的输入框内输入您想找的内容。");
}
//网站3D版跳转
function threeDim() {
    window.open("iframe3D/iframe3D.html");
    /*window.location = "https://www.baidu.com"*/
}
