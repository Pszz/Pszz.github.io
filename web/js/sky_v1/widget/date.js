sky.define("./widget/date",["./dom/dom"],function(a,s){function e(a,s){return(s||"YYYY-MM-DD").replace(/YYYY/g,a.getFullYear()).replace(/YY/g,String(a.getYear()).slice(-2)).replace(/MM/g,("0"+(a.getMonth()+1)).slice(-2)).replace(/M/g,a.getMonth()+1).replace(/DD/g,("0"+a.getDate()).slice(-2)).replace(/D/g,a.getDate()).replace(/hh/g,("0"+a.getHours()).slice(-2)).replace(/h/g,a.getHours()).replace(/mm/g,("0"+a.getMinutes()).slice(-2)).replace(/m/g,a.getMinutes()).replace(/ss/g,("0"+a.getSeconds()).slice(-2)).replace(/s/g,a.getSeconds())}function t(a){a||(a=u.getFullYear());for(var s=['<span class="b3" sky-fn="year_list" sky-data="'+(a-23)+'">&lt;</span>'],e=a-11,t=a+11,n=e;t>=n;n+=1)s.push('<span class="b3" sky-fn="year_elect" sky-data="'+n+'">'+n+"</span>");s.push('<span class="b3" sky-fn="year_list" sky-data="'+(a+23)+'">&gt;</span>'),f.html("-sky-date-b-year",s.join(""))}function n(){var a=u.getFullYear();f.text("-sky-date-txt-year",a+"年")}function c(){var a=u.getMonth()+1;f.text("-sky-date-txt-month",a+"月")}function l(){var a=u,s=a.getMonth(),t=e(g.getValue(),"YYYYMMDD"),n=new Date(e(a,"YYYY/MM/01"));n.setDate(n.getDate()-1),n.setDate(n.getDate()-n.getDay());for(var c,l,p,i=[],o=0;42>o;o+=1)c=e(n,"YYYYMMDD"),p=n.getDate(),l=n.getMonth(),i.push('<span sky-fn="day_elect" sky-data="'+e(n,"YYYY/MM/DD")+'" class="b2'+(s==l?"":" color1")+(c==t?" bg1":"")+'">'+p+"</span>"),n.setDate(p+1);f.html("-sky-date-b-day",i.join(""))}function p(){k.style.display="none",u=null,g=null}function i(a){u.setFullYear(a),t(),n(),c(),l()}function o(a){var s=u.getFullYear();u.setMonth(a);var e=u.getFullYear();s!=e&&(t(),n()),c(),l()}function r(a){g=a;u=new Date(e(a.getValue(),"YYYY/MM/01"));t(),n(),c(),l(),f("-sky-date-ccc").className="ccc for-day",k.style.display="block";var s=f.offset(a);k.style.cssText="left:"+s.left+"px;top:"+(s.top+s.height)+"px"}function y(a){var t=new Date((this.fr.value||this.fr.getAttribute("value")||"").replace(/-/g,"/")),n=s.getNow(),c=t.getTime()?t:n;return a?e(c,a):c}function d(a){var s=this.fr,t=e(a,s.getAttribute("format")||"YYYY-MM-DD");s.setAttribute("value",t);var n=s.tagName.toLowerCase();"input"==n||"textarea"==n?s.value=t:s.innerHTML=t,this.callback&&this.callback(a)}sky.loadCSS("./widget/date.css");var f=a(0);s.version="1.0.0",s.getNow=function(){return new Date},s.format=e;var k,u,g,v={close:function(){p()},year_prev:function(){return i(u.getFullYear()-1),!1},year:function(){f("-sky-date-ccc").className="ccc for-year"},year_next:function(){return i(u.getFullYear()+1),!1},year_list:function(a){t(1*a)},year_elect:function(a){i(1*a),f("-sky-date-ccc").className="ccc for-day"},month_prev:function(){return o(u.getMonth()-1),!1},month:function(){f("-sky-date-ccc").className="ccc for-month"},month_next:function(){return o(u.getMonth()+1),!1},month_elect:function(a){o(1*a),f("-sky-date-ccc").className="ccc for-day"},quick_elect:function(a){var e=s.getNow();e.setDate(e.getDate()+1*a),g.setValue(e),p()},day_elect:function(a){g.setValue(new Date(a)),p()}},h=function(a){h=r,k=f.create("div",{className:"sky-date-pick sky-date-pick-cus"},['<div class="cc">','<div class="close" sky-fn="close"></div>','<div class="head">','<div class="w1">','<span class="fn1" sky-fn="year_prev"></span><span sky-fn="year" class="txt1" id="-sky-date-txt-year">-</span><span class="fn2" sky-fn="year_next"></span>',"</div>",'<div class="w1">','<span class="fn1" sky-fn="month_prev"></span><span sky-fn="month" class="txt1" id="-sky-date-txt-month">-</span><span class="fn2" sky-fn="month_next"></span>',"</div>","</div>",'<div class="ccc" id="-sky-date-ccc">','<div class="fl-day">','<div class="l2">','<span class="b1">日</span>','<span class="b1">一</span>','<span class="b1">二</span>','<span class="b1">三</span>','<span class="b1">四</span>','<span class="b1">五</span>','<span class="b1">六</span>',"</div>",'<div class="l3" id="-sky-date-b-day"></div>',"</div>",'<div class="fl-month">','<span sky-fn="month_elect" sky-data="0" class="b4">1月</span>','<span sky-fn="month_elect" sky-data="1" class="b4">2月</span>','<span sky-fn="month_elect" sky-data="2" class="b4">3月</span>','<span sky-fn="month_elect" sky-data="3" class="b4">4月</span>','<span sky-fn="month_elect" sky-data="4" class="b4">5月</span>','<span sky-fn="month_elect" sky-data="5" class="b4">6月</span>','<span sky-fn="month_elect" sky-data="6" class="b4">7月</span>','<span sky-fn="month_elect" sky-data="7" class="b4">8月</span>','<span sky-fn="month_elect" sky-data="8" class="b4">9月</span>','<span sky-fn="month_elect" sky-data="9" class="b4">10月</span>','<span sky-fn="month_elect" sky-data="10" class="b4">11月</span>','<span sky-fn="month_elect" sky-data="11" class="b4">12月</span>',"</div>",'<div class="fl-year" id="-sky-date-b-year"></div>',"</div>",'<div class="btns">','<span sky-fn="quick_elect" sky-data="-2" class="b5">前天</span>','<span sky-fn="quick_elect" sky-data="-1" class="b5">昨天</span>','<span sky-fn="quick_elect" sky-data="0" class="b5">今天</span>','<span sky-fn="quick_elect" sky-data="1" class="b5">明天</span>','<span sky-fn="quick_elect" sky-data="2" class="b5">后天</span>',"</div>","</div>",""].join(""),document.body),p(),f.appendEvent(document,"vdown",p),f.appendEvent(k,"vdown",function(){f.getEvent().stopPropagation()}),f.skyLive(k,v),r(a)};f.datePick=s.datePick=function(a,s,e,t){var n=f(a);return n.fr=f(n.getAttribute("for-value"))||n,n.getValue=t||y,n.setValue=e||d,n.callback=s,f.appendEvent(n,"vclick",function(){h(n)}),f.appendEvent(n.fr,"focus",function(){h(n)}),n},f.setExpand("datePick")});