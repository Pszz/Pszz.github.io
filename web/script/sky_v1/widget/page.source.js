sky.define("./widget/page",["./dom/dom"],function(require,exports){
    var $ = require("dom");
    //分页点击事件
    function clickFun(){
        this[Array.prototype.shift.call(arguments)].apply(this,arguments);
        return false;
    }

    //首页 上一页 下一页 末页
    var Txt_first = "首页",
        Txt_previous = "上一页",
        Txt_next = "下一页",
        Txt_last = "末页",
        Txt_iptbtn = "跳转";

    //分页条中 输入框对输入内容的限制
    var numIpt = {
        onkeypress : function(){
            var event = $.getEvent();
            if(event.code == 13){
                $.emit(this.nextSibling,"click");
                return false;
            }
            //alert(event.keyCode);
            if(event.code < 48 || event.code > 57){
                event.preventDefault();
                return false;
            }
        },
        onkeyup : function(){
            var v = this.value.trim();
            if(v){
                v = Math.abs(parseInt(v)) || 1;
                if(v != this.value){
                    this.value = v;
                }
            }
        },
        onblur : function(){
            this.value = this.value*1 || 1;
        }
    };

    //创建 动态的分页节点
    var	Dev = {
        //首页
        first	:function(){
            return this.$first = $.create("a", {
                href: "javascript:void(0);",
                title: this.Txt_first || Txt_first,
                onclick: sky.bind(clickFun,this,"goFirst"),
                hidefocus: "true"
            }, "<b>"+(this.Txt_first || Txt_first)+"</b>");
        },
        //上一页
        previous:function(){
            return this.$previous = $.create("a", {
                href: "javascript:void(0);",
                title:this.Txt_previous || Txt_previous,
                onclick: sky.bind(clickFun,this,"goPrevious"),
                hidefocus: "true"
            }, "<b>"+(this.Txt_previous || Txt_previous)+"</b>");
        },
        //下一页
        next: function(){
            return this.$next = $.create("a", {
                href: "javascript:void(0);",
                title: this.Txt_next || Txt_next,
                onclick: sky.bind(clickFun,this,"goNext"),
                hidefocus: "true"
            }, "<b>"+(this.Txt_next || Txt_next)+"</b>");
        },
        //末页
        last: function(){
            return this.$last = $.create("a", {
                href: "javascript:void(0);",
                title: this.Txt_last || Txt_last,
                onclick: sky.bind(clickFun,this,"goLast"),
                hidefocus: "true"
            }, "<b>"+(this.Txt_last || Txt_last)+"</b>");
        },
        //分页数字 Cot
        txtRank: function(){
            var t = $.create("span", {
                className: "pENum"
            },'<span class="pENum2"></span>');
            this.$txtRank = t.firstChild;
            return t;
        },
        //分页输入框
        txtIpt: function(){
            var txt = this.Txt_iptbtn || Txt_iptbtn;
            var t = $.create("spn",{
                className:"pEIpt"
            },'<input type="text" value="' + this.pCurr + '" /><a href="javascript:void(0);" hidefocus="true" class="pEBK"><b>' + txt + '</b></a>');
            var ts = t.childNodes;
            this.$txtIpt = ts[0];
            sky.extra(numIpt,ts[0]);
            ts[1].onclick = sky.bind(clickFun,this,"goIpt");
            return t;
        }
    };

    //刷新时调用的函数
    var Ref = {
        //刷新第一页节点
        first	: function(){
            this.$first.className = this.pCurr > 1 ? "pEBK pEFir" : "pEBK pEFirDis";
        },
        //刷新上一页节点
        previous: function(){
            this.$previous.className = this.pCurr > 1 ? "pEBK pEPre" : "pEBK pEPreDis";
        },
        //刷新下一页节点
        next	: function(){
            this.$next.className = this.pCurr < this.pCount ? "pEBK pENxt" : "pEBK pENxtDis";
        },
        //刷新末页节点
        last	: function(){
            this.$last.className = this.pCurr < this.pCount ? "pEBK pELst" : "pEBK pELstDis";
        },
        //分页数字 刷新
        txtRank	: function(){
            //先清空
            this.$txtRank.innerHTML = "";
            var startNo	=	1,
                endNo	=	this.pCount,
                minNo	=	parseInt(this.pCount / 2) || 1,
                endFlg	=	false;

            if(this.pCount > this.pRank){
                minNo	=	Math.max(Math.floor(this.pRank / 2) - 1,0) || 1;
                startNo	=	(this.pCurr - minNo) > 0 ? this.pCurr - minNo : 1;
                endNo	=	startNo + this.pRank - 1;
                if(endNo > this.pCount){
                    endNo	=	this.pCount;
                    startNo	=	(endNo - this.pRank) > 0 ? endNo - this.pRank + 1 : 1;
                }
            }

            if(this.pCount - endNo > 0){
                endNo	-=	2;
                endFlg	=	true;
            }
            for(var i = startNo; i <= endNo; i += 1){
                $.create("a", i == this.pCurr ? {
                    hidefocus	: "true",
                    className	: "pESe"
                } : {
                    hidefocus	: "true",
                    href		: "javascript:void(0);",
                    onclick: sky.bind(clickFun,this,"goNav",i)
                }, i, this.$txtRank);
            }

            if (!endFlg){
                return;
            }
            $.create("b", null, "..", this.$txtRank);
            $.create("a", {
                href		: "javascript:void(0);",
                hidefocus	: "true",
                onclick		: sky.bind(clickFun,this,"goLast")
            }, this.pCount, this.$txtRank);
        },
        //刷新分页输入框显示的页码
        txtIpt  : function(){
            this.$txtIpt.value = this.pCurr;
        }
    };

    var Page = exports.BaseClass = sky.extend(sky.EventEmitter,{
        //pCount 总页数
        //pCurr 当前页码
        //pRank 分页条中，最多显示多少个页码
        set:function(pCount, pCurr, pRank){
            var flag;
            if(pCount){
                if(this.pCount != pCount){
                    flag = true;
                }
                this.pCount = pCount;
            }
            if(pCurr){
                if(this.pCurr != pCurr){
                    flag = true;
                }
                this.pCurr = pCurr;
            }
            if(pRank){
                pRank = Math.max(pRank,3);
                if(this.pRank != pRank){
                    flag = true;
                }
                this.pRank = pRank;
            }
            flag && this.goRef();
            return this;
        },
        //跳转首页
        goFirst: function(){
            this.goNav(1);
            return this;
        },
        //跳转 上一页
        goPrevious: function(){
            this.goNav(this.pCurr - 1);
            return this;
        },
        //跳转下一页
        goNext: function(){
            this.goNav(this.pCurr + 1);
            return this;
        },
        //跳转 末页
        goLast: function(){
            this.goNav(this.pCount);
            return this;
        },
        //跳转固定页
        goNav: function(pgno,same){
            pgno = pgno < 1 ? 1 : pgno > this.pCount ? this.pCount : pgno;
            if(!same && this.pCurr == pgno){
                return this;
            }
            this.pCurr = pgno;
            if(this.emit("change",pgno) === false){
                return this;
            }
            this.goRef();
            return this;
        },
        //输入框定位页码
        goIpt : function(){
            var v = parseInt(this.$txtIpt.value.trim());
            if(isNaN(v) || v < 1){
                this.goNav(1);
//				alert("请输入正确的页码");
//				this.$txtIpt.focus();
                return this;
            }
            if(this.pCount < v){
                this.goNav(this.pCount);
            }
//			if(this.pCount < v){
//				alert("已经超出最大页面，请重新输入");
//				this.$txtIpt.focus();
//				return ;
//			}
            this.goNav(v);
        },
        //刷新 指定项或者所有 的Element节点
        goRef: function(key){
            if(this.wCot){
                if(key){
                    if(typeof Ref[key] == "function"){
                        Ref[key].call(this);
                    }
                    return this;
                }
                key = this.deploy;
                for(var i = 0; i < key.length; i += 1){
                    if(typeof Ref[key[i]] == "function"){
                        Ref[key[i]].call(this);
                    }
                }
            }

            return this;
        },
        //第一次执行写入节点
        write: function(wCot, deploy){
            wCot = this.wCot = $(wCot);
            if(deploy){
                this.deploy = deploy;
            }
            else{
                deploy = this.deploy;
            }
            for(var i = 0; i < deploy.length; i += 1){
                if(typeof deploy[i] == "string"){
                    wCot.appendChild(Dev[deploy[i]].call(this));
                    Ref[deploy[i]].call(this);
                }
                else{
                    wCot.appendChild(deploy[i].call(this));
                }
            }
            return this;
        }
    },function(){
        //,"txtIpt"
        this.pCount = 1;
        this.pCurr = 1;
        this.pRank = 10;
        this.deploy = ["first", "previous", "txtRank", "next", "last"];
        if(arguments.length>0){
            this.set.apply(this,arguments);
        }
    });
    exports.version = "1.0.0";

    exports.create = function(){
        var p = new Page();
        if(arguments.length){
            p.set.apply(p,arguments);
        }
        return p;
    };
});