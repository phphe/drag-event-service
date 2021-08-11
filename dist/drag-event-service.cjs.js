/*!
 * drag-event-service v1.1.10
 * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
 * Homepage: null
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var hp = require('helper-js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
var hp__namespace = /*#__PURE__*/_interopNamespace(hp);

var events = {
  start: ['mousedown', 'touchstart'],
  move: ['mousemove', 'touchmove'],
  end: ['mouseup', 'touchend']
};
var DragEventService = {
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
          y: e.changedTouches[0].pageY,
          pageX: e.changedTouches[0].pageX,
          pageY: e.changedTouches[0].pageY,
          clientX: e.changedTouches[0].clientX,
          clientY: e.changedTouches[0].clientY,
          screenX: e.changedTouches[0].screenX,
          screenY: e.changedTouches[0].screenY
        };
      } else {
        // mouse
        mouse = {
          x: e.pageX,
          y: e.pageY,
          pageX: e.pageX,
          pageY: e.pageY,
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY
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

    (_hp$onDOM = hp__namespace.onDOM).call.apply(_hp$onDOM, [null, el, events[name][0], wrapper].concat([].concat(_toConsumableArray__default['default'](args), _toConsumableArray__default['default'](mouseArgs))));

    (_hp$onDOM2 = hp__namespace.onDOM).call.apply(_hp$onDOM2, [null, el, events[name][1], wrapper].concat([].concat(_toConsumableArray__default['default'](args), _toConsumableArray__default['default'](touchArgs))));
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

        (_hp$offDOM = hp__namespace.offDOM).call.apply(_hp$offDOM, [null, el, events[name][0], wrapper].concat([].concat(_toConsumableArray__default['default'](args), _toConsumableArray__default['default'](mouseArgs))));

        (_hp$offDOM2 = hp__namespace.offDOM).call.apply(_hp$offDOM2, [null, el, events[name][1], wrapper].concat([].concat(_toConsumableArray__default['default'](args), _toConsumableArray__default['default'](mouseArgs))));

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

function trackMouseOrTouchPosition() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var trackedInfo = {
    position: {}
  };

  var update = function update(name, e) {
    var isTouch = DragEventService.isTouch(e);

    if (isTouch) {
      // touch
      Object.assign(trackedInfo.position, {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY,
        pageX: e.changedTouches[0].pageX,
        pageY: e.changedTouches[0].pageY,
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY,
        screenX: e.changedTouches[0].screenX,
        screenY: e.changedTouches[0].screenY
      });
    } else {
      // mouse
      Object.assign(trackedInfo.position, {
        x: e.pageX,
        y: e.pageY,
        pageX: e.pageX,
        pageY: e.pageY,
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY
      });
    }

    if (name === 'start') {
      trackedInfo.startEvent = e;
    } else if (name === 'end') {
      trackedInfo.endEvent = e;
    }

    Object.assign(trackedInfo, {
      event: e,
      isTouch: isTouch,
      eventType: name
    });
  };

  var onStart = function onStart(e) {
    var isTouch = DragEventService.isTouch(e);

    if (!isTouch && e.which !== 1) {
      // not left button mousedown
      return;
    }

    update('start', e);

    if (options.onStart) {
      options.onStart();
    }
  };

  var onMove = function onMove(e) {
    update('move', e);

    if (options.onMove) {
      options.onMove();
    }
  };

  var onEnd = function onEnd(e) {
    update('end', e);

    if (options.onEnd) {
      options.onEnd();
    }
  };

  var start = function start() {
    DragEventService.on(document, 'start', onStart);
    DragEventService.on(document, 'move', onMove);
    DragEventService.on(window, 'end', onEnd);
    trackedInfo.started = true;
  };

  var stop = function stop() {
    DragEventService.off(document, 'start', onStart);
    DragEventService.off(document, 'move', onMove);
    DragEventService.off(window, 'end', onEnd);
    trackedInfo.started = false;
  };

  return {
    info: trackedInfo,
    start: start,
    stop: stop
  };
}

exports['default'] = DragEventService;
exports.trackMouseOrTouchPosition = trackMouseOrTouchPosition;
