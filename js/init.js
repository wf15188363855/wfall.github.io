/**
 * Created by Administrator on 2018/8/17 0017.
 */
//设为首页 999 设为主页函数
function SetHome(obj,url){
    alert("请您同时按“Ctrl+D”,然后按“Enter键”。\n\n即可将本站【"+url+"】添加至书签栏内。");
}

//加入收藏函数
function AddFavorite(title, url) {
    try {
        window.external.addFavorite(url, title);
    }
    catch (e) {
        try {
            window.sidebar.addPanel(title, url, "");
        }
        catch (e) {
            alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请进入新网站后使用Ctrl+D进行添加");
        }
    }
}

/* 轮播插件 */
(function($){
    $.fn.extend({
        xTaber: function(opt){
            var def = $.extend({
                /* @tab 触发事件标签 [true|false|obj]
                 * true 自动生成带数字的标签
                 * false 不显示tab
                 * obj 自定义tab
                 */
                tab: true, //默认为自动生成
                content:$('#xtaberWrap'),
                prev: null, //上一个按钮
                next: null, //下一个按钮
                /* @style 滚动的样式 [opacity|left|top|none]
                 * opacity 淡出淡入
                 * left 向左
                 * top 向上
                 * none 无效果
                 */
                style: 'opacity', //默认为opacity
                activeClass: 'current', //当前样式
                delay: 100, //操作延时
                speed: 300, //移动速度
                timeout: 3000, //间歇时间
                auto: false, //是否自动滚动
                setup: 1,//每次滚动多少个
                defaultShow: 1, //默认显示第n个
                mouseEvent: 'mouseover', //鼠标事件
                tabedCallback: null //切换后的回调函数
            }, opt);

            if(typeof def.setup != Number && def.setup < 1) def.setup = 1;
            // 内部通用变量
            var self = def.content,
                content = self.find('[rel="xtaberItems"]'),
                subItem = content.find('.xtaber-item'),
                itemLength = subItem.length,
                subItemHeight =
                    parseInt(subItem.height())+
                    parseInt(subItem.css('marginTop'))+
                    parseInt(subItem.css('marginBottom'))+
                    parseInt(subItem.css('paddingTop'))+
                    parseInt(subItem.css('paddingBottom')),
                subItemWidth =
                    parseInt(subItem.width())+
                    parseInt(subItem.css('marginLeft'))+
                    parseInt(subItem.css('marginRight'))+
                    parseInt(subItem.css('paddingLeft'))+
                    parseInt(subItem.css('paddingRight')),
                scrollHeight = subItemHeight * def.setup,
                scrollWidth = subItemWidth * def.setup,
                screenNum,
                current = 0,
                autoTimer,
                itemTimer,
                tabItem = null;

            //滚动屏数
            if(def.setup == 1){
                screenNum = itemLength;
            }
            else{
                var inAll = (itemLength % def.setup),
                    num = parseInt(itemLength / def.setup);
                screenNum = (inAll > 0) ? (num+1) : num;
            }

            var init = function(){
                // 自动生成tab
                if(def.tab && typeof def.tab != 'object'){
                    var tabHTML = '<ol rel="xtaberTabs" class="xtaber-tabs">';
                    for(var i=1; i<=screenNum; i++){
                        tabHTML += '<li rel="xtaberTabItem">'+i+'</li>';
                    }
                    tabHTML += '</ol>';
                    self.append(tabHTML);
                    def.tab = self.find('[rel="xtaberTabs"]');
                }
                else if(typeof def.tab == 'object'){
                    def.tab = self.find('[rel="xtaberTabs"]');
                }
                else{
                    def.tab = null;
                }

                if(def.tab != null){
                    tabItem = def.tab.find('[rel="xtaberTabItem"]');
                }

                if(typeof def.next == 'boolean' && def.next){
                    def.next = $('<span rel="xtaberNext">next</span>');
                    def.next.appendTo(self);
                }
                if(typeof def.prev == 'boolean' && def.prev){
                    def.prev = $('<span rel="xtaberPrev">prev</span>');
                    def.prev.appendTo(self);
                }

                switch(def.style){
                    case 'left':
                        setParent('left');
                        break;
                    case 'top':
                        setParent('top');
                        break;
                }

                goTo(def.defaultShow - 1);

                bindEvent();
                if(def.auto){auto();}
            }
            //设置父级的样式
            var setParent = function(type){
                var wrapHeight,wrapWidht,contentWidth,contentHeight;
                if(type == 'top'){
                    contentHeight = subItemHeight * itemLength;
                    contentWidth = subItemWidth;
                }
                else if(type == 'left'){
                    contentHeight = subItemHeight;
                    contentWidth = subItemWidth * itemLength;
                }
                //alert(typeof(subItemWidth));
                content.css({
                    left: 0,
                    top: 0,
                    position: 'absolute',
                    width: contentWidth,
                    height: contentHeight
                });
            }

            var goTo = function(index){
                //clearInterval(autoTimer);
                clearTimeout(itemTimer);
                current = index;
                switch(def.style){
                    case 'top':
                        content.stop().animate({'top': -(index * scrollHeight)}, def.speed);
                        break;
                    case 'left':
                        content.stop().animate({'left': -(index * scrollWidth)}, def.speed);
                        break;
                    case 'opacity':
                        subItem.eq(index).fadeIn().siblings().hide();
                        break;
                    default:
                        subItem.eq(index).show().siblings().hide();
                        break;
                }
                if(def.tab != null){
                    tabItem.eq(index).addClass(def.activeClass).siblings().removeClass(def.activeClass);
                }
                if(def.tabedCallback){
                    def.tabedCallback();
                }
            }
            var auto = function(){
                if(def.auto){
                    //鼠标事件绑定
                    content.hover(
                        function(){if(autoTimer)clearInterval(autoTimer);},
                        function(){
                            autoTimer = setInterval(function(){
                                var goNum = (current + 1 >= screenNum) ? 0 : current + 1;
                                goTo(goNum);
                            }, def.timeout);
                        }).mouseout();
                }
            }
            //绑定事件
            var bindEvent = function(){
                if(def.tab != null){
                    tabItem.each(function(){
                        var el = $(this);
                        el.bind(def.mouseEvent, function(){
                            clearInterval(autoTimer);
                            clearTimeout(itemTimer);
                            itemTimer = setTimeout(function(){
                                goTo(el.index());
                            }, def.delay);
                        });

                        el.bind('mouseleave', function(){
                            clearTimeout(itemTimer);
                        });
                    });
                }

                if(def.next){
                    def.next.click(function(e){
                        var currentNum = (current + 1 >= screenNum) ? 0 : current + 1;
                        goTo(currentNum);
                        e.preventDefault();
                    });
                }

                if(def.prev){
                    def.prev.click(function(e){
                        var currentNum = (current - 1 < 0) ? screenNum - 1 : current - 1;
                        goTo(currentNum);
                        e.preventDefault();
                    });
                }
            }
            init();
        }
    });
})(jQuery);



