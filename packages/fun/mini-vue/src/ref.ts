import { activeEffect, type Effect } from './effect'

class DepRef<T> {
  #subscribers: Set<Effect> = new Set()
  #_value: T

  constructor(val: T) {
    this.#_value = val
  }

  get value() {
    this.#depend()
    return this.#_value
  }

  set value(val: T) {
    this.#_value = val
    this.#notify()
  }

  #depend() {
    if (!activeEffect) { return }
    this.#subscribers.add(activeEffect)
  }

  #notify() {
    this.#subscribers.forEach(effect => {
      effect()
    })
  }
}

export function ref<T>(val: T): DepRef<T>
export function ref<T = undefined>(): DepRef<T | undefined>
export function ref<T>(val?: T) {
  return new DepRef(val as T)
}
