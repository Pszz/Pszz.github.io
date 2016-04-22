sky.define('./widget/date',['./dom/dom'],function(require,exports){
    sky.loadCSS('./widget/date.css');
    var $ = require(0);
    
    exports.version = '1.0.0';
    exports.getNow = function(){
        return new Date();
    };
    function format(date,join){
        return (join || "YYYY-MM-DD").replace(/YYYY/g,date.getFullYear())
            .replace(/YY/g,String(date.getYear()).slice(-2))
            .replace(/MM/g,("0" + (date.getMonth() + 1)).slice(-2))
            .replace(/M/g,date.getMonth() + 1)
            .replace(/DD/g,("0" + date.getDate()).slice(-2))
            .replace(/D/g,date.getDate())
            .replace(/hh/g,("0" + date.getHours()).slice(-2))
            .replace(/h/g,date.getHours())
            .replace(/mm/g,("0" + date.getMinutes()).slice(-2))
            .replace(/m/g,date.getMinutes())
            .replace(/ss/g,("0" + date.getSeconds()).slice(-2))
            .replace(/s/g,date.getSeconds());
    }
    exports.format = format;
    
    //面板根节点
    var root,rootDate,rootIpt;
    
    //填充年份
    function fillYear(year){
        year || (year = rootDate.getFullYear());
        var html = ['<span class="b3" sky-fn="year_list" sky-data="' + (year - 23) + '">&lt;</span>'];
        var start = year - 11;
        var end = year + 11;
        for(var i=start;i<=end;i+=1){
            html.push('<span class="b3" sky-fn="year_elect" sky-data="' + i + '">' + i + '</span>');
        }
        html.push('<span class="b3" sky-fn="year_list" sky-data="' + (year + 23) + '">&gt;</span>');
        $.html('-sky-date-b-year',html.join(''))
    }
    function fillYearTxt(){
        var year = rootDate.getFullYear();
        $.text('-sky-date-txt-year',year + '年');
    }
    function fillMonthTxt(){
        var month = rootDate.getMonth() + 1;
        $.text('-sky-date-txt-month',month + '月');
    }
    function fillDay(){
        var date = rootDate;
        var month = date.getMonth();
        var today = format(rootIpt.getValue(),'YYYYMMDD');
        var day = new Date(format(date,'YYYY/MM/01'));
        day.setDate(day.getDate() - 1);
        day.setDate(day.getDate() - day.getDay());
        var html = [];
        for(var i=0,t,m,n;i<42;i+=1){
            t = format(day,'YYYYMMDD');
            n = day.getDate();
            m = day.getMonth();
            html.push('<span sky-fn="day_elect" sky-data="' + format(day,'YYYY/MM/DD') + '" class="b2' + (month == m?'':' color1') + (t == today?' bg1':'') + '">' + n + '</span>');
            day.setDate(n + 1);
        }
        $.html('-sky-date-b-day',html.join(''));
    }
    
    function hideRoot(){
        root.style.display = "none";
        rootDate = null;
        rootIpt = null;
    }
    
    function setYear(year){
        rootDate.setFullYear(year);
        fillYear();
        fillYearTxt();
        fillMonthTxt();
        fillDay();
    }
    
    function setMonth(month){
        var y1 = rootDate.getFullYear();
        rootDate.setMonth(month);
        var y2 = rootDate.getFullYear();
        if(y1 != y2){
            fillYear();
            fillYearTxt();
        }
        fillMonthTxt();
        fillDay();
    }
    
    var rootEvent = {
        close:function(){
            hideRoot();
        },
        year_prev:function(){
            setYear(rootDate.getFullYear() - 1);
            return false;
        },
        year:function(){
            $('-sky-date-ccc').className = 'ccc for-year';
        },
        year_next:function(){
            setYear(rootDate.getFullYear() + 1);
            return false;
        },
        year_list:function(year){
            fillYear(year*1);
        },
        year_elect:function(year){
            setYear(year*1);
            $('-sky-date-ccc').className = 'ccc for-day';
        },
        month_prev:function(){
            setMonth(rootDate.getMonth() - 1);
            return false;
        },
        month:function(){
            $('-sky-date-ccc').className = 'ccc for-month';
        },
        month_next:function(){
            setMonth(rootDate.getMonth() + 1);
            return false;
        },
        month_elect:function(month){
            setMonth(month*1);
            $('-sky-date-ccc').className = 'ccc for-day';
        },
        quick_elect:function(num){
            var tody = exports.getNow();
            tody.setDate(tody.getDate() + (num*1));
            rootIpt.setValue(tody);
            hideRoot();
        },
        day_elect:function(day){
            rootIpt.setValue(new Date(day));
            hideRoot();
        }
    };
    
    function init(me){
        rootIpt = me;
        var date = rootDate = new Date(format(me.getValue(),'YYYY/MM/01'));
        fillYear();
        fillYearTxt();
        fillMonthTxt();
        fillDay();
        $('-sky-date-ccc').className = 'ccc for-day';
        root.style.display = "block";
        var offset = $.offset(me);
        root.style.cssText = 'left:' + offset.left + 'px;top:' + (offset.top + offset.height) + 'px';
    }
    
    var create = function(me){
        create = init;
        root = $.create('div',{className:'sky-date-pick sky-date-pick-cus'},[
            '<div class="cc">',
                '<div class="close" sky-fn="close"></div>',
                '<div class="head">',
                    '<div class="w1">',
                        '<span class="fn1" sky-fn="year_prev"></span><span sky-fn="year" class="txt1" id="-sky-date-txt-year">-</span><span class="fn2" sky-fn="year_next"></span>',
                    '</div>',
                    '<div class="w1">',
                        '<span class="fn1" sky-fn="month_prev"></span><span sky-fn="month" class="txt1" id="-sky-date-txt-month">-</span><span class="fn2" sky-fn="month_next"></span>',
                    '</div>',
                '</div>',
                '<div class="ccc" id="-sky-date-ccc">',
                    '<div class="fl-day">',
                        '<div class="l2">',
                            '<span class="b1">日</span>',
                            '<span class="b1">一</span>',
                            '<span class="b1">二</span>',
                            '<span class="b1">三</span>',
                            '<span class="b1">四</span>',
                            '<span class="b1">五</span>',
                            '<span class="b1">六</span>',
                        '</div>',
                        '<div class="l3" id="-sky-date-b-day"></div>',
                    '</div>',
                    '<div class="fl-month">',
                        '<span sky-fn="month_elect" sky-data="0" class="b4">1月</span>',
                        '<span sky-fn="month_elect" sky-data="1" class="b4">2月</span>',
                        '<span sky-fn="month_elect" sky-data="2" class="b4">3月</span>',
                        '<span sky-fn="month_elect" sky-data="3" class="b4">4月</span>',
                        '<span sky-fn="month_elect" sky-data="4" class="b4">5月</span>',
                        '<span sky-fn="month_elect" sky-data="5" class="b4">6月</span>',
                        '<span sky-fn="month_elect" sky-data="6" class="b4">7月</span>',
                        '<span sky-fn="month_elect" sky-data="7" class="b4">8月</span>',
                        '<span sky-fn="month_elect" sky-data="8" class="b4">9月</span>',
                        '<span sky-fn="month_elect" sky-data="9" class="b4">10月</span>',
                        '<span sky-fn="month_elect" sky-data="10" class="b4">11月</span>',
                        '<span sky-fn="month_elect" sky-data="11" class="b4">12月</span>',
                    '</div>',
                    '<div class="fl-year" id="-sky-date-b-year"></div>',
                '</div>',
                '<div class="btns">',
                    '<span sky-fn="quick_elect" sky-data="-2" class="b5">前天</span>',
                    '<span sky-fn="quick_elect" sky-data="-1" class="b5">昨天</span>',
                    '<span sky-fn="quick_elect" sky-data="0" class="b5">今天</span>',
                    '<span sky-fn="quick_elect" sky-data="1" class="b5">明天</span>',
                    '<span sky-fn="quick_elect" sky-data="2" class="b5">后天</span>',
                '</div>',
            '</div>',
            ''
        ].join(''),document.body);
        hideRoot();
        $.appendEvent(document,'vdown',hideRoot);
        $.appendEvent(root,'vdown',function(){
            $.getEvent().stopPropagation();
        });
        $.skyLive(root,rootEvent);
        //初始化
        init(me);
    };
    
    
    //取值函数
    function getValue(formatStr){
        var date = new Date((this.fr.value || this.fr.getAttribute('value') || '').replace(/-/g,"/"));
        var now = exports.getNow();
        var time = date.getTime()?date : now;
        return formatStr?format(time,formatStr):time;
    }
    //赋值函数
    function setValue(date){
        var fr = this.fr;
        var v = format(date,fr.getAttribute('format') || 'YYYY-MM-DD');
        fr.setAttribute('value',v);
        var tag = fr.tagName.toLowerCase();
        if(tag == 'input' || tag == 'textarea'){
            fr.value = v;
        }
        else{
            fr.innerHTML = v;
        }
        this.callback && this.callback(date);
    }
    
    $.datePick = exports.datePick = function(id,back,setFn,getFn){
        var me = $(id);
        me.fr = $(me.getAttribute('for-value')) || me;
        me.getValue = getFn || getValue;
        me.setValue = setFn || setValue;
        me.callback = back;
        $.appendEvent(me,'vclick',function(){
            create(me);
        });
        $.appendEvent(me.fr,'focus',function(){
            create(me);
        });
        return me;
    };
    $.setExpand('datePick');
});