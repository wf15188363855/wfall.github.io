/**
 * Created by Administrator on 2018/5/13 0013.
 */
/*▼以下是圆球滑落js*/
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
var c, $;
var balls, planks;
var fps = 30;

function go(start) {
    c = document.getElementById("canv");
    $ = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    $.lineWidth = 10;
    balls = new Balls();
    planks = new Plank();
    if (start) {
        draw();
    }
}

function draw() {
    $.fillStyle = 'hsla(252, 95%, 85%, 1)';
    $.fillRect(0, 0, c.width, c.height);
    var t = "www.WFall.cn".split("").join(String.fromCharCode(0x2004));
    $.font = "1.5em Poiret One";
    $.fillStyle = 'hsla(213, 95%, 15%, 1)';
    $.fillText(t, c.width / 2 - 125, c.height / 2 + 250);
    var t2 = " Copyright ©鲸落(Whale Fall).All Rights Reserved.";
    $.font = "0.9em Poiret One";
    $.fillStyle = 'hsla(213, 95%, 15%, 1)';
    $.fillText(t2, c.width / 2 - 165, c.height / 2 + 300);
    balls.fr(balls, $, planks);
    planks.draw(planks, $);
    window.requestAnimFrame(draw);
}

function random(min, max) {
    return Math.random() * (max - min) + min;
};

var Ball = function() {
    this.x = c.width / 2;
    this.y = 0;
    this.r = random(2, 20);
    this.col = 'rgb(' + Math.floor(Math.random() * 130) + ',' + Math.floor(Math.random() * 80) + ',' + Math.floor(Math.random() * 256) + ')';
    this.g = 980;
    this.vx = 0;
    this.vy = 0;
    this.draw = function(it, $, planks) {
        if (!it.roll(it, planks)) {
            return false;
        }
        $.strokeStyle = "hsla(0,5%,5%,1)";
        $.fillStyle = it.col;
        $.beginPath();
        $.arc(it.x, it.y, it.r, 0, 360, false);
        $.fill();
        $.closePath();
        return true;
    }
    this.bounds = function(it, nx, ny) {
        var left = it.x > nx ? nx : it.x;
        var right = it.x > nx ? it.x : nx;
        var top = it.y > ny ? ny : it.y;
        var bottom = it.y > ny ? it.y : ny;
        return [left, top, right, bottom];
    }
    this.roll = function(it, planks) {
        it.vy += (1 / fps) * it.g;
        var nY = it.y + (1 / fps) * it.vy;
        var nX = it.x + (1 / fps) * it.vx;
        var s = planks.size(planks);
        for (var i = 0; i < s; i++) {
            var _p = planks.planks[i];
            var b = (_p.ex - _p.sx) * (nY - it.y) - (_p.ey - _p.sy) * (nX - it.x);
            if (b == 0)
                continue;
            var ang = [it.x - _p.sx, it.y - _p.sy];
            var dr = ((nY - it.y) * ang[0] - (nX - it.x) * ang[1]) / b;
            var ds = ((_p.ey - _p.sy) * ang[0] - (_p.ex - _p.sx) * ang[1]) / b;
            if (dr > 0 && dr < 1 && ds > 0 && ds < 1) {

                var a = (_p.ex == _p.sx) ? 0 : (_p.ey - _p.sy) / (_p.ex - _p.sx);
                var b = -(a * _p.sx) - _p.sy;
                var a1 = (nX == it.x) ? 0 : (nY - it.y) / (nX - it.x);
                var b1 = (a1 * it.x) - it.y;
                var r = Math.sqrt(random(5, 7) / 10);
                if (a1 * a == -1) {
                    it.vy *= -r;
                    it.vx *= -r;
                } else {
                    var a = (_p.ex == _p.sx) ? 0 : -1 / ((_p.ey - _p.sy) / (_p.ex - _p.sx));
                    var b = -(a * _p.sx) + _p.sy;
                    var p = [1, a + b];
                    var p2 = [2, a * 2 + b];
                    var w = Math.sqrt(Math.pow(p2[0] - p[0], 2) + Math.pow(p2[1] - p[1], 2));
                    var ref = it.rebound([it.vx, it.vy], [(p2[0] - p[0]) / w, (p2[1] - p[1]) / w]);
                    it.vx = r * ref[0];
                    it.vy = r * ref[1];
                }
                nY = it.y + (1 / fps) * it.vy;
                nX = it.x + (1 / fps) * it.vx;
                break;
            }
        }
        it.y = nY;
        it.x = nX;
        if (c.height < it.y || c.width < it.x || 0 > it.x) {
            return false;
        }
        return true;
    }
    this.rebound = function(sp, n) {
        var t = -(n[0] * sp[0] + n[1] * sp[1]) / (n[0] * n[0] + n[1] * n[1]);
        return [sp[0] + t * n[0] * 2.0, sp[1] + t * n[1] * 2.0];
    }
}

