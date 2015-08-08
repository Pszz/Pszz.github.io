/**
 上传为 如果可以用 ajax上传的话，就用 ajax上传，没有测使用 flash上传
 */
void function(){
	function getFlashVars(){
		var str = ["porxy=" + this.porxy];
		var accept = this.accept;
		if(accept && accept.length){
			str.push("type=*." + accept.join(";*."));
		}
		return str.join("&");
	}

	function getFlash(id){
		return document[id] || document.getElementById(id);
	}

	//是否为 flash 上传
	var isFlash = !window.FormData;
	var num = 0;

	sky.define("./connect/upload" , isFlash?null:["./connect/ajax"] ,function(require, exports){
		var ajax = isFlash?null:require("./connect/ajax");
		function createBack(me){
			var key;
			num += 1;
			if(isFlash){
				key = "_upload_" + num.toString(36);
				window[key] = {
					appendSelect:function(ls){
						me._append(ls);
					},
					progress:function(id,per){
						me._progress(id,per);
					},
					complete:function(id,data){
						me._complete(id,data);
					}
				};
			}
			else{
				key = {
					onchange:function(){
						var ls = [];
						num += 1;
						for(var i = 0, k,f;i<this.files.length;i+=1){
							k = "upid" + num + "_" + i;
							f = key._list[k] = this.files[i];
							ls.push({
								id:k,
								name:f.name,
								size:f.size
							});
						}
						me._append(ls);
					},
					submit:function(id,url,name){
						var pm = new FormData();
						pm.append(name,this._list[id]);
						var up = key._ajax[id] = ajax.post(url,function(){
							delete key._ajax[id];
							me._complete(id,this.status!=200?null:this.responseText);
						},pm);
						up.on("progress",function(event){
							if(event.lengthComputable){
								me._progress(id,Math.ceil(event.loaded / event.total * 100));
							}
						});
					},
					cancel:function(id){
						var up = key._ajax[id];
						if(up){
							up.abort();
							delete key._ajax[id];
						}
					},
					_list:{},
					_ajax:{}
				};
			}
			return key;
		}

		var fixSWF = '_swf_embed_';
		var upload = exports.BaseClass = sky.extend(sky.EventEmitter,{
			//id 将上传flash嵌入到Id对用的节点中
			create:function(id){
				var con = document.getElementById(id);
				this.conId = id;
				var embedId = this.embedId = id + fixSWF;
				if(isFlash){
					//flash 实现上传
					var str = getFlashVars.call(this);
					var url = this.swfUrl || (sky.config.base + "connect/upload.swf");
					con.innerHTML = sky.IE?
						[
							'<object class="_swf_up_" width="100%" height="100%" id="' + embedId + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">',
							'<param value="' + url + '" name="movie">',
							'<param value="high" name="quality">',
							'<param value="transparent" name="wmode">',
							'<param name="allowFullscreen" value="false">',
							'<param name="allowScriptAccess" value="always">',
							'<param name="FlashVars" value="' + str + '" />',
							'</object>'
						].join("")
						:
						'<embed class="_swf_up_" name="' + embedId + '" FlashVars="' + str + '" src="' + url + '" width="100%" height="100%" allowscriptaccess="always" allowfullscreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" wmode="transparent"></embed>';
				}
				else{
					//input 实现上传
					this.clear();
				}
			},
			//清理缓存
			clear:function(){
				//flash清理还没支持
				if(!isFlash){
					var con = document.getElementById(this.conId);
					var embedId = this.embedId;
					con.innerHTML = '<input id="' + embedId + '" class="_file_up_" type="file" multiple="true" accept="' + this.inputAccept + '" />';
					document.getElementById(embedId).onchange = this.porxy.onchange;
				}
				return this;
			},
			//获取flash
			getEmbed:function(){
				return isFlash?document[this.embedId] || document.getElementById(this.embedId):this.porxy;
			},
			//提交
			//id 通过select回调后生成的id
			submit : function(id){
				var data = this.getList(id);
				if(data && !data.complete){
					if(data.url == null){
						data.url = this.url;
					}
					(isFlash?getFlash(this.embedId):this.porxy).submit(data.id,this.url,this.name);
					this.emit("submit",id);
				}
			},
			//取消id对应的上传
			cancel : function(id){
				var data = this.getList(id);
				if(data){
					this.emit("cancel",id);
					delete this.list[id];
					if(data.url){
						(isFlash?getFlash(this.embedId):this.porxy).cancel(data.id);
					}
				}
			},
			//获取上传列表属性
			getList : function(id){
				var list = this.list;
				return id == null?list:list[id];
			},
			//flash产生的select事件回调
			_append : function(ls){
				var list = this.list;
				var accept = " " + this.accept.join(" ") + " ";
				this.emit("select",sky.forEach(ls,function(v){
					var type = v.name.split('.').pop();
					v.valid = accept.indexOf(" " + type + " ") > -1;
					list[v.id] = v;
					return v.id;
				},[]));
			},
			//完成上传，如果失败，data为null
			_complete : function(id,backData){
				var data = this.getList(id);
				if(data){
					data.complete = true;
					this.emit("complete",id,backData);
				}
			},
			//上传进度
			_progress : function(id,per){
				var data = this.getList(id);
				if(data){
					this.emit("progress",id,per);
				}
			}
		},function(url,name){
			this.url = url;
			this.name = name || "file";
			this.list = {};
			this.accept = [];
			this.porxy = createBack(this);
		});

		exports.create = function(url,name){
			return new upload(url,name);
		};
	});
}();