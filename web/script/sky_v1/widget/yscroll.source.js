sky.define("./widget/yscroll",["dom"],function(require){
	//临时变量区域=============================================<<<<<<START
	var doc		=	document,
		$		=	require("dom"),
		bar		=	"sky_yscroll";

	//开始滚动
	function start(self){
		if(self.isMoveing || self.$desCot.scrollHeight - self.$desCot.offsetHeight <= 0){
			return;
		}
		self.isMoveing = true;
		var ev = $.getEvent(),diff = ev.clientY - (parseInt(self.$rplate.style.top) || 0),max = $.height(self.$rcon) - $.height(self.$rplate);
		$.bindCapture(doc, "vmove", moveing,self,diff,max);
		$.bindCapture(doc, "vup",end, self);
	}

	//move触发
	function moveing(self,diff,max){
		var ev = $.getEvent(),t = ev.clientY - diff,desCot = self.$desCot;
		t = t <= 0 ? 0 : t >= max ? max : t;
		self.$rplate.style.top = t + "px";
		desCot.scrollTop = Math.ceil((desCot.scrollHeight - desCot.offsetHeight) * (t / max));
		window.getSelection ? window.getSelection().removeAllRanges() : doc.selection.empty();
	}

	//结束
	function end(self){
		if(!self.isMoveing){
			return;
		}
		//var ev = $.getEvent();
		$.unbind(doc, "vup", end);
		$.unbind(doc, "vmove", moveing);
		self.isMoveing = false;
	}

	//箭头移动 包括鼠标滚轮模拟
	function arrowMove(){
		var desCot = this.$desCot;
		desCot.scrollTop += this.arrow;
		this.$rplate.style.top = Math.ceil((desCot.scrollTop / (desCot.scrollHeight - desCot.offsetHeight)) * ($.height(this.$rcon) - $.height(this.$rplate))) + "px";
	}

	//鼠标滚轮事件捕获
	function dcWheel(self){
		var desCot = self.$desCot;
		if(self.isMoveing || self.arrowItv || desCot.scrollHeight - desCot.offsetHeight<=0){
			return ;
		}
		var ev = $.getEvent(),flg = ev.wheelDeltaFlg;
		self.arrow = self.wheelNum*(flg?1:-1);
		ev.stopPropagation();
		self.arrowMove();
	}

	//滚动条 上下箭头操作
	function arrowStart(self,num){
		var desCot = self.$desCot;
		if(self.arrowItv || desCot.scrollHeight - desCot.offsetHeight<=0){
			return ;
		}

		//var ev = $.getEvent();
		if(window.captureEvents){
			window.captureEvents(Event.MOUSEMOVE);
		}
		else if(this.setCapture){
			this.setCapture();
		}
		self.arrow = self.wheelNum * num;
		self.arrowMove();
		self.arrowItv = setInterval(self.arrowMove, 200);
	}

	function arrowStop(self){
		if(!self.arrowItv){
			return ;
		}
		//var ev = $.getEvent();
		if(window.releaseEvents){
			window.releaseEvents(Event.MOUSEMOVE);
		}
		else if(this.releaseCapture){
			this.releaseCapture();
		}
		clearInterval(self.arrowItv);
		self.arrowItv = null;
	}

	var R = sky.extend({
		//重新计算 滚动条
		reCountPlate:function(num){
			var desCot = this.$desCot,sh = desCot.scrollHeight, oh = desCot.offsetHeight,rp = this.$rplate.style;
			if(sh - oh<=0){
				rp.display = "none";
			}
			else{
				num || (num = 0);
				var ph = parseInt(Math.max(oh/sh*this.$rcon.offsetHeight,13));
				if(num === true){
					desCot.scrollTop = 0;
				}
				else{
					desCot.scrollTop += num;
				}
				rp.height = ph + "px";
				rp.display = "block";
				rp.top = Math.min(Math.ceil((desCot.scrollTop / (desCot.scrollHeight - desCot.offsetHeight)) * ($.height(this.$rcon) - ph)), this.$rcon.offsetHeight-ph) + "px";
				//rp.top = Math.min(Math.ceil((desCot.scrollTop / (desCot.scrollHeight - desCot.offsetHeight)) * ($.height(this.rCot) - ph)),this.rcon.offsetHeight-ph) + "px";
			}
		},
		//显示滚动条
		show:function(){
			$.bind(this.$desCot, "mousewheel", dcWheel,this);
			$.bind(this.$rCot, "mousewheel", dcWheel,this);
			$.bind(this.$rplate, "vdown", start,this);
			$.bind(this.$rup, "vdown", arrowStart,this,-1);
			$.bind(this.$rdown, "vdown", arrowStart,this,1);
			$.bind(this.$rup, "vup", arrowStop,this);
			$.bind(this.$rdown, "vup", arrowStop,this);
			this.$rCot.style.display = "block";
			this.$desCot.scrollTop = 0;
			this.$rplate.style.top = "0px";
			this.reCountPlate();
			return this;
		},
		//隐藏滚动条
		hidden:function(){
			$.unbind(this.$desCot, "mousewheel", dcWheel);
			$.unbind(this.$rCot, "mousewheel", dcWheel);
			$.unbind(this.$rplate, "vdown", start);
			$.unbind(this.$rup, "vdown", arrowStart);
			$.unbind(this.$rdown, "vdown", arrowStart);
			$.unbind(this.$rup, "vup", arrowStop);
			$.unbind(this.$rdown, "vup", arrowStop);
			this.$rcot.style.display = "none";
			return this;
		}
	},function(rId,desId,wheel){
		//内容存放地点
		this.$desCot = $(desId);
		//组件框
		this.$rCot = $(rId);
		//滚动条组件dom
		var ds = this.rCot.getElementsByTagName("*");
		for(var i=0,v;i<ds.length;i+=1){
			if(v = ds[i].getAttribute(bar)){
				this["$r" + v] = ds[i];
			}
		}
		this.arrowMove = L.bind(arrowMove,this);
		if(sky.IE==6){
			this.$rplate.setAttribute("href","javascript:;");
		}
		else{
			this.$rplate.removeAttribute("href");
		}

		//每个震荡 移动像素
		this.wheelNum = wheel || 30;
	});
	R.version = "1.0.0";
	return R;
});