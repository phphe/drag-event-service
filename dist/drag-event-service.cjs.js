/*!
 * drag-event-service v0.0.6
 * (c) 2018-present phphe <phphe@outlook.com> (https://github.com/phphe)
 * Released under the MIT License.
 */
'use strict';

var hp = require('helper-js');

// support desktop and mobile
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
  on: function on(el, name, handler) {
    var _hp$onDOM, _hp$onDOM2;

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

    for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    (_hp$onDOM = hp.onDOM).call.apply(_hp$onDOM, [null, el, events[name][0], wrapper].concat(args));

    (_hp$onDOM2 = hp.onDOM).call.apply(_hp$onDOM2, [null, el, events[name][1], wrapper].concat(args));
  },
  off: function off(el, name, handler) {
    var store = this._getStore(el);

    for (var _len2 = arguments.length, args = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      args[_key2 - 3] = arguments[_key2];
    }

    for (var i = store.length - 1; i >= 0; i--) {
      var _store$i = store[i],
          handler2 = _store$i.handler,
          wrapper = _store$i.wrapper;

      if (handler === handler2) {
        var _hp$offDOM, _hp$offDOM2;

        (_hp$offDOM = hp.offDOM).call.apply(_hp$offDOM, [null, el, events[name][0], wrapper].concat(args));

        (_hp$offDOM2 = hp.offDOM).call.apply(_hp$offDOM2, [null, el, events[name][1], wrapper].concat(args));

        store.splice(i, 1);
      }
    }
  }
};

module.exports = index;
