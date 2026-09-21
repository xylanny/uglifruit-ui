import { createApp } from "vue";
import { describe, expect, it } from "vitest";
import UUi, { UIcon } from "../index";
import components from "../components";

// 建一个不挂载的应用实例，只用于断言组件注册结果
const createAppStub = () => createApp({ render: () => null });

describe("核心包入口", () => {
  it("默认导出的插件可被app.use", () => {
    const app = createAppStub();
    app.use(UUi);
    expect(app.component("UIcon")).toBe(UIcon);
  });

  it("支持按需引用与可单独注册", () => {
    const app = createAppStub();
    expect(UIcon.install).toBeTypeOf("function");
    app.use(UIcon);
    expect(app.component("UIcon")).toBe(UIcon);
  });

  it("收录了按需导出的同一个组件实例", () => {
    expect(components).toContain(UIcon);
  });
});
