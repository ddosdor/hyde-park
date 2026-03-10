import { activeEffect, type Effect } from './effect'

export class DepReactive {
  subscribers: Set<Effect> = new Set()

  depend() {
    if (!activeEffect) { return }
    this.subscribers.add(activeEffect)
  }

  notify() {
    this.subscribers.forEach(effect => {
      effect()
    })
  }
}

type TargetState = object
type DepsMap = Map<PropertyKey, DepReactive>
const ITERATE_KEY = Symbol('iterate')
const LENGTH_KEY = 'length'

const hasOwn = (target: TargetState, key: PropertyKey) => {
  return Object.prototype.hasOwnProperty.call(target, key)
}

const isArrayIndex = (key: PropertyKey) => {
  if (typeof key === 'symbol') return false

  const index = Number(key)
  return Number.isInteger(index) && index >= 0 && String(index) === String(key)
}

const targetMap = new WeakMap<TargetState, DepsMap>()
const getReactiveDep = (target: TargetState, key: PropertyKey): DepReactive => {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map<PropertyKey, DepReactive>()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new DepReactive()
    depsMap.set(key, dep)
  }

  return dep
}

const notifyArrayIndexDepsAboveLength = (target: TargetState, nextLength: number) => {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  depsMap.forEach((dep, depKey) => {
    if (isArrayIndex(depKey) && Number(depKey) >= nextLength) {
      dep.notify()
    }
  })
}

const reactiveHandlers: ProxyHandler<TargetState> = {
  get (target, key, receiver) {
    if (Array.isArray(target) && key === Symbol.iterator) {
      const iterateDep = getReactiveDep(target, ITERATE_KEY)
      iterateDep.depend()
    }

    const dep = getReactiveDep(target, key)
    dep.depend()
    return Reflect.get(target, key, receiver)
  },
  set (target, key, value, receiver) {
    const isArrayTarget = Array.isArray(target)
    const hadKey = hasOwn(target, key)
    const oldLength = isArrayTarget ? target.length : 0
    const prevValue = Reflect.get(target, key, receiver)
    const result = Reflect.set(target, key, value, receiver)

    if (!result) {
      return result
    }

    const hasChanged = !Object.is(prevValue, value)
    if (hasChanged) {
      const dep = getReactiveDep(target, key)
      dep.notify()
    }

    if (!hadKey) {
      const iterateDep = getReactiveDep(target, ITERATE_KEY)
      iterateDep.notify()
    }

    if (isArrayTarget && key === LENGTH_KEY && hasChanged) {
      const nextLength = Number(value)
      if (Number.isInteger(nextLength) && nextLength >= 0) {
        notifyArrayIndexDepsAboveLength(target, nextLength)
      }

      const iterateDep = getReactiveDep(target, ITERATE_KEY)
      iterateDep.notify()
    }

    if (isArrayTarget && isArrayIndex(key) && !hadKey && Number(key) >= oldLength) {
      const lengthDep = getReactiveDep(target, LENGTH_KEY)
      lengthDep.notify()
    }

    return result
  },
  deleteProperty (target, key) {
    const hadKey = hasOwn(target, key)
    const result = Reflect.deleteProperty(target, key)

    if (!result || !hadKey) {
      return result
    }

    const dep = getReactiveDep(target, key)
    dep.notify()

    const iterateDep = getReactiveDep(target, ITERATE_KEY)
    iterateDep.notify()

    if (Array.isArray(target) && isArrayIndex(key)) {
      const lengthDep = getReactiveDep(target, LENGTH_KEY)
      lengthDep.notify()
    }

    return result
  },
  ownKeys(target) {
    const iterateDep = getReactiveDep(target, ITERATE_KEY)
    iterateDep.depend()
    return Reflect.ownKeys(target)
  }
}
export const reactive = <T extends object>(state: T): T => {
  return new Proxy(state, reactiveHandlers as ProxyHandler<T>)
}
