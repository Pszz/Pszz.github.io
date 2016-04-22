if(!window.api){
    window.api = {};
}
if(!api.data){
    api.data = {};
}
if(!api.config){
    api.config = {};
}
//日志，防止在低版本的IE中报错
if(!window.console){
    window.console = {log:function(){}};
}

/**
 * Strinbg扩展配置
 */
String.Config = {
    uniRe:"**",
    uniExp:/[*]{2}/g,
    uniRemove:/[*]/g
};
//去除字符串两端空白字符
String.prototype.trim = function(){
    return this.replace(/^\s+/,"").replace(/\s\s*$/, "");
};
//去除HTML编码 生成可以在html文档显示的字符
String.prototype.htmlEncode = function(left){
    return (left?this.uniLeft(30,".."):this).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&#34;").replace(/\'/g,"&#39;");
};
String.prototype.htmlEncodeBr = function(left){
    return this.htmlEncode(left).replace(/\n/g,"<br />");
};

Date.prototype.format = function(join){
    return (join || "YYYY-MM-DD").replace(/YYYY/g,this.getFullYear())
        .replace(/YY/g,String(this.getYear()).slice(-2))
        .replace(/MM/g,("0" + (this.getMonth() + 1)).slice(-2))
        .replace(/M/g,this.getMonth() + 1)
        .replace(/DD/g,("0" + this.getDate()).slice(-2))
        .replace(/D/g,this.getDate())
        .replace(/hh/g,("0" + this.getHours()).slice(-2))
        .replace(/h/g,this.getHours())
        .replace(/mm/g,("0" + this.getMinutes()).slice(-2))
        .replace(/m/g,this.getMinutes())
        .replace(/ss/g,("0" + this.getSeconds()).slice(-2))
        .replace(/s/g,this.getSeconds());
};

//登录函数
api.login = function(src){
    var href = api.config.login_href || (api.config.path + 'page/user/login.html');
    if(document.location.pathname.indexOf(href) == -1){
        document.location.href = href + (href.indexOf('?') > -1?'&':'?') + 'href=' + encodeURIComponent(src || document.location.href);
    }
};

void function (){
    var c = api.config;

    //sky版本
    if(c.version_sky){
        sky.config.version = c.version_sky;
    }
    if(c.versions){
        sky.extra(c.versions,sky.config.versions);
    }
    //扩展别名
    if(c.alias){
        sky.extra(c.alias,sky.config.alias);
    }
    
    //事件
    api.Event = new sky.EventEmitter();
    
    //获取服务器时间
    var difference = 0;
    api.getServerTime = function(){
        return new Date(new Date().getTime() - difference);
    };

    //loading
    function initLoad(){
        var load = document.getElementById('__loading_');
        if(load){
            return ;
        }
        if(c.getData('load') != 'none'){
            load = document.createElement('div');
            load.id = '__loading_';
            load.style.cssText = ' position: fixed; width: 100%; text-align: center; padding: 2px 0;top:0; height: 100%; background-color: rgba(0, 0, 0, 0.1); z-index: 9999; display:none;';
            load.innerHTML = '<img style="margin-top:300px;" src="' + c.path + 'css/img/loading.gif" />';

            document.body.appendChild(load);
            var num = 0;
            api.openLoad = function(){
                num += 1;
                if(num == 1){
                    load.style.display = 'block';
                }
            };
            api.closeLoad = function(){
                num -= 1;
                if(num == 0){
                    load.style.display = 'none';
                }
                num = Math.max(num,0);
            };
        }
        else{
            api.openLoad = api.closeLoad = function(){};
        }
    }

    //ajax回调
    sky.on_connect_ajax = function(ajax){
        //ajax=======snail=================
        sky.extra({
            onsend:function(){
                api.openLoad();
            },
            oncomplete:function(){
                api.closeLoad();
                // 保证获取服务器的时间
                if(difference === undefined){
                    difference = new Date().getTime() - (new Date(this.getResponseHeader('Date')).getTime());
                }
                if(this.status == 0){
                    return false;
                }
//                var d = this.responseJSON || {};
//                if(this.autoLogin && d.code == 1008){
//                    api.login();
//                    return false;
//                }
            },
            oncensor: function(){
                var s = this.status;
                var err = "后台接口出错了";
                this.resultCode = s*-1;
                this.resultText = '';
                if(!this.timeout && s >= 200 && s < 300 || s === 304 || s === 1223){
                    var d = this.responseJSON;
                    if(d){
                        if(d.errno === undefined || d.errno == 0){
                            this.resultCode = 0;
                            return true;
                        }
                        this.resultCode = d.errno;
                        if(d.errmsg){
                            err = d.errmsg;
                        }
                    }
                }
                this.resultText = err;
                return err + '[' + this.resultCode + ']';
            },
//            onopen:function(pm,upm){
//                upm._source = 1;
//                api.ajaxOpen && api.ajaxOpen.call(this);
//            },
            autoLogin:true
        },ajax.BaseClass.prototype);
    };

    function getCookie(key){
        return new RegExp('[?:; ]*' + key + '=([^;]*);?').test(document.cookie + '') ? decodeURIComponent(RegExp["$1"]) : "";
    }

    //百度统计 采集脚本
    function baidu_tj(){
        sky.loadJS('//hm.baidu.com/hm.js?27fff5ed0673fe50436b520fe6f1d8c0');
    }
    
    function loadPageJS(){
        //使用的js 延后通过脚本加载器加载
        var js = c.getData("js");
        //不加载页面js，请设置js的值为none
        if(js != "none"){
            //获取同html页面同级下的script/页面同名.js
            var pjs = document.location.pathname.replace(/\/+$/,"/index.html").replace(/(\/[^\/]*)$/,"/script$1").replace(/\.[^.]*$/,c.jsSuffix || '.js');
            pjs = js?/,$/.test(js)?js + pjs:js:pjs;
            //页面js
            var js = pjs?pjs.split(","):[];
            if(js.length){
                js.push(baidu_tj);
                sky.use.apply(sky,js);
            }
        }
        else{
            baidu_tj();
        }
    }

    //加入DOMContentLoaded事件
    function domReady(){
        //初始化loading
        initLoad();
        //加载页面js
        loadPageJS();
        return ;
        /*
        var verify = c.getData('verify');
        if(verify == 'not'){
            api.Event.emit('verifyLogin',false);
            //加载页面js
            loadPageJS();
        }
        else{
            //获取身份
            sky.use('ajax',function(ajax){
                ajax.get('/shop/user/getlogin',function(){
                    if(!this.error){
                        var data = this.responseJSON || {};
                        api.data.user_id = data.uid;
                        api.data.user_name = data.username;
                    }
                    if(verify == 'must' && !api.data.user_id){
                        //跳转登录
                        api.login();
                        return ;
                    }
                    api.Event.emit('verifyLogin');

                }).autoLogin = false;
            });
        }
        */
    }
    document.attachEvent ? document.attachEvent("onreadystatechange", function(){
        if(document.readyState == "complete" || document.readyState == "loaded"){
            domReady();
        }
    }) : document.addEventListener("DOMContentLoaded", domReady, false);
}();