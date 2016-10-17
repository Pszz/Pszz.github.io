//公共脚本，用于网站独有的一些方法存放
void function(api){
   var fn = API.fn = {},J = api.JSON = {};
	   isTouch = 'createTouch' in document;
  //格式化Float数据
  fn.parseFloat = function(v){
    return window.parseFloat((+v).toFixed(2)); //控制精度为2位;
};	
  //获取地址栏参数
  fn.getSearch = function(key,str){
    return new RegExp("[?:; &]*" + key + "=([^&?=]*)&?").test(str || (doc.location.search || "")) ? decodeURIComponent(RegExp["$1"]) : "";
};
    
  //对文本框数据监控-只能为数字
  fn.fomatNumber = function(d,fun,args){
    var ev = 'oninput' in d ? 'input' : 'propertychange',temp;
	d.setAttribute("pattern","[0-9]*");//html5元素，让文本框只允许输入0-9的数字
    if(isTouch){
        d.type = args || "tel" ||"number"; //可以传入属性 如 tel电话格式验证
    }
    fn.on(d,ev,function(){
        var dom = this == window ? d : this;//ie7 - 9 bug 指向问题
        var v= dom.value;
        if(v){
            if(temp == v){ //ie7~ie9会反复执行
                return false;
            }
            dom.value = temp = v < 1 ? 1 : v.replace(/[\D]/g, '');
        }
        fun && fun(dom);
    });
  };

  //JSON 解析 兼容处理
  J.parse = function(str,safety){
        if(!str || str.length == 0){
            return null;
        }
        if(safety || safety === undefined){
            if(window.JSON){
                try{
                    return window.JSON.parse(str);
                }catch(e){
                    return null;
                }
            }
            //验证json字符串的安全性,不安全，直接返回 null
            if(!/^[\],:{}\s]*$/.test(str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))){
                return null;
            }
        }

        // 直接调用 eval 序列化
        try{
            return eval("(" + str + ")");
        }catch(e){
            return null;
        }

        return null;
    };

  //JSON  格式化字符串 兼容处理
  J.stringify = function(obj){
        if(window.JSON){
            //调用系统的
            return window.JSON.stringify(obj);
        }

        var type = typeof obj;
        if(obj == null){
            return "null";
        }
        if(type == "string"){
            return "\"" + obj.replace(/([\'\"\\])/g, "\\$1").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r") + "\"";
        }
        if(type == "number"){
            return obj.toString();
        }
        if(type == "boolean"){
            return obj + "";
        }
        var r = [], i, x;
        if(toString.call(obj) == "[object Array]"){
            var il = obj.length;
            for(i = 0; i < il; i += 1){
                x = arguments.callee(obj[i]);
                x != null && r.push(x);
            }
            return "[" + r.join(",") + "]";
        }
        if(obj && obj.constructor == Object){
            for(i in obj){
                if(obj.hasOwnProperty(i)){
                    x = arguments.callee(obj[i]);
                    x != null && r.push("\"" + i + "\":" + x);
                }
            }
            return "{" + r.join(",") + "}";
        }
        return null;
    };    
  //本地存储简单兼容
  if(!window.localStorage && /MSIE/.test(navigator.userAgent)){  
        if(!window.UserData) {  
            window.UserData = function(file_name) {  
                if(!file_name) file_name="user_data_default";  
                var dom = document.createElement('input');  
                dom.type = "hidden";  
                dom.addBehavior ("#default#userData");  
                document.body.appendChild(dom);  
                dom.save(file_name);  
                this.file_name = file_name;  
                this.dom = dom;  
                return this;  
            };  
            window.UserData.prototype = {  
                setItem:function(k, v) {  
                    this.dom.setAttribute(k,v);  
                    this.dom.save(this.file_name);  
                },  
                getItem:function(k){  
                    this.dom.load(this.file_name);  
                    return this.dom.getAttribute(k);  
                },  
                removeItem:function(k){  
                    this.dom.removeAttribute(k);  
                    this.dom.save(this.file_name);  
                },  
                clear:function() {  
                   this.dom.load(this.file_name);  
                   var now = new Date();  
                   now = new Date(now.getTime()-1);  
                   this.dom.expires = now.toUTCString();  
                   this.dom.save(this.file_name);  
                }  
            };  
        }  
        window.localStorage = new window.UserData("local_storage");  
    }
  //自定义事件封装
  fn.on = function(d,e,fn){
    if(d && typeof(fn) == "function"){
        d.attachEvent ? d.attachEvent("on" + e, fn) : d.addEventListener(e, fn, false);
    }
    return d;  
  };
  fn.vclick = function(d,fn){$(d).on(isTouch?"touchstart":"mousedown",fn)};
  fn.load = function(){
      var id = "load" + parseInt(Math.random()*10000);
      var str = [
        '<div id="'+ id +'" class="load">',
            '<div class="load-container load1">',
                '<div class="loader">Loading...</div>',
            '</div>',
        '</div>',
      ].join("");
      fn.load.remove = function(){
         //$("#"+id).remove();
          $(".load").remove();
      }
      $(document.body).append(str);
  }
  fn.load.remove = function(){};
}(API || {});
