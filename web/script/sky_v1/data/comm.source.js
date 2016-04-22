/**
 * 数据处理 V1.0.0 版本
 */
sky.define("./data/comm", function(require, exports){
	exports.version = "1.0.0";
	var toString = Object.prototype.toString;
	var J = exports.JSON = {};
	//基础数据转换
	//json字符串转Object 安全转换
	J.parse = function(str,safety){
		if(!str){
			return null;
		}
        if(safety || safety === undefined){
            if(window.JSON){
                try{
                    return window.JSON.parse(str);
                }catch(e){
                    return null;
                }
            }
            //验证json字符串的安全性,不安全，直接返回 null
            if(!/^[\],:{}\s]*$/.test(str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))){
                return null;
            }
        }
        
        // 直接调用 eval 序列化
        try{
            return eval("(" + str + ")");
        }catch(e){
            return null;
        }
		
		return null;
	};
	J.stringify = function(obj){
        if(window.JSON){
            //调用系统的
            return window.JSON.stringify(obj);
        }
        
		var type = typeof obj;
		if(obj == null){
			return "null";
		}
		if(type == "string"){
			return "\"" + obj.replace(/([\'\"\\])/g, "\\$1").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r") + "\"";
		}
		if(type == "number"){
			return obj.toString();
		}
		if(type == "boolean"){
			return obj + "";
		}
		var r = [], i, x;
		if(toString.call(obj) == "[object Array]"){
			var il = obj.length;
			for(i = 0; i < il; i += 1){
				x = arguments.callee(obj[i]);
				x != null && r.push(x);
			}
			return "[" + r.join(",") + "]";
		}
		if(obj && obj.constructor == Object){
			for(i in obj){
				if(obj.hasOwnProperty(i)){
					x = arguments.callee(obj[i]);
					x != null && r.push("\"" + i + "\":" + x);
				}
			}
			return "{" + r.join(",") + "}";
		}
		return null;
	};

	var X = exports.XML = {};
	//将字符串转XML
	X.parse = window.DOMParser ? function(str){
        try{
            var xml = new DOMParser().parseFromString(str, "text/xml");
//            //火狐加载失败的时候 会生成一个特定的错误xml
            return xml.documentElement.tagName != "parsererror" ? xml : null;
        }catch(e){
            return null;
        }
	} : function(str){
		var xml = new ActiveXObject("Microsoft.XMLDOM");
		try{
			var flg = xml.loadXML(str);
			return flg ? xml : null;
		}catch(e){
		}
		return null;
	};

	var QS = exports.QS = {};

	function getQS(str){
		var data = {};
		sky.forEach(str.replace(/^[\s#\?&]+/, "").replace(/&+/, "&").split(/&/), function(v){
			var s = v.split("=");
			if(s[0] != ""){
				s[1] = decodeURIComponent(s[1] || "");
				if(data[s[0]] == null){
					data[s[0]] = s[1];
				}
				else if(data[s[0]].push){
					data[s[0]].push(s[1]);
				}
				else{
					data[s[0]] = [data[s[0]], s[1]];
				}
			}
		});
		return data;
	}

	var QSData = {};
	QS.parse = function(str, key){
		var data = QSData[str];
		if(!data){
			data = QSData[str] = getQS(str);
		}
		if(key){
			return data[key];
		}
		return data;
	};
	//获取页面地址上的参数
	exports.getSearch = function(key){
		return QS.parse(document.location.search, key);
	};
	exports.getHash = function(key){
		return QS.parse(document.location.hash, key);
	};

	QS.stringify = function(obj, k){
		var rv = [];
		sky.forEach(obj, function(m, n){
			if(toString.call(m) === "[object Array]"){
				for(var i = 0; i < m.length; i += 1){
					rv.push(n + "=" + encodeURIComponent(m[i]));
				}
			}
			else{
				rv.push(n + "=" + encodeURIComponent(m));
			}
		});
		return rv.join(k || "&");
	};

	exports.cookie = {
		//获取对应cookie的建的值
		get: function(k){
			return new RegExp("[?:; ]*" + k + "=([^;]*);?").test(document.cookie + "") ? decodeURIComponent(RegExp["$1"]) : "";
		},
		//设置Cookie 建 值 有效期 目录 域 安全
		set: function(k, v, t, p, m, s){
			var r = k + "=" + encodeURIComponent(v);
			if(t){
				if(typeof t == "string"){
					t = new Date(t.replace(/-/g, "/").replace(/\.\d+$/, ""));
				}
				else if(typeof t == "number"){
					t = new Date(new Date().getTime() + t * 60000);
				}
				r += "; expires=" + t.toGMTString();
			}
			if(p){
				r += "; path=" + p;
			}
			if(m){
				r += "; domain=" + m;
			}
			if(s){
				r += "; secure";
			}
			document.cookie = r;
			return this;
		},
		//删除Cookie
		del: function(k, p, m){
			var r = k + "=; expires=" + (new Date(0)).toGMTString();
			if(p){
				r += "; path=" + p;
			}
			if(m){
				r += "; domain=" + m;
			}
			document.cookie = r;
			return this;
		}
	};
    
    // 兼容IE的本地存储
    exports.store = window.localStorage || function(){
        var userData,name = document.location.hostname;
        var init = function(){
            init = function(){
                userData.load(name);
            };
            userData = document.createElement('input');
            userData.type = 'hidden';
            userData.style.display = 'none';
            userData.addBehavior ("#default#userData");
            document.body.appendChild(userData);
            init();
        };
        
        return {
            //设置存储数据
            setItem:function(key,value){
                init();
                userData.setAttribute(key, value);
                userData.save(name);
            },
            getItem:function(key){
                init();
                return userData.getAttribute(key);
            },
            removeItem:function(key){
                init();
                userData.removeAttribute(key);
                userData.save(name);
            }
        };
    }();
});