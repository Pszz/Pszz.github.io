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
//免商店IOS版本
if(/FreeStoreIOS/i.test(window.navigator.userAgent + '')){
    window.EasyJS={__callbacks:{},invokeCallback:function(B,C){var _=Array.prototype.slice.call(arguments);_.shift();_.shift();for(var D=0,A=_.length;D<A;D++)_[D]=decodeURIComponent(_[D]);var $=EasyJS.__callbacks[B];if(C)EasyJS.__callbacks[B]=undefined;return $.apply(null,_)},call:function(D,G,B){var A=[];for(var H=0,C=B.length;H<C;H++)if(typeof B[H]=="function"){A.push("f");var F="__cb"+(+new Date);EasyJS.__callbacks[F]=B[H];A.push(F)}else{A.push("s");A.push(encodeURIComponent(B[H]))}var E=(A.length>0?":"+encodeURIComponent(A.join(":")):""),_=document.createElement("IFRAME");_.setAttribute("src","easy-js:"+D+":"+encodeURIComponent(G)+E);document.documentElement.appendChild(_);_.parentNode.removeChild(_);_=null;var $=EasyJS.retValue;EasyJS.retValue=undefined;return typeof $ == 'string'?decodeURIComponent($):$;},inject:function(B,$){window[B]={};var _=window[B];for(var C=0,A=$.length;C<A;C++)(function(){var D=$[C],A=D.replace(new RegExp(":","g"),"");_[A]=function(){return EasyJS.call(B,D,Array.prototype.slice.call(arguments))}})()}};
    //已经支持的方法 
    window.EasyJS.inject('AndroidInterface',['login','finish','getBssAccount','getAccount','getLoginInfo','getDeviceId','loadUrlInNewWindow']);
}
else{
    window.EasyJS = {inject:function(){console.log(arguments)}};
}

