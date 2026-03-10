import { type VNode } from './h'

type EventHandler = (...args: unknown[]) => void
type PropValue = NonNullable<VNode['props']>[string] | undefined

type ElementWithCustomHandlers = HTMLElement & {
  __customEventHandlers?: Record<string, EventHandler>
}

const normalizeEventName = (eventName: string) => {
  return eventName.toLowerCase()
}

const isEventProp = (key: string) => {
  return key.startsWith('on') && key.length > 2
}

const isEventHandler = (value: unknown): value is EventHandler => {
  return typeof value === 'function'
}

const getEventName = (key: string) => {
  return normalizeEventName(key.slice(2))
}

const isNativeEvent = (eventName: string, el: HTMLElement) => {
  const nativeKey = `on${eventName}`

  return nativeKey in el || nativeKey in document || nativeKey in window
}

const setCustomEventHandler = (el: HTMLElement, eventName: string, handler: EventHandler) => {
  const elementWithHandlers = el as ElementWithCustomHandlers

  if (!elementWithHandlers.__customEventHandlers) {
    elementWithHandlers.__customEventHandlers = {}
  }

  elementWithHandlers.__customEventHandlers[eventName] = handler
}

const removeCustomEventHandler = (el: HTMLElement, eventName: string) => {
  const elementWithHandlers = el as ElementWithCustomHandlers
  const handlers = elementWithHandlers.__customEventHandlers

  if (!handlers) return

  delete handlers[eventName]

  if (Object.keys(handlers).length === 0) {
    delete elementWithHandlers.__customEventHandlers
  }
}

const shouldSetAsProperty = (el: HTMLElement, key: string) => {
  if (key === 'class' || key === 'for') return false
  if (key.startsWith('data-') || key.startsWith('aria-')) return false

  return key in el
}

const setAsProperty = (el: HTMLElement, key: string, value: unknown) => {
  ;(el as HTMLElement & Record<string, unknown>)[key] = value
}

const unsetProperty = (el: HTMLElement, key: string) => {
  const target = el as HTMLElement & Record<string, unknown>
  const currentValue = target[key]

  if (typeof currentValue === 'boolean') {
    target[key] = false
    return
  }

  target[key] = ''
}

const setAsAttribute = (el: HTMLElement, key: string, value: unknown) => {
  if (typeof value === 'boolean') {
    if (value) {
      el.setAttribute(key, '')
    } else {
      el.removeAttribute(key)
    }

    return
  }

  el.setAttribute(key, String(value))
}

export const applyProp = (el: HTMLElement, key: string, value: PropValue) => {
  if (value === undefined) return

  if (isEventProp(key)) {
    if (!isEventHandler(value)) return

    const eventName = getEventName(key)

    if (isNativeEvent(eventName, el)) {
      el.addEventListener(eventName, value as EventListener)
    } else {
      setCustomEventHandler(el, eventName, value)
    }

    return
  }

  if (typeof value === 'function') return

  if (shouldSetAsProperty(el, key)) {
    setAsProperty(el, key, value)
    return
  }

  setAsAttribute(el, key, value)
}

export const removeProp = (el: HTMLElement, key: string, value: PropValue) => {
  if (isEventProp(key)) {
    if (!isEventHandler(value)) return

    const eventName = getEventName(key)

    if (isNativeEvent(eventName, el)) {
      el.removeEventListener(eventName, value as EventListener)
    } else {
      removeCustomEventHandler(el, eventName)
    }

    return
  }

  if (typeof value === 'function') return

  if (shouldSetAsProperty(el, key)) {
    unsetProperty(el, key)
    return
  }

  el.removeAttribute(key)
}
