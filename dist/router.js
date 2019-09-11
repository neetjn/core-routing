parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"2j8W":[function(require,module,exports) {
var define;
var e;!function(t){if("object"==typeof module&&"object"==typeof module.exports){var r=t(require,exports);void 0!==r&&(module.exports=r)}else"function"==typeof e&&e.amd&&e(["require","exports"],t)}(function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Memoize=function(e){return function(t,r,i){if(null!=i.value)i.value=o(i.value,e);else{if(null==i.get)throw"Only put a Memoize() decorator on a method or get accessor.";i.get=o(i.get,e)}}};var r=0;function o(e,t){var o=++r;return function(){for(var r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];var a,n="__memoized_value_"+o,u="__memoized_map_"+o;if(t||r.length>0){this.hasOwnProperty(u)||Object.defineProperty(this,u,{configurable:!1,enumerable:!1,writable:!1,value:new Map});var l=this[u],s=void 0;s=t?t.apply(this,r):r[0],l.has(s)?a=l.get(s):(a=e.apply(this,r),l.set(s,a))}else this.hasOwnProperty(n)?a=this[n]:(a=e.apply(this,r),Object.defineProperty(this,n,{configurable:!1,enumerable:!1,writable:!1,value:a}));return a}}});
},{}],"C9JJ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Config=void 0;var e={settings:{hash:"#!",wildcard:"*"},regex:{settings:{default:/[a-zA-Z0-9]/g,href:/(www|http:|https:)+[^\s]+[\w]/g},routes:{variables:/(:(?!qargs)[a-zA-Z]*)/g}},intervals:{start:10,listener:250}};exports.Config=e;
},{}],"N8lG":[function(require,module,exports) {
"use strict";var t=require("typescript-memoize"),i=require("./config");function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var n=function(t,i,n,o){var s,r=arguments.length,c=r<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,n):o;if("object"===("undefined"==typeof Reflect?"undefined":e(Reflect))&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,i,n,o);else for(var l=t.length-1;l>=0;l--)(s=t[l])&&(c=(r<3?s(c):r>3?s(i,n,c):s(i,n))||c);return r>3&&c&&Object.defineProperty(i,n,c),c},o=function(){function i(t){this.config=t}return i.prototype.inspect=function(t,i){var e=t.split("/"),n="",o="";if(e.length>1){var s=e.slice(-1)[0];s.split("#").length>1&&(o=s.split("#")[1]),-1!==s.indexOf("?")&&(n=s.split("?")[1].split("#")[0]),e=e.join("/").split("?")[0].split("/").slice(1)}else e=["/"];return{route:e,query:n,fragment:o,source:"/"!==i?i.split("/").slice(1):[i]}},i.prototype.match=function(t,i){if(i!==this.config.settings.wildcard){var e=this.inspect(t,i);if(e.route.length!==e.source.length)return!1;for(var n in e.source)if(!e.source[n].startsWith(":")&&e.route[n]!==e.source[n])return!1}return!0},i.prototype.process=function(t,i){var e=this.inspect(t,i),n={},o={};(e.source.forEach(function(t,i){if(t.startsWith(":")){var o=t.slice(1),s=e.route[i];n[o]=s}}),e.query)&&e.query.split("&").forEach(function(t){var i=t.split("=");2===i.length&&(o[i[0]]=i[1])});return{result:e,variables:n,args:o}},n([(0,t.Memoize)()],i.prototype,"process",null),i}(),s=function(){function t(t){this.config=Object.assign(t.config||{},i.Config),this.client=t.client,this.running=!1,this.legacySupport=!("onpopstate"in window),this.$tools=new o(this.config),this.$previous={path:"",hash:"",href:""}}return Object.defineProperty(t.prototype,"$location",{get:function(){var t="",i=window.location.hash;return i.split(this.config.settings.hash).length>1&&((t=i.split(this.config.settings.hash)[1]).startsWith("/")||(t="/"+t)),{path:t,hash:i,href:window.location.href}},enumerable:!0,configurable:!0}),t.prototype.watch=function(){this.running&&this.client&&this.client.onNavigate&&(this.client.onNavigate({$tools:this.$tools,location:this.$location,previous:this.$previous}),this.$previous=this.$location)},t.prototype.start=function(){this.running||(this.running=!0,this.client&&this.client.onStart&&this.client.onStart({$tools:this.$tools,location:this.$location}),this.legacySupport?setInterval(this.watch,this.config.intervals.listener):window.addEventListener("popstate",this.watch.bind(this)))},t.prototype.stop=function(){this.running&&(this.running=!1,this.client&&this.client.onStop&&this.client.onStop({$tools:this.$tools}),this.legacySupport?window.removeEventListener("popstate",this.watch):window.clearInterval(this.listenerKey))},t}();module.exports=s;
},{"typescript-memoize":"2j8W","./config":"C9JJ"}]},{},["N8lG"], "Router")
//# sourceMappingURL=/router.js.map