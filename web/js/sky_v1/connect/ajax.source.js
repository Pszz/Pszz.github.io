/**
 ajax v1.0版本
 */
sky.define("./connect/ajax" , ["./data/comm"] ,function(require, exports){
    exports.version = "1.0.0";
    //创建XHR
    var createXHR = window.XMLHttpRequest ? function(){
        return new window.XMLHttpRequest();
    } : function(){
        return new window.ActiveXObject("Microsoft.XMLHTTP");
    };
    var D = require("./data/comm");
    var bindFun = sky.bind;
    function fixedURL(url,param){
        var str = typeof param == 'string' ? param : D.QS.stringify(param,'&');
        if(str){
            return url + (url.indexOf("?") > -1 ? '&' : '?') + str;
        }
        return url;
    }


    //XHR 发送数据
    function requestSend(param){
        param || (param = {});
        var xhr = this.XHR = createXHR();
        var uripm = sky.extra(this.uriParam, {});
        this.emit('open', param, uripm);
        var isFormData = window.FormData && param instanceof window.FormData;
        var paramStr = null;
        if(typeof param == "string" || isFormData){
            paramStr = param;
        }
        else if(param){
            paramStr = D.QS.stringify(param, "&");
        }

        var url = fixedURL(this.url, uripm);
        //复制头
        var head = sky.extra(this.header, {});

        //Open
        if(this.method == "GET"){
            //请求
            if(paramStr && !isFormData){
                url = fixedURL(url, paramStr);
                paramStr = null;
            }
            //get请求缓存
            var cache = this.cache;
            if(cache === false){
                cache = '_r_=' + new Date().getTime();
            }
            if(typeof cache == 'string'){
                url = fixedURL(url, cache);
            }
            xhr.open(this.method, url, this.async);
        }
        else{
            xhr.open(this.method, url, this.async);
            if(!isFormData){
                if(head["Content-Type"] == null){
                    head["Content-Type"] = "application/x-www-form-urlencoded";
                }
                if(paramStr){
                    paramStr = paramStr.replace(/[\x00-\x08\x11-\x12\x14-\x20]/g, "*");
                }
            }
        }

        this.emit("send",head);
        sky.forEach(head, function(v, k){
            xhr.setRequestHeader(k, v);
        });

        //发送请求
        if(this.async){
            xhr.onreadystatechange = this._requestChange;
        }
        try{
            xhr.upload.onprogress = this._progress;
            xhr.onprogress = this._progressDown;
        }catch(e){}
        this.status = 0;
        xhr.send(paramStr);
        return this;
    }

    //ajax进度
    function onprogress(type, event){
        this.emit("progress" + type, event);
    }

    function onHttpRequestChange(){
        var xhr = this.XHR;
        this.readyState = xhr.readyState;
        this.emit("requestchange");
        if(xhr.readyState == 4){
            if(!this.overFlag){
                this.responseHeaders = xhr.getAllResponseHeaders();
                try{
                    this.responseText = xhr.responseText;
                }catch(e){
                    this.responseText = "";
                }
                this.responseXML = xhr.responseXML?D.XML.parse(this.responseText):null;
                this.responseJSON = D.JSON.parse(this.responseText);
                this.status = xhr.status;
                var end = this.emit("complete");
                if(end !== false){
                    var back = this.emit("censor");
                    this.error = back === true ? null : back;
                    this.emit("callback");
                    this.emit(this.error ? "fail" : "success");
                }
            }
            delete this.XHR;
            delete this.overFlag;
            return null;
        }
        return null;
    }

    var ajax = exports.BaseClass = sky.extend(sky.EventEmitter, {
        oncensor: function(){
            var s = this.status;
            if(s >= 200 && s < 300 || s === 304 || s === 1223){
                return true;
            }
            return "no data back,please try it later...";
        },
        //ajax中中止
        abort: function(){
            if(this.XHR){
                this.XHR.abort();
            }
            return this;
        },
        //发送数据
        send: function(param, over){
            if(this.XHR){
                if(this.XHR.readyState == 4 || !over){
                    return this;
                }
                this.overFlag = true;
                this.XHR.abort();
                this.XHR = null;
            }
            if(this.async){
                setTimeout(bindFun(requestSend, this, param));
            }
            else{
                requestSend.call(this, param);
            }
            return this;
        },
        //获得response头
        getResponseHeader: function(key){
            return key ? this.responseHeaders && new RegExp("(?:" + key + "):[ \t]*([^\r\n]*)\r").test(this.responseHeaders) ? RegExp["$1"] : "" : (this.responseHeaders || "");
        },
        //设置头
        setRequestHeader: function(k, v){
            this.header[k] = v;
            return this;
        },
        open: function(url, method, async){
            if(url){
                this.url = url;
            }
            if(method){
                this.method = method;
            }
            if(async != null){
                this.async = !!async;
            }
        }
    }, function(){
        this.uriParam = {};
        this.header = {};
        this.url = "";
        this.method = "GET";
        this.async = true;
        //XMLHttpRequest 改变调用
        this._requestChange = bindFun(onHttpRequestChange, this);
        this._progress = bindFun(onprogress, this, "");
        this._progressDown = bindFun(onprogress, this, "down");
        if(arguments.length){
            this.open.apply(this, arguments);
        }
    });

    exports.create = function(){
        var t = new ajax();
        if(arguments.length){
            t.open.apply(t, arguments);
        }
        return t;
    };

    sky.forEach(["get", "post", "put", "delete"], function(v){
        exports[v] = function(url, callback, param, sync){
            //v.toUpperCase()
            return new ajax(url, v.toUpperCase(), !sync).extra("oncallback", callback).send(param);
        };
    });
});