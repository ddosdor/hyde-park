import { type VNode } from './h'
import { applyProp } from './props'
import { watchEffect } from './effect'
import { patch } from './patch'
import { createRootRenderScope, renderWithRootScope } from './component'

type RootRenderer = () => VNode

const addProps = (props: VNode['props'], el: HTMLElement) => {
  if (!props) return

  for (const key in props) {
    applyProp(el, key, props[key])
  }
}

const addChildren = (children: VNode['children'], el: HTMLElement) => {
  if (!children) return

  children.forEach(child => {
    if (typeof child === 'string') {
      el.append(child)
    } else {
      mount(child, el)
    }
  })
}

const mountVNode = (vnode: VNode, container: HTMLElement | null) => {
  const el = vnode.el = document.createElement(vnode.tag)

  // props
  if (vnode.props) {
    addProps(vnode.props, el)
  }

  // children
  if (vnode.children) {
    addChildren(vnode.children, el)
  }

  container?.appendChild(el)
}

const mountRootComponent = (render: RootRenderer, container: HTMLElement | null) => {
  let prevVNode: VNode | null = null
  const scope = createRootRenderScope()

  watchEffect(() => {
    const nextVNode = renderWithRootScope(scope, render)

    if (!prevVNode) {
      mountVNode(nextVNode, container)
      prevVNode = nextVNode
      return
    }

    patch(prevVNode, nextVNode)
    prevVNode = nextVNode
  })
}

export const mount = (
  source: VNode | RootRenderer,
  container: HTMLElement | null,
) => {
  if (typeof source === 'function') {
    mountRootComponent(source, container)
    return
  }

  mountVNode(source, container)
}
