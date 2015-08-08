
// 默认的核心文件
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

void function ($){
    
    var c = $.config;

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
    
    var path = document.location.pathname;
    
    //登陆
    $.login = function(href){
        document.location.replace((/^\/admin\//.test(path)?'/admin/login.html?href=':'/page/login.html?href=') + decodeURIComponent(href || document.location.href));
    };
    
    $.logout = function(){
        sky.use('ajax',function(ajax){
            console.log(ajax);
            ajax.post('/index/Home/Api/logout',function(){
                if(!this.error){
                    document.cookie = 'AGENTID=; path=/';
                    document.cookie = 'AUTHNAME=; path=/';
                    document.cookie = 'AUTHIMG=; path=/';
                    $.login();
                }
            });
        });
    };
    
    var difference;
    Date.prototype.brevity = function(){
        var n = new Date().getTime() - (difference || 0);
        var t = this.getTime();
        var c = Math.floor((n - t)/60000);
        if(c > 2880){
            return this.format('YYYY-MM-DD');
        }
        if(c > 1440){
            return '昨天';
        }
        if(c > 60){
            return Math.floor(c / 60) + '小时前';
        }
        if(c < 0){
            c *= -1;
            var d = c / 60 / 24;
            var h = (d - Math.floor(d)) * 24;
            var m = (h - Math.floor(h)) * 60;
            var arr = ['还有'];
            if(d > 1){
                arr.push(Math.floor(d) + '天');
            }
            if(h > 1){
                arr.push(Math.floor(h) + '小时');
            }
            if(m > 1){
                arr.push(Math.floor(m) + '分钟');
            }
            return arr.join('');
        }
        return c + '分钟前';
    };
    $.getServerTime = function(){
        return new Date(new Date().getTime() - (difference || 0));
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
            load.innerHTML = '<img style="margin-top:300px;" src="/admin/res/img/loading.gif" />';

            document.body.appendChild(load);
            var num = 0;
            $.openLoad = function(){
                num += 1;
                if(num == 1){
                    load.style.display = 'block';
                }
            };
            $.closeLoad = function(){
                num -= 1;
                if(num == 0){
                    load.style.display = 'none';
                }
                num = Math.max(num,0);
            };
        }
        else{
            $.openLoad = $.closeLoad = function(){};
        }
    }

    //ajax回调
    sky.on_connect_ajax = function(ajax){
        //ajax=======snail=================
        sky.extra({
            onsend:function(){
                $.openLoad();
            },
            oncomplete:function(){
                $.closeLoad();
                // 保证获取服务器的时间
                if(difference === undefined){
                    difference = new Date().getTime() - (new Date(this.getResponseHeader('Date')).getTime());
                }
                
                if(this.status == 0){
                    return false;
                }
                var d = this.responseJSON || {};
                if(this.autoLogin && d.error == '80100002'){
                    $.login();
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
                        if(d.error === undefined || d.error == '0'){
                            this.resultCode = 0;
                            return true;
                        }
                        return this.resultText = '错误[' + d.error + ']';
                    }
                    return err;
                }
                return err + "[" + this.status + "]";
            },
            onopen:function(pm){
                if(pm.append){
                    pm.append('ajax',1);
                }
                else{
                    pm.ajax = 1;
                }
            },
            autoLogin:true
        },ajax.BaseClass.prototype);
    };

    sky.on_dom_dom = function($){
        //根点击
        $.live = function(id,back,ev){
            ev || (ev = 'vclick');
            var me = $(id);
            $.on(me,ev,function(){
                var ev = $.getEvent();
                var target = ev.target;
                while(target && target != me){
                    var fn = target.getAttribute('v-fn') || '';
                    var data = target.getAttribute('v-data');
                    if(data != null){
                        (back[fn] || back).call(target,data,ev);
                        break;
                    }
                    target = target.parentNode;
                }
            });
        };
        //tab切换
        $.tabs = function(ids,cls,def){
            var tab;
            $.query(ids).on('vclick',function(){
                if(tab != this){
                    if(tab){
                        $.removeClass(tab,cls);
                        $.css(tab.getAttribute('-for-c'),'display','none');
                    }
                    tab = this;
                    $.addClass(tab,cls);
                    $.css(tab.getAttribute('-for-c'),'display','block');
                }
            }).get(def || 0).emit('vclick');
        };
        //单选 复选切换
        function checkOne(ids,fn){
            var index;
            var cl1 = 'fa fa-circle-o';
            var cks = $.query(ids).attr('className',cl1);
            cks.on('vclick',function(){
                if(index != this){
                    if(index){
                        index.className = cl1;
                    }
                    index = this;
                    index.className = 'fa fa-dot-circle-o';
                    fn && fn.call(cks,index);
                }
            });
            cks.val = function(i){
                if(i == null){
                    return index?index.getAttribute('value'):'';
                }
                $.emit(cks[i],'vclick');
            };
            return cks;
        }
        function checkMulti(ids,num,fn){
            var len = 0;
            var indexs = {};
            var cl1 = 'fa fa-square-o';
            var cks = $.query(ids).attr('className',cl1).forEach(function(i){this._i = i});
            cks.on('vclick',function(){
                var i = this._i;
                if(indexs[i] !== undefined){
                    len -= 1;
                    delete indexs[i];
                    this.className = cl1;
                    fn && fn.call(cks,indexs,len);
                }
                else if(len < num){
                    len += 1;
                    indexs[i] = this.getAttribute('value');
                    this.className = 'fa fa-check-square-o';
                    fn && fn.call(cks,indexs,len);
                }
            });
            cks.val = function(iis){
                if(iis == null){
                    return sky.forEach(indexs,function(v){
                        return v;
                    },[]);
                }
                sky.forEach(iis,function(v){
                    $.emit(cks[v],'vclick');
                });
            };
            return cks;
        }
        $.checkBox = function(ids,num,fn){
            if(typeof num == 'function'){
                fn = num;
                num = 1;
            }
            if(num && num > 1){
                return checkMulti(ids,num,fn);
            }
            return checkOne(ids,fn);
        };
        $.vclick = function(id,fn,cop){
            $.appendEvent(id,'vclick',fn,cop);
        };
    };

    sky.on_data_template = function(tpl){
        //默认使用的模板=======snail=================
	    tpl.setFormat("brevity",function(v){
            return new Date(v).brevity();
        });
    };

    function getCookie(key){
        return new RegExp('[?:; ]*' + key + '=([^;]*);?').test(document.cookie + '') ? decodeURIComponent(RegExp["$1"]) : "";
    }
    
    if(!c.getPageJS){
        c.getPageJS = function(){
            return document.location.pathname.replace(/\/+$/,"/index.html").replace(/(\/[^\/]*)$/,"/script$1").replace(/[^.]*$/,"source.js");
        }
    }

    //加入DOMContentLoaded事件
    function domReady(){

        //初始化loading
        initLoad();

        if($.onload){
            $.onload();
        }
        var verify = c.getData('verify');
        $.data.user_id = getCookie('AGENTID');
        //$.data.user_account = getCookie('userAcc');
        $.data.user_nick = getCookie('AUTHNAME');
        $.data.user_img = getCookie('AUTHIMG');
        if(verify == 'must' && $.data.user_id == ''){
            $.login();
            return ;
        }
        var nickDom = document.getElementById('_api_nickname_');
        if(nickDom){
            nickDom.innerHTML = $.data.user_nick.htmlEncode();
        }
        var logoutDom = document.getElementById('_api_pwd_exit_');
        if(logoutDom){
            logoutDom.onclick = function(){
                $.logout();
            };
        }
        var pwdDom = document.getElementById('_api_pwd_edit_');
        if(pwdDom){
            pwdDom.onclick = function(){
                document.location.href = 'pwd.html';
            };
        }
        //使用的js 延后通过脚本加载器加载
        var js = c.getData("js");
        //不加载页面js，请设置js的值为none
        if(js != "none"){
            //获取同html页面同级下的script/页面同名.js
            //c.host.js + document.location.pathname.replace(/\/+$/,"/index.html").replace(/[^.]*$/,"source.js");
            var pjs = c.getPageJS();
            var version = c.getData("version") || '';
            if(version){
                pjs = pjs + '?' + version;
            }
            pjs = js?/,$/.test(js)?js + pjs:js:pjs;

            //页面js
            var js = pjs?pjs.split(","):[];
            if(js.length){
                sky.use.apply(sky,js);
            }
            return ;
        }
    }
    document.attachEvent ? document.attachEvent("onreadystatechange", function(){
        if(document.readyState == "complete" || document.readyState == "loaded"){
            domReady();
        }
    }) : document.addEventListener("DOMContentLoaded", domReady, false);
}(api);