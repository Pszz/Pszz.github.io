/**
 * 前端模板
 */
sky.define("./data/template", function(require, exports){
	exports.version = "1.0.0";
	//获取模板 正则
	var tempMReg = /<!--\s*\^\s*(\w+)\s*-->(.*)<!--\s*\1\s*\$\s*-->/g;
	//对模板中的 {#...} 占位符进行替换
	var tempRRe = /\{([#]?)(.*?)(?:\|([\w\$]+)(?:\((.*?)\))?)?\}/g;
	//获取obj中对应的值 对.分解
	function getValue(obj, key){
		if(key == "*"){
			return obj;
		}
		var x = key.split(/[.]+/);
		while(obj != null && x.length){
			obj = obj[x.shift()];
		}
		return obj;
	}

	function valueEncode(v, flag){
		if(v == null){
			v = "";
		}
		v = String(v).replace(/\"/g, "&#34;").replace(/\'/g, "&#39;");
		if(flag){
			v = v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		}
		return v;
	}

	var format = exports.format = {
		//运用其他模板
		apply: function(obj, mId){
			return this.apply(mId, obj);
		},
		//循环数组 引用其他模板
		applyArray: function(arr, mId, split){
			return this.applyArray(mId, arr).join(split || "");
		},
		//格式化字符串 使得次字符串执行innerHTML的时候，按照次字符串原本的内容显示
		htmlEncode: function(v){
			return valueEncode(v, true);
		},
		//格式化字符串，并将回车替换为<br />
		htmlEncodeBr: function(v){
			return valueEncode(v, true).replace(/\n/g, "<br />");
		},
		//格式化为页面节点的属性值 比如value值
		valueEncode: function(v){
			return valueEncode(v);
		}
	};

	exports.setFormat = function(){
		var ag = Array.prototype.slice.call(arguments);
		ag.push(this.format);
		sky.extra.apply(this, ag);
		return this;
	};

	var template = exports.BaseClass = sky.extend({
		//获取页面中模板数据
		getLocal: function(type){
			var s = document.getElementsByTagName("script"), n, i = 0;
			if(type == null){
				type = "text/html";
			}
			for(; i < s.length; i += 1){
				if((n = s[i]).getAttribute("type") == type){
					this.setModel(n.innerHTML);
					//多次调用 防止重复设置
					n.parentNode.removeChild(n);
				}
			}
			return this;
		},
		//将一个带有模板数据的字符串转换为模板集
		setModel: function(str,key){
			if(key){
				this.data[key] = str;
			}
			else{
				var v = str.replace(/^\s+|\s+$|\n+|\r+/g, "").replace(/>\s+</g, "><"), arr;
				while(arr = tempMReg.exec(v)){
					this.data[arr[1]] = arr[2];
				}
			}
			return this;
		},
		//应用模板
		apply: function(mId,obj){
			if(this.data[mId]){
				var me = this, f = me.format;
				var arg = arguments;
				return me.data[mId].replace(tempRRe, function(str, type, key, fun, parms){
					var rv;
					var o = type == '#'?obj:arg;
					var fn = f[fun] || format[fun];
					if(typeof fn == 'function'){
						var vs = key?sky.forEach(key.split(','),function(v){
							return getValue(o,v);
						},[]):[];
						rv = fn.apply(me, vs.concat((parms || "").split(/,/)));
					}
					else if(key){
						rv = getValue(o, key);
					}
					if(rv == null){
						rv = "";
					}
					return rv;
				});
			}
			return "";
		},
		applyArray:function(mId, arr){
			return arr ? sky.forEach(arr,function(obj,i){
				return this.apply(mId, obj,i);
			}, [], this) : [];
		},
		//执行format中另外的函数
		call: function(){
			var ag = Array.prototype.slice.call(arguments), key = ag.shift();
			return this.format[key].apply(this, ag);
		},
		//扩展format
		setFormat: exports.setFormat
	}, function(){
		this.data = {};
		this.format = sky.extra(format,{});
	});

	exports.create = function(type){
		var t = new template();
		if(type){
			t.getLocal(type);
		}
		return t;
	};
});