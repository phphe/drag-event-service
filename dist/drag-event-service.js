/*!
* drag-event-service v1.0.1
* (c) phphe <phphe@outlook.com> (https://github.com/phphe)
* Released under the MIT License.
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.dragEventService = {}));
}(this, (function (exports) { 'use strict';

  /*!
  * helper-js v1.4.14
  * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
  * Released under the MIT License.
  */


  function onDOM(el, name, handler) {
    for (var _len6 = arguments.length, args = new Array(_len6 > 3 ? _len6 - 3 : 0), _key8 = 3; _key8 < _len6; _key8++) {
      args[_key8 - 3] = arguments[_key8];
    }

    if (el.addEventListener) {
      // 所有主流浏览器，除了 IE 8 及更早 IE版本
      el.addEventListener.apply(el, [name, handler].concat(args));
    } else if (el.attachEvent) {
      // IE 8 及更早 IE 版本
      el.attachEvent.apply(el, ["on".concat(name), handler].concat(args));
    }
  }

  function offDOM(el, name, handler) {
    for (var _len7 = arguments.length, args = new Array(_len7 > 3 ? _len7 - 3 : 0), _key9 = 3; _key9 < _len7; _key9++) {
      args[_key9 - 3] = arguments[_key9];
    }

    if (el.removeEventListener) {
      // 所有主流浏览器，除了 IE 8 及更早 IE版本
      el.removeEventListener.apply(el, [name, handler].concat(args));
    } else if (el.detachEvent) {
      // IE 8 及更早 IE 版本
      el.detachEvent.apply(el, ["on".concat(name), handler].concat(args));
    }
  }

  // support desktop and mobile
  const events = {
    start: ['mousedown', 'touchstart'],
    move: ['mousemove', 'touchmove'],
    end: ['mouseup', 'touchend']
  };
  var index = {
    isTouch(e) {
      return e.type && e.type.startsWith('touch');
    },

    _getStore(el) {
      if (!el._wrapperStore) {
        el._wrapperStore = [];
      }

      return el._wrapperStore;
    },

    on(el, name, handler, options) {
      const {
        args,
        mouseArgs,
        touchArgs
      } = resolveOptions(options);

      const store = this._getStore(el);

      const ts = this;

      const wrapper = function (e) {
        let mouse;
        const isTouch = ts.isTouch(e);

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
        handler,
        wrapper
      }); // follow format will cause big bundle size
      // 以下写法将会使打包工具认为hp是上下文, 导致打包整个hp
      // hp.onDOM(el, events[name][0], wrapper, ...args)

      onDOM.call(null, el, events[name][0], wrapper, ...[...args, ...mouseArgs]);
      onDOM.call(null, el, events[name][1], wrapper, ...[...args, ...touchArgs]);
    },

    off(el, name, handler, options) {
      const {
        args,
        mouseArgs,
        touchArgs
      } = resolveOptions(options);

      const store = this._getStore(el);

      for (let i = store.length - 1; i >= 0; i--) {
        const {
          handler: handler2,
          wrapper
        } = store[i];

        if (handler === handler2) {
          offDOM.call(null, el, events[name][0], wrapper, ...[...args, ...mouseArgs]);
          offDOM.call(null, el, events[name][1], wrapper, ...[...args, ...mouseArgs]);
          store.splice(i, 1);
        }
      }
    }

  };

  function resolveOptions(options) {
    if (!options) {
      options = {};
    }

    const args = options.args || [];
    const mouseArgs = options.mouseArgs || [];
    const touchArgs = options.touchArgs || [];
    return {
      args,
      mouseArgs,
      touchArgs
    };
  }

  exports.default = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
