/**
 * Created by ASUS on 2018/9/19.
 */
$(document).ready(function(){
    /********页面自定义头部赋值*******/
    var  username = GetUrlByParamName("username");     /*获取拼接name参数*/
    if(username){
        $("#wfall3Dku_tittle").html(username);      /*将URL的name赋值给页面tittle*/
    }else {
        $("#wfall3Dku_tittle").html("鲸落WFall");
    }
    /********页面右下角跳转链接赋值*********/
    var ip = GetUrlByParamName("ip");   /*获取拼接ip参数*/
    if(ip == "1"){
        $(".logo_name p").html("百度");
        $(".logo_name").click(function () {
            window.location.href='https://www.baidu.com/';
        });
    }else if (ip == "2"){
        $(".logo_name p").html("知乎");
        $(".logo_name").click(function () {
            window.location.href='https://www.zhihu.com';
        });
    }else {
        $(".logo_name p").html("鲸落www.WFall.cn");
        $(".logo_name").click(function () {
            window.location.href='https://www.wfall.cn/';
        });
    };



// 点击生成二维码
    $(document).ready(function(){
        /*如果已生成过二维码，则删除二维码img图片和canvas，重新生成；反之，则直接生成二维码*/
        if($('#imgDiv:has(img)').length!=0){
            $('#imgDiv img').remove();
            $('canvas').remove();
            $("#qr_btn").click(function () {
                createQr();
            })

        }else{
            $("#qr_btn").click(function () {
                createQr();
            })
        }
    });
// 生成二维码

    function createQr(){
        document.createElement('canvas').getContext('2d');
        var valName = utf16to8($("#qr_text").val());
        var valText = "https://www.wfall.cn/wfall3Dbox/wfall3Dku/wfall_BMWi8.html?ip="+ip+"&username="+valName;

// 采用正则表达式判断输入的内容是否是中文
        var reg=/^[\u0391-\uFFE5]+$/;
        if(valText!=""&&!reg.test(valName)){
// 如果不是中文，直接将输入的内容转换成二维码
            $('#qr_container').html("");
            $('#qr_container').qrcode({render:"canvas",height:150, width:150,correctLevel:0,text:valText});
        }else{
// 如果是中文，直接将输入的内容字符串转换成UTF-8，然后再转换成二维码
            $('#qr_container').html("");
            $('#qr_container').qrcode({render:"canvas",height:150, width:150,correctLevel:0,text:utf16to8(valText)});
        }

//获取网页中的canvas对象
        var mycanvas1=document.getElementsByTagName('canvas')[0];

//将转换后的img标签插入到html中
        var img = convertCanvasToImage(mycanvas1);
        //$('#imgDiv').append(img);//imgDiv表示你要插入的容器id
        $('#imgDiv').html(img);//imgDiv表示你要插入的容器id
    }

// 字符编码
    function utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for(i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            }
        }
        return out;
    }
//从canvas中提取图片image
    function convertCanvasToImage(canvas) {
//新Image对象，可以理解为DOM
        var image = new Image();
// canvas.toDataURL 返回的是一串Base64编码的URL
// 指定格式PNG
        image.src = canvas.toDataURL("image/png");
        return image;
    }
});


//获取URL拼接参数的方法
function GetUrlByParamName(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var URL =  decodeURI(window.location.search);
    var r = URL.substr(1).match(reg);
    if(r!=null){
        //decodeURI() 函数可对 encodeURI() 函数编码过的 URI 进行解码
        return  decodeURI(r[2]);
    }
    return null;
}
/*var  username = GetUrlByParamName("username");     /!*获取拼接name参数*!/
$("#wfall3Dku_tittle").html(username);      /!*将URL的name赋值给页面tittle*!/*/

$("#custom").click(function () {
    $("#erweima").css("display","block");
});
$("#close").click(function () {
    $("#erweima").css("display","none");
});