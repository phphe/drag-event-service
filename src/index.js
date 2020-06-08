// support desktop and mobile
// support start, move, end
// the second argument is mouse{x, y}
import * as hp from 'helper-js'

const events = {
  start: ['mousedown', 'touchstart'],
  move: ['mousemove', 'touchmove'],
  end: ['mouseup', 'touchend'],
}
const DragEventService = {
  isTouch(e) {
    return e.type && e.type.startsWith('touch')
  },
  _getStore(el) {
    if (!el._wrapperStore) {
      el._wrapperStore = []
    }
    return el._wrapperStore
  },
  on(el, name, handler, options) {
    const {args, mouseArgs, touchArgs} = resolveOptions(options)
    const store  = this._getStore(el)
    const ts  = this
    const wrapper = function (e) {
      let mouse
      const isTouch = ts.isTouch(e)
      if (isTouch) {
        // touch
        mouse = {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY,
          pageX: e.changedTouches[0].pageX,
          pageY: e.changedTouches[0].pageY,
          clientX: e.changedTouches[0].clientX,
          clientY: e.changedTouches[0].clientY,
          screenX: e.changedTouches[0].screenX,
          screenY: e.changedTouches[0].screenY,
        }
      } else {
        // mouse
        mouse = {x: e.pageX, y: e.pageY,
          pageX: e.pageX,
          pageY: e.pageY,
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
        }
        if (name === 'start' && e.which !== 1) {
          // not left button mousedown
          return
        }
      }
      return handler.call(this, e, mouse)
    }
    store.push({handler, wrapper})
    // follow format will cause big bundle size
    // 以下写法将会使打包工具认为hp是上下文, 导致打包整个hp
    // hp.onDOM(el, events[name][0], wrapper, ...args)
    hp.onDOM.call(null, el, events[name][0], wrapper, ...[...args, ...mouseArgs])
    hp.onDOM.call(null, el, events[name][1], wrapper, ...[...args, ...touchArgs])
  },
  off(el, name, handler, options) {
    const {args, mouseArgs, touchArgs} = resolveOptions(options)
    const store  = this._getStore(el)
    for (let i = store.length - 1; i >= 0; i--) {
      const {handler: handler2, wrapper} = store[i]
      if (handler === handler2) {
        hp.offDOM.call(null, el, events[name][0], wrapper, ...[...args, ...mouseArgs])
        hp.offDOM.call(null, el, events[name][1], wrapper, ...[...args, ...mouseArgs])
        store.splice(i, 1)
      }
    }
  },
}

export default DragEventService

function resolveOptions(options) {
  if (!options) {
    options = {}
  }
  const args = options.args || []
  const mouseArgs = options.mouseArgs || []
  const touchArgs = options.touchArgs || []
  return {args, mouseArgs, touchArgs}
}

export function trackMouseOrTouchPosition(options = {}) {
  const trackedInfo = {
    position: {},
  }
  const update = (name, e) => {
    const isTouch = DragEventService.isTouch(e)
    if (isTouch) {
      // touch
      Object.assign(trackedInfo.position, {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY,
        pageX: e.changedTouches[0].pageX,
        pageY: e.changedTouches[0].pageY,
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY,
        screenX: e.changedTouches[0].screenX,
        screenY: e.changedTouches[0].screenY,
      })
    } else {
      // mouse
      Object.assign(trackedInfo.position, {x: e.pageX, y: e.pageY,
        pageX: e.pageX,
        pageY: e.pageY,
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
      })
    }
    if (name === 'start') {
      trackedInfo.startEvent = e
    } else if (name === 'end') {
      trackedInfo.endEvent = e
    }
    Object.assign(trackedInfo, {
      event: e,
      isTouch,
      eventType: name,
    })
  }
  const onStart = (e) => {
    const isTouch = DragEventService.isTouch(e)
    if (!isTouch && e.which !== 1) {
      // not left button mousedown
      return
    }
    update('start', e)
    if (options.onStart) {
      options.onStart()
    }
  }
  const onMove = () => {
    update('move', e)
    if (options.onMove) {
      options.onMove()
    }
  }
  const onEnd = () => {
    update('end', e)
    if (options.onEnd) {
      options.onEnd()
    }
  }
  const start = () => {
    DragEventService.on(document, 'start', onStart)
    DragEventService.on(document, 'move', onMove)
    DragEventService.on(window, 'end', onEnd)
    info.started = true
  }
  const stop = () => {
    DragEventService.off(document, 'start', onStart)
    DragEventService.off(document, 'move', onMove)
    DragEventService.off(window, 'end', onEnd)
    info.started = false
  }
  return {info, start, stop}
}