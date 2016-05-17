(function(){
    var fn = API.fn = API.fn || {};
    fn.mastShow = function(s,sid){
        if(sid == undefined || sid == ""){
            alert("参数错误");
            return false;
        }         
        $("._mast").show();
        $("._mast .menu").attr("class", "menu "+ sid );    
    }
    fn.mastClose = function(){
         $("._mast").hide();
        $("._mast .menu").attr("class", "menu"); 
    }
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

  //底部菜单
  (function(){
      var lastClick;
      var isTouch = 'createTouch' in document;
      $("footer.pu .list a").on(!!isTouch?"touchstart":"mousedown",function(){
            if(lastClick != this){
                if(lastClick){
                    lastClick.flag = false;
                }
                lastClick = this;
            }
            var that = $(this),sid = "";
            $("footer.pu .list a.atv").removeClass("atv");
            if(!this.flag){
                that.attr("class","li atv");
                fn.mastShow(undefined,that.attr("sid"));
                this.flag = true;
            }else{
                that.attr("class","li");
                fn.mastClose();
                this.flag = false;
            }
            
      });
      
  }());
})();