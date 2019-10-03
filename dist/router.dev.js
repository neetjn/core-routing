// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"2j8W":[function(require,module,exports) {
var define;
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Memoize(hashFunction) {
        return function (target, propertyKey, descriptor) {
            if (descriptor.value != null) {
                descriptor.value = getNewFunction(descriptor.value, hashFunction);
            }
            else if (descriptor.get != null) {
                descriptor.get = getNewFunction(descriptor.get, hashFunction);
            }
            else {
                throw 'Only put a Memoize() decorator on a method or get accessor.';
            }
        };
    }
    exports.Memoize = Memoize;
    var counter = 0;
    function getNewFunction(originalMethod, hashFunction) {
        var identifier = ++counter;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var propValName = "__memoized_value_" + identifier;
            var propMapName = "__memoized_map_" + identifier;
            var returnedValue;
            if (hashFunction || args.length > 0) {
                if (!this.hasOwnProperty(propMapName)) {
                    Object.defineProperty(this, propMapName, {
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: new Map()
                    });
                }
                var myMap = this[propMapName];
                var hashKey = void 0;
                if (hashFunction) {
                    hashKey = hashFunction.apply(this, args);
                }
                else {
                    hashKey = args[0];
                }
                if (myMap.has(hashKey)) {
                    returnedValue = myMap.get(hashKey);
                }
                else {
                    returnedValue = originalMethod.apply(this, args);
                    myMap.set(hashKey, returnedValue);
                }
            }
            else {
                if (this.hasOwnProperty(propValName)) {
                    returnedValue = this[propValName];
                }
                else {
                    returnedValue = originalMethod.apply(this, args);
                    Object.defineProperty(this, propValName, {
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: returnedValue
                    });
                }
            }
            return returnedValue;
        };
    }
});

},{}],"C9JJ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = void 0;
var Config = {
  settings: {
    hash: '#!',
    wildcard: '*'
  },
  regex: {
    settings: {
      default: /[a-zA-Z0-9]/g,
      href: /(www|http:|https:)+[^\s]+[\w]/g
    },
    routes: {
      variables: /(:(?!qargs)[a-zA-Z]*)/g
    }
  },
  intervals: {
    start: 10,
    listener: 250
  }
};
exports.Config = Config;
},{}],"N8lG":[function(require,module,exports) {
"use strict";

var _typescriptMemoize = require("typescript-memoize");

var _config = require("./config");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var memoizeRTKey = function memoizeRTKey(route, source) {
  return route + ":" + source;
};

var RouterTools = function () {
  function RouterTools(config) {
    this.config = config;
  }

  RouterTools.prototype.inspect = function (route, source) {
    var parts;
    var query = '';
    var fragment = '';

    if (route !== '/') {
      parts = route.split('/');
      var trailing = parts.slice(-1)[0];

      if (trailing.split('#').length > 1) {
        fragment = trailing.split('#')[1];
      }

      if (trailing.indexOf('?') !== -1) {
        query = trailing.split('?')[1].split('#')[0];
      }

      parts = parts.join('/').split('?')[0].split('/').slice(1);
    } else {
      parts = ['/'];
    }

    return {
      route: parts,
      query: query,
      fragment: fragment,
      source: source !== '/' ? source.split('/').slice(1) : [source]
    };
  };

  RouterTools.prototype.match = function (route, source) {
    if (source !== this.config.settings.wildcard) {
      var result = this.inspect(route, source);

      if (result.route.length === result.source.length) {
        for (var i in result.source) {
          if (!result.source[i].startsWith(':') && result.route[i] !== result.source[i]) {
            return false;
          }
        }
      } else {
        return false;
      }
    }

    return true;
  };

  RouterTools.prototype.process = function (route, source) {
    var result = this.inspect(route, source);
    var variables = {};
    var args = {};
    result.source.forEach(function (part, i) {
      if (part.startsWith(':')) {
        var name = part.slice(1);
        var value = result.route[i];
        variables[name] = value;
      }
    });

    if (result.query) {
      var query = result.query.split('&');
      query.forEach(function (arg) {
        var temp = arg.split('=');

        if (temp.length === 2) {
          args[temp[0]] = temp[1];
        }
      });
    }

    return {
      result: result,
      variables: variables,
      args: args
    };
  };

  __decorate([(0, _typescriptMemoize.Memoize)(memoizeRTKey)], RouterTools.prototype, "inspect", null);

  __decorate([(0, _typescriptMemoize.Memoize)(memoizeRTKey)], RouterTools.prototype, "match", null);

  __decorate([(0, _typescriptMemoize.Memoize)(memoizeRTKey)], RouterTools.prototype, "process", null);

  return RouterTools;
}();

var Router = function () {
  function Router(args) {
    this.config = Object.assign(args.config || {}, _config.Config);
    this.client = args.client;
    this.running = false;
    this.legacySupport = !('onpopstate' in window);
    this.$tools = new RouterTools(this.config);
    this.$previous = {
      path: '',
      hash: '',
      href: ''
    };
  }

  Object.defineProperty(Router.prototype, "$location", {
    get: function get() {
      var path = '';
      var hash = window.location.hash;

      if (hash.split(this.config.settings.hash).length > 1) {
        path = hash.split(this.config.settings.hash)[1];

        if (!path.startsWith('/')) {
          path = "/" + path;
        }
      }

      return {
        path: path,
        hash: hash,
        href: window.location.href
      };
    },
    enumerable: true,
    configurable: true
  });

  Router.prototype.watch = function () {
    if (this.running) {
      if (this.legacySupport && JSON.stringify(this.$location) === JSON.stringify(this.$previous)) {
        return;
      }

      if (this.client && this.client.onNavigate) {
        this.client.onNavigate({
          $tools: this.$tools,
          location: this.$location,
          previous: this.$previous
        });
      }

      this.$previous = this.$location;
    }
  };

  Router.prototype.start = function () {
    if (!this.running) {
      this.running = true;
      this.$previous = this.$location;

      if (this.client && this.client.onStart) {
        this.client.onStart({
          $tools: this.$tools,
          location: this.$location
        });
      }

      if (this.legacySupport) {
        setInterval(this.watch.bind(this), this.config.intervals.listener);
      } else {
        window.addEventListener('popstate', this.watch.bind(this));
      }
    }
  };

  Router.prototype.stop = function () {
    if (this.running) {
      this.running = false;

      if (this.client && this.client.onStop) {
        this.client.onStop({
          $tools: this.$tools,
          location: this.$location
        });
      }

      if (this.legacySupport) {
        window.removeEventListener('popstate', this.watch);
      } else {
        window.clearInterval(this.listenerKey);
      }
    }
  };

  return Router;
}();

module.exports = Router;
},{"typescript-memoize":"2j8W","./config":"C9JJ"}]},{},["N8lG"], "Router")
//# sourceMappingURL=/router.dev.js.map