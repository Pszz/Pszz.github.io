//配置 
var API = {data:{}};
void function(api){
    var doc = document, J = api.JSON = {}, M = api.msg = {};
    var suffix = ".js",c,u;
    //公共配置  例如title
     c = api.config = {
        rootPath : "",//根目录
        title : "前端code - [Pszz]",//通用title
        qq : "",//客服qq地址
        data : function(){
            var ns = doc.getElementsByTagName("script");
            var n = ns[ns.length - 1];
            for(var i = ns.length - 1; i >= 0 ; i -= 1){
                if(ns[i].src){
                    n = ns[i];
                    break;
                }
            }
            //config.js 调用 config.source.js 时,其他js统一引入 .source.js 用于调试
            if(/\.source\.js/.test(n.src)){
                suffix = ".source.js";
            }
            return n.getAttribute("data") || "";
        }(),
        getData : function(key){
            return new RegExp("[?:; ]*" + key + "=([^;]*);?").test(this.data) ? decodeURIComponent(RegExp["$1"]) : "";
        }
    };
	u = api.user = {
		name : "Pi Shu Zhang",
		qq : "pi951357@qq.com",
		email : "pi951357@qq.com",
		github : "Pszz.github.io",
		weixin : "pishuzhang"
	};
  

    c.jsSuffix = suffix;
    
    doc.title = c.title;
  
    //静态地址写入
    var css = c.getData("css");
    c.rootPath = c.getData("uri") || c.rootPath;
    var rv = [];
     //加载 必要文件js和css
    rv.push('<link href="'+  c.rootPath +'css/main.css" rel="stylesheet" type="text/css" />');
	//rv.push('<script href="'+  c.rootPath +'script/sky_v1/core'+ suffix +'"></script>');
    //加载 动态css
    if(css != "none"){
        if(css){
            css = css.replace(/^\[/,"").replace(/\]$/,"").split(",");
            for(var i = 0; i < css.length; i++){
                rv.push('<link href="'+ c.rootPath + css[i] +'.css" rel="stylesheet" type="text/css" />');
            }
        }      
    }
	doc.write(rv.join(''));
    //动态加载js
    function loadPageJS(){
        var js = c.getData("js");
        //向head插入数据
        var headJs = [];//[c.rootPath +'script/public'];
        //向body插入的数据
       //var bodyJs = ["http://hm.baidu.com/hm.js?7ed291a4e1e9aeceaa65a7fd653e9547"];
        js = js ? js.replace(/^\[/,"").replace(/\]$/,"").split(",") : "";
        //不加载js 则设置js=none 
        if(!(js == "none" || js == "")){
            for(var i = 0; i < js.length; i++){
                js[i] = c.rootPath + (c.rootPath ? "/" : "") + "script/" + js[i].replace(/^script\/|\/script\//,"");
            }
            useJs(js);
        }
        useJs(headJs);
       //useJs(bodyJs,"body");//百度统计，放到最后加载
    }
    //调用js
    function useJs(arr,loca){
        if(arr.length != 0){
            var js = arr.shift().replace(".js","") + suffix;
			var t = doc.createElement("script");
			t.type = "text/javascript";
			t.src =  js;
			if(loca != "body"){
				loca = "head";
			}
			t.onreadystatechange = t.onload = t.onerror = function(){
				if(!t.readyState || t.readyState == "loaded" || t.readyState == "complete"){
				t.onreadystatechange = t.onload = t.onerror = null;
				t = null;
				setTimeout(function(){
					useJs(arr);
				},0);
				}
			}
			doc.getElementsByTagName(loca)[0].appendChild(t);
        }
    }
	//dom加载完成后执行
    function domReady(){
        loadPageJS();
        var aList = document.getElementsByTagName("a");
		for(var i = 0; i < aList.length; i++){
            if(aList[i].getAttribute("href") == "#"){ //部分浏览器会打开新窗口
                aList[i].href = "javascript:;";
            }
        }
    }
    //文档流加载完成后 写入js
    doc.attachEvent ? doc.attachEvent("onreadystatechange", function(){
        if(doc.readyState == "complete" || doc.readyState == "loaded"){
            domReady();
        }
    }) : doc.addEventListener("DOMContentLoaded", domReady, false);
}(API);


//特殊公共函数
API.showMain = function(uri){
	window.frames['box-iframe'].location.href = API.config.rootPath + (uri? "" : "page/home.html");
}