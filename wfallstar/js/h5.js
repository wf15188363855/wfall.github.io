;(function(global) {
        global.MtaH5 = global.MtaH5 || {};
        MtaH5.hack = function() {
            return {
                params: '',
                conf: {
                    "sid": 500001784,
                    "senseHash": true,
                    "autoReport": true,
                    "performanceMonitor": true,
                    "cid": 500001785
                }
            };
        }
        ;
    }
)(this);

(function(g, m) {
        function p(a) {
            var b = "";
            b = window.localStorage ? localStorage.getItem(a) || sessionStorage.getItem(a) : (a = document.cookie.match(new RegExp("(?:^|;\\s)" + a + "=(.*?)(?:;\\s|$)"))) ? a[1] : "";
            return b
        }
        function q(a, b, d) {
            if (window.localStorage)
                d ? localStorage.setItem(a, b) : sessionStorage.setItem(a, b);
            else {
                var c = window.location.host
                    , f = {
                    "com.cn": 1,
                    "js.cn": 1,
                    "net.cn": 1,
                    "gov.cn": 1,
                    "com.hk": 1,
                    "co.nz": 1
                }
                    , e = c.split(".");
                2 < e.length && (c = (f[e.slice(-2).join(".")] ? e.slice(-3) : e.slice(-2)).join("."));
                document.cookie = a + "=" + b + ";path=/;domain=" + c + (d ? ";expires=" + d : "")
            }
        }
        function n(a) {
            var b, d, c, f = {};
            void 0 === a ? (c = window.location,
                a = c.host,
                b = c.pathname,
                d = c.search.substr(1),
                c = c.hash) : (c = a.match(/\w+:\/\/((?:[\w-]+\.)+\w+)(?:\:\d+)?(\/[^\?\\\"\'\|\:<>]*)?(?:\?([^\'\"\\<>#]*))?(?:#(\w+))?/i) || [],
                a = c[1],
                b = c[2],
                d = c[3],
                c = c[4]);
            if (d)
                for (var e = d.split("&"), h = 0, k = e.length; h < k; h++)
                    if (-1 != e[h].indexOf("=")) {
                        var l = e[h].indexOf("=")
                            , g = e[h].slice(0, l)
                            , l = e[h].slice(l + 1);
                        f[g] = l
                    }
            return {
                host: a,
                path: b,
                search: d,
                hash: c,
                param: f
            }
        }
        function r(a) {
            return (a || "") + Math.round(2147483647 * (Math.random() || .5)) * +new Date % 1E10
        }
        function t() {
            var a = n()
                , b = {
                dm: a.host,
                pvi: "",
                si: "",
                url: a.path,
                arg: encodeURIComponent(a.search || ""),
                ty: 1
            };
            b.pvi = function() {
                var a = p("pgv_pvi");
                a || (b.ty = 0,
                    a = r(),
                    q("pgv_pvi", a, "Sun, 18 Jan 2038 00:00:00 GMT;"));
                return a
            }();
            b.si = function() {
                var a = p("pgv_si");
                a || (a = r("s"),
                    q("pgv_si", a));
                return a
            }();
            b.url = function() {
                var b = a.path;
                g.senseHash && (b = a.hash ? b + a.hash.replace(/#/i, "_") : b);
                return b
            }();
            return b
        }
        function u() {
            var a = n(document.referrer)
                , b = n();
            return {
                rdm: a.host,
                rurl: a.path,
                rarg: encodeURIComponent(a.search || ""),
                adt: b.param.ADTAG || b.param.adtag || b.param.PTAG || b.param.ptag
            }
        }
        function v() {
            try {
                var a = navigator
                    , b = screen || {
                        width: "",
                        height: "",
                        colorDepth: ""
                    }
                    , d = document.body
                    , c = b.width + "x" + b.height
                    , f = b.colorDepth + "-bit"
                    , e = (a.language || a.userLanguage).toLowerCase()
                    , h = a.javaEnabled() ? 1 : 0
                    , k = (new Date).getTimezoneOffset() / 60
                    , a = "";
                d && d.addBehavior && (d.addBehavior("#default#clientCaps"),
                    a = d.connectionType);
                d = {
                    fl: "",
                    scr: c,
                    scl: f,
                    lg: e,
                    jv: h,
                    tz: k,
                    ct: a
                }
            } catch (l) {
                return {}
            }
            return d
        }
        function w(a) {
            a = a || {};
            for (var b in a)
                a.hasOwnProperty(b) && (g[b] = a[b]);
            if (g.sid) {
                for (var d = [], c = 0, f = [t(), u(), {
                    r2: g.sid
                }, v(), {
                    random: +new Date
                }], e = f.length; c < e; c++)
                    for (b in f[c])
                        f[c].hasOwnProperty(b) && d.push(b + "=" + (f[c][b] || ""));
                a.params && d.push(a.params);
                var h = function(a) {
                    a = Ta.src = ("https:" == document.location.protocol ? "https://pingtas.qq.com/webview" : "http://pingtcss.qq.com") + "/pingd?" + a.join("&");
                    var b = new Image;
                    Ta[g.sid] = b;
                    b.onload = b.onerror = b.onabort = function() {
                        b = b.onload = b.onerror = b.onabort = null;
                        Ta[g.sid] = !0
                    }
                    ;
                    b.src = a
                };
                g.performanceMonitor ? (window.onload && h(d),
                        window.onload = function() {
                            var a;
                            if (window.performance) {
                                a = window.performance.timing;
                                var b = {
                                    value: a.domainLookupEnd - a.domainLookupStart
                                }
                                    , c = {
                                    value: a.connectEnd - a.connectStart
                                }
                                    , f = {
                                    value: a.responseStart - (a.requestStart || a.responseStart + 1)
                                }
                                    , e = a.responseEnd - a.responseStart;
                                a.domContentLoadedEventStart ? 0 > e && (e = 0) : e = -1;
                                a = {
                                    domainLookupTime: b,
                                    connectTime: c,
                                    requestTime: f,
                                    resourcesLoadedTime: {
                                        value: e
                                    },
                                    domParsingTime: {
                                        value: a.domContentLoadedEventStart ? a.domInteractive - a.domLoading : -1
                                    },
                                    domContentLoadedTime: {
                                        value: a.domContentLoadedEventStart ? a.domContentLoadedEventStart - a.fetchStart : -1
                                    }
                                }
                            } else
                                a = "";
                            var b = [], g;
                            for (g in a)
                                a.hasOwnProperty(g) && ("domContentLoadedTime" == g ? d.push("r3=" + a[g].value) : b.push(a[g].value));
                            d.push("ext=pfm=" + b.join("_"));
                            h(d)
                        }
                ) : h(d)
            }
        }
        m.MtaH5 = m.MtaH5 || {};
        m.Ta = m.Ta || {};
        MtaH5.pgv = w;
        Ta.clickStat = MtaH5.clickStat = function(a) {
            var b = MtaH5.hack ? MtaH5.hack() : ""
                , d = {};
            b.conf && function() {
                var a = b.conf, c;
                for (c in a)
                    a.hasOwnProperty(c) && (d[c] = a[c])
            }();
            if (d.cid) {
                var c = []
                    , f = t()
                    , e = {
                    r2: g.sid
                };
                f.dm = "TACLICK";
                f.url = a;
                e.r2 = d.cid;
                a = 0;
                f = [f, u(), e, v(), {
                    random: +new Date
                }];
                for (e = f.length; a < e; a++)
                    for (var h in f[a])
                        f[a].hasOwnProperty(h) && c.push(h + "=" + (f[a][h] || ""));
                b.params && c.push(b.params);
                var c = MtaH5.src = ("https:" == document.location.protocol ? "https://pingtas.qq.com/webview" : "http://pingtcss.qq.com") + "/pingd?" + c.join("&")
                    , k = new Image;
                MtaH5["click_" + d.sid] = k;
                k.onload = k.onerror = k.onabort = function() {
                    k = k.onload = k.onerror = k.onabort = null;
                    MtaH5[d.sid] = !0
                }
                ;
                k.src = c
            }
        }
        ;
        var x = MtaH5.hack ? MtaH5.hack() : {};
        x.conf && function() {
            var a = x.conf, b;
            for (b in a)
                a.hasOwnProperty(b) && (g[b] = a[b])
        }();
        g.autoReport && w()
    }
)({}, this);
