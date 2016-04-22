/**
 * 数据表格 两个数组，一个定义head 另一个定义 数据值
 * table 的 thead tbody tfoot tr td 内的 innerHTML 不适合使用此库
 */
sky.define("./data/sheet", function(require, exports){
	exports.version = "1.0.0";
	function getData(target){
		var li = this.data[target];
		var rv = {};
		sky.forEach(this.head, function(i,v){
			rv[v] = li[i];
		});
		return rv;
	}

	exports.BaseClass = sky.extend({
		//获取当前指针下的数据
		get: function(num, key){
			if(key == null){
				//this.data[this.target]
				return getData.call(this, num);
			}
			return this.head[key] === undefined ? "" : this.data[num][this.head[key]];
		},
		forEach: function(fn, exe){
			return sky.forEach(this.data, function(v, i){
				return fn.call(this, i);
			}, exe, this);
		}
	}, function(data, head){
		this.data = data;	//数据体
		this.head = {};
		if(head){			//头部
			for(var i = 0; i < head.length; i += 1){
				this.head[head[i]] = i;
			}
		}
		this.target = 0;	//当前指针
	});
	exports.create = function(data, head){
		return new exports.BaseClass(data, head);
	};
});

