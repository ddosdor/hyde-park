import { type VNode } from './h'

type ComponentProps = Record<string, unknown>
type ComponentRender<P extends ComponentProps> = (props: P) => VNode
type SetupResult<P extends ComponentProps> = VNode | ComponentRender<P>
type ComponentSetup<P extends ComponentProps> = (props: P) => SetupResult<P>
type ComponentKey = string | number | symbol
type ComponentInstance = {
  setup: ComponentSetup<ComponentProps>
  render: ComponentRender<ComponentProps> | null
  props: ComponentProps | null
  slots: ComponentInstance[]
  slotCursor: number
  keyedSlots: Map<ComponentSetup<ComponentProps>, Map<ComponentKey, ComponentInstance>>
  usedKeyedSlots: Map<ComponentSetup<ComponentProps>, Set<ComponentKey>>
}

type RenderScope = {
  slots: ComponentInstance[]
  slotCursor: number
  keyedSlots: Map<ComponentSetup<ComponentProps>, Map<ComponentKey, ComponentInstance>>
  usedKeyedSlots: Map<ComponentSetup<ComponentProps>, Set<ComponentKey>>
}

let activeScope: RenderScope | null = null

const createComponentInstance = (
  setup: ComponentSetup<ComponentProps>,
): ComponentInstance => {
  return {
    setup,
    render: null,
    props: null,
    slots: [],
    slotCursor: 0,
    keyedSlots: new Map(),
    usedKeyedSlots: new Map(),
  }
}

const syncProps = (target: ComponentProps, source: ComponentProps) => {
  for (const key in target) {
    if (!(key in source)) {
      delete target[key]
    }
  }

  for (const key in source) {
    target[key] = source[key]
  }
}

const cleanupScope = (scope: RenderScope) => {
  scope.slots.length = scope.slotCursor

  scope.keyedSlots.forEach((instancesByKey, setup) => {
    const usedKeys = scope.usedKeyedSlots.get(setup)

    if (!usedKeys || usedKeys.size === 0) {
      scope.keyedSlots.delete(setup)
      return
    }

    instancesByKey.forEach((_, key) => {
      if (!usedKeys.has(key)) {
        instancesByKey.delete(key)
      }
    })

    if (instancesByKey.size === 0) {
      scope.keyedSlots.delete(setup)
    }
  })

  scope.usedKeyedSlots.clear()
}

const executeInScope = <T>(scope: RenderScope, cb: () => T): T => {
  const previousScope = activeScope
  activeScope = scope
  scope.slotCursor = 0

  try {
    return cb()
  } finally {
    cleanupScope(scope)
    activeScope = previousScope
  }
}

const renderInstance = <P extends ComponentProps>(
  instance: ComponentInstance,
  props: P,
): VNode => {
  if (!instance.props) {
    instance.props = { ...props }
  } else {
    syncProps(instance.props, props)
  }

  if (!instance.render) {
    const setupResult = instance.setup(instance.props)

    instance.render = typeof setupResult === 'function'
      ? setupResult as ComponentRender<ComponentProps>
      : () => setupResult
  }

  return executeInScope(instance, () => {
    return instance.render!(instance.props!)
  })
}

const resolveInstanceFromActiveScope = <P extends ComponentProps>(
  setup: ComponentSetup<P>,
  key?: ComponentKey,
): ComponentInstance | null => {
  if (!activeScope) return null

  const normalizedSetup = setup as ComponentSetup<ComponentProps>

  if (key !== undefined) {
    let instancesByKey = activeScope.keyedSlots.get(normalizedSetup)
    if (!instancesByKey) {
      instancesByKey = new Map()
      activeScope.keyedSlots.set(normalizedSetup, instancesByKey)
    }

    let usedKeys = activeScope.usedKeyedSlots.get(normalizedSetup)
    if (!usedKeys) {
      usedKeys = new Set()
      activeScope.usedKeyedSlots.set(normalizedSetup, usedKeys)
    }

    usedKeys.add(key)

    const existingByKey = instancesByKey.get(key)
    if (existingByKey) {
      return existingByKey
    }

    const keyedInstance = createComponentInstance(normalizedSetup)
    instancesByKey.set(key, keyedInstance)

    return keyedInstance
  }

  const slotIndex = activeScope.slotCursor
  activeScope.slotCursor += 1

  const existing = activeScope.slots[slotIndex]
  if (!existing || existing.setup !== setup) {
    const nextInstance = createComponentInstance(normalizedSetup)
    activeScope.slots[slotIndex] = nextInstance
    return nextInstance
  }

  return existing
}

export const createRootRenderScope = (): RenderScope => {
  return {
    slots: [],
    slotCursor: 0,
    keyedSlots: new Map(),
    usedKeyedSlots: new Map(),
  }
}

export const renderWithRootScope = <T>(scope: RenderScope, render: () => T): T => {
  return executeInScope(scope, render)
}

export const component = <P extends ComponentProps = ComponentProps>(
  setup: ComponentSetup<P>,
) => {
  let standaloneInstance: ComponentInstance | null = null

  return (props: P = {} as P, key?: ComponentKey): VNode => {
    const activeInstance = resolveInstanceFromActiveScope(setup, key)
    if (activeInstance) {
      return renderInstance(activeInstance, props)
    }

    if (!standaloneInstance) {
      standaloneInstance = createComponentInstance(setup as ComponentSetup<ComponentProps>)
    }

    return renderInstance(standaloneInstance, props)
  }
}
