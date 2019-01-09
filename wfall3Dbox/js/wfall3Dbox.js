/**
 * Created by Administrator on 2018/9/10 0010.
 */
Vector2 = function(a, b) {
    return this.x = a || 0, this.y = b || 0, this
}, Vector2.prototype.add = function(a) {
    return this.x += a.x, this.y += a.y, this
}, Vector2.prototype.sub = function(a) {
    return "object" == typeof a && (this.x -= a.x, this.y -= a.y), "number" == typeof a && (this.x -= a, this.y -= a), this
}, Vector2.prototype.mult = function(a) {
    return "object" == typeof a ? (this.x *= a.x, this.y *= a.y) : "number" == typeof a && (this.x *= a, this.y *= a), this
}, Vector2.prototype.div = function(a) {
    return "object" == typeof a ? (this.x /= a.x, this.y /= a.y) : "number" == typeof a && (this.x /= a, this.y /= a), this
}, Vector2.prototype.norm = function() {
    return this.div(this.mag()), this
}, Vector2.prototype.setMag = function(a) {
    return this.norm(), this.mult(a), this
}, Vector2.prototype.limit = function(a) {
    return this.mag() > a ? (this.setMag(a), this) : this
}, Vector2.prototype.direction = function(a) {
    return Math.atan2(this.y, this.x)
}, Vector2.prototype.rotate = function(a) {
    var b = this.direction() + a,
        c = this.mag();
    return this.x = Math.cos(b) * c, this.y = Math.sin(b) * c, this
}, Vector2.prototype.mag = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
}, Vector2.prototype.angleTo = function(a) {
    var b = Math.atan2(a.x - this.x, a.y - this.y);
    return b
}, Vector2.prototype.distanceTo = function(a) {
    return Math.sqrt(Math.pow(a.x - this.x, 2) + Math.pow(a.y - this.y, 2))
}, Vector2.prototype.copy = function() {
    return new Vector2(this.x, this.y)
}, Vector2.prototype.set = function() {
    var a = arguments;
    return 1 == a.length ? "object" == typeof a[0] ? (this.x = a[0].x, this.y = a[0].y) : "number" == typeof a[0] && (this.x = a[0], this.y = a[0]) : 2 == a.length && (this.x = a[0], this.y = a[1]), this
}, Vector2.prototype.map = function(a, b, c, d) {
    return a < this.x < b && c < this.y < d ? this : (this.x < a ? this.x = a : this, this.x > b ? this.x = b : this, this.y < c ? this.y = c : this, void(this.y > d ? this.y = d : this))
}, Math.radians = function(a) {
    return a * (Math.PI / 180)
}, Math.degrees = function(a) {
    return a * (180 / Math.PI)
}, random = function() {
    if (!arguments) return Math.random();
    var a = arguments;
    return 1 == a.length ? Math.random() * a[0] : 2 == a.length ? Math.random() * (Math.max(a[0], a[1]) - Math.min(a[0], a[1])) + Math.min(a[0], a[1]) : void 0
}, random = function(a, b) {
    return null == b && (b = a, a = 0), a + Math.floor(Math.random() * (b - a + 1))
};

