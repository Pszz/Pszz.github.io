sky.define('./project/i4/webdev',['./connect/ajax'],function(require,webdev){
    webdev.version = '1.0.0';
    var devHost = 'http://' + window.location.host;
    webdev.setHost = function(host){
        devHost = host;
    };
    var ajax = reqwuire(0);
    // 查询
    webdev.propfind = function (url, callBack) {
        var a = ajax.create(url, "PROPFIND", true).extra("oncallback", callBack).extra("oncensor", onCensor);
        a.setRequestHeader("Content-Type","text/xml; charset=\"utf-8\"");
        a.setRequestHeader("Depth","1");
        return a.send(null, true);
    };
    // 
    webdev.mlcol = function (url, callBack) {
        return ajax.create(url, "MKCOL", true).extra("oncallback", callBack).extra("oncensor", onCensor).send();
    };
    //删除
    webdev.del = function (url, callBack) {
        return ajax.create(url, "DELETE", true).extra("oncallback", callBack).extra("oncensor", onCensor).send();
    };
    function movecopy(type, form, to, callBack, overflow) {
        var a = ajax.create(form, type, true).extra("oncallback", callBack).extra("oncensor", onCensor);
        a.setRequestHeader('Destination',host + to);
        a.setRequestHeader('Depth','1');
        if (overflow == null) {
            a.setRequestHeader('Overwrite','F');
        }
        return a.send();
    }
    // 移动
    webdev.move = function (form, to, callBack, overflow) {
        return movecopy("MOVE", form, to, callBack, overflow);
    };
    // 复制
    webdev.copy = function (form, to, callBack, overflow) {
        return movecopy("COPY", form, to, callBack, overflow);
    };
});