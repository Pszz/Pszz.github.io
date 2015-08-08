sky.define("./widget/kite",["./dom/dom"],function(require,K){
	K.version = "1.0.0";

	var doc		= document,
		docEl	= doc.documentElement,
		$		= require(0),
		bar		= "sky-kite",
		isIE6	= sky.IE==6,
        isTouch = sky.isTouch;
    
    //isTouch = true;

	function getDClient(t){
		return docEl["client" + t] || doc.body["client" + t];
	}
	//获得Scroll的值
	function getDScroll(t){
		t = "scroll" + t;
		return docEl[t] || doc.body[t];
	}
    
    var matrixKeys = 'transform,-webkit-transform,-moz-transform,-o-transform,-ms-transform';
    function getOptOffset(d){
        if(isTouch){
            var matrix = '';
            var keys = matrixKeys.split(',');
            do{
                matrix = $.css(d,keys.shift());
            }while(keys.length && !/translate\(/.test(matrix) && !/matrix\(/.test(matrix));
            var ms =  matrix.split(/,+/);
            if(/translate\(/.test(matrix)){
                return [parseInt(ms[0].replace(/\D/g,'')) || 0,parseInt(ms[1]) || 0];
            }
            if(/matrix\(/.test(matrix)){
                return [parseInt(ms[4].replace(/\D/g,'')) || 0,parseInt(ms[5]) || 0];
            }
            return [0,0];
        }
        return [parseInt($.css(d,"left")) || 0,parseInt($.css(d,"top")) || 0];
    }
    function setOptOffset(d,x,y){
        var flag = false;
        if(isTouch){
            var v;
            if(x != null && y != null){
                flag = true;
                v = 'translate(' + x + 'px,' + y + 'px)';
            }
            else if(x != null){
                flag = true;
                v = 'translateX(' + x + 'px)';
            }
            else if(y != null){
                flag = true;
                v = 'translateY(' + y + 'px)';
            }
            else{
                return flag;
            }
            sky.forEach(matrixKeys.split(','),function(k){
                $.css(d,k,v);
            });
            return flag;
        }
        else{
            if(x != null){
                flag = true;
                d.style.left = x + "px";
            }
            if(y != null){
                flag = true;
                d.style.top = y + "px";
            }
            return flag;
        }
    }

	function getOffset(d,left,top){
		var ps;
		if(left && left>0 && left<=1){
			ps = $.offset(d,2);
			left = Math.round(left*(getDClient("Width") - ps.width));
		}
		if(top && top>0 && top<=1){
			ps || (ps = $.offset(d,2));
			top = Math.round(top*(getDClient("Height") - ps.height));
		}
		return {
			left:left,
			top:top
		}
	}

	/**
	 * @param left
	 * @param top
	 */
	function getPos(left,top){
		left==null && (left = this.posLeft);
		top==null && (top = this.posTop);
		var pos = {},ps;
		if(left!=null){
			ps = getOffset(this.$,left,top);
			if(this.isIE6Fixed || (this.isAbsolute && left < 1)){
				left = getDScroll("Left") + ps.left;
			}
			else{
				left = ps.left;
			}
			pos.left$ = left;
		}

		if(top!=null){
			ps || (ps = getOffset(this.$,left,top));
			if(this.isIE6Fixed || (this.isAbsolute && top < 1)){
				top = getDScroll("Top") + ps.top;
			}
			else{
				top = ps.top;
			}
			pos.top$ = top;
		}
		return pos;
	}

	/**
	 * 重新调整定位
	 * @param left
	 * @param top
	 * @param fn
	 */
	function resize(left,top,fn){
		var pos = getPos.call(this,left,top);
		if(setOptOffset(this.$,pos.left$,pos.top$)){
			fn.call(this);
		}
		return this;
	}
	function _resize(self){
		if(self.dragData || self.$.style.display == "none"){
			return ;
		}
		var type = $.getEvent().type;
		clearTimeout(self._handle);
		self._handle = setTimeout(function(){
			if(type=="scroll"){
				resize.call(self,self.posLeft || self.ie6fixedLeft,self.posTop || self.ie6fixedTop);
			}
			else{
				resize.call(self);
			}
		},100);
	}
	/**
	 * 获取需要的节点
	 * @param foc
	 */
	function getBar(foc){
		var $$ = this.$$ = {};
		var $S = this.$S = {};
		var ds = this.$.getElementsByTagName("*");
		for(var i=0,b;i<ds.length;i+=1){
			b = ds[i].getAttribute(bar);
			if(b){
				$$[b] = ds[i];
				if($S[b] == null){
					$S[b] = [];
				}
				$S[b].push(ds[i]);
			}
		}
		if(foc){
			foc =  $$[foc];
		}
		if(foc){
			setTimeout(function(){
				foc.focus();
			},0);
		}
	}

	/**
	 * 拖动功能快开始
	 */
	function dragStart(){
		if(this.dragData){
			return ;
		}
		var ev = $.getEvent();
        var optOffset = getOptOffset(this.$);
		this.dragData = {
			x : ev.clientX + (this.isFixed?0:getDScroll("Left")) - optOffset[0],
			y : ev.clientY + (this.isFixed?0:getDScroll("Top")) - optOffset[1],
			w : getScreen("Width") - this.$.offsetWidth,
			h : getScreen("Height") - this.$.offsetHeight,
			move:sky.bind(dragMove,this),
			end:sky.bind(dragEnd,this)
		};
		$.appendEvent(doc,"vmove",this.dragData.move,true);
		$.appendEvent(doc,"vup",this.dragData.end,true);
		docEl.style.WebkitUserSelect = "none";
		this.emit("dragStart",ev);
	}
	/**
	 * 拖动功能快 拖动中
	 */
	function dragMove(){
		var m = this.dragData;
		if(!m){
			return ;
		}
		var ev	= $.getEvent(),
			st	= this.isFixed?0:getDScroll("Top"),
			sl	= this.isFixed?0:getDScroll("Left");
        var x,y;
		if(this.dragOver){
            y = ev.clientY - m.y + st;
            x = ev.clientX - m.x + sl;
		}
		else{
            y = Math.min(Math.max(ev.clientY - m.y + st,st),m.h + st);
            x = Math.min(Math.max(ev.clientX - m.x + sl,sl),m.w + sl);
		}
        setOptOffset(this.$,x,y);
		window.getSelection ? window.getSelection().removeAllRanges() : doc.selection.empty();
		this.emit("dragMove",ev);
	}
	/**
	 * 拖动功能快结束
	 */
	function dragEnd(){
		if(!this.dragData){
			return ;
		}
		$.removeEvent(doc,"vmove",this.dragData.move,true);
		$.removeEvent(doc,"vup",this.dragData.end,true);
		this.dragData = null;
		docEl.style.WebkitUserSelect = "";
		this.emit("dragEnd",$.getEvent());
	}
    
    //弹窗销毁
    

	/**
	 * 默认功能
	 */
	var defOpt = {
		/**
		 * 设置x坐标
		 * @param x
		 */
		setX:function(x){
			this.posLeft = x;
			return this;
		},
		/**
		 * 设置y坐标
		 * @param y
		 */
		setY:function(y){
			this.posTop = y;
			return this;
		},
		/**
		 * 为元素绑定事件
		 * @param k
		 * @param fn
		 */
		bind:function(k,fn){
			if(typeof k == "string"){
				var kk,ke;
				if(this.$S[k]){
					kk = k;
					ke = "click";
				}
				else if(/_([a-z]+)$/.test(k)){
					ke = RegExp.$1;
					kk = k.replace(/_[a-z]+$/,"");
					if(!this.$S[kk]){
						return this;
					}
				}
				else{
					return this;
				}
				$.expand.appendEvent.call(this.$S[kk],ke,sky.bind(fn,this));
//				$.appendEvent(this.$S[kk],ke,);
				return this;
			}
			for(var n in k){
				this.bind(n,k[n]);
			}
			return this;
		},
		/**
		 * 添加拖动事件
		 * @param id
		 * @param ov
		 */
		drag:function(id,ov){
			ov!==undefined && (this.dragOver = ov);
			$.appendEvent(this.$$[id] || this.$,"vdown",sky.bind(dragStart,this));
			return this;
		},
		/**
		 * 设定位置
		 * @param left
		 * @param top
		 */
		offset:function(left,top){
//			An.stop(this.$);
			var ps = getOffset(this.$,left || this.posLeft,top || this.posTop);
			this.ie6fixedLeft = ps.left;
			this.ie6fixedTop = ps.top;
			var pos = getPos.call(this,left,top);
            setOptOffset(this.$,pos.left$,pos.top$);
			return this;
		},
		/**
		 * 替换 $ 中间的
		 * @param html
		 * @param foc
		 */
		html:function(html,foc){
			this.$.innerHTML = html;
			getBar.call(this,foc);
			return this;
		},
		/**
		 * 关闭打开的
		 */
		destroy:function(){
			if(this.mask){
				removeMask.call(this.mask);
			}
            if(this._maskDestroyFn){
                $.unbind(this.mask.M,'vclick',this._maskDestroyFn);
            }
			this.$.parentNode.removeChild(this.$);
			$.removeEvent(window,"vresize",this.resize._);
			if(this.isIE6Fixed){
				$.removeEvent(window,"scroll",this.resize._);
			}
			this.emit("destroy");
		},
		/**
		 * 将弹框获得焦点
		 * @param id
		 */
		focus:function(id){
			var z = ($.css(this.$,"z-index")*1 || 0) + 1;
			if(z < this.parent.Z){
				this.$.style.zIndex = this.parent.Z++;
			}
			try{
				this.$$[id].focus();
			}catch(e){}
			this.emit("focus");
			return this;
		},
		/**
		 * 隐藏
		 */
		hide:function(){
			if(this.$.style.display == "none"){
				return this;
			}
			this.mask && removeMask.call(this.mask);
			this.$.style.display = "none";
            this.emit('hide');
			return this;
		},
		/**
		 * 显示
		 */
		show:function(){
			if(this.$.style.display != "none"){
				return this;
			}
			this.mask && showMask.call(this.mask);
			this.$.style.display = "";
            this.emit('show');
			return this;
		}
	};
	/**
	 * 蒙板用
	 */
	var fixed = !isIE6 && docEl.clientHeight && !('createTouch' in document)?true:false,maskFrame,Masks = [];
	function getScreen(t){
		var v = getDClient(t);
		return fixed?v:Math.max(v,getDScroll(t));
	}

	//创建蒙板
	function createMask(){
		if(!this.M){
			this.M = $.create("div",{style:"position:" + (fixed ? "fixed" : "absolute") + ";overflow:hidden;top:0;left:0;display:none;z-index:" + this.Z + ";background:" + this.background},null,doc.body);
			this.Z += 1;
			//resize
			if(Masks.length==0){
				$.appendEvent(window,"vresize",resizeMask);
			}
			Masks.push(this);
			$.opacity(this.M,this.opacity || 0);
		}
	}

	/**
	 * 显示蒙板
	 */
	function showMask(){
		this.nums += 1;
		if(this.nums != 1){
			return ;
		}
		var w = getScreen("Width"),h = getScreen("Height");
		this.M.style.display = "block";
		this.M.style.width = w + "px";
		this.M.style.height = h + "px";
		//IE6 iframe蒙版
		if(!maskFrame && isIE6 && Mask.frame!==null){
			maskFrame = $.create("iframe",{style: "position:" + (fixed ? "fixed" : "absolute") + ";overflow:hidden;width:"+w+"px;height:"+h+"px;top:0;left:0;"},null,doc.body);
			$.opacity(maskFrame,0);
		}
	}
	/**
	 * 移除显示的蒙板
	 */
	function removeMask(){
		this.nums -=1;
		if(this.nums<1){
			this.M.style.display = "none";
			if(maskFrame){
				for(var i=0,flag = false;i<Masks.length;i+=1){
					if(Masks[i].nums>0){
						flag = true;
						break;
					}
				}
				if(!flag){
					maskFrame.style.display = "none";
				}
			}
		}
	}
	/**
	 * 重新计算蒙板大小
	 */
	function resizeMask(){
		clearTimeout(resizeMask.time);
		resizeMask.time = setTimeout(function(){
			for(var i=0;i<Masks.length;i+=1){
				Masks[i].M.style.display = "none";
			}
			var w = getScreen("Width"),h = getScreen("Height");
			for(var i=0,m;i<Masks.length;i+=1){
				if((m = Masks[i]) && m.nums>0){
					m.M.style.display = "block";
					m.M.style.width = w + "px";
					m.M.style.height = h + "px";
				}
			}
			if(maskFrame){
				maskFrame.style.width = w + "px";
				maskFrame.style.height = h + "px";
			}
		},100);
	}

    //设置点击蒙版 关闭弹窗
    function setMaskDestroy(){
        if(this._maskDestroyFn){
            return ;
        }
        this._maskDestroyFn = sky.bind(function(){
            this.destroy();
        },this);
        $.bind(this.mask.M,'vclick',this._maskDestroyFn);
        return this;
    }
    
	/**
	 * 弹窗 带蒙板
	 */
	var Mask = sky.extend({
		create:function(){
			createMask.call(this);
			var opt = K.create.apply(this,arguments);
			opt.mask = this;
			if($.css(opt.$,"display") != "none"){
				showMask.call(this);
			}
			return opt;
		}
	},function(bg,opa,z){
		this.nums = 0;
		this.Z = z || K.zIndex;
		K.zIndex = Math.max(this.Z,K.zIndex) + 2000;
		this.background = bg || "#000";
		this.opacity = opa==null?0.2:opa;

		this.option = sky.extra(defOpt,{setMaskDestroy:setMaskDestroy});
	});

	//配置
	K.zIndex = 10000;
	//获得可是区域的宽或者高
	K.getClientWidth = function(){
		return getDClient("Width");
	};
	K.getClientHeight = function(){
		return getDClient("Height");
	};
	//获得Scroll的值
	K.getScrollWidth = function(){
		return getDScroll("Width");
	};
	K.getScrollHeight = function(){
		return getDScroll("Height");
	};
	//创建
	K.create = function(dom,foc,body){
		var opt = sky.extend(sky.EventEmitter,this.option,{});
		opt.emit("create");
		opt.$ = typeof dom == "string"?$.create("div",null,dom).firstChild:dom;
        
        if(isTouch){
            // top left 没赋值，默认使用 0
            if(!/\d/.test($.css(opt.$,'left'))){
                $.css(opt.$,'left',0);
            }
            if(!/\d/.test($.css(opt.$,'top'))){
                $.css(opt.$,'top',0);
            }
        }
        
		opt.parent = this;
		opt.dragOver = this.dragOver;
		body = body?$(body) || doc.body:doc.body;
		body.appendChild(opt.$);
		opt.$.style.zIndex = this.Z++;
		$.appendEvent(opt.$,"vdown",sky.bind(opt.focus,opt));
		getBar.call(opt,foc);
		//动画
		opt.resize = function(left,top,fn){
			var ps = getOffset(opt.$,left || opt.posLeft,top || opt.posTop);
			this.ie6fixedLeft = ps.left;
			this.ie6fixedTop = ps.top;
			resize.call(opt,left,top,fn);
			return opt;
		};
		opt.resize._ = sky.bind(_resize,null,opt);
		$.appendEvent(window,"vresize",opt.resize._);
		var position = $.css(opt.$,"position");
        if(position != 'fixed' && position != 'absolute'){
            position = 'absolute';
            $.css(opt.$,"position",position);
        }
		if(position == "absolute"){
			opt.isAbsolute = true;
		}
		else if(position == "fixed"){
			if(isIE6){
				opt.isIE6Fixed = true;
				opt.$.style.position = "absolute";
				$.appendEvent(window,"scroll",opt.resize._);
			}
			else{
				opt.isFixed = true;
			}
		}

		return opt;
	};
	K.Z = 9000;
	//蒙版
	K.Mask = Mask;
	//弹框默认
	K.option = defOpt;
});