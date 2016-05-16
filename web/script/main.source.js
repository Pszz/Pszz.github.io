
sky.use(["dom"],function($$){
     //绑定首页跳转数据
    (function(){
        var domList = $$.get("#head-tab a"),
            path = "/page/"; //网页存放page下面，除了首页
        for(var i = 0; i < domList.length; i++){
           domList[i].onclick = function(){
              var uri = this.getAttribute("v") || "";
              if(uri){
                 uri = API.config.rootPath + path + uri;
              }
                 
           };
        }         
    }());
  
    
});