(function() {
    var canvasBody, $,
        w = window.innerWidth,
        h = window.innerHeight,
        gui = new dat.GUI(),
        stats = new Stats(),
        tick = 0,
        //predefines
        pi = Math.PI,
        pi2 = pi * 2,
        piD2 = pi / 2,
        piD3 = pi / 3,
        piD6 = pi / 6,
        pi2D3 = pi2 / 3,
        piDeg = pi / 180,

        canvasStyles = {
            position: "absolute",
            top: "0px",
            left: "0px",
            "background-color": "#222",
            "z-index": -1
        },
        Mouse = new Vector2(-100, -100),
        mousePressed = false,
        opts = {
            bgc: "#222",
            showFPS: false,
            message: "WWWKWFALLKCN",
            minR: 6, //minRadius
            addR: 0, //addedRadius
            pTD: 13, //partTextDistance
            pA: new Number(), //particleAmount
            aP: 200, //addedParticles
            aC: "red", //activeColor
            aR: 100, //affectionRadius
            naC: "playdoh" //nonActiveColor
        },
        alphabet = {
            A: [
                " ++ ",
                "+  +",
                "++++",
                "+  +",
                "+  +"
            ],
            B: [
                "+++ ",
                "+  +",
                "+++ ",
                "+  +",
                "+++ "
            ],
            C: [
                " +++",
                "+   ",
                "+   ",
                "+   ",
                " +++"
            ],
            D: [
                "+++ ",
                "+  +",
                "+  +",
                "+  +",
                "+++ "
            ],
            E: [
                "++++",
                "+   ",
                "+++ ",
                "+   ",
                "++++"
            ],
            F: [
                "++++",
                "+   ",
                "+++ ",
                "+   ",
                "+   "
            ],
            L: [
                " +   ",
                " +   ",
                " +   ",
                " +   ",
                " ++++"
            ],
            T: [
                "+++++",
                "  +  ",
                "  +  ",
                "  +  ",
                "  +  "
            ],
            U: [
                "+  +",
                "+  +",
                "+  +",
                "+  +",
                "++++"
            ],
            H: [
                "+  +",
                "+  +",
                "++++",
                "+  +",
                "+  +"
            ],
            N: [
                " +++ ",
                "+   +",
                "+   +",
                "+   +",
                "+   +"
            ],
            G: [
                " ++++",
                "+    ",
                "+ +++",
                "+   +",
                " ++++",
                "    +",
            ],
            I: [
                " +++",
                "  + ",
                "  + ",
                "  + ",
                " +++",
            ],
            S: [
                " +++ ",
                "+    ",
                " +++ ",
                "    +",
                " +++ "
            ],
            W: [
                "+ + +",
                "+ + +",
                "+ + +",
                "+ + +",
                " + + "
            ],
            K: [
                "     ",
                "     ",
                "     ",
                "     ",
                "  +  "
            ],
            Q: [
                "",
                "",
                "",
                "",
                ""
            ]
        },
        //for Particles and text
        Particle = function(X, Y) {
            this.pos = new Vector2(X, Y);
            this.speed = new Vector2();
            this.acc = new Vector2();
            this.color = Colors("red");
            this.radius = opts.minR + Math.random() * opts.addR;
            this.dest = new Vector2(Math.random() * w, Math.random() * h);
            this.fixed = false;
            this.maxSpeed = 3;
        },
        particles = [],
        letDests = [];
    Particle.prototype = {
        attractTo: function(vector) {
            var tar = vector.copy();
            tar.sub(this.pos);
            var desired = tar.sub(this.speed);
            return desired;
        },
        update: function() {
            this.border();
            var runT = new Vector2(0, 0);
            this.fixed ? runT = this.attractTo(this.dest).limit(this.maxSpeed) : void 0;
            if (this.pos.distanceTo(Mouse) < opts.aR) {
                var runM = this.attractTo(Mouse).limit(5).mult(-0.5);
            }
            this.acc.add(runT);
            runM ? this.acc.add(runM) : this.speed.mult(0.95);
            this.speed.add(this.acc);
            this.pos.add(this.speed);
            this.acc.set(0);
            return this;
        },
        render: function() {
            var pos = this.pos;
            $.fillStyle = this.color;
            $.beginPath();
            $.arc(pos.x, pos.y, this.radius, 0, pi2);
            $.closePath();
            $.fill();
            return this;
        },
        border: function() {
            this.pos.x - this.radius < 0 ? (this.pos.x = this.radius, this.speed.x *= -1) : void 0;
            this.pos.x + this.radius > w ? (this.pos.x = w - this.radius, this.speed.x *= -1) : void 0;
            this.pos.y - this.radius < 0 ? (this.pos.y = this.radius, this.speed.y *= -1) : void 0;
            this.pos.y + this.radius > h ? (this.pos.y = h - this.radius, this.speed.y *= -1) : void 0;
        }
    };

    //For text
    function populate() {
        particles = [];
        for (var i = 0; i < opts.pA; particles[i++] = new Particle(Math.random() * w, Math.random() * h));
    }

    function createTextVectors() {
        var message = opts.message;
        var letters = [];
        for (var i = 0; i < message.length; i++) {
            letters.push(alphabet[message[i]]);
        }
        letDests = [];
        for (var i = 0; i < letters.length; i++) {
            for (var y = 0; y < letters[i].length; y++) {
                for (var x = 0; x < letters[i][y].length; x++) {
                    letters[i][y][x] == "+" ? letDests.push(new Vector2(x * opts.pTD + w / 2 - ((letters.length / 2) * opts.pTD * 4) + (i * opts.pTD * 5)-80, y * opts.pTD + h / 3-260)) : void 0;/***"h / 3-260"调整"www.wfall.cn上下位置"***/
                }
                /*console.log(letDests)*/
            }
        }
        /*console.log(letDests);*/
        opts.pA < letDests.length ? opts.pA = letDests.length + opts.aP : opts.pA = letDests.length + opts.aP;
    }

    function createTextTargets() {
        for (var i = particles.length - 1; i > -1; i--) {
            particles[i].dest = letDests[i] ? letDests[i] : new Vector2(Math.random() * w, Math.random() * h);
            particles[i].fixed = letDests[i] ? true : false;
            particles[i].color = letDests[i] ? Colors(opts.aC) : Colors(opts.naC)
        }
    }

    function startParticles() {
        createTextVectors();
        populate();
        createTextTargets();
    };

    //startup
    function setup() {
        createCanvas();
        addListeners();
        startParticles();
        gui.add(opts, "aR", 10, w / 2).name("affectionRadius");
        gui.add(opts, "aC", ["red", "dark-red", "playdoh", "green"]).onFinishChange(startParticles).name("activeColor");
        gui.add(opts, "naC", ["red", "dark-red", "playdoh", "green"]).onFinishChange(startParticles).name("nonActiveColor");
        gui.add(opts, "pTD", 10, 50).onFinishChange(startParticles).name("particleTextDistance");
        gui.add(opts, "aP", 0, 1000).name("addedParticles").onFinishChange(startParticles);
        gui.close();
        document.body.appendChild(stats.domElement);
        window.requestAnimationFrame(loop);
        console.log(Colors("red"))
    }

    function loop() {
        stats.begin();
        drawBg();

        particles.map(function(P) {
            P.update().render();
        })

        opts.showFPS ? stats.domElement.style["display"] = "block" : stats.domElement.style["display"] = "none";
        window.requestAnimationFrame(loop);
        stats.end();
    }

    function createCanvas() {
        var el = document.createElement("canvas"),
            ctx = el.getContext("2d");
        for (var style in canvasStyles) {
            el.style[style] = canvasStyles[style];
        }
        document.body.appendChild(el);
        canvasBody = el;
        $ = ctx;
        canvasBody.width = w;
        canvasBody.height = h;
        document.body.style["overflow"] = "hidden"
        return [el, ctx];
    }

    function drawBg() {
        $.fillStyle = opts.bgc;
        $.fillRect(0, 0, w, h);
    }

    //listeners
    function addListeners() {
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", mouseMove);
        canvasBody.addEventListener("mousedown", mouseDown);
        canvasBody.addEventListener("mouseup", mouseUp);
        canvasBody.addEventListener("touchmove", touchMove);
        canvasBody.addEventListener("touchstart", touchStart);
        canvasBody.addEventListener("touchend", touchEnd);
    }

    function resize() {
        w = canvasBody.width = window.innerWidth;
        h = canvasBody.height = window.innerHeight;
        startParticles();
    }

    function mouseDown(event) {
        mousePressed = true;
        Mouse.set(event.pageX, event.pageY);
    }

    function mouseUp(event) {
        mousePressed = false;
    }

    function mouseMove(event) {
        Mouse.set(event.pageX, event.pageY);
    }

    function touchMove(event) {
        var touches = event.changedTouches;
        Mouse.set(touches[0].pageX, touches[0].pageY);
    }

    function touchStart(event) {
        /*e.preventDefault();*/
        mousePressed = true;
        touchMove(event);
    }

    function touchEnd(event) {
        mousePressed = false;
        Mouse.set(-opts.aR, -opts.aR);
    }
    setup();
})();

