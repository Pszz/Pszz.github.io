
void function(){
	var mids =  $(".mids"); //父元素
	var winWidth = $(".slideContainer").width(); //视口宽度
	var midWidth = winWidth * $(".mids .con_slide").length * 2; //总长度
	var maxDistance = 150; //移动范围
	var startX,startY,stargDis,distance,flag;
    var animateSpeed = 500; //滑动时间
    var recoverSpeed = 100;  //反弹时间
	var basePoint = -(midWidth / 2); //当前位置
	mids.css({left: basePoint, width: midWidth}); //默认位置和默认宽度
	
	 //复制
	 mids.html(mids.html() + mids.html());
	//鼠标按下
   mids.mousedown(function(event){
        startX = event.screenX;
        mids.bind("mousemove", moveHandler); 
        startX = event.screenX;
   });
    //鼠标弹起
    mids.mouseup(function(){
       // if(distance < maxDistance && !flag){
            recoverPosition();
       // }
            mids.unbind("mousemove");            
    });
   //鼠标移动
   function moveHandler(event){
        distance = event.screenX - startX;
        if(distance > maxDistance){ 
            slide("r");
			return ;
        }
		if(distance < -maxDistance) {
            slide("l"); 
			return ;
        }
			mids.css("left", basePoint + distance)			
   }
   //鼠标弹起时，最终位置
   function recoverPosition(){
	   if(!mids.flag){
		  mids.animate({ left: basePoint }, recoverSpeed,function(){console.log("键盘弹起")});
	   }
   }
   //鼠标移动移动方向
   function slide(vPs){
		mids.unbind("mousemove");   
		if(vPs == "r"){
			basePoint += winWidth;	
		}else if(vPs == "l"){
			basePoint -= winWidth;	
		}
		mids.flag = true;
		mids.animate({left: basePoint}, animateSpeed,function(){
			checkPosition();
		});			
    }
	//检测位置
	function checkPosition(){ 
		var loadPosition = 0; //需要重置的位置
		var vLeft = Math.abs(parseInt(basePoint));
		//检测边界
		if(vLeft == 0){ //最前面
			loadPosition = -(midWidth / 2); //转换到第一个对接处
			console.log("前置");
		}else if(vLeft == midWidth - winWidth){ //最后面
			loadPosition = -(midWidth / 2 - winWidth); //转换到最后一个对接处
			console.log("后置");
		}
		
		if(loadPosition){ //需要转换-优先转换
			basePoint = loadPosition;
			mids.css("left",loadPosition);
			mids.flag = true;
		}else{
			mids.flag = false;
		}
	}
}();












