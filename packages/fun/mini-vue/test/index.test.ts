import { describe, expect, it } from "vitest";

import { component, h, reactive, ref, watchEffect } from "../src/index";
import { Fragment, jsx } from "../src/jsx-runtime";

describe("mini-vue package", () => {
  it("tracks reactive object updates", () => {
    const state = reactive({ count: 1 });
    let snapshot = 0;

    watchEffect(() => {
      snapshot = state.count;
    });

    state.count = 2;

    expect(snapshot).toBe(2);
  });

  it("tracks ref updates", () => {
    const value = ref(1);
    let snapshot = 0;

    watchEffect(() => {
      snapshot = value.value;
    });

    value.value = 3;

    expect(snapshot).toBe(3);
  });

  it("supports components and JSX runtime exports", () => {
    const Greeting = component<{ name: string }>((props) => h("div", { title: props.name }, [props.name]));
    const vnode = Greeting({ name: "Hyde Park" });
    const jsxNode = jsx("section", { id: "mini-vue", children: ["runtime"] });
    const fragment = Fragment({ children: ["first", "second"] });

    expect(vnode.tag).toBe("div");
    expect(vnode.children).toEqual(["Hyde Park"]);
    expect(jsxNode.tag).toBe("section");
    expect(jsxNode.children).toEqual(["runtime"]);
    expect(fragment.tag).toBe("fragment");
    expect(fragment.children).toEqual(["first", "second"]);
  });
});
