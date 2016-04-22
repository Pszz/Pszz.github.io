sky.define('./edit/edit',function(require,WebEdit){
    sky.loadCSS('./edit/edit.css');
    var isKHTML = navigator.userAgent.indexOf("KHTML") > -1 || navigator.userAgent.indexOf("Konqueror") > -1  || navigator.userAgent.indexOf("AppleWebKit") > -1;
    var isIE = window.attachEvent && window.ActiveXObject && !window.opera;
    var isMoz = navigator.userAgent.indexOf("Gecko") > -1 && !isKHTML;
    var $ = function(cot){
        return typeof cot =="string"?document.getElementById(cot):cot;
    };

    function getColors(format,jStart){
        jStart = jStart || 0;

        var v = [],i,j,k,c,is,js,ks,to16 = "0123456789ABCDEF";
        for(i=0;i<=15;i+=3){
            is = to16.charAt(i) + to16.charAt(i);
            for(j=jStart;j<=jStart+6;j+=3){
                js = to16.charAt(j) + to16.charAt(j);
                for(k=0;k<=15;k+=3){
                    ks = to16.charAt(k) + to16.charAt(k);
                    c = "#" + js + ks + is;
                    v.push('<a href="javascript:;" title="'+c+'" v-click="format,'+format+','+c+'" style="background-color:'+c+'"></a>');
                }
            }
            v.push("\n");
        }
        if(j<15){
            v.push(getColors(format,9));
        }
        return v.join("");
    }

    function getFontFace(){
        var v = [],f = WebEdit._FontFace || WebEdit.defFontFace;
        for(var i=0;i<f.length;i+=1){
            v.push('<A v-click="format,fontname,'+f[i]+'" style="font-family:'+f[i]+'" href="javascript:;">'+f[i]+'</A>');
        }
        return v.join("");
    }

    function callFuns(){
        var key = Array.prototype.shift.call(arguments);
        WebEdit[key].apply(WebEdit,arguments);
    }

    sky.extra({
        defFontFace:[
            '宋体',
            '黑体',
            '楷体',
            '隶书',
            '幼圆',
            'Arial',
            'Arial Narrow',
            'Arial Black',
            'Comic Sans MS',
            'Courier',
            'System',
            'Times New Roman',
            'Verdana'
        ],
        setFontFace:function(f){
            this._FontFace = f;
            return this;
        },
        defDeploys:[
            "Cut",
            "Copy",
            "Paste",
            "|",
            "fontface",
            "fontsize",
            "Bold",
            "Italic",
            "Underline",
            "Justifyleft",
            "Justifycenter",
            "Justifyright",
            "Insertorderedlist",
            "Insertunorderedlist",
            "Outdent",
            "Indent",
            "foreColor",
            "backColor",
            "|",
            "CreateLink",
            "CreateImg"
        ],
        renderTo:function(cot,deploys){
            this.deploys = deploys || this.defDeploys;
            var htmls = [
                '<table cellpadding="0" cellspacing="0" width="100%" class="WebEdit_Edit">',
                '<thead>',
                '<tr>',
                '<td nowrap="nowrap">'
            ];
            for(var i=0,t;i<this.deploys.length;i+=1){
                t = this.deploys[i]=="-"?[
                    this.htmlDeploys[this.deploys[i]]
                ]:[
                    '<div class="WebEdit_left">', // v-click="WebEdit.stopClick(event);"
                    this.htmlDeploys[this.deploys[i]],
                    '</div>'
                ];
                htmls.push(t.join(""));
            }
            htmls.push([
                '</td>',
                '</tr>',
                '</thead>',
                '<tbody>',
                '<tr>',
                '<td>',
                '<iframe width="100%" name="WebEdit_HTMLEdit" id="WebEdit_HTMLEdit" class="WebEdit_HTMLEdit" frameBorder="0" marginHeight="5" marginWidth="5"></iframe>',
                '</td>',
                '</tr>',
                '</tbody>',
                '</table>'
            ].join(""));
            cot = $(cot);
            cot.innerHTML = htmls.join("");
            var tags = cot.getElementsByTagName('*');
            for(var i = 0,tag,v_click,v_over;i<tags.length;i+=1){
                tag = tags[i];
                v_click = tag.getAttribute('v-click');
                if(v_click){
//                    console.log(v_click);
                    tag.onclick = sky.bind.apply(sky,[callFuns,null].concat(v_click.split(',')));
                }
                v_over = tag.getAttribute('v-mouseover');
                if(v_over){
//                    console.log(v_over);
                    tag.onmouseover = sky.bind.apply(sky,[callFuns,null].concat(v_over.split(',')));
                }
            }

            this.iframe = window.frames["WebEdit_HTMLEdit"];
            if(isMoz){
                this.iframe.onload = function(){
                    WebEdit.iframe.document.designMode="on";
                    WebEdit.iframe.document.execCommand("useCSS",false, true);
                }
            }
            else{
                this.iframe.document.designMode = "on";
            }
            //window obblur
            //FF
            if(!isIE){
                $("WebEdit_HTMLEdit").contentWindow.addEventListener("click",WebEdit.close,false);
            }
            else{//
                this.iframe.document.attachEvent("onclick",WebEdit.close);
            }
        },
        showCot:null,
        show:function(id){
            var c = $("WebEdit.Down." + id);
            this.close();
            this.showCot = c;
            if(this.showCot){
                this.showCot.style.display = "block";
            }
        },
        close:function(){
            if(WebEdit.showCot){
                WebEdit.showCot.style.display = "none";
                WebEdit.showCot = null;
            }
        },
        outClose:function(ev,id){
            ev = ev || window.event;
            var d = ev.target || ev.srcElement;
            if(d.getAttribute("id")==id){
                WebEdit.close();
            }
        },
        format:function(type, para){
            var sAlert = "";
            if(!isIE){
                switch(type){
                    case "Cut":
                        sAlert = "你的浏览器安全设置不允许编辑器自动执行剪切操作,请使用键盘快捷键(Ctrl+X)来完成";
                        break;
                    case "Copy":
                        sAlert = "你的浏览器安全设置不允许编辑器自动执行拷贝操作,请使用键盘快捷键(Ctrl+C)来完成";
                        break;
                    case "Paste":
                        sAlert = "你的浏览器安全设置不允许编辑器自动执行粘贴操作,请使用键盘快捷键(Ctrl+V)来完成";
                        break;
                }
            }
            if(sAlert != ""){
                alert(sAlert);
                return;
            }
            this.iframe.focus();
            if(!para){
                if(isIE){
                    this.iframe.document.execCommand(type);
                }
                else{
                    this.iframe.document.execCommand(type,false,false);
                }
            }
            else{
                this.iframe.document.execCommand(type,false,para);
            }
            this.close();
        },
        // 临时
        createLink:function() {
            var sURL=window.prompt("请输入网站地址:", "http://");
            if ((sURL!=null) && (sURL!="http://")){
                this.format("CreateLink", sURL);
            }
        },
        createImg:function(){
            var sPhoto=prompt("请输入图片位置:", "http://");
            if ((sPhoto!=null) && (sPhoto!="http://")){
                this.format("InsertImage", sPhoto);
            }
        },
        setHTML:function(str){
            this.iframe.document.body.innerHTML = str;
        },
        //去除HTML
        getHTML:function(){
            return this.iframe.document.body.innerHTML;
        },
        getText:function(){
            return this.iframe.document.body.textContent || this.iframe.document.body.innerText;
        },
        clear:function(){
            this.iframe.document.body.innerHTML = "";
            return this;
        }
    },WebEdit);

    WebEdit.htmlDeploys = {
        Cut:'<a v-click="format,Cut" id="WebEdit.Deploy.Cut" hidefocus="true" title="剪切" href="javascript:;" class="WebEdit_abtn WebEdit_a0" v-mouseover="show,Cut"></a>',
        Copy:'<a v-click="format,Copy" id="WebEdit.Deploy.Copy" hidefocus="true" title="复制" href="javascript:;" class="WebEdit_abtn WebEdit_a1" v-mouseover="show,Copy"></a>',
        Paste:'<a v-click="format,Paste" id="WebEdit.Deploy.Paste" hidefocus="true" title="粘贴" href="javascript:;" class="WebEdit_abtn WebEdit_a2" v-mouseover="show,Paste"></a>',
        "|":'<span class="WebEdit_split"></span>',
        fontface:[
            '<a id="WebEdit.Deploy.fontface" hidefocus="true" title="字体" href="javascript:;" class="WebEdit_abtn WebEdit_a3" v-mouseover="show,fontface"></a>',
            '<div id="WebEdit.Down.fontface" class="WebEdit_down");">',
            getFontFace(),
            '</div>'
        ].join(""),
        fontsize:[
            '<a v-mouseover="show,fontsize" id="WebEdit.Deploy.fontsize" hidefocus="true" title="字号" href="javascript:;" class="WebEdit_abtn WebEdit_a4"></a>',
            '<div id="WebEdit.Down.fontsize" class="WebEdit_down">',
            '<A v-click="format,fontsize,1" href="javascript:;" style="line-height: 120%; font-size: xx-small;">极小</A>',
            '<A v-click="format,fontsize,2" href="javascript:;" style="line-height: 120%; font-size: x-small;">特小</A>',
            '<A v-click="format,fontsize,3" href="javascript:;" style="line-height: 120%; font-size: small;">小</A>',
            '<A v-click="format,fontsize,4" href="javascript:;" style="line-height: 120%; font-size: medium;">中</A>',
            '<A v-click="format,fontsize,5" href="javascript:;" style="line-height: 120%; font-size: large;">大</A>',
            '<A v-click="format,fontsize,6" href="javascript:;" style="line-height: 120%; font-size: x-large;">特大</A>',
            '<A v-click="format,fontsize,7" href="javascript:;" style="line-height: 120%; font-size: xx-large;">极大</A>',
            '</div>'
        ].join(""),
        Bold:'<a v-click="format,Bold,1" v-mouseover="show,Bold" id="WebEdit.Deploy.Bold" hidefocus="true" title="加粗" href="javascript:;" class="WebEdit_abtn WebEdit_a5"></a>',
        Italic:'<a v-click="format,Italic,1" v-mouseover="show,Italic" id="WebEdit.Deploy.Italic" hidefocus="true" title="斜体" href="javascript:;" class="WebEdit_abtn WebEdit_a6"></a>',
        Underline:'<a v-click="format,Underline,1" v-mouseover="show,Underline" id="WebEdit.Deploy.Underline" hidefocus="true" title="下划线" href="javascript:;" class="WebEdit_abtn WebEdit_a7"></a>',
        Justifyleft:'<a v-click="format,Justifyleft,1" v-mouseover="show,Justifyleft" id="WebEdit.Deploy.Justifyleft" hidefocus="true" title="左对齐" href="javascript:;" class="WebEdit_abtn WebEdit_a8"></a>',
        Justifycenter:'<a v-click="format,Justifycenter,1" ov-mouseover="show,Justifycenter" id="WebEdit.Deploy.Justifycenter" hidefocus="true" title="居中对齐" href="javascript:;" class="WebEdit_abtn WebEdit_a9"></a>',
        Justifyright:'<a v-click="format,Justifyright,1" v-mouseover="show,Justifyright" id="WebEdit.Deploy.Justifyright" hidefocus="true" title="右对齐" href="javascript:;" class="WebEdit_abtn WebEdit_a10"></a>',
        Insertorderedlist:'<a v-click="format,Insertorderedlist,1" v-mouseover="show,Insertorderedlist" id="WebEdit.Deploy.Insertorderedlist" hidefocus="true" title="数字编号" href="javascript:;" class="WebEdit_abtn WebEdit_a11"></a>',
        Insertunorderedlist:'<a v-click="format,Insertunorderedlist,1" v-mouseover="show,Insertunorderedlist" id="WebEdit.Deploy.Insertunorderedlist" hidefocus="true" title="项目编号" href="javascript:;" class="WebEdit_abtn WebEdit_a12"></a>',
        Indent:'<a v-click="format,Indent,1" v-mouseover="show,Indent" id="WebEdit.Deploy.Outdent" hidefocus="true" title="增加缩进" href="javascript:;" class="WebEdit_abtn WebEdit_a13"></a>',
        Outdent:'<a v-click="format,Outdent,1" v-mouseover="show,Outdent" id="WebEdit.Deploy.Indent" hidefocus="true" title="减少缩进" href="javascript:;" class="WebEdit_abtn WebEdit_a14"></a>',
        foreColor:[
            '<a v-mouseover="show,foreColor" id="WebEdit.Deploy.foreColor" hidefocus="true" title="字体颜色" href="javascript:;" class="WebEdit_abtn WebEdit_a15"></a>',
            '<div id="WebEdit.Down.foreColor" class="WebEdit_down WebEdit_Color">',
            getColors("foreColor"),
            '</div>'
        ].join(""),
        backColor:[
            '<a v-mouseover="show,backColor" id="WebEdit.Deploy.backColor" hidefocus="true" title="背景颜色" href="javascript:;" class="WebEdit_abtn WebEdit_a16"></a>',
            '<DIV id="WebEdit.Down.backColor" class="WebEdit_down WebEdit_Color">',
            getColors("backColor"),
            '</DIV>'
        ].join(""),
        CreateLink:[
            '<a v-click="createLink" v-mouseover="show,CreateLink" id="WebEdit.Deploy.CreateLink" hidefocus="true" title="增加连接" href="javascript:;" class="WebEdit_abtn WebEdit_a17"></a>'
        ].join(""),
        CreateImg:[
            '<a v-click="createImg" v-mouseover="show,CreateImg" id="WebEdit.Deploy.CreateImg" hidefocus="true" title="增加图片" href="javascript:;" class="WebEdit_abtn WebEdit_a18"></a>'
        ].join(""),
        "-":[
            '</td></tr><tr><td nowrap="nowrap">'
        ].join("")
    };
});