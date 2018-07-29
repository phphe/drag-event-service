// support desktop and mobile
// support start, move, end
// the second argument is mouse{x, y}
import * as hp from 'helper-js'

const events = {
  start: ['mousedown', 'touchstart'],
  move: ['mousemove', 'touchmove'],
  end: ['mouseup', 'touchend'],
}
export default {
  canTouch() {
    return 'ontouchstart' in document.documentElement
  },
  _getStore(el) {
    if (!el._wrapperStore) {
      el._wrapperStore = []
    }
    return el._wrapperStore
  },
  on(el, name, handler) {
    const store  = this._getStore(el)
    const canTouch = this.canTouch()
    const wrapper = function (e) {
      let mouse
      if (!canTouch) {
        if (name === 'start' && e.which !== 1) {
          // not left button
          return
        }
        mouse = {x: e.pageX, y: e.pageY}
      } else {
        mouse = {x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY}
      }
      return handler.call(this, e, mouse)
    }
    store.push({handler, wrapper})
    hp.onDOM(el, events[name][canTouch?1:0], wrapper)
  },
  off(el, name, handler) {
    const store  = this._getStore(el)
    const canTouch = this.canTouch()
    const eventName = events[name][canTouch?1:0]
    for (let i = store.length - 1; i >= 0; i--) {
      const {handler: handler2, wrapper} = store[i]
      if (handler === handler2) {
        hp.offDOM(el, eventName, wrapper)
        store.splice(i, 1)
      }
    }
  },
}
