export default interface DragEventService{
  isTouch: (e: MouseOrTouchEvent) => Boolean
  on: (el: HTMLElement, name: EventType, handler: Handler, options: Options) => void
  off: (el: HTMLElement, name: EventType, handler: Handler, options: Options) => void
}

export interface trackMouseOrTouchPosition{
  (options: Options_trackMouseOrTouchPosition): {
    info: TrackedInfo
    start: () => void
    stop: () => void
  }
}

// types
export type EventType = 'start'|'move'|'end'
export type MouseOrTouchEvent = MouseEvent|TouchEvent
export interface EventPosition {
  x: number, y: number,
  pageX: number,
  pageY: number,
  clientX: number,
  clientY: number,
  screenX: number,
  screenY: number
}
export interface Handler{
  (e: MouseOrTouchEvent, evetPosition: EventPosition): void
}
export interface Options{
  args?: [],
  mouseArgs?: [],
  touchArgs?: [],
}
export interface Options_trackMouseOrTouchPosition{
  onMove: () => void
  onStart: () => void
  onEnd: () => void
}
export interface TrackedInfo{
  position: EventPosition
  event: MouseOrTouchEvent
  eventType: EventType
  isTouch: boolean
  startEvent?: MouseOrTouchEvent
  endEvent?: MouseOrTouchEvent
}