/*!
 * drag-event-service v1.0.2
 * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.dragEventService = factory());
}(this, (function () { 'use strict';

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
  }

  var toConsumableArray = _toConsumableArray;

  /*!
   * helper-js v1.4.21
   * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
   * Released under the MIT License.
   */

  function onDOM(el, name, handler) {
    for (var _len6 = arguments.length, args = new Array(_len6 > 3 ? _len6 - 3 : 0), _key8 = 3; _key8 < _len6; _key8++) {
      args[_key8 - 3] = arguments[_key8];
    }

    if (el.addEventListener) {
      // 所有主流浏览器，除了 IE 8 及更早 IE版本
      el.addEventListener(name, handler, ...args);
    } else if (el.attachEvent) {
      // IE 8 及更早 IE 版本
      el.attachEvent("on".concat(name), handler, ...args);
    }
  }
  function offDOM(el, name, handler) {
    for (var _len7 = arguments.length, args = new Array(_len7 > 3 ? _len7 - 3 : 0), _key9 = 3; _key9 < _len7; _key9++) {
      args[_key9 - 3] = arguments[_key9];
    }

    if (el.removeEventListener) {
      // 所有主流浏览器，除了 IE 8 及更早 IE版本
      el.removeEventListener(name, handler, ...args);
    } else if (el.detachEvent) {
      // IE 8 及更早 IE 版本
      el.detachEvent("on".concat(name), handler, ...args);
    }
  }

  var events = {
    start: ['mousedown', 'touchstart'],
    move: ['mousemove', 'touchmove'],
    end: ['mouseup', 'touchend']
  };
  var index = {
    isTouch: function isTouch(e) {
      return e.type && e.type.startsWith('touch');
    },
    _getStore: function _getStore(el) {
      if (!el._wrapperStore) {
        el._wrapperStore = [];
      }

      return el._wrapperStore;
    },
    on: function on(el, name, handler, options) {
      var _hp$onDOM, _hp$onDOM2;

      var _resolveOptions = resolveOptions(options),
          args = _resolveOptions.args,
          mouseArgs = _resolveOptions.mouseArgs,
          touchArgs = _resolveOptions.touchArgs;

      var store = this._getStore(el);

      var ts = this;

      var wrapper = function wrapper(e) {
        var mouse;
        var isTouch = ts.isTouch(e);

        if (isTouch) {
          // touch
          mouse = {
            x: e.changedTouches[0].pageX,
            y: e.changedTouches[0].pageY
          };
        } else {
          // mouse
          mouse = {
            x: e.pageX,
            y: e.pageY
          };

          if (name === 'start' && e.which !== 1) {
            // not left button mousedown
            return;
          }
        }

        return handler.call(this, e, mouse);
      };

      store.push({
        handler: handler,
        wrapper: wrapper
      }); // follow format will cause big bundle size
      // 以下写法将会使打包工具认为hp是上下文, 导致打包整个hp
      // hp.onDOM(el, events[name][0], wrapper, ...args)

      (_hp$onDOM = onDOM).call.apply(_hp$onDOM, [null, el, events[name][0], wrapper].concat([].concat(toConsumableArray(args), toConsumableArray(mouseArgs))));

      (_hp$onDOM2 = onDOM).call.apply(_hp$onDOM2, [null, el, events[name][1], wrapper].concat([].concat(toConsumableArray(args), toConsumableArray(touchArgs))));
    },
    off: function off(el, name, handler, options) {
      var _resolveOptions2 = resolveOptions(options),
          args = _resolveOptions2.args,
          mouseArgs = _resolveOptions2.mouseArgs;

      var store = this._getStore(el);

      for (var i = store.length - 1; i >= 0; i--) {
        var _store$i = store[i],
            handler2 = _store$i.handler,
            wrapper = _store$i.wrapper;

        if (handler === handler2) {
          var _hp$offDOM, _hp$offDOM2;

          (_hp$offDOM = offDOM).call.apply(_hp$offDOM, [null, el, events[name][0], wrapper].concat([].concat(toConsumableArray(args), toConsumableArray(mouseArgs))));

          (_hp$offDOM2 = offDOM).call.apply(_hp$offDOM2, [null, el, events[name][1], wrapper].concat([].concat(toConsumableArray(args), toConsumableArray(mouseArgs))));

          store.splice(i, 1);
        }
      }
    }
  };

  function resolveOptions(options) {
    if (!options) {
      options = {};
    }

    var args = options.args || [];
    var mouseArgs = options.mouseArgs || [];
    var touchArgs = options.touchArgs || [];
    return {
      args: args,
      mouseArgs: mouseArgs,
      touchArgs: touchArgs
    };
  }

  return index;

})));
