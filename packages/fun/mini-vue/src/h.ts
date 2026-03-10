type PropValue = string | number | boolean | ((...args: unknown[]) => void)
export type VNodeKey = string | number | symbol

export type Props = Record<string, PropValue>

export type Child = VNode | string

export type VNode = {
  el: HTMLElement | null
  tag: string
  props: Props | null
  children: Child[]
  key?: VNodeKey
}

export type Hypescript = (
  tag: VNode['tag'],
  props?: VNode['props'],
  children?: VNode['children'],
  key?: VNode['key'],
) => VNode

export const h: Hypescript = (tag, props = null, children = [], key) => {
  return {
    el: null,
    tag,
    props,
    children,
    key,
  }
}
