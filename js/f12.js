function disableInfo() {
    document.onkeydown = function() {
        var e = window.event || arguments[0];
        if(e.keyCode == 123) {
            return false;
        } else if((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)) {
            return false;
        } else if((e.shiftKey) && (e.keyCode == 121)){
            return false;
        }
    };
    document.oncontextmenu = function() {
        return false;
    }
}
function goto() {
    debugger;
}
$(document).ready(function () {
    goto();
})
function checkDebugger() {
    const d = new Date();
    debugger;
    const dur = Date.now() - d;
    if (dur < 5) {
        return false;
    } else {
        return true;
    }
}
function breakDebugger() {
    if (checkDebugger()) {
        window.location.href='https://www.baidu.com/s?wd=鲸落www.WFall.cn：兄台来百度转转吧，大神都在这里，我的源码太低端，不献丑碍您眼了';
    }
}
$(document).ready(function () {
    breakDebugger();
});
