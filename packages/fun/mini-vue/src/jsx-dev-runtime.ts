import { Fragment, jsx, jsxs } from './jsx-runtime'

type JsxType = Parameters<typeof jsx>[0]
type JsxProps = Parameters<typeof jsx>[1]

export { Fragment, jsx, jsxs }

export const jsxDEV = (
  type: JsxType,
  props: JsxProps,
  _key?: string | number | symbol,
  _isStaticChildren?: boolean,
  _source?: unknown,
  _self?: unknown,
) => {
  return jsx(type, props, _key)
}
