window.sky || (window.sky = {});
void function(){
	//浏览器版本等
	void function(uAgent){
		//IE 版本 非IE为 0
		sky.IE = (window.attachEvent && window.ActiveXObject && !window.opera) ? parseFloat(uAgent.match(/msie ([\d.]+)/)[1]) : 0;
		//Firefox 版本
		sky.Firefox = /firefox\/([\d.]+)/.test(uAgent) ? parseFloat(RegExp.$1) : 0;
        sky.isTouch = 'createTouch' in document;
	}(window.navigator.userAgent.toLowerCase());

	//数据循环
	function forpush(arr,v){
		arr.push(v);
		return v;
	}
	function forappend(obj,v,k){
		obj[k] = v;
	}
	function forback(){
		return arguments[1];
	}

	//常量简化
	var doc = document
		,   slice = Array.prototype.slice
		,   pop = Array.prototype.pop
		,   toString = Object.prototype.toString;

	var forEach = sky.forEach = function (o, fn, exe, scope){
		if(scope == null){
			scope = this;
		}
		if(o){
			var doExe = exe? exe.push ? forpush : forappend : forback;
			var len = o.length;
			var type = toString.call(o).toLowerCase();
			var v;
			if(type == "[object nodelist]" || type == "[object arguments]" || (type == "[object object]" && typeof len == "number" && len >= 0)){
				for(var i = 0; i < len; i += 1){
					v = fn.call(scope, o[i], i);
					if(v === false){
						break;
					}
					doExe(exe,v,i);
				}
			}
			else{
				for(var n in o){
					if(o.hasOwnProperty(n)){
						v = fn.call(scope, o[n], n);
						if(v === false){
							break;
						}
						doExe(exe,v, n);
					}
				}
			}
		}
		return exe || scope;
	};

	//数据配置
	var config = sky.config?sky.config : sky.config = {};

	//绑定事件方法以及参数
	sky.bind = function(){
		var a = slice.call(arguments), m = a.shift(), o = a.shift();
		return function(){
			return m.apply(o == null ? this : o, a.concat(slice.call(arguments)));
		}
	};

	//扩展object
	function extra(k,v){
		if(typeof k == "string"){
			this[k] = v;
			return this;
		}
		var ag = slice.call(arguments), m,n;
		while(ag.length){
			m = ag.shift();
			for(n in m){
				this[n] = m[n];
			}
		}
		return this;
	}
	sky.extra = function(){
		return extra.apply(pop.call(arguments),arguments);
	};

	//扩展this
	function extend(){
		var ag = slice.call(arguments),m;
		if(typeof this == "function"){
			this.prototype.extra = extra;
			this._inits_ = [];
			while(ag.length){
				m = ag.shift();
				if(typeof m == "function"){
					extra.call(this,m);
					this._inits_.unshift(m);
					m = m.prototype;
				}
				extra.call(this.prototype,m);
			}
		}
		else{
			while(m = ag.shift()){
				if(typeof m == "function"){
					try{
						m = new m();
					}catch(e){
						m = m.prototype;
					}
				}
				extra.call(this,m);
			}
		}
		return this;
	}
	//继承与扩展
	sky.extend = function(){
		return extend.apply(pop.call(arguments),arguments);
	};

	//事件类
	var ev = sky.EventEmitter = sky.extend({
		on:function(type, fn){
			var m = this._monitor_ || (this._monitor_ = {});
			m[type] || (m[type] = []);
			m[type].push(fn);
			return this;
		},
		onec:function(type, fn){
			this.on(type,function(){
				fn.apply(this,arguments);
				this.off(type,arguments.callee);
			});
			return this;
		},
		off:function(type, fn){
			var m = this._monitor_;
			if(m){
				if(fn){
					var es = m[type];
					if(es){
						for(var i = 0; i < es.length; i += 1){
							if(es[i] == fn){
								es.splice(i, 1);
								break;
							}
						}
					}
				}
				else if(type){
					delete m[type];
				}
				else{
					delete this._monitor_;
				}
			}
			return this;
		},
		emit:function(){
			var type = Array.prototype.shift.call(arguments),
				es = this._monitor_?this._monitor_[type]:null,
				flag, i;
			//返回false 阻止冒泡
			if(es){
				var m;
				for(i = 0; i < es.length; i += 1){
					m = es[i].apply(this, arguments);
					flag!==false && (flag = m);
				}
			}

			//以下是冒泡事件
			if(flag!==false){
				es = this.constructor._monitor_?this.constructor._monitor_[type]:null;
				if(es){
					for(i = 0; i < es.length; i += 1){
						es[i].apply(this, arguments);
					}
				}
			}
			var t = "on" + type;
			if(typeof this[t] == "function"){
				return this[t].apply(this, arguments);
			}
			return this;
		}
	},function(){});
	//函数的事件，触发，有具体对象触发
	ev.on = ev.prototype.on;
	ev.onec = ev.prototype.onec;
	ev.off = ev.prototype.off;

	//当前脚本的script节点
    var baseKey = 'data-base';
	var jsNode = function(ns){
        var n;
        for(var i = 0;i < ns.length;i += 1){
            if(ns[i].getAttribute(baseKey)){
                n = ns[i];
                break;
            }
            if(ns[i].src){
                n = ns[i];
            }
        }
        return n;
	}(doc.getElementsByTagName("script"));
    var jsNodeUrl = jsNode.src.split(/[\?\#]/)[0];

	//获取lib路径
	if(config.base == null){
		config.base = jsNode.getAttribute(baseKey) || jsNodeUrl.replace(/[^\/]*$/, "");
	}
	if(config.alias == null){
		config.alias = {};
	}
	//动态版本号
	if(config.versions == null){
		config.versions = {};
	}
    
    var suffix = jsNode.src.indexOf('.source.js') > 0?'.source.js':'.js';
    function getUrl(src,flag){
        var x = config.alias[src] || src;
        var ver = '?v=' + (config.versions[x] || config.version || '1.0.0');
        var u = x.match(/^([^?#]*)(.*)$/);
        var url = (/\.js|\.css$/.test(u[1])?u[0]:(u[1] + suffix)).replace(/^\.\//, config.base) + ver + u[2];
        if(flag){
            return url.match(/^([^#]*)(.*)$/);
        }
        return url;
    }

	//已经加载完毕的js
	var jsLoaded = {};
	jsLoaded[jsNode.src] = true;
	//待加载的js
	var jsWait = [];
	//待回调的函数
	var callWait = [];
    //定义模块时返回优先
    var callDefine = [];
	//js是否在执行中
	var jsFlag = 0;
	//模块化
	var xModules = {};
    sky.xModules = xModules;

	//进栈
	function stackPush(urls, callBack, charset,isDefine){
		if(callBack){
            (isDefine?callDefine:callWait).push(callBack);
		}
		for(var i = 0; i < urls.length; i += 1){
			jsWait.push([urls[i], stackShift, charset]);
		}
		if(jsFlag == 0){
			jsFlag = 1;
			stackShift();
		}
	}

	function getExports(id){
		var x = xModules[getUrl(id)] || {};
		return x.exports;
	}
	sky.require = getExports;

	//出栈
	function stackShift(){
		if(jsWait.length){
			var js = jsWait.shift();
			disorderJS.apply(null, js);
			return ;
		}
		if(callDefine.length || callWait.length){
			var back = (callDefine.length?callDefine:callWait).pop();
			back(getExports);
			stackShift();
			return ;
		}
		jsFlag = 0;
	}

	//加载script脚本
	function loadJS(url, callBack, charset){
		var t = doc.createElement("script");
		t.setAttribute("type", "text/javascript");
		charset && t.setAttribute("charset", charset);
		t.onreadystatechange = t.onload = t.onerror = function(){
			if(!t.readyState || t.readyState == 'loaded' || t.readyState == 'complete'){
				t.onreadystatechange = t.onload = t.onerror = null;
				t = null;
				//防止回调的时候，script还没执行完毕
				callBack && setTimeout(function(){
					callBack(url);
				},0);
			}
		};
		t.src = url;
		doc.getElementsByTagName("head")[0].appendChild(t);
	}
	function requireJSed(url){
		var x = jsLoaded[url];
        jsLoaded[url] = true;
		if(x && x!==true){
			for(var i= 0,n;i<x.length;i+=1){
				n = x[i];
				n[0](n[1]);
			}
		}
	}

	function requireJS(src, callBack, charset){
		var url = getUrl(src,true)[1];
		if(jsLoaded[url] === true){
            callBack(src);
			return;
		}
        if(jsLoaded[url] == null){
            jsLoaded[url] = [[callBack,src]];
            loadJS(url,requireJSed,charset);
        }
        else{
            jsLoaded[url].push([callBack,src]);
        }
	}

	//无序下载
	function disorderJS(urls, callBack, charset){
		if(typeof urls == "string"){
			requireJS(urls, callBack, charset);
			return;
		}
		var led = {};
        for(var i=0;i<urls.length;i+=1){
            led[urls[i]] = true;
        }
		function loadBack(src){
			delete led[src];
			for(var n in led){
				return;
			}
			callBack();
			loadBack = function(){};
		}
        for(i=0;i<urls.length;i+=1){
            requireJS( urls[i], loadBack, charset);
        }
		return;
	}

	//单独loadjs公开，方便做 jsonp
	sky.loadJS = loadJS;
    sky.loadCSS = function(url,charset){
        var link = doc.createElement('link');
        link.setAttribute('rel','stylesheet');
        link.setAttribute('type','text/css');
        if(charset){
            link.setAttribute('charset',charset);
        }
        link.href = getUrl(url,true)[1];
        doc.getElementsByTagName("head")[0].appendChild(link);
    };

	function skyused(urls,arr){
		forEach(urls,function(v){
			if(v.push && v.shift){
				skyused(v,arr);
			}
			else{
				arr.push(getExports(v));
			}
		});
		return arr;
	}

	sky.use = function(){
		var urls = slice.call(arguments),len = urls.length,callBack,charset,back;
		if(typeof urls[len - 2] == "function"){
			charset = urls.pop();
			len -= 1;
		}
		if(typeof urls[len - 1] == "function"){
			callBack = urls.pop();
		}
		if(callBack){
			back = function(){
				callBack.apply(sky,skyused(urls,[]));
			};
		}
		setTimeout(function(){
			stackPush(urls,back,charset);
		},0);
		return this;
	};

	function defineBack(factory,x){
		if(typeof factory == "function"){
			var y = factory(function(id){
				return getExports(x.deps && x.deps[id] || id);
			}, x.exports,x);
			if(y != null){
				x.exports = y;
			}
		}
		else{
			x.exports = factory;
		}
		var backfn = sky['on_' + x.mid.replace(/^\.\//,'').replace(/\/+/g,'_')];
		backfn && backfn(x.exports);
	}

	sky.define = function(){
		var ag = slice.call(arguments);
		var factory = ag.pop(),deps,id = "";
		if(ag.length){
			deps = ag.pop();
			if(typeof deps == "string"){
				id = deps;
				deps = null;
			}
			else{
				id = ag.pop();
			}
		}
		var u = getUrl(id,true);
		var x = xModules[u[0]] = {url:u[1],id:u[0],mid:id};
		x.exports = {};
		if(deps){
			x.deps = deps;
            setTimeout(function(){
                stackPush(deps,function(){
                    defineBack(factory,x);
                },null,true);
            },0);
		}
		else if(u[1] == jsNodeUrl){
			defineBack(factory,x);
			jsLoaded[u[1]] = true;
		}
		else{
			setTimeout(function(){
				defineBack(factory,x);
			},0);
		}
	};
}();

//别名
sky.extra({
	"comm":"./data/comm",
	"sheet":"./data/sheet",
	"dom":"./dom/dom",
	"kite":"./widget/kite",
	"ajax":"./connect/ajax",
	"template":"./data/template",
    "date":"./widget/date"
},sky.config.alias);

//用户调试的代码
void function(){
	var traceDom,tarceI,tc = ["#F00","#0F0","#00F","#FF0","#F0F","#0FF"],cc = ["#FFF","#000","#FFF","#000","#FFF","#000"];
	sky.debug = function(str){
		if(typeof str != "string"){
			str = JSON.stringify(str);
		}
		if(!traceDom){
			tarceI = 0;
			traceDom = document.createElement("div");
			traceDom.style.cssText = "position:absolute; top:0; left:0; right:0; z-index:999999999;";
			traceDom.ondblclick = function(ev) {
				this.innerHTML = "";
				ev.stopPropagation();
			};
			document.ondblclick = function(){
				var s =  traceDom.style;
				s.display = s.display == "none"?"block":"none";
			};
			document.body.appendChild(traceDom);
		}
		var div = document.createElement("div");
		div.style.cssText = 'padding: 5px; color:' + cc[tarceI] + '; word-wrap: break-word; background-color:' + tc[tarceI++];
		div.innerHTML = str;
		traceDom.appendChild(div);
		tarceI = tarceI % tc.length;
	};
}();