//设置首页，还有cookie操作，日期
var tools = {
    setHome: function(obj,hostname){
        if(!$.browser.msie){
            alert("您的浏览器不支持自动设置主页，请使用浏览器菜单手动设置。")
            return;
        }
        var host = hostname;
        if(!host){
            host = window.location.href;
        }
        obj.style.behavior = 'url(#default#homepage)';
        obj.setHomePage(host);
    },
    cookie: {
        set:function(name,value,expires,path,domain){
            if(typeof expires=="undefined"){
                expires = 365;
            }
            expires=new Date(new Date().getTime()+1000*3600*24*expires);
            document.cookie=name+"="+escape(value)+((expires)?"; expires="+expires.toGMTString():"")+((path)?"; path="+path:"; path=/")+((domain)?";domain="+domain:"");

        },
        get:function(name){
            var arr=document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
            if(arr!=null){
                return unescape(arr[2]);
            }
            return null;
        },
        clear:function(name,path,domain){
            if(this.get(name)){
                document.cookie=name+"="+((path)?"; path="+path:"; path=/")+((domain)?"; domain="+domain:"")+";expires=Fri, 02-Jan-1970 00:00:00 GMT";
            }
        }
    },
    format: function(_, B) {
        if (arguments.length > 1) {
            var F = tools.format,
                H = /([.*+?^=!:${}()|[\]\/\\])/g,
                C = (F.left_delimiter || "{").replace(H, "\\$1"),
                A = (F.right_delimiter || "}").replace(H, "\\$1"),
                E = F._r1 || (F._r1 = new RegExp("#" + C + "([^" + C + A + "]+)" + A, "g")),
                G = F._r2 || (F._r2 = new RegExp("#" + C + "(\\d+)" + A, "g"));
            if (typeof(B) == "object"){
                var result = _.replace(E,
                    function(_, A) {
                        var $ = B[A];
                        if (typeof $ == "function") $ = $(A);
                        return typeof($) == "undefined" ? "": $
                    });
                // alert(result);
                return result;
            }else if (typeof(B) != "undefined") {
                var D = Array.prototype.slice.call(arguments, 1),
                    $ = D.length;
                return _.replace(G,
                    function(A, _) {
                        _ = parseInt(_, 10);
                        return (_ >= $) ? A: D[_]
                    })
            }
        }
        return _
    },
    pngfix: function(img){
        if (window.XMLHttpRequest) {return}
        var imgStyle = "display:inline-block; " + img.style.cssText;
        var strNewHTML = "<span class=\"" + img.className + "\" title=\"" + img.title + "\" style=\"width:" + img.clientWidth + "px; height:" + img.clientHeight + "px;" + imgStyle + ";" + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img.src + "', sizingMethod='crop');\"></span>";
        img.outerHTML = strNewHTML;
    },//ie6 png
    dateFormat: function(format){
        var now = new Date((new Date).getTime()+864E5);
        var o = {
            "M+" : now.getMonth()+1, //month
            "d+" : now.getDate(), //day
            "h+" : now.getHours(), //hour
            "m+" : now.getMinutes(), //minute
            "s+" : now.getSeconds(), //second
            "q+" : Math.floor((now.getMonth()+3)/3), //quarter
            "S" : now.getMilliseconds() //millisecond
        }

        if(/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (now.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return format;
    }

};

(function($){
    $.extend($.fn, {
        xAutocomplete: function(opts){
            opts = $.extend({},
                {
                    node: null,
                    delay: 0,
                    param: null,
                    source: 'su',
                    fix: {
                        x: 0,
                        y: 0
                    },
                    extSource: ["示例"],
                    border: true,
                    onchange: null,
                    onselect: null,
                    extBtn: null
                }, opts);

            var keys = {
                RETURN: 13,
                BACKSPACE: 8,
                SPACE: 32,
                UP: 38,
                DOWN: 40,
                ESC: 27
            };

            var self = this,
                cacheData = {},
                currentData = [],
                lastKeyPress = null,
                lastSelectedValue = null,
                active = false,//当有自动完成的值时
                local = $.isArray(opts.source),
                mouseInSelect = false,
                timeOutActive = null,
                lastProcessValue = null,
                menuContainer = null,
                node = opts.node,
                form = $(node).parents('form'),
                delay = opts.delay,
                extBtn = opts.extBtn,
                extEvent = false;

            var init = function(){
                    //bind event
                    node.bind('keydownEvent', function(e, event){
                        _keydownEvent.apply(self, [event]);
                    }).bind('blurEvent', function(){
                        _blurEvent.apply(self);
                    }).attr('autocomplete', 'off');
                    //trigger event
                    node.keyup(function(e){
                        node.trigger('keydownEvent', [e]);
                    }).blur(function(e){
                        node.trigger('blurEvent');
                    });
                    if(extBtn != null){
                        extBtn.bind('click', function(e){
                            extBtn.find('.arr').addClass('up');
                            $(this).find('.num').css('visibility', 'hidden');
                            var hotNewTime = new Date().getTime();
                            tools.cookie.set('__hotNewNum_', hotNewTime);
                            extEvent = true;
                            if(active){
                                _blurEvent();
                            }
                            else{
                                activeAutoComplete();
                            }
                            e.preventDefault();
                            e.stopPropagation();
                        });
                    }
                    $('body').bind('click',_blurEvent);
                },
                dealData = function(data){
                    return data;
                },
                isResult = function(data){
                    return data.length;
                },
                destroy = function(){
                    node.unbind('keydownEvent').unbind('blurEvent').removeAttr('autocomplete');
                },
                _keydownEvent = function(e){
                    extEvent = false;
                    //var self = this;
                    lastKeyPress = e.keyCode;
                    switch (lastKeyPress) {
                        case keys.UP:
                            e.preventDefault();
                            if (active) {
                                focusPrev();
                            }
                            break;
                        case keys.DOWN:
                            e.preventDefault();
                            if (active) {
                                focusNext();
                            }
                            else {
                                activeAutoComplete();
                            }
                            break;
                        case keys.RETURN:
                            e.preventDefault();
                            if(active) {
                                selectCurrent();
                                return false;
                            }
                            break;
                        case keys.ESC:
                            //esc
                            e.preventDefault();
                            if(active) {
                                finish();
                            }
                            break;
                        default:
                            activeAutoComplete();
                    }
                },
                _blurEvent = function(){
                    if(!mouseInSelect){
                        finish();
                        if(extEvent){
                            extBtn.find('.arr').removeClass('up');
                        }
                    }
                },
                activeAutoComplete = function(){
                    if(timeOutActive){
                        clearTimeout(timeOutActive);
                    }
                    if(delay && !local){
                        timeOutActive = setTimeout(function(){
                            activeNow();
                        }, delay);
                    }
                    else {
                        activeNow();
                    }
                },
                activeNow = function(){
                    var value = $.trim(node.val());
                    /*if (value.length < 1) {
                     finish();
                     lastProcessValue = null;
                     return;
                     }*/
                    if (value != lastSelectedValue) {
                        lastProcessValue = value;
                    }
                    getData(value);
                },
                finish = function(){
                    active = false;
                    menuContainer && menuContainer.hide();
                },
                getData = function(value){
                    if (typeof opts.source == 'string') {
                        /*var sendData = {},
                         name = opts.param ? opts.param : node.attr('name');
                         sendData[name] = lastProcessValue;*/
                        value = encodeURIComponent(value);
                        var url = _autoCompleteData.url + value;
                        var tnInput = form.find('[name="tn"]');
                        if(extEvent){
                            parseData(_autoCompleteData.hotData);
                            if(!form.find('[name="from"]').length){
                                form.append('<input type="hidden" name="from" value="news" />');
                            }
                            //tnInput.val(dropTn);/* 设置其他TN值 */
                        }
                        else{
                            $.ajax({
                                url: url,
                                dataType: 'script',
                                scriptCharset: 'gb2312',
                                success: function(r){
                                    currentData = eval(_autoCompleteData.data);
                                    parseData(currentData)
                                }
                            });
                            /*var newTn = BaiduTn.tn,
                             href = location.href;
                             if(href.indexOf('?xzb') > -1){
                             newTn = sourceTn;
                             }*/
                            //tnInput.val(sourceTn);
                            if(form.find('[name="from"]').length){
                                form.find('[name="from"]').remove();
                            }
                        }
                    }
                },
                parseData = function(data){
                    if(isResult(data)){
                        active = true;
                        createDom();
                        position();
                        var data = dealData(data)
                        renderMenu(data, lastProcessValue);
                    }
                    else{
                        finish();
                    }
                },
                createDom = function(){
                    if (menuContainer) {
                        return;
                    }
                    else {
                        var div = $('<div/>').addClass('autocomplete-container'), ul = $('<ul/>');
                        menuContainer = div;
                        menuContainer.append(ul);
                        menuContainer.appendTo(document.body);
                        ul.delegate('li', 'mouseover', function(){
                            $(this).addClass('autocomplete-hover').siblings().removeClass('autocomplete-hover');
                            mouseInSelect = true;
                            var val = $('li.autocomplete-hover',menuContainer).data('value');
                            //node.val(val);
                        }).delegate('li', 'mouseout', function(){
                            mouseInSelect = false;
                        }).delegate('li', 'click', function(){
                            lastSelectValue = $(this).data('value');
                            mouseInSelect = false;
                            finish();
                            node.val(lastSelectValue);
                            $(node).parents('form').submit();
                        });
                        menuContainer.click(function(){return false;});
                    }
                },
                renderMenu = function(data, value){
                    var ul = menuContainer.find('ul');
                    ul.empty();
                    $.each(data, function(i, item){
                        if (!extEvent) {
                            var li = $('<li/>').data('value', item);
                            item = item.replace(value, '<b class="imp">' + value + '</b>');
                            li.html(item);
                        }
                        else {
                            var key = item.split('|')[0];
                            var isnew = item.split('|')[1];
                            var li = $('<li/>').data('value', key);
                            li.html('<i class="auto-raq auto-'+(i+1)+'">'+(i+1)+'</i><i class="auto-key">'+key+'</i><i class="isnew-'+isnew+'"></i>');
                        }
                        ul.append(li);
                    });
                    menuContainer.show();
                },
                position = function(){
                    menuContainer.css('position', 'absolute');
                    var offset = node.offset(),
                        height = node.outerHeight(),
                        width = node.outerWidth(),
                        border = opts.border ? 2 : 0;
                    //alert(t)
                    menuContainer.css({
                        top: offset.top + height + opts.fix.y,
                        left: offset.left + opts.fix.x,
                        width: width - border
                    });
                },
                //移动选中
                focus = function(index){
                    var items = $('li', menuContainer), hasSelect = false;
                    if (items.length) {
                        for (var i = 0; i < items.length; i++) {
                            if (items.eq(i).hasClass('autocomplete-hover')) {
                                selectItem(i + index);
                                hasSelect = true;
                                return;
                            }
                        }
                        if (!hasSelect) {
                            selectItem(0);
                        }
                    }
                },
                focusNext = function(){
                    focus(1);
                },
                focusPrev = function(){
                    focus(-1);
                },
                selectItem = function(index){
                    var items = $('li', menuContainer);
                    index = index < 0 ? items.length - 1 : index;
                    index = index == items.length ? 0 : index;
                    items.removeClass('autocomplete-hover');
                    items.eq(index).addClass('autocomplete-hover');
                    var val = $('li.autocomplete-hover', menuContainer).data('value');
                    node.val(val);
                    if (lastSelectedValue && !lastSelectedValue != val) {
                        if(opts.onchange)
                            opts.onchange(val);
                    }
                    lastSelectedValue = val;
                },
                selectCurrent = function(){
                    var val = $('li.autocomplete-hover',menuContainer).data('value');
                    if(val != '' && val != undefined){
                        node.val(val);
                        lastSelectValue = val;
                        if(opts.onselect){
                            onselect(val);
                        }
                        finish();
                    }
                };
            init();
        }
    });

})(jQuery);

/* 百度搜索框 end */

$(function(){


    /* 分类导航 */
    if($('.classify-nav').get(0)){
        var classify = $('.classify');
        var classifyBtn = $('.classify-nav');
        classifyBtn.hover(function() {
            $(this).addClass('cn-current');
            classify.show();
        }, function() {
            $(this).removeClass('cn-current');
            classify.hide();
        });
    }

    /* 使用工具 */
    if ($('.uc-list').get(0)){
        var ucList = $('.uc-list');
        var ucListA = $('.uc-list').find('a');
        var ucCurrent= '<div class="uc-current"></div>';
        ucListA.hover(function() {
            $(this).append(ucCurrent);
            $(this).addClass('cul-current');
        }, function() {
            $('.uc-current').remove();
            $(this).removeClass('cul-current');
        });
    }

    /* 浏览量 */
    if($('.all-web').get(0)){
        /* 暂时没有数据去掉 */
        /*var allWebTd = $('.all-web td');
         allWebTd.hover(function() {
         $(this).find('.web-pv').show();
         }, function() {
         $(this).find('.web-pv').hide();
         });*/

        /* 表格补全 */
        $('.all-web').each(function(){
            var tdLen = $(this).find('tr:last>td').length;
            if(tdLen < 5 && tdLen > 0){
                for(var i=0;i<(5-tdLen);i++){
                    $(this).find('tr:last').append('<td></td>');
                }
            }
        });
    }


    /* 搜索框 */
    if ($('.search-list').get(0)){
        var searchList = $('.search-list');
        searchList.click(function(event){
            if ($(this).hasClass('sl-current')) {
                $(this).removeClass('sl-current');
                $(this).siblings('i').removeClass('i-add-rotate');
            }else{
                $(this).addClass('sl-current');
                $(this).siblings('i').addClass('i-add-rotate');
            }
            event.stopPropagation();
        });
        searchList.children('li').click(function(){
            var _this = $(this);
            $('#show_class').html(_this.html()).attr('rel',_this.attr('rel'));
        });


        $(window).click(function(){
            $('.search-list').removeClass('sl-current');
            $('.search-list').siblings('i').removeClass('i-add-rotate');
        });
    }

    /* 一周天气列表 */
    if ($('.all-weather').get(0)) {
        //天气hover
        var weatherLi = $('.all-weather li');
        var weatherTimer;
        weatherLi.mouseover(function() {
            var _this = $(this);
            weatherTimer = setTimeout(function(){
                _this.addClass('current').siblings('li').removeClass('current');
            },100);
        }).mouseout(function(){
            clearTimeout(weatherTimer);
        });

        //展示更多天气
        var weatherBtn = $('.more-weather');
        var moreWeather = $('#more_weather');
        weatherBtn.click(function(){
            var _this = $(this);
            moreWeather.slideToggle(400);
            var thisSpanHtml = _this.children('span').html();
            if ( thisSpanHtml == '展开更多') {
                _this.children('span').addClass('mw-span-add').html('收起更多');
            }else{
                _this.children('span').removeClass('mw-span-add').html('展开更多');
            }
        });
    };



    /* 关注的城市天气 */
    if($('.attention').get(0)){
        var attentionLi = $('.attention li');
        var attentionEditBtn = $('.attention-edit');
        //hover 过去才显示编辑按钮
        attentionLi.hover(function(){
            $(this).children('.attention-edit').show();
        },function(){
            $(this).children('.attention-edit').hide();
        });
        //点击编辑按钮的时候切换
        attentionEditBtn.click(function(){
            $(this).siblings('.attention-01').stop().slideToggle().siblings('.attention-02').stop().slideToggle();
        });

        //编辑返回
        attentionLi.find('.ab-02').click(function(){
            $(this).parents('.attention-02').slideUp();
            $(this).parents('.attention-02').siblings('.attention-01').slideDown();
        });
    }


    /* 地区切换 */
    if ($('#wbi_change_btn').get(0)) {
        var wbiChangeBtn = $('#wbi_change_btn');
        var wBackBtn = $('#w_back_btn1');
        var wbiBox = $('.select-city-s');
        var wbiCity = $('#wbi-city');
        wbiChangeBtn.click(function(){
            wbiBox.show();
            wbiCity.hide();
        });
        wBackBtn.click(function(){
            wbiBox.hide();
            wbiCity.show();
        });
    };




    //改变字体大小
    (function(){
        //默认字体大小
        var fontSize;
        //放大变小按钮
        var oBigFontBtn = $('.font-big');
        var oSmallFontBtn = $('.font-small');

        if ( tools.cookie.get('_fontSize') == null ) {
            tools.cookie.set('_fontSize', 14 );
            fontSize = tools.cookie.get('_fontSize');
        }else{
            fontSize = tools.cookie.get('_fontSize');
            $('.art-main').css('font-size', fontSize + 'px');
        }

        //字体变大按钮
        oBigFontBtn.click(function(){
            if ( fontSize > 20 ) {
                return;
            }
            fontSize ++;
            tools.cookie.set('_fontSize',fontSize);
            $('.art-main').css('font-size', fontSize + 'px');
        });
        //字体变小按钮
        oSmallFontBtn.click(function(){
            if ( fontSize < 12 ) {
                return;
            }
            fontSize --;
            tools.cookie.set('_fontSize',fontSize);
            $('.art-main').css('font-size', fontSize + 'px');
        });

    }());

    //调用轮播
    $.fn.xTaber({
        content: $('#xTaber-news'),
        tab: true,
        style: 'left',
        auto: true
    })



});