/*开关*/
var oBtn = document.getElementsByClassName('embed-link')[0];
var wenben = document.getElementsByClassName('wenben')[0];
var kai = "k"
oBtn.onclick = function(){
    if(kai=="k"){
        wenben.style.display = "block";
        kai = "g"
    }else {
        wenben.style.display = "none";
        kai = "k"
    }
};
/*动态添加特效目录*/
function add3Dlist() {
    oDiv = document.getElementById('wf3D_tittle');
    oDiv.innerHTML = '<p>特效目录:</p><a href="wfall3Dbox.html"><span>3D水晶</span></a><a href="wfall3Dbox2.html"><span>爱心ET</span></a><a href="wfall3Dbox3.html"><span>水波文字</span></a><a href="wfall3Dbox4.html"><span>彩虹圆点</span></a><a href="wfall3Dbox5.html"><span>彩虹粒子</span></a><a href="wfall3Dbox6.html"><span>彩虹迷雾</span></a><a href="wfall3Dbox7.html"><span>垂直帘幕</span></a><a href="wfall3Dbox8.html"><span>磁力线</span></a><a href="wfall3Dbox9.html"><span>烟花绽放</span></a><a href="wfall3Dbox10.html"><span>飞鸟动画</span></a><a href="wfall3Dbox11.html"><span>光束线</span></a><a href="wfall3Dbox12.html"><span>海底鱼群</span></a><a href="wfall3Dbox13.html"><span>海洋物体</span></a><a href="wfall3Dbox14.html"><span>黑客</span></a><a href="wfall3Dbox15.html"><span>花儿绽放</span></a><a href="wfall3Dbox16.html"><span>蝴蝶飞舞</span></a><a href="wfall3Dbox17.html"><span>蝴蝶粒子</span></a><a href="wfall3Dbox18.html"><span>3D火焰</span></a><a href="wfall3Dbox19.html"><span>交互星空</span></a><a href="wfall3Dbox20.html"><span>镜像粒子坠落</span></a><a href="wfall3Dbox21.html"><span>立体金星</span></a><a href="wfall3Dbox22.html"><span>集群圆点</span></a><a href="wfall3Dbox23.html"><span>旋转雷电</span></a><a href="wfall3Dbox24.html"><span>哭闹番茄</span></a><a href="wfall3Dbox25.html"><span>蓝色流星雨</span></a><a href="wfall3Dbox26.html"><span>铃铛狗</span></a><a href="wfall3Dbox27.html"><span>粒子流动</span></a><a href="wfall3Dbox28.html"><span>3D乱流</span></a><a href="wfall3Dbox29.html"><span>魔幻羽化动效</span></a><a href="wfall3Dbox30.html"><span>魔幻粒子</span></a><a href="wfall3Dbox31.html"><span>奶油脂</span></a><a href="wfall3Dbox32.html"><span>拖到碗里来</span></a><a href="wfall3Dbox33.html"><span>卡通日月</span></a><a href="wfall3Dbox34.html"><span>三角旋转</span></a><a href="wfall3Dbox35.html"><span>三维烟花</span></a><a href="wfall3Dbox36.html"><span>闪电文字</span></a><a href="wfall3Dbox37.html"><span>圣诞树</span></a><a href="wfall3Dbox38.html"><span>点击染色</span></a><a href="wfall3Dbox39.html"><span>3D螺纹</span></a><a href="wfall3Dbox40.html"><span>跳舞机器人</span></a><a href="wfall3Dbox41.html"><span>图像碎末变幻</span></a><a href="wfall3Dbox42.html"><span>文字3D</span></a><a href="wfall3Dbox43.html"><span>文本粒子</span></a><a href="wfall3Dbox44.html"><span>镜像机器人</span></a><a href="wfall3Dbox45.html"><span>白线舞者</span></a><a href="wfall3Dbox46.html"><span>跟屁虫小黑</span></a><a href="wfall3Dbox47.html"><span>顽皮小猫</span></a><a href="wfall3Dbox48.html"><span>摇头兔子</span></a><a href="wfall3Dbox49.html"><span>立体像素羊</span></a><a href="wfall3Dbox50.html"><span>下雨动画</span></a><a href="wfall3Dbox51.html"><span>星空背景</span></a><a href="wfall3Dbox52.html"><span>炫彩骷髅</span></a><a href="wfall3Dbox53.html"><span>血色粒子</span></a><a href="wfall3Dbox54.html"><span>小黄眼色跟随</span></a><a href="wfall3Dbox55.html"><span>萤火虫</span></a><a href="wfall3Dbox56.html"><span>3D纸团飞舞</span></a>';
}
add3Dlist();

