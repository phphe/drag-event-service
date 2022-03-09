# drag-event-service

Listen both mouse and touch event. With Typescript definition files. Support Typescript.

同时监听鼠标和触摸事件. 支持 Typescript.

```js
// mapping
const events = {
  start: ["mousedown", "touchstart"],
  move: ["mousemove", "touchmove"],
  end: ["mouseup", "touchend"],
};
```

## install

```sh
npm install drag-event-service --save
```

## usage & api

```js
import DragEventService from "drag-event-service";
DragEventService.on(el, name, handler, { args, mouseArgs, touchArgs });
DragEventService.off(el, name, handler, { args, mouseArgs, touchArgs });
```

- args, mouseArgs and touchArgs should be Array
- The args will pass to addEventListener.
- mouseArgs will pass to mouse event.
- touchArgs will pass to touch event.
- handler(event, currentPosition). The second argument of handler is current position({x, y, pageX, pageY, clientX, clientY, screenX, screenY}). x and y is pageX and pageY.

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
