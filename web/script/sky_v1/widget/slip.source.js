sky.define("./widget/slip",["./dom/dom"],function(require,exports){
	exports.version = "1.0.0";

	var doc = document;
	var $ = require("dom");
	var moveData;
	//鼠标移动开始
	function slipDown(self){
		if(moveData){
			return ;
		}
		var ev = $.getEvent();
		var cur = ev["client" + self.aspect];
		moveData = [self,cur];
		$.appendEvent(doc,"vmove",slipMove,true);
		$.appendEvent(doc,"vup",slipUp,true);
		self.emit("start");
	}

	//鼠标移动中
	function slipMove(){
		if(moveData){
			var self = moveData[0];
			window.getSelection ? window.getSelection().removeAllRanges() : doc.selection.empty();
			var end = ($.getEvent()["client" + self.aspect] -  moveData[1]) + self.cur;
			end = Math.max(Math.min(end,self.len),0);
			moveData[0].emit("move",end);
		}
	}

	//鼠标抬起
	function slipUp(){
		if(moveData){
			var self = moveData[0];
			var ev = $.getEvent();
			var cur = (ev["client" + self.aspect] - moveData[1]) + self.cur;
			self.cur = Math.min(Math.max(0,cur),self.len);
			$.removeEvent(doc, "vup", slipUp,true);
			$.removeEvent(doc, "vmove", slipMove,true);
			moveData = null;
			self.emit("end");
		}
	}

	var slip = exports.BaseClass = sky.extend(sky.EventEmitter,function(id,len,aspect){
		this.dom = $(id);
		this.len = len || 100;
		this.aspect = aspect || "X";
		this.cur = 0;
		$.bind(this.dom,"vdown",slipDown,this);
	});
	
	exports.create = function(id,len,aspect){
		return new slip(id,len,aspect);
	};
});