var Balls = function() {
    this.balls = [new Ball()];
    this.f = 0;
    this.fr = function(it, col, _p) {
        it.f++;
        var size = it.balls.length;
        if (it.f >= Balls.nxt) {
            it.f = 0;
            if (size < Balls.max) {
                it.gen(it);
            }
        }
        for (var i = 0; i < size; i++) {
            var b = it.balls[i];
            if (!b.draw(b, col, _p)) {
                it.balls.splice(i, 1);
                i--;
                size--;
            }
        }
    }
    this.gen = function(it) {
        it.balls.push(new Ball());
    }
}
Balls.nxt = 7;
Balls.max = 100;
var Line = function(x, y) {
    this.sx = x;
    this.sy = y;
    this.ex = x;
    this.ey = y;
    this.col = 'rgb(' + Math.floor(Math.random() * 130) + ',' + Math.floor(Math.random() * 80) + ',' + Math.floor(Math.random() * 256) + ')';

    this.bounds = function(it) {
        var left = it.sx > it.ex ? it.ex : it.sx;
        var right = it.sx > it.ex ? it.sx : it.ex;
        var top = it.sy > it.ey ? it.ey : it.sy;
        var bottom = it.sy > it.ey ? it.sy : it.ey;
        return [left, top, right, bottom];
    }
    this.draw = function(it, $) {
        $.strokeStyle = it.col;
        $.shadowColor = 'hsla(0,0%,0%,.4)';
        $.shadowBlur = 55;
        $.shadowOffsetX = 10;
        $.shadowOffsetY = 10;
        $.beginPath();
        $.moveTo(it.sx, it.sy);
        $.lineTo(it.ex, it.ey);
        $.closePath();
        $.stroke();
    }
    this.checked = function(it) {
        return Math.sqrt(Math.pow(it.ex - it.sx, 2) + Math.pow(it.ey - it.sy, 2)) > Line.min;
    }
}
Line.min = 50;
var Plank = function() {

    this.planks = [];
    this.curr = null;
    this.size = function(it) {
        return it.planks.length;
    }
    this.draw = function(it, $) {

        var s = it.planks.length;
        for (var i = 0; i < s; i++) {
            var _p = it.planks[i];
            _p.draw(_p, $);
        }
        if (it.curr != null) {
            it.curr.draw(it.curr, $);
        }
    }
    this.start = function(it, x, y) {
        if (it.curr == null)
            it.curr = new Line(x, y);
    }
    this.fin = function(it, x, y) {
        if (it.curr != null) {
            it.curr.ex = x;
            it.curr.ey = y;

            if (it.curr.checked(it.curr)) {
                if (it.planks.length >= Plank.max)
                    it.planks.shift();
                it.planks.push(it.curr);
            }}
        it.curr = null;
    }
    this.roll = function(it, x, y) {
        if (it.curr != null) {
            it.curr.ex = x;
            it.curr.ey = y;
        }
    }
}
Plank.max = 10;

