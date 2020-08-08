export declare const DragEventService: {
  isTouch: (e: MouseOrTouchEvent) => Boolean
  on: (el: HTMLElement|Window|Document, name: EventType, handler: Handler, options?: Options) => void
  off: (el: HTMLElement|Window|Document, name: EventType, handler: Handler, options?: Options) => void
}
export default DragEventService

export function trackMouseOrTouchPosition(options?: Options_trackMouseOrTouchPosition): {
  info: TrackedInfo
  start: () => void
  stop: () => void
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
  args?: any[],
  mouseArgs?: any[],
  touchArgs?: any[],
}
export interface Options_trackMouseOrTouchPosition{
  onMove?: () => void
  onStart?: () => void
  onEnd?: () => void
}
export interface TrackedInfo{
  position: EventPosition
  event: MouseOrTouchEvent
  eventType: EventType
  isTouch: boolean
  started: boolean
  startEvent?: MouseOrTouchEvent
  endEvent?: MouseOrTouchEvent
}