/**
 水平卷动
 */
sky.define("./widget/xroll",["dom","./widget/anim"],function(require){
	//临时变量区域
	var $		= require("dom"),
		bar		= "sky_xroll",
		An		= require("anim");

	function arrowMove(no){
		if(this.moveing){
			return ;
		}
		var xp = this.$plate,xl = parseInt($.css(xp,"marginLeft")) || 0;
		if(xl==0 && this.arrow>0 || (xl<=this.max && this.arrow<0)){
			return ;
		}
		var end = xl + this.arrow;
		end = Math.min(Math.max(end,this.max),0);
		if(no){
			this.$plate.style.marginLeft = end;
			this.setArrow();
			return ;
		}
		this.moveing = true;
		var self = this;
		An.play(this.$plate,{
			marginLeft$:end,
			homing:false,
			speed:this.speed || 2.5,
			callBack:function(){
				self.moveing = null;
				self.setArrow();
				self.emit("moveEnd",end);
			}
		});
	}

	function arrowStart(self,num){
		self.arrow = self.wheelNum * num;
		self.arrowMove();
	}

	function setArrow(dom,flg){
		var x = dom.getAttribute("disclass");
		if(x){
			$[flg?"removeClass":"addClass"](dom,x);
		}
		else{
			dom.style.visibility = flg?"visible":"hidden";
		}
	}

	var XRoll = sky.extend(sky.EventEmitter,{
		//设置箭头
		setArrow:function(){
			var max = this.max,xp = parseInt($.css(this.$plate,"marginLeft")) || 0;
			setArrow(this.$left,max>0 || xp==0?false:true);
			setArrow(this.$right,max>0 || xp==max?false:true);
			return this;
		},
		reCountPlate:function(w,max){
			this.$plate.style.width = w + "px";
			if(!max){
				max = w - $.width(this.$con || this.$Cot);
			}
			this.max = max*-1;
			this.setArrow();
			return this;
		},
		next:function(){
			if(this.max<0){
				arrowStart(this,-1);
			}
			return this;
		},
		prev:function(){
			if(this.max<0){
				arrowStart(this,1);
			}
			return this;
		},
		goCustom:function(ml,no){
			ml = parseInt(ml);
			if(!isNaN(ml)){
				this.arrow = ml + (parseInt($.css(this.$plate,"marginLeft")) || 0);
				this.arrowMove(no);
			}
			return this;
		}
	},function(xId,step,xlen,max){
		//移动单个宽度
		this.wheelNum = step;
		//组件框
		this.$Cot = $(xId);

		//滚动条组件dom
		var ds = this.$Cot.getElementsByTagName("*");
		for(var i=0,v;i<ds.length;i+=1){
			if(v = ds[i].getAttribute(bar)){
				this["$" + v] = ds[i];
			}
		}
		this.arrowMove = PUI.lib.bind(arrow$ove,this);

		$.bind(this.$left, "click", arrowStart,this,1);
		$.bind(this.$right, "click", arrowStart,this,-1);

		if(xlen || xlen==0){
			this.reCountPlate(xlen,max);
		}
	});
	XRoll.version = "1.0.0";
	return XRoll;
});