sky.define('./simi/dialog', ['./widget/kite'], function(require,dialog){
    dialog.version = '1.0.0';
    var kite = require('./widget/kite');
    
    //销毁弹窗
    function destroy(){
        this.destroy();
    }
    
    //默认信息
    var opt_default = dialog.options = {title_text:'信息提示',con_text:'信息内容'};
    
    //组织数据
    function getOptContent(str,df){
        var opt = sky.extra(opt_default, df || {}, {});
        if(typeof str == 'string'){
            opt.con_text = str;
        }
        else{
            opt = sky.extra(str, opt);
        }
        return opt;
    }

    
    //替换字符串
    function replaceText(str, opt){
        return str.replace(/\{#(\w+)\}/g,function($0,$1){
            return opt[$1] || '';
        });
    }
    
    //自定义弹窗
    var string_prompt = [
        '<div class="_opt_1 {#opt_class}"><div class="o_c">',
            '<a href="javascript:void(0);" sky-kite="destroy" class="o_close_1">×</a>',
            '<div class="o_t_1" sky-kite="title">',
               ' <strong>{#title_text}</strong>',
            '</div>',
            '<div class="o_c_1" sky-kite="con">{#con_text}</div>',
            '{#buttons}',
        '</div></div>'
    ].join('');
    
    //alert 弹窗
    var string_alert = string_prompt.replace('{#buttons}', '<div class="o_b_1" sky-kite="btns"><div class="_btn_1" sky-kite="btn_ok">{#btn_ok_text}</div></div>');
    
    //onfiorm 弹窗
    var string_confiorm = string_prompt.replace('{#buttons}', '<div class="o_b_2" sky-kite="btns"><div class="_btn_3" sky-kite="btn_cancel">{#btn_cancel_text}</div><div class="_btn_1" sky-kite="btn_ok">{#btn_ok_text}</div></div>');
    
    //通用弹窗
    function prompt(str,buttons,string_str,focus){
        //.drag('title')
        return this.create(replaceText(string_str,getOptContent(str,buttons)),focus).offset(0.5,0.5).bind('destroy_vclick',destroy).setMaskDestroy();
    }
    
    //弹窗控件
    var Dialog = sky.extend(kite.Mask,{
        //默认弹窗
        prompt:function(str,buttons,focus){
            return prompt.call(this, str, {buttons:buttons || ''}, string_prompt,focus);
        },
        //alert
        alert:function(str,fn){
            return prompt.call(this, str, {btn_ok_text:'确认'}, string_alert, 'btn_ok').bind('btn_ok_vclick',fn || destroy);
        },
        //confirm
        confirm:function(str,fn,fn1){
            return prompt.call(this, str, {btn_ok_text:'确认'}, string_alert, 'btn_ok').bind('btn_ok_vclick',fn || destroy);
        }
    },function(){
        arguments.callee._inits_[0].apply(this,arguments);
    });
    
    //创建模板
    dialog.create = function(bg,option,zindex){
        return new Dialog(bg,option,zindex);
    };
    
    //默认模板
    var m1 = dialog.create('#000000',.5);
    sky.forEach(['prompt','alert','confirm'],function(v){
        dialog[v] = function(){
            return m1[v].apply(m1,arguments);
        };
    });
    
    
});