//安卓特定=======================================================
void function(){
    var AFace = window.AndroidInterface || window.OnlineShopInterface || {};
    api.isCustom = !!(window.AndroidInterface || window.OnlineShopInterface);
    var backId = 0;
    var backFns = {};
    //回调
    window.onconfirm = function(id,flag){
        var fn = backFns[id];
        if(fn){
            fn(flag);
            delete backFns[id];
        }
    };
    window.onalert = function(id){
        var fn = backFns[id];
        if(fn){
            fn();
            delete backFns[id];
        }
    };

    //拼接URL
    function setUrl(url){
        if(/^http(?:s)?:\/\//i.test(url)){
            return url;
        }
        if(/^\//i.test(url)){
            return "http://" + document.domain + url;
        }
        return "http://" + document.domain + document.location.pathname.replace(/[^\/]*$/,'') + url.replace(/^\.\//,'');
    }
    api.getFullPath = setUrl;
    
    

    //新的窗口
    api.newWindow = function(href){
        var url = setUrl(href);
        try{
            window.OnlineShopInterface.loadUrlInNewWindow(url);
        }catch(e){
            try{
                window.AndroidInterface.loadUrlInNewWindow(url);
            }catch(e){
                try{
                    window.AndroidInterface.loadUrl(url);
                }catch(e){
                    document.location.href = href;
                }
            }
        }
        return this;
    };

    //新浏览器窗口 openInSystemBrowser
    api.newSystemWindow = function(href){
        var url = setUrl(href);
        try{
            window.AndroidInterface.openInSystemBrowser(url);
        }catch(e){
            try{
                window.OnlineShopInterface.openInSystemBrowser(url);
            }catch(e){
                document.location.href = href;
            }
        }
        return this;
    };

    //confirm
    api.confirm = AFace.confirm?function(str,fn){
        backId += 1;
        if(fn){
            backFns[backId] = fn;
        }
        AFace.confirm(str,backId);
    }:function(str,fn){
        var flag = window.confirm(str);
        fn && fn(flag?1:0);
    };

    //alert
    api.alert = AFace.alert?function(str,fn){
        backId += 1;
        if(fn){
            backFns[backId] = fn;
        }
        AFace.alert(str,backId);
    }:function(str,fn){
        window.alert(str);
        fn && fn();
    };

    //日志
    api.trace = AFace.Log?function(str){
        AFace.Log(str);
    }:function(str){
        console.log(str);
    };

    //复制到剪切板
    api.copy = AFace.copy?function(str){
        AFace.copy(str);
    }:function(str){
        console.log("复制到剪切板：" + str);
    };

    //调用登录接口
    api.login = AFace.login?function(){
        AFace.login();
    }:function(src){
        var href = api.config.login_href || '/cms/web/center/login.html';
        document.location.href = href + (href.indexOf('?') > -1?'&':'?') + 'href=' + encodeURIComponent(src || document.location.href);
    };

    //charge充值 bind绑定 scorePage赚积分
    api.charge = AFace.charge?function(){
        AFace.charge();
    }:function(){
        console.log('充值');
    };

    api.bind = AFace.bind?function(){
        AFace.bind();
    }:function(){
        console.log('绑定手机');
    };

    api.score = AFace.scorePage?function(){
        AFace.scorePage();
    }:function(){
        console.log('赚积分');
    };

    //设置title
    api.setTitle = AFace.Log?function(str){
        AFace.Log(str);
    }:function(str){
        console.log("设置网页标题：" + str);
    };

    //关闭窗口
    api.finish = AFace.finish?function(){
        AFace.finish();
    }:function(){
        window.close();
        console.log("关闭窗口");
    };

    //下载游戏
    //cDownloadUrl,sGameName,cPackage,cIcon,iVersionCode,nAppId,cVersionName,cMd5,iSize
    api.downloadAPK = AFace.downloadApk?function(){
        for(var i=0;i<arguments.length;i+=1){
            arguments[i] = String(arguments[i]);
        }
        AFace.downloadApk.apply(AFace,arguments);
    }:function(){
        console.log("apk下载(真实的已经全部转为字符串)",arguments);
    };

    //检测游戏是否安装
    api.checkApkIsInstall = AFace.checkApkIsInstall?function(name){
        return AFace.checkApkIsInstall(name);
    }:function(name,flag){
        console.log("apk是否安装",name);
        return flag;
    };

    //分享
    //title标题,txt内容,url链接地址,pic图片
    api.activation = AFace.activation?function(){
        AFace.activation.apply(AFace,arguments);
    }:function(){
        console.log("apk分享",arguments);
    };

    //隐藏分享
    //window.AndroidInterface.hideShareImage(1)
    api.hideShareImage = AFace.hideShareImage?function(){
        AFace.hideShareImage(1);
    }:function(){
        console.log("隐藏分享按钮",arguments);
    };

    //获取登录用户信息
    //window.AndroidInterface.getLoginInfo
    api.getLoginInfo = AFace.getLoginInfo?function(){
        return AFace.getLoginInfo();
    }:function(){
        return '';
    };

    //是否为BSS帐号  getBssAccount
    api.getIsBssAccount = AFace.getBssAccount?function(){
        return AFace.getBssAccount();
    }:function(flag){
        return flag;
    };

    function return_first(){
        console.log(arguments);
        return arguments[0] || '';
    }

    //获取用户名    getAccount
    api.getAccount = AFace.getAccount?function(){
        return AFace.getAccount();
    }:function(){
        return api.data.user_account || arguments[0] || '';
    };
    api.getDisplayAccount = AFace.getDisplayAccount?function(){
        return AFace.getDisplayAccount();
    }:return_first;

    //获取昵称      getNickName
    api.getNickName = AFace.getNickName?function(){
        return AFace.getNickName();
    }:return_first;

    //获取用户绑定手机号   getPhoneNumber
    api.getPhoneNumber = AFace.getPhoneNumber?function(){
        return AFace.getPhoneNumber();
    }:return_first;

    //获取设备号
    api.getDeviceId = AFace.getDeviceId?function(){
        return AFace.getDeviceId();
    }:return_first;
    
    //设置左上角后退的运作方式
    //0：关闭窗口 1:webview 返回 2：页面控制
    api.setBarAction = AFace.setTitleViewAction?function(v,fn){
        if(fn){
            window.OnTitleViewClick = fn;
        }
        AFace.setTitleViewAction(v);
    }:return_first;

    //领取礼包结果 0 OK，其他的为错误
    //msgcode giftCode
    api.getGiftBag = AFace.getGiftBag?function(){
        return AFace.getGiftBag.apply(AFace,arguments);
    }:return_first;
    
    //__
    api.openFreeArea = AFace.openFreeArea?function(){
        AFace.openFreeArea();
    }:return_first;
    
    //通知客户端，刷新用户数据
    api.refreshUserInfo = AFace.refreshUserInfo?function(){
        AFace.refreshUserInfo();
    }:function(){
         console.log("刷新用户数据");
    };
}();

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

//目录计算 id 层 每层个数
api.getPath = function(n,d,s){
    var infoStr = "",tempUserID = Number(n),gene = 1;
    s = s || 1000;
    d = d || 4;
    for (var i = 1; i < d; i+=1){
        gene *= s;
    }
    for(i = 0; i < d; i+=1) {
        if(d != i + 1){
            infoStr += "/" + Math.floor(tempUserID / gene);
            tempUserID %= gene;
            gene /= s;
        }
        else
            infoStr += "/" + n;
    }
    return infoStr;
};

//计算大小
api.config.sizeStairs = 1024;
api.sizeTxt = function (size, multiply, stairs){
    size = size*(multiply || 1) || 0;
    if(size <= 0){
        return '';
    }
    stairs || (stairs = api.config.sizeStairs);
    var x;
    if ((x = size / stairs / stairs / stairs) >= 1) {
        size = Math.floor(x * 10) / 10 + "GB";
    }
    else if ((x = size / stairs / stairs) >= 1) {
        size = Math.floor(x * 10) / 10 + "MB";
    }
    else if ((x = size / stairs) >= 1) {
        size = Math.floor(x * 10) / 10 + "KB";
    }
    else {
        size = size + "B";
    }
    return size;
};

//下载游戏
void function(){
    var games = {};
    function downloadSet(x){
        games[x.nAppId] = [
            x.cDownloadUrl,
            x.sAppName,
            x.cPackage,
            x.cIcon,
            x.iVersionCode,
            x.nAppId,
            x.cVersionName,
            x.cMd5,
            x.iSize
        ];
    }
    api.downloadAPKSet = downloadSet;
    api.downloadAPKMini = function(appId){
        var game = games[appId];
        if(game){
            if(game !== true){
                api.downloadAPK.apply(api,game);
            }
        }
        else{
            games[appId] = true;
            sky.use('ajax',function(ajax){
                ajax.get('/appSpace' + api.getPath(appId) + '/detail.json',function(){
                    var v = (this.responseJSON || {}).item;
                    if(v){
                        downloadSet(v);
                        api.downloadAPKMini(appId);
                    }
                    else{
                        setTimeout(function(){
                            games[appId] = null;
                        },1000*60);
                    }
                });
            });
        }
    };
}();

//活动游戏下载统计
api.act_tj_down = function(actId,appId){
    sky.use('ajax',function(ajax){
        ajax.post('/store/platform/activity/user/center/download',null,{
            iActivityId:actId,
            cImei:api.getDeviceId(),
            iAppId:appId || '',
            iPlatform:0
        });
    });
};
//活动打开统计
api.act_tj_pv = function(actId){
    sky.use('ajax',function(ajax){
        ajax.post('/store/platform/activity/user/center/visit',null,{
            iActivityId:actId,
            cImei:api.getDeviceId(),
            url:document.location.href,
            iPlatform:0
        });
    });
};

void function(){
    var c = api.config;
    var domain = {
        'api.app.snail.com':'6003ae023b8bd87e7ad096cb855876bc',
        'api.app1.snail.com':'d977828f083079e345977a5f3525c71e',
        'api.app2.snail.com':'e96f0b92bb7dba119339ecce65dfe727',
        'api.app3.snail.com':'1d37c33c960ec36b0299fa525651008e',
        'api.app4.snail.com':'a286f4d2a9a8b98b98292785a09fffcc',
        'api.app5.snail.com':'cb8a4add88e862913e960ce695252b01',
        //礼包
        'libao.snail.com':'7bd19a01633a2153b8481e12dafb924b',
        //神器
        'sq.snail.com':'8d0740e75d1073c1e1b50835276036b8',
        //免商店
        'gofreestore':'77c6aeb59ead4439a99e4b754654d520'
    };
    var url = c.baidu_tj_url || '//hm.baidu.com/hm.js';
    if(c.baidu_tj_domain){
        sky.extra(c.baidu_tj_domain,domain);
    }
    //百度统计
    api.load_baidu_tj = function(){
        var key = domain[document.domain];
        if(key){
            sky.loadJS(url + '?' + key);
        }
        api.load_baidu_tj = function(){};
    };
}();

void function(userAgent){
    var isFreeStore = api.isFreeStore = userAgent.indexOf('freestore') >= 0;
    var isMicroMessenger = /MicroMessenger/i.test(userAgent);
    var isBlur = false;
    if(window.addEventListener){
        window.addEventListener('blur',function(){
            isBlur = true;
        });
    }
    
    //打开免商店
    var isOpenEnd = false;
    function openFreeStroe(opt,back){
        //alert(isOpenEnd);
        if(isOpenEnd){
            return ;
        }
        isOpenEnd = true;
        opt || (opt = {});
        if(!opt.type){
            if(opt.url){
                opt.type = 7;
            }
            else if(opt.pageId){
                opt.type = opt.pageTitle?5:6;
            }
            else{
                opt.type = 1;
            }
        }
        var strs = [];
        if(opt.url){
            opt.url = api.getFullPath(opt.url);
        }
        for(var n in opt){
            strs.push(n + '=' + decodeURIComponent(opt[n]));
        }
        //打开
        isBlur = false;
        var src = 'snailgame ://freestore?' + strs.join('&');
        //var win = window.open(src);
        //win.close();
        var _=document.createElement("IFRAME");_.setAttribute("src",src);document.documentElement.appendChild(_);_.parentNode.removeChild(_);
        //window.href = src;
        //document.location.href = src;
        setTimeout(function(){
            isOpenEnd = null;
            //sky.debug(api.isActived);
            //sky.debug(ifr.contentWindow.document.location.href);
            //document.body.removeChild(ifr);
            back && back(isBlur);
        },50);
    }
    
    //打开下载界面
    function _showDialog(isOpen){
        //sky.debug(isOpen);
        if(isOpen){
            return ;
        }
        //当前页面还是有焦点，显示下载
        if(api.notFreeStoreAlert){
            api.notFreeStoreAlert();
        }
        else{
            api.alert(api.config.not_freestore_tip || '活动详情请至免商店查看\n如没安装免商店，请下载安装');
        }
    }
    
    api.openFreeStore = function(opt,back){
        openFreeStroe(opt,back || _showDialog);
    };
    //页面跳转
    api.href = function(src,needLogin,isReplace){
        if(!isFreeStore){
            //尝试打开免商店
            api.openFreeStore({url:src,type:7});
            return ;
        }
        if(needLogin && !api.data.user_id){
            api.login(api.getFullPath(src));
            return ;
        }
        if(isReplace){
            document.location.replace(src);
        }
        else{
            document.location.href = src;
        }
    };

    //ios 版本微型，显示提示
    var iosMask;
    function showIOSDown(){
        if(!iosMask){
            iosMask = document.createElement('div');
            iosMask.style.cssText = ' position: fixed; display:none; z-index:101; top: 0; bottom: 0; left: 0; right: 0; background-color: rgba(0,0,0,.85); text-align: right;';
            iosMask.innerHTML = '<img src="' + api.getCDNSrc('api:ios_down.png') + '" />';
            iosMask.onmousedown = function(){
                iosMask.style.display = 'none';
            };
            document.body.appendChild(iosMask);
        }
        iosMask.style.display = 'block';
    }

    var down_android_url = api.config.down_android_url || 'http://go.woniu.com/to/66A426E7-5ADE-FE0C-4F8F-3433726EBBC7';
    var down_android_url_wx = api.config.down_android_url_wx || 'http://app.qq.com/#id=detail&appid=1101250309';
    var down_ios_url = 'https://itunes.apple.com/cn/app/mian-shang-dian/id871192746?mt=8';

    //下载免商店
    api.downloadFreeStore = function(fn){
        //尝试打开免商店
        api.openFreeStore({type:1},function(isOpen){
            if(fn){
                fn(isOpen);
                return ;
            }
            if(!isOpen){
                if(/ipad|ipod|ipad|iphone/i.test(userAgent)){
                    if(isMicroMessenger){
                        showIOSDown();
                    }
                    else{
                        document.location.href = down_ios_url;
                    }
                }
                else if(isMicroMessenger){
                    document.location.href = down_android_url_wx;
                }
                else{
                    document.location.href = down_android_url;
                }
            }
        });
    };
}(window.navigator.userAgent.toLowerCase());

void function (){
    var c = api.config;

    //sky版本
    if(c.version.sky){
        sky.config.version = c.version.sky;
    }
    if(c.versions){
        sky.extra(c.versions,sky.config.versions);
    }
    //扩展别名
    if(c.alias){
        sky.extra(c.alias,sky.config.alias);
    }
    var domain = c.domain || '//' + document.domain.replace(/^api\./,'static.') + '/';

    //走cdn的路径
    if(!api.getCDNSrc){
        var path = document.location.pathname.replace(/\/[^\/]*$/,'/').replace(/^\/*/,'');
        api.getCDNSrc = function(src){
            if(!api.isLargeScreen){
                src = src.replace(/_larger(\.[^.]+)$/,'$1');
            }
            var m = document.domain;
            if(/^\.\//.test(src)){
                return domain + src.replace(/^\.\//,path);
            }
            if(/^api:/.test(src)){
                var per = (m.indexOf('api.app') == 0?domain:'//static.app1.snail.com/') + 'cms/web/res/imgs/';
                return src.replace(/^api:/,per);
            }
            
            return src;
        };
    }
    
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
            load.style.cssText = ' position: fixed; width: 100%; text-align: center; padding: 2px 0; bottom: 0; z-index: 9999; display:none;';
            load.innerHTML = '<img src="' + api.getCDNSrc('api:loading.gif') + '" />';
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
                var d = this.responseJSON || {};
                if(this.autoLogin && d.code == 1008){
                    api.login();
                    return false;
                }
            },
            oncensor: function(){
                var s = this.status;
                var err = "未定义错误类型";
                this.resultCode = s*-1;
                this.resultText = '';
                if(!this.timeout && s >= 200 && s < 300 || s === 304 || s === 1223){
                    var d = this.responseJSON;
                    if(d){
                        if(d.code===undefined || d.code==0){
                            this.resultCode = 0;
                            return true;
                        }
                        this.resultCode = d.code;
                        this.resultText = d.msg || '';
                        return d.msg || err;
                    }
                    return err;
                }
                return err + "[" + this.status + "]";
            },
            onopen:function(pm,upm){
                upm._source = 1;
                api.ajaxOpen && api.ajaxOpen.call(this);
            },
            autoLogin:true
        },ajax.BaseClass.prototype);
    };

    sky.on_data_template = function(tpl){
        //默认使用的模板=======snail=================
	    tpl.setFormat("sizeTxt",function(){
            return api.sizeTxt.apply(this,arguments);
        });
    };

    //走cdn的图片
    function setCNDImg(){
        var imgs = document.body.getElementsByTagName('img');
        for(var i= 0,v;i<imgs.length;i+=1){
            v = imgs[i].getAttribute('cdn-src');
            if(v){
                imgs[i].removeAttribute('cdn-src');
                imgs[i].src = api.getCDNSrc(v);
            }
        }
    }

    function getCookie(key){
        return new RegExp('[?:; ]*' + key + '=([^;]*);?').test(document.cookie + '') ? decodeURIComponent(RegExp["$1"]) : "";
    }

    //蜗牛 采集脚本
    function snail_collection(){
        if(api.snail_collection){
            api.snail_collection();
        }
        else{
            if(api.data.user_id){
                var naid = getCookie('naid');
                if(!naid){
                    document.cookie = 'naid=' + api.data.user_id;
                }
            }
            setTimeout(function(){
                sky.loadJS('http://gg.woniu.com/app/models/ty/statistics_ty_v1.js');
            },100);
        }
    }

    //加入DOMContentLoaded事件
    function domReady(){
        //免商店 设置title
        api.setTitle(document.title);

        //查询页面上走cdn的图片
        setCNDImg();

        //初始化loading
        initLoad();

        if(api.onload){
            api.onload();
        }

        var verify = c.getData('verify');
        api.data.user_id = getCookie('nUserId') || getCookie('naid');
        api.data.user_account = getCookie('SSOPrincipal');
        if(verify == 'must' && api.data.user_id == ''){
            api.login();
            return ;
        }
        //使用的js 延后通过脚本加载器加载
        var js = c.getData("js");
        //不加载页面js，请设置js的值为none
        if(js != "none"){
            //获取同html页面同级下的script/页面同名.js
            var pjs = c.host.js + document.location.pathname.replace(/\/+$/,"/index.html").replace(/(\/[^\/]*)$/,"/script$1").replace(/\.[^.]*$/,c.suffix || '.js');
            var version = c.getData("version") || '';
            if(version){
                pjs = pjs + '?' + version;
            }
            pjs = js?/,$/.test(js)?js + pjs:js:pjs;

            //页面js
            var js = pjs?pjs.split(","):[];
            if(js.length){
                js.push(snail_collection);
                sky.use.apply(sky,js);
            }
            return ;
        }

        snail_collection();
    }
    document.attachEvent ? document.attachEvent("onreadystatechange", function(){
        if(document.readyState == "complete" || document.readyState == "loaded"){
            domReady();
        }
    }) : document.addEventListener("DOMContentLoaded", domReady, false);
}();

//ios中css active 无效的决绝方案
try{
    document.addEventListener('touchstart', function(){}, true);
}catch(e){}