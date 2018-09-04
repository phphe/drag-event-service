/*!
 * drag-event-service v0.0.4
 * (c) 2018-present phphe <phphe@outlook.com> (https://github.com/phphe)
 * Released under the MIT License.
 */
import * as hp from 'helper-js';
import { onDOM, offDOM } from 'helper-js';

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
    var store = this._getStore(el);

    var wrapper = function wrapper(e) {
      var mouse;
      var isTouch = this.isTouch(e);

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
    });

    for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    onDOM.apply(hp, [el, events[name][0], wrapper].concat(args));
    onDOM.apply(hp, [el, events[name][1], wrapper].concat(args));
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
        offDOM.apply(hp, [el, events[name][0], wrapper].concat(args));
        offDOM.apply(hp, [el, events[name][1], wrapper].concat(args));
        store.splice(i, 1);
      }
    }
  }
};

export default index;
