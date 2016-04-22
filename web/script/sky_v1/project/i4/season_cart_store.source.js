sky.define('./project/i4/season_cart_store',['./data/comm'],function(require,exporets){
    var comm = require(0);
    
    var storeName = 'cart_list';
    var storeHeader = ['id','num'];
    var storeNumKey = 'num';
    var storeData = {};
    var length = 0;
    function getStoreDataKey(li){
        return li[0];
    }
    function getObjData(li){
        var key = getStoreDataKey(li);
		var rv = {};
		sky.forEach(storeHeader, function(v,i){
			rv[v] = li[i];
		});
        if(storeData[key]){
            storeData[key][storeNumKey] += rv[storeNumKey];
        }
        else{
            storeData[key] = rv;
            length += 1;
        }
	}
    function getArrData(data){
        var rv = [];
		sky.forEach(storeHeader, function(v){
			rv.push(data[v]);
		});
		return rv;
    }
    //初始化
    var init = function(){
        init = function(){};
        var arr = comm.JSON.parse(comm.store.getItem(storeName) || '[]') || [];
        sky.forEach(arr,getObjData);
    };
    
    //保存
    function save(){
        var arr = sky.forEach(storeData,getArrData,[]);
        comm.store.setItem(storeName,comm.JSON.stringify(arr));
    }
    
    exporets.get = function(){
        init();
        return storeData;
    };
    
    exporets.getKeys = function(){
        init();
        return sky.forEach(storeData,function(v,id){
            return id;
        },[]);
    };
    
    exporets.getItem = function(key){
        init();
        return storeData[key];
    };
    
    exporets.getLength = function(){
        init();
        return length;
    };
    
    exporets.addItem = function(){
        init();
        getObjData(arguments);
        save();
    };
    
    exporets.removeItem = function(key){
        init();
        if(typeof key != 'string'){
            key = getStoreDataKey(key);
        }
        if(storeData[key]){
            length -= 1;
            delete storeData[key];
            save();
        }
    };
    
    exporets.addNum = function(key,num){
        init();
        storeData[key][storeNumKey] += num;
        save();
    };
    
    exporets.setNum = function(key,num){
        storeData[key][storeNumKey] = num;
        save();
    };
    
});