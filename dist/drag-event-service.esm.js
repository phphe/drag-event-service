/*!
 * drag-event-service v1.0.3
 * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
 * Released under the MIT License.
 */
import { onDOM, offDOM } from 'helper-js';

// support desktop and mobile
var events = {
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
    var {
      args,
      mouseArgs,
      touchArgs
    } = resolveOptions(options);

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
      handler,
      wrapper
    }); // follow format will cause big bundle size
    // 以下写法将会使打包工具认为hp是上下文, 导致打包整个hp
    // hp.onDOM(el, events[name][0], wrapper, ...args)

    onDOM.call(null, el, events[name][0], wrapper, ...[...args, ...mouseArgs]);
    onDOM.call(null, el, events[name][1], wrapper, ...[...args, ...touchArgs]);
  },

  off(el, name, handler, options) {
    var {
      args,
      mouseArgs,
      touchArgs
    } = resolveOptions(options);

    var store = this._getStore(el);

    for (var i = store.length - 1; i >= 0; i--) {
      var {
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

  var args = options.args || [];
  var mouseArgs = options.mouseArgs || [];
  var touchArgs = options.touchArgs || [];
  return {
    args,
    mouseArgs,
    touchArgs
  };
}

export default index;
