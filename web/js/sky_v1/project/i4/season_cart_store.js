sky.define("./project/i4/season_cart_store",["./data/comm"],function(t,o){function e(t){return t[0]}function n(t){var o=e(t),n={};sky.forEach(a,function(o,e){n[o]=t[e]}),f[o]?f[o][u]+=n[u]:(f[o]=n,p+=1)}function r(t){var o=[];return sky.forEach(a,function(e){o.push(t[e])}),o}function s(){var t=sky.forEach(f,r,[]);i.store.setItem(c,i.JSON.stringify(t))}var i=t(0),c="cart_list",a=["id","num"],u="num",f={},p=0,m=function(){m=function(){};var t=i.JSON.parse(i.store.getItem(c)||"[]")||[];sky.forEach(t,n)};o.get=function(){return m(),f},o.getKeys=function(){return m(),sky.forEach(f,function(t,o){return o},[])},o.getItem=function(t){return m(),f[t]},o.getLength=function(){return m(),p},o.addItem=function(){m(),n(arguments),s()},o.removeItem=function(t){m(),"string"!=typeof t&&(t=e(t)),f[t]&&(p-=1,delete f[t],s())},o.addNum=function(t,o){m(),f[t][u]+=o,s()},o.setNum=function(t,o){f[t][u]=o,s()}});