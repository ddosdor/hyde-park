import { type Child, type Props, type VNode, type VNodeKey } from './h'
import { mount } from './mount'
import { applyProp, removeProp } from './props'

const patchProps = (el: HTMLElement, oldProps: Props | null, newProps: Props | null) => {
  const prevProps = oldProps ?? {}
  const nextProps = newProps ?? {}

  for (const key in nextProps) {
    const prevValue = prevProps[key]
    const nextValue = nextProps[key]

    if (prevValue === nextValue) continue

    if (prevValue !== undefined) {
      removeProp(el, key, prevValue)
    }

    applyProp(el, key, nextValue)
  }

  for (const key in prevProps) {
    if (key in nextProps) continue

    removeProp(el, key, prevProps[key])
  }
}

const mountChild = (child: Child, container: HTMLElement, anchor: ChildNode | null = null) => {
  if (typeof child === 'string') {
    container.insertBefore(document.createTextNode(child), anchor)
    return
  }

  mount(child, null)

  if (child.el) {
    container.insertBefore(child.el, anchor)
  }
}

const removeChild = (container: HTMLElement, child: Child, index: number) => {
  if (typeof child === 'string') {
    const textNode = container.childNodes[index]
    textNode?.remove()
    return
  }

  child.el?.remove()
}

const patchChild = (
  oldChild: Child,
  newChild: Child,
  container: HTMLElement,
  index: number,
) => {
  if (typeof oldChild === 'string' && typeof newChild === 'string') {
    const currentNode = container.childNodes[index]

    if (currentNode?.nodeType === Node.TEXT_NODE) {
      if (currentNode.textContent !== newChild) {
        currentNode.textContent = newChild
      }

      return
    }

    const nextTextNode = document.createTextNode(newChild)
    if (currentNode) {
      container.replaceChild(nextTextNode, currentNode)
    } else {
      container.appendChild(nextTextNode)
    }

    return
  }

  if (typeof oldChild === 'string' && typeof newChild !== 'string') {
    const currentNode = container.childNodes[index]

    mount(newChild, null)

    if (!newChild.el) return

    if (currentNode) {
      container.replaceChild(newChild.el, currentNode)
    } else {
      container.appendChild(newChild.el)
    }

    return
  }

  if (typeof oldChild !== 'string' && typeof newChild === 'string') {
    const nextTextNode = document.createTextNode(newChild)

    if (oldChild.el) {
      oldChild.el.replaceWith(nextTextNode)
    } else {
      const currentNode = container.childNodes[index]

      if (currentNode) {
        container.replaceChild(nextTextNode, currentNode)
      } else {
        container.appendChild(nextTextNode)
      }
    }

    return
  }

  if (typeof oldChild !== 'string' && typeof newChild !== 'string') {
    patch(oldChild, newChild)
  }
}

const isKeyedVNode = (child: Child): child is VNode & { key: VNodeKey } => {
  return typeof child !== 'string' && child.key !== undefined
}

const canUseKeyedDiff = (oldChildren: Child[], newChildren: Child[]) => {
  if (oldChildren.length === 0 || newChildren.length === 0) return false
  return oldChildren.every(isKeyedVNode) && newChildren.every(isKeyedVNode)
}

const patchKeyedChildren = (
  oldChildren: Array<VNode & { key: VNodeKey }>,
  newChildren: Array<VNode & { key: VNodeKey }>,
  container: HTMLElement,
) => {
  const oldChildrenByKey = new Map<VNodeKey, VNode & { key: VNodeKey }>()
  oldChildren.forEach(oldChild => {
    oldChildrenByKey.set(oldChild.key, oldChild)
  })

  const usedKeys = new Set<VNodeKey>()

  newChildren.forEach(newChild => {
    const oldChild = oldChildrenByKey.get(newChild.key)

    if (!oldChild) {
      mount(newChild, null)
      return
    }

    usedKeys.add(newChild.key)
    patch(oldChild, newChild)
  })

  oldChildren.forEach(oldChild => {
    if (usedKeys.has(oldChild.key)) return
    oldChild.el?.remove()
  })

  let anchor: ChildNode | null = null
  for (let i = newChildren.length - 1; i >= 0; i -= 1) {
    const child = newChildren[i]
    if (!child) continue

    const childEl = child.el
    if (!childEl) continue
    container.insertBefore(childEl, anchor)
    anchor = childEl
  }
}

const patchChildren = (oldVNode: VNode, newVNode: VNode, container: HTMLElement) => {
  const oldChildren = oldVNode.children
  const newChildren = newVNode.children

  if (canUseKeyedDiff(oldChildren, newChildren)) {
    patchKeyedChildren(
      oldChildren as Array<VNode & { key: VNodeKey }>,
      newChildren as Array<VNode & { key: VNodeKey }>,
      container,
    )
    return
  }

  const commonLength = Math.min(oldChildren.length, newChildren.length)

  for (let i = 0; i < commonLength; i += 1) {
    const oldChild = oldChildren[i]
    const newChild = newChildren[i]

    if (!oldChild || !newChild) continue

    patchChild(oldChild, newChild, container, i)
  }

  if (newChildren.length > oldChildren.length) {
    for (let i = commonLength; i < newChildren.length; i += 1) {
      const newChild = newChildren[i]
      if (!newChild) continue

      mountChild(newChild, container, null)
    }
    return
  }

  if (oldChildren.length > newChildren.length) {
    for (let i = oldChildren.length - 1; i >= commonLength; i -= 1) {
      const oldChild = oldChildren[i]
      if (!oldChild) continue

      removeChild(container, oldChild, i)
    }
  }
}

const replaceVNode = (oldVNode: VNode, newVNode: VNode) => {
  const oldEl = oldVNode.el

  if (!oldEl) return

  const container = oldEl.parentElement

  if (!container) return

  mount(newVNode, null)

  if (!newVNode.el) return

  container.replaceChild(newVNode.el, oldEl)
}

export const patch = (oldVNode: VNode, newVNode: VNode) => {
  if (oldVNode.tag !== newVNode.tag) {
    replaceVNode(oldVNode, newVNode)
    return
  }

  const el = (newVNode.el = oldVNode.el)

  if (!el) return

  patchProps(el, oldVNode.props, newVNode.props)
  patchChildren(oldVNode, newVNode, el)
}
