(function(){
    setTimeout(function(){
        window.scrollTo(0,1);//进入的时候隐藏地址栏
        $("a[href='#']").attr("href","javascript:;");
    },0); //移动上，href为#会有bug
    /* 轮播 */
	setTimeout(function(){
		var mySwiper = new Swiper('.swiper-containe',{
			pagination : ".swiper-pagination",
			autoplay : 5000
		});	
	},0);
    //广告提示
   (function(){
       var loopDom =  $("#loop"), loopLen = loopDom.children("h4").length, num = 1;
       loopDom[0].innerHTML += loopDom[0].innerHTML;//重复一份
       function play(){
            loopDom.animate({top:'-' + num + "00%"},2000,"swing",function(){
                if(num > loopLen){
                    num = 1;
                    loopDom.css("top",0);
                }else{
                    num++;
                }
                setTimeout(play,2000);              
            });
       }
       play();
   }());
    
   //切换
    (function(){
        var list = $(".info-list .title a");
        list.click(function(){
            var that = $(this),vid = that.attr("vid") || 0;
            that.parent().find("a").removeClass("sel");
            that.addClass("sel");
            that.parent().parent().find(".item").hide();
            that.parent().parent().find(".item[vid='"+ vid +"']").show();
        });
        
    })();
})();