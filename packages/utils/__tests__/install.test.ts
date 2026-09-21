import { createApp, defineComponent, h, type App, type Plugin } from "vue";
import { describe, expect, it, vi } from "vitest";
import { attachInstall, createInstaller } from "../install";

/**
 * 伪造App实例的工厂函数
 *
 * @returns 伪造的App实例
 */
function createSpyApp() {
  // 创建模拟app.use的spy函数
  const use = vi.fn();
  // 创建模拟app.component的spy函数
  const component = vi.fn();

  // 由于这个app对象只有两个方法则不满足App类型定义，使用双重断言
  return { app: { use, component } as unknown as App, use, component };
}

// 定义一个真实Vue组件
const VueComponentDemo = defineComponent({
  name: "VueComponentDemo", // 命名组件
  render: () => h("div", "demo"), // 定义渲染函数
});

describe("测试attachInstall函数", () => {
  it("返回不改变引用的原组件本身", () => {
    expect(attachInstall(VueComponentDemo)).toBe(VueComponentDemo);
  });

  it("为组件挂上install方法", () => {
    expect(typeof attachInstall(VueComponentDemo).install).toBe("function");
  });

  it("被安装插件时以组件的name作为注册名", () => {
    // 创建一个虚构的App实例app
    const { app, component } = createSpyApp();

    attachInstall(VueComponentDemo).install(app);

    expect(component).toHaveBeenCalledTimes(1);

    expect(component).toHaveBeenCalledWith(
      "VueComponentDemo",
      VueComponentDemo,
    );
  });

  it("实现全局注册", () => {
    // 创建一个真实App实例app
    const app = createApp({ render: () => null });

    app.use(attachInstall(VueComponentDemo));

    expect(app.component("VueComponentDemo")).toBe(VueComponentDemo);
  });

  it("仅扩展组件能力而不破坏原有", () => {
    const withInstall = attachInstall(VueComponentDemo);

    expect(withInstall.name).toBe("VueComponentDemo");

    expect(withInstall.render).toBe(VueComponentDemo.render);
  });
});

describe("测试createInstaller函数", () => {
  it("返回函数且满足Vue插件的函数式写法", () => {
    expect(typeof createInstaller([])).toBe("function");
  });

  it("没有任何子插件时，安装不会调用app.use", () => {
    // 创建伪造的App实例，解构出use()
    const { app, use } = createSpyApp();

    createInstaller([])(app);

    expect(use).not.toHaveBeenCalled();
  });

  it("不改变组件注册次序", () => {
    const { app, use } = createSpyApp();
    // 创建三个伪造插件
    const plugins: Plugin[] = [
      { install: vi.fn() },
      { install: vi.fn() },
      { install: vi.fn() },
    ];
    // 创建总安装器，立即调用
    createInstaller(plugins)(app);
    // 断言app.use()被调用次数等于插件数量
    expect(use).toHaveBeenCalledTimes(plugins.length);
    expect(use.mock.calls.map(([plugin]) => plugin)).toEqual(plugins);
  });

  it("作为插件交给app.use而批量批量注册", () => {
    const A = defineComponent({ name: "A", render: () => null });
    const B = defineComponent({ name: "B", render: () => null });
    const app = createApp({ render: () => null });

    app.use(createInstaller([attachInstall(A), attachInstall(B)]));

    expect(app.component("A")).toBe(A);
    expect(app.component("B")).toBe(B);
  });
});
