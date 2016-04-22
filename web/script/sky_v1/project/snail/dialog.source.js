/**
 * Created by poppy on 2014/7/14 0014.
 */
sky.define('./project/snail/dialog',['./widget/kite'],function(require,msg){
    msg.version = '1.0.0';
    //kite
    var kite = require(0);

    //销毁弹窗
    function destroy(){
        this.destroy();
    }

    var opt_default = {
        title_text:'提示信息',
        con_text:'信息内容'
    };

    function getOptContent(str,df){
        var opt = sky.extra(opt_default,df || {},{});
        if(typeof str == 'string'){
            opt.con_text = str;
        }
        else{
            opt = sky.extra(str,opt);
        }
        return opt;
    }

    function replaceText(str,opt){
        return str.replace(/\{#(\w+)\}/g,function($0,$1){
            return opt[$1] || '';
        });
    }

    //============ 自定义 弹窗  =====================
    var string_prompt = [
        '<div class="_opt_1 {#opt_class}"><div class="o_cc">',
            '<div class="o_t" sky-kite="title">{#title_text}</div>',
            '<div class="o_c" sky-kite="con">{#con_text}</div>',
            '{#buttons}',
        '</div></div>'
    ].join('');

    //============alert 弹窗 ========================
    var string_alert = string_prompt.replace(/\{\#buttons\}/g,'<div class="o_c_b1" sky-kite="btns"><div class="o_btn" sky-kite="btn_ok">{#btn_ok_text}</div></div>');
    //============confiorm 弹窗 ========================
    var string_confiorm = string_prompt.replace(/\{\#buttons\}/g,'<div class="o_c_b2" sky-kite="btns"><div class="o_btn" sky-kite="btn_cancel">{#btn_cancel_text}</div><div class="o_btn" sky-kite="btn_ok">{#btn_ok_text}</div></div>');
    var dialog = sky.extend(kite.Mask,{
        //默认弹窗 .drag('title') .drag('title')
        prompt:function(str,buttons){
            var opt = getOptContent(str,{buttons:buttons || ''});
            return this.create(replaceText(string_prompt,opt)).offset(.5,.5);
        },
        //============alert 弹窗 ======================== .drag('title')
        alert : function(str,fn){
            var opt = getOptContent(str,{btn_ok_text:'确认'});
            return this.create(replaceText(string_alert,opt),'btn_ok').offset(.5,.5).bind('btn_ok_vclick',fn || destroy);
        },
        confirm : function(str,fn,fn1){
            var opt = getOptContent(str,{btn_ok_text:'确认',btn_cancel_text:'取消'});

            return this.create(replaceText(string_confiorm,opt),'btn_ok').offset(.5,.5).bind('btn_ok_vclick',fn || destroy).bind('btn_cancel_vclick',fn1 || destroy);
        },
        //警告框
        warning:function(str,fn){
            return this.alert({
                con_text:'<div class="o_tc"><span class="_icon80_4"></span><div class="o_t1">' + str + '</div></div>',
                opt_class:'_opt_ht'
            },fn);
        },
        //通过的框
        pass:function(str,fn){
            return this.alert({
                con_text:'<div class="o_tc"><span class="_icon80_3"></span><div class="o_t2">' + str + '</div></div>',
                opt_class:'_opt_ht'
            },fn);
        }
    },function(){
        arguments.callee._inits_[0].apply(this,arguments);
    });

    msg.create = function(bg,option,zindex){
        return new dialog(bg,option,zindex)
    };
    var m1 = msg.create('#000000',.5);
    sky.forEach(['prompt','alert','confirm','warning','pass'],function(v){
        msg[v] = function(){
            return m1[v].apply(m1,arguments);
        };
    });
});