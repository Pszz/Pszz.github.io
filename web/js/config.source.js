//配置
var API = {
		data:{}
    };
void function($){
    var suffix = ".js";
    var c = $.config = {
        rootPath : "",//根目录
        title : "前端code - [Pszz]",//通用title
        data : function(){
            var ns = document.getElementsByTagName("script");
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
        },
        alias : {
            cartStor : "./project/i4/season_cart_stor"
        },
		Pszz : { //个人信息
				name : "Pi Shu Zhang",
				qq : "pi951357@qq.com",
			    email : "pi951357@qq.com",
				github : "Pszz.github.io",
		}
    };
    
    //获取参数
    $.getSearch = function(key,str){
        return new RegExp("[?:; &]*" + key + "=([^&?=]*)&?").test(str || (document.location.search || "")) ? decodeURIComponent(RegExp["$1"]) : "";
    };
        
    c.jsSuffix = suffix;
    //更新title
    document.title = c.title;
    //静态地址写入
    var css = c.getData("css");
    var rv = [];
    if(css != "none"){
        css || (css = c.rootPath + 'css/main.css');
        rv.push('<link href="'+ css +'" rel="stylesheet" type="text/css" />');
    }
    rv.push('<script data-base="'+ c.rootPath +'js/sky_v1/" type="text/javascript" src="'+ c.rootPath +'js/sky_v1/core'+ suffix +'"></script>');
	document.write(rv.join(''));
    //动态加载js
    function loadPageJS(){
        var js = c.getData("js");
        //不加载js 则设置js=none 
        if(js != "none"){
            //默认获取同目录 index.html => js/index.js ,需要另外调用则 js=地址
            var pjs = document.location.pathname.replace(/\/+$/,"/index.html").replace(/(\/[^\/]*)$/,"/js$1").replace(/\.[^.]*$/,c.jsSuffix || '.js');
            pjs = js ? /,$/.test(js) ? js + pjs : js : pjs;
            var js = pjs ? pjs.split(","):[];
            if(js.length){
                js.push(beforeJS());
                sky.use.apply(sky,js);
            }else{
                beforeJS();
            }
        }
    }
    //其他特殊js导入 - 在此处添加，每个使用config.js的都会添加
    //主栈加载前 加入 - 例如其他类库 - 追加在head最后面
    function beforeJS(){
        //wait code 暂未添加
		return ["js/main"];
		 
    }
    //主栈加载后 加入 - 例如统计数据 - 追加在body最后面
    function afterJS(){
        //wait code 暂未添加
    }
    //loading - 蒙板
    function initLoad(){
        //写loading  //wait code
    }
	//dom加载完成后执行
    function domReady(){
        //初始化状态
        initLoad();
        loadPageJS();
        return ;
    }
    //文档流加载完成后 写入js
    document.attachEvent ? document.attachEvent("onreadystatechange", function(){
        if(document.readyState == "complete" || document.readyState == "loaded"){
            domReady();
        }
    }) : document.addEventListener("DOMContentLoaded", domReady, false);
}(API);