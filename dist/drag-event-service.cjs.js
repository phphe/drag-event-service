/*!
 * drag-event-service v0.0.3
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
  canTouch: function canTouch() {
    return 'ontouchstart' in document.documentElement;
  },
  _getStore: function _getStore(el) {
    if (!el._wrapperStore) {
      el._wrapperStore = [];
    }

    return el._wrapperStore;
  },
  on: function on(el, name, handler) {
    var store = this._getStore(el);

    var canTouch = this.canTouch();

    var wrapper = function wrapper(e) {
      var mouse;

      if (!canTouch) {
        if (name === 'start' && e.which !== 1) {
          // not left button
          return;
        }

        mouse = {
          x: e.pageX,
          y: e.pageY
        };
      } else {
        mouse = {
          x: e.changedTouches[0].pageX,
          y: e.changedTouches[0].pageY
        };
      }

      return handler.call(this, e, mouse);
    };

    store.push({
      handler: handler,
      wrapper: wrapper
    });
    hp.onDOM(el, events[name][canTouch ? 1 : 0], wrapper);
  },
  off: function off(el, name, handler) {
    var store = this._getStore(el);

    var canTouch = this.canTouch();
    var eventName = events[name][canTouch ? 1 : 0];

    for (var i = store.length - 1; i >= 0; i--) {
      var _store$i = store[i],
          handler2 = _store$i.handler,
          wrapper = _store$i.wrapper;

      if (handler === handler2) {
        hp.offDOM(el, eventName, wrapper);
        store.splice(i, 1);
      }
    }
  }
};

module.exports = index;
