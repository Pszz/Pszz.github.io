sky.define('./data/storage',function(require,exporets){
    exporets.verson = '1.0.0';
    var storage = window.localStorage || function(){
        var userData,name = document.location.hostname;
        var init = function(){
            init = function(){
                userData.load(name);
            };
            userData = document.createElement('input');
            userData.type = 'hidden';
            userData.style.display = 'none';
            userData.addBehavior ("#default#userData");
            document.body.appendChild(userData);
            init();
        };
        
        return {
            //设置存储数据
            setItem:function(key,value){
                init();
                userData.setAttribute(key, value);
                userData.save(name);
            },
            getItem:function(key){
                init();
                return userData.getAttribute(key);
            },
            removeItem:function(key){
                init();
                userData.removeAttribute(key);
                userData.save(name);
            }
        };
    }();
    
    exporets.setItem = storage.setItem;
    exporets.getItem = storage.getItem;
    exporets.removeItem = storage.removeItem;
});