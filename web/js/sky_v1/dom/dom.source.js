/**
 汇聚对dom的操作
 */
sky.define("./dom/dom",function(){
	function $$(str){
		return typeof str == "string"?document.getElementById(str):str;
	}
	function $(str,fn){
		var v = $$(str);
		return typeof fn == "function"?fn.call(v || false):v;
	}

	$.version = "1.0.0";
	//获得当前网页的唯一值
	var soleCount = Math.round(Math.random()*100);
	var getSole = $.getSole = function(){
		var key = soleCount = soleCount + 1,
			fix = Math.round(Math.random() * 26 + 10).toString(36);
		return fix + key;
	};

	//节点缓存
	var Cache = $.Cache = sky.extend({
		//取得缓存
		get:function(d){
			var id = typeof d == "string" ? d : d.id;
			return this.data[id] || null;
		},
		//添加某个节点 到缓存
		append:function(d, v){
			var id = typeof d == "string" ? d : d.id;
			if(!id){
				id = this.create();
				d.id = id;
			}
			this.data[id] = v;
			return this;
		},
		//移除某个缓存 返回该值
		remove:function(d){
			var id = typeof d == "string" ? d : d.id;
			var v = this.data[id];
			delete this.data[id];
			return v;
		},
		//判断某个某个节点是否包含在内
		has:function(d){
			var id = typeof d == "string" ? d : d.id;
			return this.data[id] ? true : false;
		},
		//创建一个 当前页面可以用的 id值 返回
		create:function(){
			var id, el;
			do{
				id = this.prefix + getSole();
				el = $(id);
			}while(el);
			return id;
		}
	},function(prefix){
		this.prefix = prefix || Cache.prefix;
		this.data = {};
	});
	//自动创建的Id的前缀
	Cache.prefix = "_sky_dom_id_";

	function trim(str){
		return str.replace(/^\s+/,"").replace(/\s+$/,"");
	}
	var doc = document;
	var toString = Object.prototype.toString;
    //清理选中
    $.clearSelection = function(){
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    };
	//Dom筛选 简单
	$.get = function(){
		//#a[2,t]x 多ID筛选
		var siftExpIds = /^#([\w\u00c0-\uFFFF\-]*)\[([\-\w,]+)\]([\w\u00c0-\uFFFF\-]*)/,
		//ID筛选
			siftExpId = /^(?:#([\w\u00c0-\uFFFF\-]+))?([ >]*)/,
		//Name筛选
			siftExpName = /^\[name=([\w\u00c0-\uFFFF\-]+)\]/,
		//tag筛选
			siftExpTag = /^([a-zA-Z]+[a-zA-Z:]*|\*)/,
		//样式筛选
			siftExpClass = /^\.([\w\u00c0-\uFFFF\-]+)/,
		//属性筛选
			siftExpAtt = /^\[([\w\u00c0-\uFFFF\-]+)([\^!\$\*]*=)*([\w\u00c0-\uFFFF\-]*)\]/,
		//自定义筛选
			siftExpCus = /^:([\w:\(\),]+)/;
		//筛选器
		function Sift(selector, context){
			var rv = [],flag;
			//ids 筛选 #ttp[1,2,3]xx
			selector = trim(selector).replace(siftExpIds, function($0, q, c, h){
				var rx = c.split(/[\s*,\s*]/), o = rv.$ = {};
				for(var i = 0; i < rx.length; i += 1){
					rv.push(o[rx[i]] = $(q + rx[i] + h));
				}
				flag = true;
				return "";
			});
			if(flag){
				return rv;
			}
			//name [name=]
			selector = trim(selector).replace(siftExpName, function($0, name){
				var r = doc.getElementsByName(name);
				r.length && Sift.filterArray(r,null,rv);
				flag = true;
				return "";
			});
			if(flag){
				return rv;
			}
			//id 单个Id筛选
			var ex = " ";
			selector = selector.replace(siftExpId, function($0, id, e){
				ex = !id || e ? e.indexOf(">") > -1 ? ">" : " " : "";
				if(id){
					context = $(id);
				}
				return "";
			});
			if(ex == ""){
				return context?[context]:[];
			}
			var filter = {};
			selector = selector.replace(siftExpTag, function($0, tag){
				if(tag && tag != "*"){
					filter.tag = [tag];
				}
				return "";
			});
			if(ex == ">"){
				rv = (context || doc.body).childNodes;
			}
			else{
				rv = (context || doc).getElementsByTagName(filter.tag ? filter.tag[0] : "*");
				delete filter.tag;
			}
			selector = selector.replace(siftExpClass, function($0, className){
				filter.className = [className];
				return "";
			});
			selector = selector.replace(siftExpAtt, function($0, key, compare, val){
				filter.att = [key, compare, val];
				return "";
			});
			selector.replace(siftExpCus, function($0, cus){
				var cs = cus.split(":"), i = 0, m, re = /^(\w+)(?:\(([\w,]*)\))?$/;
				for(; i < cs.length; i += 1){
					(m = cs[i].match(re)) && (filter[m[1]] = m[2].split(","));
				}
				return "";
			});
			return Sift.filterArray(rv, filter);
		}

		//筛选 转换为数组
		Sift.filterArray = function(array, filters,rv){
			rv || (rv = []);
			var i = 0, len = array.length, flag;
			for(; i < len; i += 1){
				if(array[i].nodeType == 1){
					flag = true;
					sky.forEach(filters,function(v,n){
						if(!Sift.filter[n].apply(array[i], v)){
							return flag = false;
						}
					});
					flag && rv.push(array[i]);
				}
			}
			return rv;
		};
		//删选器
		Sift.filter = {
			//标签筛选
			tag:function(tag){
				return this.tagName == tag.toLocaleUpperCase();
			},
			//class筛选
			className:function(className){
				return (" " + this.className + " ").indexOf(" " + className + " ") > -1;
			},
			//属性筛选
			att:function(key, compare, val){
				var att = this[key] != null ? this[key] : this.getAttribute(key);
				switch(compare || ""){
					case "":
						return att != null;
					case "=":
						return att == val;
					case "!=":
						return att != val;
					case "^=":
						return att.indexOf(val) == 0;
					case "$=":
						return att.slice(val.length * -1) == val;
					case "*=":
						return att.indexOf(val) > -1;
				}
				return false;
			}
		};
		return Sift;
	}();

	//将Dom产生的事件自动获取 并格式化
	//部分移动事件属性需要增加或者转移
	$.getEvent = function(ev){
		ev = ev || window.event || function(gs){
			return gs[gs.length - 1];
		}(arguments.callee.caller.arguments);
		if(!ev){
			return null;
		}

		//移动是多点触控，默认使用第一个作为clientX和clientY
		if(ev.clientX == null){
			var touches = ev.targetTouches && ev.targetTouches[0]?ev.targetTouches : ev.changedTouches;
			if(touches && touches[0]){
				ev.clientX = touches[0].clientX;
				ev.clientY = touches[0].clientY;
			}
		}
//		if(ev.clientX == null && ev.targetTouches && ev.targetTouches[0]){
//			ev.clientX = ev.targetTouches[0].clientX;
//			ev.clientY = ev.targetTouches[0].clientY;
//		}
		//code 统一处理
		ev.code = ev.charCode || ev.keyCode || ev.which;
		ev.charCode == null && (ev.charCode = (ev.type == "keypress") ? ev.keyCode : 0);
		ev.eventPhase == null && (ev.eventPhase = 2);
		ev.isChar == null && (ev.isChar = ev.charCode > 0);
		ev.pageX == null && (ev.pageX = ev.clientX + doc.body.scrollLeft);
		ev.pageY == null && (ev.pageY = ev.clientY + doc.body.scrollTop);
		ev.preventDefault == null && (ev.preventDefault = function(){
			this.returnValue = false;
		});
		ev.stopPropagation == null && (ev.stopPropagation = function(){
			this.cancelBubble = true;
		});
		ev.target == null && (ev.target = ev.srcElement);
		ev.time == null && (ev.time = new Date().getTime());

		if(ev.relatedTarget == null && (ev.type == "mouseout" || ev.type == "mouseleave")){
			ev.relatedTarget = ev.toElement;
		}
		if(ev.relatedTarget == null && (ev.type == "mouseover" || ev.type == "mouseenter")){
			ev.relatedTarget = ev.fromElement;
		}
		if(ev.type == "mousewheel" || ev.type == "DOMMouseScroll"){
			if(ev.wheelDelta == null){
				ev.wheelDelta = ev.detail * -40;
			}
			ev.wheelDeltaFlg = ev.wheelDelta < 0;
		}
		return ev;
	};

	//动态创建多节点
	var domCache = {};
	var create = $.create = function(t, b, h, y){
		var rv;
		//制造节点
		if(typeof t == "string"){
			if(b == "text"){
				rv = doc.createTextNode(t);
				y = h;
			}
			else{
				b = b || {};
				t = t.toLowerCase();
				//IE中的只读属性
				if(sky.IE && sky.IE < 9 && (b.name || b.checked || b.hidefocus)){
					t = '<' + t;
					if(b.name){
						t = t + ' name="' + b.name + '"';
						delete b.name;
					}
					if(b.checked){
						t = t + ' checked="checked"';
						delete b.checked;
					}
					if(b.hidefocus){
						t = t + ' hidefocus="true"';
						delete b.hidefocus;
					}
					t = t + " >";
				}
				if(!domCache[t]){
					domCache[t] = doc.createElement(t);
				}
				rv = domCache[t].cloneNode(false);
				if(typeof h == "string" || typeof h == "number"){
					rv.innerHTML = h;
				}
				else if(toString.call(h) == "[object Array]"){
					create(h,rv);
				}
				//设置属性
				$.attr(rv, b);
			}
		}
		else if(toString.call(t) == "[object Array]"){
			if(typeof t[0] == "string"){
				rv = create.apply($,t);
			}
			else{
				rv = [];
				for(var i = 0; i < t.length; i += 1){
					rv.push(create.apply($,t[i]));
				}
			}
			y = b;
		}
		//加入
		y && $.append(y, rv);
		return rv;
	};

	//Dom 设置CSS
	$.css = function(d, k, v){
		d = $$(d);
		if(typeof k == "string"){
			if(k == "opacity"){
				return $.opacity(d, v);
			}
			if(k == "float"){
				k = sky.IE?"styleFloat":"cssFloat";
			}
			k = k.replace(/\-([a-z])/g, function(){
				return arguments[1].toUpperCase();
			});
			if(v == null){
				return d.style[k] || (d.currentStyle ? d.currentStyle[k] : d.ownerDocument.defaultView.getComputedStyle(d, null)[k]);
			}
			d.style[k] = v;
			return this;
		}
		sky.forEach(k,function(v,n){
			$.css(d, n, v);
		});
		return this;
	};

	//设置透明度
	$.opacity = sky.IE && sky.IE < 9 ? function(d, v){
		d = $$(d);
		var ropacity = /opacity=([^)]*)/, ralpha = /alpha\([^)]*\)/, style = d.style,filter;
		if(v == null){
			filter = style.filter || d.currentStyle.filter || "";
			return filter && filter.indexOf("opacity=") >= 0 ? parseFloat(ropacity.exec(filter)[1]) / 100 : 1;
		}
		var opacity = parseInt(v, 10) + "" === "NaN" ? "" : "alpha(opacity=" + v * 100 + ")";
		filter = style.filter || "";
		style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : opacity;
		return this;
	} : function(d, v){
		if(v == null){
			v = d.style.opacity || (d.currentStyle ? d.currentStyle.opacity : d.ownerDocument.defaultView.getComputedStyle(d, null).opacity);
			return v == "" ? 1 : v;
		}
		d.style.opacity = v;
		return this;
	};

	//CSS实际宽度
	void function(){
		//设置新的CSS属性，并把老的CSS属性返回
		function cssSwap(d, op){
			var old = {};
			sky.forEach(op,function(v,n){
				old[n] = $.css(d, n);
				$.css(d, n, v);
			});
			return old;
		}

		//获取宽 高数据
		function getDomWH(d, t, c, a){
			var v = d["offset" + t];
			if(v == 0){
				var old = cssSwap(d, {position:"absolute", visibility:"hidden", display:"block"});
				v = d["offset" + t];
				cssSwap(d, old);
			}
			var i;
			if(c){
				for(i = 0; i < c.length; i += 1){
					v -= parseFloat($.css(d, c[i])) || 0;
				}
			}
			if(a){
				for(i = 0; i < a.length; i += 1){
					v += parseFloat($.css(d, a[i])) || 0;
				}
			}
			return v;
		}

		//CSS实际宽度
		$.width = function(d, v){
			d = $$(d);
			if(v == null){
				v = $.css(d, "width");
				if(v && /px$/.test(v)){
					return parseInt(v) || 0;
				}
				return getDomWH(d, "Width", ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"]);
			}
			d.style.width = typeof v == "number" ? v + "px" : v;
			return this;
		};
		//CSS实际高度
		$.height = function(d, v){
			d = $$(d);
			if(v == null){
				v = $.css(d, "height");
				if(v && /px$/.test(v)){
					return parseInt(v) || 0;
				}
				return getDomWH(d, "Height", ["paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"]);
			}
			d.style.height = typeof v == "number" ? v + "px" : v;
			return this;
		};
		// 获取某个节点的 left top width heiget 属性
		$.offset = function(d, sl){
			d = $$(d);
			var r = {}, ds = d.style.display, old;
			if(ds == "none"){
				old = cssSwap(d, {position:"absolute", visibility:"hidden", display:"block"});
			}
			if(sl != 2){
				r.left = 0;
				r.top = 0;
				if(d.getBoundingClientRect){
					var box = d.getBoundingClientRect(),
						body = doc.body,
						docEl = doc.documentElement,
						clientTop = docEl.clientTop || body.clientTop || 0,
						clientLeft = docEl.clientLeft || body.clientLeft || 0,
						zoom = 1;
					if(body.getBoundingClientRect){
						var bound = body.getBoundingClientRect();
						zoom = (bound.right - bound.left) / body.clientWidth;
					}
					if(zoom > 1){
						clientTop = 0;
						clientLeft = 0;
					}
					r.top = box.top / zoom + (window.pageYOffset || docEl && docEl.scrollTop / zoom || body.scrollTop / zoom) - clientTop;
					r.left = box.left / zoom + (window.pageXOffset || docEl && docEl.scrollLeft / zoom || body.scrollLeft / zoom) - clientLeft;
				}
				else{
					var e = d;
					while(e.offsetParent){
						r.left += (e.offsetLeft - e.scrollLeft);
						r.top += (e.offsetTop - e.scrollTop);
						e = e.offsetParent;
					}
				}
			}
			if(sl != 1){
				r.width = d.offsetWidth;
				r.height = d.offsetHeight;
			}
			if(old){
				cssSwap(d, old);
			}
			return r;
		};
	}();

	//切换样式
	$.toggleClass = function(d, v, f){
		d = $$(d);
		v = trim(v);
		if(!v){
			return this;
		}
		if(f && !d.className){
			d.className = v;
			return this;
		}
		if(f === false && !d.className){
			return this;
		}
		var cn = " " + trim(d.className).replace(/\s+/g, " ") + " ", p = v.split(/\s+/);
		for(var i = 0; i < p.length; i += 1){
			if(cn.indexOf(" " + p[i] + " ") >= 0){
				if(!f){
					cn = cn.replace(" " + p[i] + " ", " ");
				}
			}
			else{
				if(f || f == null){
					cn += (p[i] + " ");
				}
			}
		}
		d.className = trim(cn);
		return this;
	};
	//增加Class
	$.addClass = function(d, v){
		$.toggleClass(d, v, true);
		return this;
	};
	//增加Class
	$.hasClass = function(d, v){
		d = $$(d);
		var cn = " " + trim(d.className).replace(/\s+/g, " ") + " ", p = trim(v).split(/\s+/);
		for(var i=0; i< p.length; i+=1){
			if(cn.indexOf(" " + p[i] + " ") == -1){
				return false;
			}
		}
		return true;
	};
	//移除Class
	$.removeClass = function(d, v){
		$.toggleClass(d, v, false);
		return this;
	};
	//获得 HTML 或者设置HTML
	$.html = function(d, v){
		d = $$(d);
		if(v == null){
			return d.innerHTML.replace(/\s*[iI][dD]=(['"]*)_sky_dom_id_\w+\1\s*/g, " ");
		}
		d.innerHTML = v;
		return this;
	};
	//获得 HTML 或者设置HTML
	var domText = sky.IE ? "innerText" : "textContent";
	$.text = function(d, v){
		d = $$(d);
		if(v == null){
			return d[domText];
		}
		d[domText] = v;
		return this;
	};

	//清空字节点
	$.clear = function(d){
		d = $$(d);
		while(d.childNodes.length){
			d.removeChild(d.lastChild);
		}
		return this;
	};
	//添加字节点
	$.append = function(d, v){
		d = $$(d);
		if(toString.call(v) == "[object Array]"){
			for(var i = 0; i < v.length; i += 1){
				$.append(d, v[i]);
			}
			return this;
		}
		d.appendChild(v);
		return this;
	};

	//Dom事件
	void function(){
		var eventKeyDown = $.keypressConfig = {
			vkeyenter:13,
			vkeybackspace:8,
			vkeyspace:32,
			vkeydel:46,
			vkeyleft:37,
			vkeyup:38,
			vkeyright:39,
			vkeydown:40
		};

		//虚拟事件
        var vEvt = sky.isTouch?{
            vresize:'orientationchange',
            vclick:'mousedown',
            vdown:'touchstart',
            vmove:'touchmove',
            vup:'touchend'
        }:{
            vresize:'resize',
            vclick:'click',
            vdown:'mousedown',
            vmove:'mousemove',
            vup:'mouseup'
        };
        var vEvent = $.vEvents = sky.forEach(vEvt,function(z){
            return function(fn){
                if (!fn) {
                    return z;
                }
                return [z, fn];
            };
        },{});
		var exEvent = $.exEvents = [];
		//使得 火狐有 mousewheel mouseenter mouseleave 事件 以及 添加 keyenter事件
		function eventCut(e, fn, f){
			//虚拟事件，需要转移只实体事件
			if(vEvent[e]){
				return vEvent[e](fn,f);
			}

			//按键事件
			var ee;
			if(eventKeyDown[e]){
				if(!fn){
					return "keypress";
				}
				ee = "_sky_dom_" + e + "_";
				if(f && !fn[ee]){
					fn[ee] = function(ev){
						var keyfun = eventKeyDown[e], key = (ev || window.event).keyCode;
						if(typeof keyfun == "function" && keyfun(key)){
							return fn.call(this, ev);
						}
						if(keyfun == key){
							return fn.call(this, ev);
						}
					}
				}
				return ["keypress", fn[ee] || fn];
			}

			if(!sky.IE && (e == "mouseenter" || e == "mouseleave")){
				if(!fn){
					return e == "mouseenter" ? "mouseover" : "mouseout";
				}
				ee = "_sky_dom_mouse_el_";
				if(f && fn[ee] == null){
					fn[ee] = function(ev){
						var t = ev.relatedTarget;
						if(t && !(t.compareDocumentPosition(this) & 8)){
							fn.call(this, ev);
						}
					}
				}
				return [e == "mouseenter" ? "mouseover" : "mouseout", fn[ee] || fn];
			}

			if(sky.Firefox && e == "mousewheel"){
				return fn ? ["DOMMouseScroll", fn] : "DOMMouseScroll";
			}

			//泛累虚拟事件
			for(var i=0;i<exEvent.length;i+=1){
				ee = exEvent[i](e,fn,f);
				if(ee){
					return ee;
				}
			}

			return fn ? [e, fn] : e;
		}

		//通过M.bind加入的事件，都会在这里留下缓存
		var eventCache = new Cache();
		//对缓存的处理
		function eventHandle(d, e, f, fn, cap, a){
			if(f){//加入
				var data;
				if(eventCache.has(d)){
					data = eventCache.get(d);
				}
				else{
					data = [];
					eventCache.append(d, data);
				}
				a.unshift(d);
				a.unshift(fn);
				var m = sky.bind.apply(d, a);
				data.push([e, fn, m, cap]);
				return m;
			}
			else{
				var rv = [];
				if(eventCache.has(d)){
					var c = eventCache.get(d);
					for(var i = 0; i < c.length;){
						if(c[i][0] == e && (fn == null || (fn && c[i][1] == fn))){
							rv.push([c[i][2],c[i][3]]);
							c.splice(i, 1);
						}
						else{
							i += 1
						}
					}
				}
				return rv;
			}
		}

		//设置节点的属性
		void function(){
			//非IE下设置某些特殊属性 转义 以及节点缓存
			var domAttName = {
				className:"class",
				htmlFor:"for"
			};
			$.attr = function(d, k, v){
                d = $$(d);
				if(typeof k == "string"){
					//转义
					if(!sky.IE && domAttName[k]){
						k = domAttName[k]
					}
					//取值
					if(v == null){
						return k == "style" ? d.style.cssText : (d[k] || d.getAttribute(k));
					}
					if(k == "style"){//样式
						typeof v == "string" ? d.style.cssText = v : $.css(d, v);
						return this;
					}
					if(typeof v == "function" && (/^on/.test(k) || eventKeyDown[k] || vEvent[k])){
						var f = eventCut(eventKeyDown[k] || vEvent[k]?k:k.replace(/^on/, ""), v, true);
						d["on" + f[0]] = f[1];
						return this;
					}
					if(k == "className" || typeof v == "function"){
						d[k] = v;
						return this;
					}
					if(v === false){
						d.removeAttribute(k);
						return this;
					}
					d.setAttribute(k, v);
					return this;
				}
				sky.forEach(k,function(v,n){
					$.attr(d, n, v);
				});
				return this;
			};
		}();

		//添加/移除 事件
		var eventAppend = doc.addEventListener ? function(d, e, fn, cap){
			d.addEventListener(e, fn, !!cap);
		} : function(d, e, fn,cap){
			d.attachEvent("on" + e, fn);
			if(cap){
				doc.documentElement.setCapture();
			}
		};
		var eventRemove = doc.removeEventListener ? function(d, e, fn, cap){
			d.removeEventListener(e, fn, !!cap);
		} : function(d, e, fn, cap){
			d.detachEvent("on" + e, fn);
			if(cap){
				doc.documentElement.releaseCapture();
			}
		};
		//增加普通事件
		$.appendEvent = function(d, e, fn, cap){
			d = $$(d);
			var f = eventCut(e, fn, true);
			eventAppend(d, f[0], f[1], cap);
			return this;
		};
		//移除普通事件
		$.removeEvent = function(d, e, fn, cap){
			d = $$(d);
			var f = eventCut(e, fn);
			eventRemove(d, f[0], f[1], cap);
			return this;
		};
        //只执行一次的事件
        $.onec = function(d, e, fn, cap){
            $.appendEvent(d, e, function(){
				fn.apply(this,arguments);
				$.removeEvent(d, e ,arguments.callee, cap);
			}, cap);
			return this;
        };
		//手动触发事件 获赠增加属性事件
		$.on = function(d, e, fn){
			d = $$(d);
			var f = eventCut(e || "click", fn, true);
			d["on" + f[0]] = f[1];
			return this;
		};
		$.emit = doc.createEvent?function(d,e,obj){
			d = $$(d);
			var v = e || "click", ev;
			ev = doc.createEvent('HTMLEvents');
			ev.initEvent(eventCut(v), true, true);
			if(obj){
				sky.extra(obj,ev);
			}
			d.dispatchEvent(ev);
			return this;
		}:function(d,e,obj){
			d = $$(d);
			var v = e || "click", ev;
			ev = doc.createEventObject();
			if(obj){
				sky.extra(obj,ev);
			}
			d.fireEvent('on' + eventCut(v), ev);
			return this;
		};
		// 添加事件
		$.bind = function(d, e, f){
			d = $$(d);
			var v = eventCut(e, f, true),
				m = eventHandle(d, e, true, v[1], false, Array.prototype.slice.call(arguments, 3));
			eventAppend(d, v[0], m);
			return this;
		};
		// 添加事件 设置 setcapture
		$.bindCapture = function(d, e, f){
			d = $$(d);
			var v = eventCut(e, f, true),
				m = eventHandle(d, e, true, v[1], true, Array.prototype.slice.call(arguments, 3));
			eventAppend(d, v[0], m);
			return this;
		};
		//移除事件
		$.unbind = function(d, e, f){
			d = $$(d);
			var v = f ? eventCut(e, f, false) : [eventCut(e, f, false), null],
				n = eventHandle(d, e, false, v[1]);
			for(var i = 0; i < n.length; i += 1){
				eventRemove(d, v[0], n[i][0], n[i][1]);
			}
			return this;
		};
        //点击事件
        $.vclick = function(d,f,cap){
            if(typeof f == 'function'){
                $.appendEvent(d,'vclick',f,cap);
            }
            else{
                $.emit(d,'vclick',f);
            }
        };
	}();
    
    //特殊事件提供
    $.skyLive = function(id,back,e){
        e || (e = 'vclick');
        var me = $(id);
        $.appendEvent(me,e,function(){
            var ev = $.getEvent();
            var target = ev.target;
            while(target && target != me){
                var fn = target.getAttribute('sky-fn');
                var data = target.getAttribute('sky-data');
                if(fn || data){
                    var fun = back;
                    if(fn != null){
                        fun = back[fn];
                    }
                    if(fun){
                        var arg = [ev];
                        if(data != null){
                            arg.unshift(data);
                        }
                        var flag = fun.apply(target,arg);
                        if(flag === false){
                            break;
                        }
                    }
                }
                
                target = target.parentNode;
            }
        });
    };

	//对dom数组中的方法封装
	var expand = $.expand = {
		//不破坏当前this，生成新的对象 返回
		get:function(i){
			if(typeof i == "number"){
				return sky.extra(expand,[this[i]]);
			}
			for(var n = 0, nl = this.length, r = [], o = {}, m; n < nl; n += 1){
				m = eval(i);
				if(this[m] && !o[m]){
					r.push(o[m] = this[m]);
				}
			}
			return sky.extra(expand,r);
		},
		//在当前对象数组中删除部分元素 返回本身
		wipe:function(i){
			for(var n = 0, nl = this.length; n < nl; n += 1){
				this[eval(i)] = null;
			}
			for(n = 0; n < nl;){
				if(this[n]){
					n += 1;
				}
				else{
					this.splice(n, 1);
				}
			}
			return this;
		},
		//迭代
		forEach:function(){
			var fn = arguments[0];
			for(var i = 0; i < this.length; i += 1){
				arguments[0] = i;
				if(fn.apply(this[i], arguments) === false){
					break;
				}
			}
			return this;
		},
		//取值函数
		val:function(){
			var v = [], radio = true, rv, ckBox = true, cv = [], nn, tt;
			for(var i = 0; i < this.length; i += 1){
				v.push(trim(this[i].value || this[i].getAttribute("value") || ""));
				nn = this[i].nodeName.toUpperCase();
				tt = this[i].type.toUpperCase();
				if(radio){
					radio = nn == "INPUT" && tt == "RADIO";
					if(radio){
						ckBox = false;
						if(this[i].checked){
							rv = this[i].value;
						}
					}
				}
				if(ckBox){
					ckBox = nn == "INPUT" && tt == "CHECKBOX";
					if(ckBox && this[i].checked){
						cv.push(this[i].value);
					}
				}
			}
			return radio ? rv : ckBox ? cv : v;
		}
	};
	var expandOne = $.expandOne = {};
    $.setExpand = function(type,fn){
        fn || (fn =  $[type]);
        expand[type] = function(){
			Array.prototype.unshift.call(arguments, null);
			for(var i = 0, len = this.length, ks = []; i < len; i += 1){
				arguments[0] = this[i];
				ks[i] = fn.apply(this, arguments);
			}
			return ks[0] == this ? this : ks;
		};
		expandOne[type] = function(){
			if(this[0]){
				Array.prototype.unshift.call(arguments, this[0]);
				return fn.apply(this, arguments);
			}
			return this;
		};
    };
	//继续扩展
	sky.forEach(["attr", "css", "opacity", "width", "height", "html", "text", "clear", "offset", "bind", "unbind", "appendEvent", "removeEvent", "on", "emit", "addClass", "removeClass", "toggleClass","hasClass","skyLive","vclick"], function(type){
        $.setExpand(type);
    });

	//多节点查询，并附加方法
	$.query = function(els,context){
		return sky.extra(expand,typeof els == "string" ? $.get(els,context) : toString.call(els) == "[object Array]" ? els : [els]);
	};
	//多节点查询，并附加方法
	$.queryOne = function(els,context){
		if(typeof els == "string"){
			return sky.extra(expandOne,$.get(els,context).splice(0,1));
		}
		if(toString.call(els) == "[object Array]"){
			return sky.extra(expandOne,els.splice(0,1));
		}
		return sky.extra(expandOne,[els]);
	};
	return $;
});