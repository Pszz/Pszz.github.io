!function(){setTimeout(function(){window.scrollTo(0,1),$("a[href='#']").attr("href","javascript:;")},0),setTimeout(function(){new Swiper(".swiper-containe",{pagination:".swiper-pagination",autoplay:5e3})},0),function(){function t(){e.animate({top:"-"+a+"00%"},2e3,"swing",function(){a>n?(a=1,e.css("top",0)):a++,setTimeout(t,2e3)})}var e=$("#loop"),n=e.children("h4").length,a=1;e[0].innerHTML+=e[0].innerHTML,t()}(),function(){var t=$(".info-list .title a");t.click(function(){var t=$(this),e=t.attr("vid")||0;t.parent().find("a").removeClass("sel"),t.addClass("sel"),t.parent().parent().find(".item").hide(),t.parent().parent().find(".item[vid='"+e+"']").show()})}()}();