window.addEventListener("mousedown", msdn, false);
window.addEventListener("mouseup", msup, true);
window.addEventListener("mousemove", roll, true);
window.addEventListener("resize", resize, false);

function msdn(e) {
    planks.start(planks, e.x + window.scrollX, e.y + window.scrollY);
}

function msup(e) {
    planks.fin(planks, e.x + window.scrollX, e.y + window.scrollY);
}

function roll(e) {
    planks.roll(planks, e.x + window.scrollX, e.y + window.scrollY);
}

function resize() {
    c.width = w = window.innerWidth;
    c.height = h = window.innerHeight;
    c.style.position = 'absolute';
    c.style.left = (window.innerWidth - w) *
        .01 + 'px';
    c.style.top = (window.innerHeight - h) *
        .01 + 'px';
    go();
};

go(true);
/*▲以上是圆球滑落js*/

/*▼以下是变形导航js*/
{
    class ImgItem {
        constructor(el) {
            this.DOM = {};
            this.DOM.el = el;
            this.DOM.svg = this.DOM.el.querySelector('.item__svg');
            this.DOM.path = this.DOM.svg.querySelector('path');
            this.paths = {};
            this.paths.start = this.DOM.path.getAttribute('d');
            this.paths.end = this.DOM.el.dataset.morphPath;
            this.DOM.deco = this.DOM.svg.querySelector('.item__deco');
            this.DOM.image = this.DOM.svg.querySelector('image');
            this.DOM.title = this.DOM.el.querySelector('.item__meta > .item__title');
            this.DOM.subtitle = this.DOM.el.querySelector('.item__meta > .item__subtitle');
            this.CONFIG = {
                // Defaults:
                animation: {
                    path: {
                        duration: this.DOM.el.dataset.animationPathDuration || 1500,
                        delay: this.DOM.el.dataset.animationPathDelay || 0,
                        easing: this.DOM.el.dataset.animationPathEasing || 'easeOutElastic',
                        elasticity: this.DOM.el.dataset.pathElasticity || 400,
                        scaleX: this.DOM.el.dataset.pathScalex || 1,
                        scaleY: this.DOM.el.dataset.pathScaley || 1,
                        translateX: this.DOM.el.dataset.pathTranslatex || 0,
                        translateY: this.DOM.el.dataset.pathTranslatey || 0,
                        rotate: this.DOM.el.dataset.pathRotate || 0
                    },
                    image: {
                        duration: this.DOM.el.dataset.animationImageDuration || 2000,
                        delay: this.DOM.el.dataset.animationImageDelay || 0,
                        easing: this.DOM.el.dataset.animationImageEasing || 'easeOutElastic',
                        elasticity: this.DOM.el.dataset.imageElasticity || 400,
                        scaleX: this.DOM.el.dataset.imageScalex || 1.1,
                        scaleY: this.DOM.el.dataset.imageScaley || 1.1,
                        translateX: this.DOM.el.dataset.imageTranslatex || 0,
                        translateY: this.DOM.el.dataset.imageTranslatey || 0,
                        rotate: this.DOM.el.dataset.imageRotate || 0
                    },
                    deco: {
                        duration: this.DOM.el.dataset.animationDecoDuration || 2500,
                        delay: this.DOM.el.dataset.animationDecoDelay || 0,
                        easing: this.DOM.el.dataset.animationDecoEasing || 'easeOutQuad',
                        elasticity: this.DOM.el.dataset.decoElasticity || 400,
                        scaleX: this.DOM.el.dataset.decoScalex || 0.9,
                        scaleY: this.DOM.el.dataset.decoScaley || 0.9,
                        translateX: this.DOM.el.dataset.decoTranslatex || 0,
                        translateY: this.DOM.el.dataset.decoTranslatey || 0,
                        rotate: this.DOM.el.dataset.decoRotate || 0
                    }
                }
            };
            this.initEvents();
        }
        initEvents() {
            this.mouseenterFn = () => {
                this.mouseTimeout = setTimeout(() => {
                    this.isActive = true;
                this.animate();
            }, 75);
            }
            this.mouseleaveFn = () => {
                clearTimeout(this.mouseTimeout);
                if (this.isActive) {
                    this.isActive = false;
                    this.animate();
                }
            }
            this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
            this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
            this.DOM.el.addEventListener('touchstart', this.mouseenterFn);
            this.DOM.el.addEventListener('touchend', this.mouseleaveFn);
        }
        getAnimeObj(targetStr) {
            const target = this.DOM[targetStr];
            let animeOpts = {
                targets: target,
                duration: this.CONFIG.animation[targetStr].duration,
                delay: this.CONFIG.animation[targetStr].delay,
                easing: this.CONFIG.animation[targetStr].easing,
                elasticity: this.CONFIG.animation[targetStr].elasticity,
                scaleX: this.isActive ? this.CONFIG.animation[targetStr].scaleX : 1,
                scaleY: this.isActive ? this.CONFIG.animation[targetStr].scaleY : 1,
                translateX: this.isActive ? this.CONFIG.animation[targetStr].translateX : 0,
                translateY: this.isActive ? this.CONFIG.animation[targetStr].translateY : 0,
                rotate: this.isActive ? this.CONFIG.animation[targetStr].rotate : 0
            };
            if (targetStr === 'path') {
                animeOpts.d = this.isActive ? this.paths.end : this.paths.start;
            }
            anime.remove(target);
            return animeOpts;
        }
        animate() {
            // Animate the path, the image and deco.
            anime(this.getAnimeObj('path'));
            anime(this.getAnimeObj('image'));
            anime(this.getAnimeObj('deco'));
            // Title and Subtitle animation
            anime.remove(this.DOM.title);
            anime({
                targets: this.DOM.title,
                easing: 'easeOutQuad',
                translateY: this.isActive ? [{
                    value: '-50%',
                    duration: 200
                }, {
                    value: ['50%', '0%'],
                    duration: 200
                }] : [{
                    value: '50%',
                    duration: 200
                }, {
                    value: ['-50%', '0%'],
                    duration: 200
                }],
                opacity: [{
                    value: 0,
                    duration: 200
                }, {
                    value: 1,
                    duration: 200
                }]
            });
            anime.remove(this.DOM.subtitle);
            anime({
                targets: this.DOM.subtitle,
                easing: 'easeOutQuad',
                translateY: this.isActive ? {
                    value: ['50%', '0%'],
                    duration: 200,
                    delay: 250
                } : {
                    value: '0%',
                    duration: 1
                },
                opacity: this.isActive ? {
                    value: [0, 1],
                    duration: 200,
                    delay: 250
                } : {
                    value: 0,
                    duration: 1
                }
            });
        }
    }

    const items = Array.from(document.querySelectorAll('.item'));
    const init = (() => items.forEach(item => new ImgItem(item)))();
    setTimeout(() => document.body.classList.remove('loading'), 2000);
};
/*▲以上是变形导航js*/
document.getElementById("Video_one").addEventListener("click", function() {
    window.location.href='wfalltv/wfalltv.html';
});
document.getElementById("Shop_two").addEventListener("click", function() {
    window.location.href='wfallshop/wfallshop.html';
});
document.getElementById("Wf3D_three").addEventListener("click", function() {
    window.location.href='wfall3Dbox/wfall3Dbox.html';
});
document.getElementById("Game_btn").addEventListener("click", function() {
    window.location.href='wfallgame/wfallgame.html';
});
/*document.getElementById("VR3D_btn").addEventListener("click", function() {
    window.location.href='wfallstar/index.html';
});*/
document.getElementById("Lizi3D_btn").addEventListener("click", function() {
    window.location.href='wfalllizi/wfalllizi.html';
});
document.getElementById("Litiban_btn").addEventListener("click", function() {
    window.location.href='iframe3D/iframe3D.html';
});