/**
 * Created by Administrator on 2018/9/9 0009.
 */
var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext('2d'),
    particles = [],
    dirs = [{
        x: Math.cos(Math.PI * 2 / 6),
        y: Math.sin(Math.PI * 2 / 6)
    }, {
        x: Math.cos(Math.PI * 2 / 6 * 2),
        y: Math.sin(Math.PI * 2 / 6 * 2)
    }, {
        x: Math.cos(Math.PI * 2 / 6 * 3),
        y: Math.sin(Math.PI * 2 / 6 * 3)
    }, {
        x: Math.cos(Math.PI * 2 / 6 * 4),
        y: Math.sin(Math.PI * 2 / 6 * 4)
    }, {
        x: Math.cos(Math.PI * 2 / 6 * 5),
        y: Math.sin(Math.PI * 2 / 6 * 5)
    }, {
        x: Math.cos(Math.PI * 2 / 6 * 6),
        y: Math.sin(Math.PI * 2 / 6 * 6)
    }, ],
    len = 20;

var tick = 0;

function anim() {

    window.requestAnimationFrame(anim);

    tick += .1;

    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0,0,0,.04)';
    ctx.fillRect(0, 0, w, h);

    ctx.shadowBlur = 3;
    ctx.globalCompositeOperation = 'lighter';

    if (particles.length < 100 && Math.random() < .5)
        particles.push({
            tick: tick,
            sx: w / 2,
            sy: h / 2,
            x: 0,
            y: 0,
            dir: (Math.random() * 3 | 0) * 2,
            askDir: false,
            time: 0
        });

    particles.map(function(particle) {
        if (particle.askDir) {
            particle.dir = Math.random() < .5 ?
            (particle.dir + 1) % 6 :
            (particle.dir + 5) % 6;
            particle.askDir = false;
        }

        ++particle.time;

        var dir = dirs[particle.dir];
        particle.x += dir.x * 1.5;
        particle.y += dir.y * 1.5;

        if (particle.x * particle.x + particle.y * particle.y >= len * len) {
            particle.sx += dir.x * len;
            particle.sy += dir.y * len;

            particle.x = particle.y = 0;
            particle.askDir = true;

            if (Math.random() < .05) {
                particle.sx = w / 2;
                particle.sy = h / 2;
                particle.dir = (Math.random() * 3 | 0) * 2;
                particle.askDir = false;
                particle.tick = tick;
            }
        }

        var color = 'hsla(hue,80%,50%,.8)'.replace('hue', particle.tick);
        ctx.shadowColor = ctx.fillStyle = color;
        var x = particle.sx + particle.x,
            y = particle.sy + particle.y
        ctx.fillRect(x, y, 2.5, 2.5);

        for (var i = .5; i < Math.random(); i += .1) {
            ctx.fillRect(x + (Math.random() - .5) * 20, y + (Math.random() - .5) * 20, 1.5, 1.5);
        }
    })
}

ctx.fillStyle = '#111';
ctx.fillRect(0, 0, w, h);
anim();

window.addEventListener('resize', function() {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    particles.length = 0;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);
})

/*以下是主体*/
$(".hover").mouseleave(
    function() {
        $(this).removeClass("hover");
    }
);
//搜索框功能
$(function(){
    var aa;
    $("#j_search_btn").click(function () {
        var rel = $("#show_class").val();
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
