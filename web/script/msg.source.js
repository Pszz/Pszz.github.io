/********
 ** date : 2015-08-08
 ** author : Pszz
 ** remark ： 用于定义的一些特殊函数 
 **
 ***********/

void function(){
	var api = API;
   //返回顶部
	void function(){
		  var scrolldelay;
		  api.PgUp = function(flag){
			 // window.scrollTo(0,0); 直接回顶部
			 //暂时不使用动画
			 var y = window.scrollY;
			 if(y <= 0 || flag){
				clearTimeout(scrolldelay);
			 }else{
				window.scrollBy(0,-100); 
				scrolldelay = setTimeout(function(){
					$.PgUp();
				},10); 
			}
		  }; 
	}();
  //弹窗
  void function(fm){
	  
	 var mask = [
	 	'<div class="mask">',
		 	'{#data}',
		'</div>'
	 ].join("");
	  
	//alert; - msg
  	fm.alert = function(s){

	}; 
	//confirm  - msg ,yes ,no
	fm.confirm = function(s,y,n){
		
	};
  }(api.msg = {});

}; 

