/*
* Date:2015年8月25日 18:46:41
* Author:psz
*/

function $(s){
	return typeof s == "string" ? document.getElementById(s) : s;
}
//on事件
$.on = function(element, type, handler){    
    if(element.addEventListener) {    
       element.addEventListener(type, handler, false);    
    } else {    
       element.attachEvent('on'+ type, handler); // for IE6,7,8  
    }    
}  
//原图返回成功之后。
$.on($("img"),"load",function(){
	var c = $("canvas");
	var img = $("img");
	c.width = img.clientWidth * 1.5;  
    c.height = img.clientHeight * 1.5; 
	
	if(!c.getContext){
		console.log("浏览器不支持Canvas");
		return ;
	}
	var context = c.getContext("2d");
	context.drawImage(img,0,0,c.width,c.height);
});

//负片
$.on($("inver"),"click",function(){
	var c = $("canvas"),
		context = c.getContext("2d"),
		canvasData = context.getImageData(0,0,c.width,c.height),
		len = c.height * c.width * 4,
		binary = canvasData.data;
	//处理图像
	$.filter.inver(binary,len);
	//将数据重新给画布
	context.putImageData(canvasData,0,0);
});

//灰色调
$.on($("adjust"),"click",function(){
	var c = $("canvas"),
		context = c.getContext("2d"),
		canvasData = context.getImageData(0,0,c.width,c.height),
		len = c.height * c.width * 4,
		binary = canvasData.data;
	
	//处理图像
	$.filter.adjust(binary,len);
	//将数据重新给画布
	context.putImageData(canvasData,0,0);
});
//模糊
$.on($("blur"),"click",function(){
	var c = $("canvas"),
		context = c.getContext("2d"),
		canvasData = context.getImageData(0,0,c.width,c.height);
		
		$.filter.blur(context,canvasData);
		context.putImageData(canvasData,0,0);
	
});
//浮雕
$.on($("relief"),"click",function(){
	var c = $("canvas"),
		context = c.getContext("2d"),
		canvasData = context.getImageData(0,0,c.width,c.height);
		
		$.filter.relief(context,canvasData);
		context.putImageData(canvasData,0,0);
});
//雕刻
$.on($("heibai"),"click",function(){
	var c = $("canvas"),
		context = c.getContext("2d"),
		canvasData = context.getImageData(0,0,c.width,c.height);
		
		$.filter.heibai(context,canvasData);
		context.putImageData(canvasData,0,0);
});
//镜像
$.on($("mirror"),"click",function(){
	var c = $("canvas");
		context = c.getContext("2d");
		canvasData = context.getImageData(0,0,c.width,c.height);
		
		$.filter.mirror(context,canvasData);
		context.putImageData(canvasData,0,0);
});


