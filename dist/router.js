parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"C9JJ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Config={settings:{hash:"#!",timeout:5e3},regex:{settings:{default:/[a-zA-Z0-9]/g,href:/(www|http:|https:)+[^\s]+[\w]/g},routes:{variables:/(:(?!qargs)[a-zA-Z]*)/g}},intervals:{start:10,fragments:250}};
},{}],"N8lG":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("./config"),i=function(){function i(i){this.config=i.config||t.Config,this.client=i.client,this.running=!1,Object.defineProperty(this,"location",{get:function(){return{hash:window.location.hash,href:window.location.href}},set:function(t){window.history.pushState(null,null,t)}})}return i.prototype.watch=function(){this.running&&this.client&&this.client.onNavigate&&this.client.onNavigate({router:this,location:this.location,previous:this.previous})},i.prototype.start=function(){this.running||(this.client&&this.client.onStart&&this.client.onStart({router:this}),window.addEventListener("hashchange",this.watch))},i.prototype.stop=function(){this.running&&(this.running=!1,this.client&&this.client.onStop&&this.client.onStop({router:this}),window.removeEventListener("hashchange",this.watch))},i}();exports.Router=i;
},{"./config":"C9JJ"}]},{},["N8lG"], null)
//# sourceMappingURL=/router.js.map