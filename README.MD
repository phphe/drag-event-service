# drag-event-service
Listen both mouse and touch event. With Typescript definition files. Support Typescript.

同时监听鼠标和触摸事件. 支持Typescript.
```js
// mapping
const events = {
  start: ['mousedown', 'touchstart'],
  move: ['mousemove', 'touchmove'],
  end: ['mouseup', 'touchend'],
}
```
## install
```sh
npm install drag-event-service --save
```
## usage & api
```js
import DragEventService from 'drag-event-service'
DragEventService.on(el, name, handler, {args, mouseArgs, touchArgs})
DragEventService.off(el, name, handler, {args, mouseArgs, touchArgs})
```
* args, mouseArgs and touchArgs should be Array
* The args will pass to addEventListener.
* mouseArgs will pass to mouse event.
* touchArgs will pass to touch event.
* handler(event, currentPosition). The second argument of handler is current position({x, y, pageX, pageY, clientX, clientY, screenX, screenY}). x and y is pageX and pageY.

## example
```js
// 1
DragEventService.on(document, 'start', (e, mouse) => ..., {touchArgs: [{passive: false}]})
DragEventService.on(document, 'move', (e, mouse) => ..., {touchArgs: [{passive: false}]})
DragEventService.on(document, 'end', (e, mouse) => ..., {touchArgs: [{passive: false}]})
// 2
const handler = (e, mouse) => ...
DragEventService.on(document, 'start', handler)
DragEventService.off(document, 'start', handler)
```

## Track mouse or touch position globally
全局跟踪鼠标或触摸位置
### Usage
```js
import {trackMouseOrTouchPosition} from 'drag-event-service'
const {info, start, stop} = trackMouseOrTouchPosition(options)
start() // call start to start tracking.
```
### Types
```ts
// options
export interface Options_trackMouseOrTouchPosition{
  onMove: () => void
  onStart: () => void
  onEnd: () => void
}
// info
export interface TrackedInfo{
  position: EventPosition
  event: MouseOrTouchEvent
  eventType: EventType
  isTouch: boolean
  started: boolean
  startEvent?: MouseOrTouchEvent
  endEvent?: MouseOrTouchEvent
}
// 
start: () => void
stop: () => void
```