//滤镜效果
$.filter = {
	//负片-反色
	inver : function(data, l){
		for(var i = 0; i < l; i+=4){
			var r = data[i];
			var g = data[i + 1];
			var b = data[i + 2];

			data[i] = 255 - r;
			data[i + 1] = 255 - g;
			data[i + 2] = 255 - b;
		}
		
	},
	//灰色调
	adjust : function(data, l){
		for(var i = 0; i< l; i += 4){
			var r = data[i];
			var g = data[i + 1];
			var b = data[i + 2];
			
			data[i] = (r * 0.272) + (g * 0.534) + (b * 0.131);
			data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
			data[i + 2] = (r * 0.393) + (g * 0.769) + (b * 0.189);
		}
		
	},
	//模糊
	blur : function(context, data){
		var temp = this.copyImageData(context, data);
		var red = 0.0, green = 0.0, blue = 0.0;
		for(var x = 0; x < temp.width; x++){
			for(var y = 0; y < temp.height; y++){
				
				var idx = (x + y * temp.width) * 4;
				for(var subCol = -2; subCol <= 2; subCol++){
					var colOff = subCol + x;
					if(colOff < 0 || colOff >= temp.width){
						colOff = 0;						
					}
					for(var subRow = -2; subRow <= 2; subRow++){
						var rowOff = subRow + y;
						if(rowOff < 0 || rowOff >= temp.height){
							rowOff = 0;							
						}
						var idx2 = (colOff + rowOff * temp.width) * 4;
						var r = temp.data[idx2 + 0];
						var g = temp.data[idx2 + 1];
						var b = temp.data[idx2 + 2];
						red += r;
						green += g;
						blue += b;
					}
				}

				data.data[idx + 0] = red / 25.0;//红色通道
				data.data[idx + 1] = green / 25.0;//绿色通道
				data.data[idx + 2] = blue / 25.0; //蓝色通道
				data.data[idx + 3] = 255; //透明度通道
				red = green = blue = 0;
				
			}
		}
	},
	//浮雕
	relief : function(context, data){
		var temp = this.copyImageData(context, data);
		var h = temp.height,w = temp.width;
		for(var x = 1; x < temp.width - 1 ; x++){
			for(var y = 1; y < temp.height -1; y++){
				var idx = (x + y * temp.width) * 4;
				var bidx = ((x - 1) + y * temp.width) * 4;
				var aidx = ((x + 1) + y * temp.width) * 4;
				
				var nr = temp.data[aidx + 0] - temp.data[bidx + 0] + 128;
				var ng = temp.data[aidx + 1] - temp.data[bidx + 1] + 128;
				var nb = temp.data[aidx + 2] - temp.data[bidx + 2] + 128;
				nr = (nr < 0) ? 0 : ((nr > 255) ? 255 : nr);
				ng = (ng < 0) ? 0 : ((ng > 255) ? 255 : ng);
				nb = (nb < 0) ? 0 : ((nb > 255) ? 255 : nb);
				
				data.data[idx + 0] = nr;
				data.data[idx + 1] = ng;
				data.data[idx + 2] = nb;
				data.data[idx + 3] = 255;
			}
		}
	},
	//雕刻
	diaoke : function(context, data){
		var temp = this.copyImageData(context, data);
		var h = temp.height,w = temp.width;
		for(var x = 1; x < temp.width - 1 ; x++){
			for(var y = 1; y < temp.height -1; y++){
				var idx = (x + y * temp.width) * 4;
				var bidx = ((x - 1) + y * temp.width) * 4;
				var aidx = ((x + 1) + y * temp.width) * 4;
				
				var nr = temp.data[bidx + 0] - temp.data[aidx + 0] + 128;
				var ng = temp.data[bidx + 1] - temp.data[aidx + 1] + 128;
				var nb = temp.data[bidx + 2] - temp.data[aidx + 2] + 128;
				nr = (nr < 0) ? 0 : ((nr > 255) ? 255 : nr);
				ng = (ng < 0) ? 0 : ((ng > 255) ? 255 : ng);
				nb = (nb < 0) ? 0 : ((nb > 255) ? 255 : nb);
				
				data.data[idx + 0] = nr;
				data.data[idx + 1] = ng;
				data.data[idx + 2] = nb;
				data.data[idx + 3] = 255;
			}
		}
		
	},
	//镜像
	mirror : function(context, data){
		var temp = this.copyImageData(context,data);
		for(var x = 0; x < temp.width; x++){
			for(var y = 0; y < temp.height; y++){
				var idx = (x + y * temp.width) * 4;
				var midx = (((temp.width - 1) - x) + y * temp.width) * 4;
				
				data.data[midx + 0] = temp.data[idx + 0];
				data.data[midx + 1] = temp.data[idx + 1];
				data.data[midx + 2] = temp.data[idx + 2];
				data.data[midx + 3] = 255;
				
			}
			
		}
		
	},
	//黑白
	heibai : function(context , data){
			var temp = this.copyImageData(context,data);
			var color = 0;
			for(var x = 0; x < temp.width; x++){
				for(var y = 0; y < temp.height; y++){
					var idx = (x + y * temp.width) * 4;
					var nr = temp.data[idx + 0];
					var ng = temp.data[idx + 1];
					var nb = temp.data[idx + 2];
					
					var avg = (nr + ng + nb) / 3;
					if(avg >= 128){
						color = 255;
					}else{
						color = 0;						
					}
				
					data.data[idx + 0] = color;
					data.data[idx + 1] = color;
					data.data[idx + 2] = color;
					data.data[idx + 3] = 255;
				}
				
			}
	},
	//复制图层
	copyImageData : function(context, src){  
		var img = context.createImageData(src.width, src.height);
		img.data.set(src.data);
		return img;  
    } 
	
	
}