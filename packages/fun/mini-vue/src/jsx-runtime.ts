import { h, type Child, type Props, type VNode, type VNodeKey } from './h'

type PrimitiveChild = string | number | boolean | null | undefined
type JsxChild = VNode | PrimitiveChild
type JsxChildren = JsxChild | JsxChildren[]
type Key = VNodeKey

type EventHandler<E = Event> = (event: E) => void
type NativeEventMap = GlobalEventHandlersEventMap

type OnEvents = {
  [K in keyof NativeEventMap as `on${Capitalize<K & string>}`]?: EventHandler<NativeEventMap[K]>
}

type CommonAttributes = {
  children?: JsxChildren
  class?: string
  className?: string
  id?: string
  for?: string
  htmlFor?: string
  title?: string
  type?: string
  name?: string
  value?: string | number
  checked?: boolean
  disabled?: boolean
  placeholder?: string
  role?: string
  href?: string
  src?: string
  alt?: string
  tabIndex?: number
}

type DataAttributes = {
  [K in `data-${string}`]?: string | number | boolean
}

type AriaAttributes = {
  [K in `aria-${string}`]?: string | number | boolean
}

type IntrinsicElementAttributes = CommonAttributes &
  DataAttributes &
  AriaAttributes &
  OnEvents & {
    [name: string]: unknown
  }

type ComponentProps = IntrinsicElementAttributes
type Component = (props: ComponentProps, key?: Key) => VNode
type ElementType = string | Component

const normalizeChild = (child: JsxChildren, output: Child[]) => {
  if (Array.isArray(child)) {
    child.forEach(nestedChild => {
      normalizeChild(nestedChild, output)
    })
    return
  }

  if (child === null || child === undefined || typeof child === 'boolean') {
    return
  }

  if (typeof child === 'number') {
    output.push(String(child))
    return
  }

  output.push(child)
}

const normalizeChildren = (children: JsxChildren | undefined): Child[] => {
  if (children === undefined) return []

  const normalizedChildren: Child[] = []
  normalizeChild(children, normalizedChildren)

  return normalizedChildren
}

const normalizeProps = (props: ComponentProps | null | undefined) => {
  if (!props) {
    return {
      props: null as Props | null,
      children: [] as Child[],
    }
  }

  const {
    children,
    key: _ignoredKey,
    ...restProps
  } = props
  const normalizedProps: Record<string, unknown> = { ...restProps }

  if ('className' in normalizedProps && !('class' in normalizedProps)) {
    normalizedProps.class = normalizedProps.className
    delete normalizedProps.className
  }

  if ('htmlFor' in normalizedProps && !('for' in normalizedProps)) {
    normalizedProps.for = normalizedProps.htmlFor
    delete normalizedProps.htmlFor
  }

  return {
    props: Object.keys(normalizedProps).length > 0 ? normalizedProps as Props : null,
    children: normalizeChildren(children),
  }
}

export const Fragment = (props: { children?: JsxChildren }) => {
  return h('fragment', null, normalizeChildren(props.children))
}

export const jsx = (type: ElementType, props: ComponentProps | null, key?: Key): VNode => {
  const propsKey = props?.key as Key | undefined
  const resolvedKey = key ?? propsKey

  if (typeof type === 'function') {
    const nextProps = props ?? {}
    const vnode = type(nextProps, resolvedKey)

    if (resolvedKey !== undefined) {
      vnode.key = resolvedKey
    }

    return vnode
  }

  const normalized = normalizeProps(props)
  return h(type, normalized.props, normalized.children, resolvedKey)
}

export const jsxs = jsx

export namespace JSX {
  export type Element = VNode
  export interface IntrinsicAttributes {
    key?: Key
  }
  export interface ElementChildrenAttribute {
    children: unknown
  }
  export interface IntrinsicElements {
    [elemName: string]: IntrinsicElementAttributes
  }
}
