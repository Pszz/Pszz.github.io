window.api||(window.api={}),api.data||(api.data={}),api.config||(api.config={}),window.console||(window.console={log:function(){}}),String.Config={uniRe:"**",uniExp:/[*]{2}/g,uniRemove:/[*]/g},String.prototype.trim=function(){return this.replace(/^\s+/,"").replace(/\s\s*$/,"")},String.prototype.htmlEncode=function(t){return(t?this.uniLeft(30,".."):this).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&#34;").replace(/\'/g,"&#39;")},String.prototype.htmlEncodeBr=function(t){return this.htmlEncode(t).replace(/\n/g,"<br />")},Date.prototype.format=function(t){return(t||"YYYY-MM-DD").replace(/YYYY/g,this.getFullYear()).replace(/YY/g,String(this.getYear()).slice(-2)).replace(/MM/g,("0"+(this.getMonth()+1)).slice(-2)).replace(/M/g,this.getMonth()+1).replace(/DD/g,("0"+this.getDate()).slice(-2)).replace(/D/g,this.getDate()).replace(/hh/g,("0"+this.getHours()).slice(-2)).replace(/h/g,this.getHours()).replace(/mm/g,("0"+this.getMinutes()).slice(-2)).replace(/m/g,this.getMinutes()).replace(/ss/g,("0"+this.getSeconds()).slice(-2)).replace(/s/g,this.getSeconds())},void function(){function t(){var t=document.getElementById("__loading_");if(!t)if("none"!=n.getData("load")){t=document.createElement("div"),t.id="__loading_",t.style.cssText=" position: fixed; width: 100%; text-align: center; padding: 2px 0; bottom: 0; z-index: 9999; display:none;",t.innerHTML='<img src="//static.app1.snail.com/cms/web/res/imgs/loading.gif" />',document.body.appendChild(t);var e=0;api.openLoad=function(){e+=1,1==e&&(t.style.display="block")},api.closeLoad=function(){e-=1,0==e&&(t.style.display="none"),e=Math.max(e,0)}}else api.openLoad=api.closeLoad=function(){}}function e(t){return new RegExp("[?:; ]*"+t+"=([^;]*);?").test(document.cookie+"")?decodeURIComponent(RegExp.$1):""}function a(){if(api.snail_collection)api.snail_collection();else{if(api.data.user_id){var t=e("naid");t||(document.cookie="naid="+api.data.user_id)}setTimeout(function(){sky.loadJS("http://gg.woniu.com/app/models/ty/statistics_ty_v1.js")},100)}}function i(){t(),api.onload&&api.onload();var i=n.getData("verify");if(api.data.user_id=e("nUserId")||e("naid"),api.data.user_account=e("SSOPrincipal"),"must"==i&&""==api.data.user_id)return void api.login();var s=n.getData("js");if("none"!=s){var o=n.host.js+document.location.pathname.replace(/\/+$/,"/index.html").replace(/(\/[^\/]*)$/,"/script$1").replace(/\.[^.]*$/,n.suffix||".js"),r=n.getData("version")||"";r&&(o=o+"?"+r),o=s?/,$/.test(s)?s+o:s:o;var s=o?o.split(","):[];return void(s.length&&(s.push(a),sky.use.apply(sky,s)))}a()}var n=api.config;n.version.sky&&(sky.config.version=n.version.sky),n.versions&&sky.extra(n.versions,sky.config.versions),n.alias&&sky.extra(n.alias,sky.config.alias),api.login=function(t){var e=api.config.login_href||"/login.html";document.location.href=e+(e.indexOf("?")>-1?"&":"?")+"href="+encodeURIComponent(t||document.location.href)};var s=0;api.getServerTime=function(){return new Date((new Date).getTime()-s)},sky.on_connect_ajax=function(t){sky.extra({onsend:function(){api.openLoad()},oncomplete:function(){if(api.closeLoad(),void 0===s&&(s=(new Date).getTime()-new Date(this.getResponseHeader("Date")).getTime()),0==this.status)return!1;var t=this.responseJSON||{};return this.autoLogin&&1008==t.code?(api.login(),!1):void 0},oncensor:function(){var t=this.status,e="未定义错误类型";if(this.resultCode=-1*t,this.resultText="",!this.timeout&&t>=200&&300>t||304===t||1223===t){var a=this.responseJSON;return a?void 0===a.code||0==a.code?(this.resultCode=0,!0):(this.resultCode=a.code,this.resultText=a.msg||"",a.msg||e):e}return e+"["+this.status+"]"},onopen:function(t,e){e._source=1,api.ajaxOpen&&api.ajaxOpen.call(this)},autoLogin:!0},t.BaseClass.prototype)},sky.on_dom_dom=function(t){t.tabs=function(e,a,i){var n;t.query(e).on("vclick",function(){n!=this&&(n&&(t.removeClass(n,a),t.css(n.getAttribute("-for-c"),"display","none")),n=this,t.addClass(n,a),t.css(n.getAttribute("-for-c"),"display","block"))}).get(i||0).emit("vclick")}},document.attachEvent?document.attachEvent("onreadystatechange",function(){("complete"==document.readyState||"loaded"==document.readyState)&&i()}):document.addEventListener("DOMContentLoaded",i,!1)}();