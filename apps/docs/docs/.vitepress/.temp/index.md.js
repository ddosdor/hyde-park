import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"Hyde Park","text":"Independently versioned TypeScript packages","tagline":"Vue composables, framework-agnostic utils, and an optional umbrella package.","actions":[{"theme":"brand","text":"Browse Packages","link":"/packages/"},{"theme":"alt","text":"Installation","link":"/public-api/installation"}]},"features":[{"title":"Independent releases","details":"Every public package ships with its own version, changelog entry, and npm release lifecycle."},{"title":"Hybrid consumption model","details":"Install individual leaf packages or the umbrella package with subpath exports."},{"title":"TypeScript first","details":"ESM, CJS, declaration files, Vitest coverage, and Changesets release management."}]},"headers":[],"relativePath":"index.md","filePath":"index.md","lastUpdated":1773170225000}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
