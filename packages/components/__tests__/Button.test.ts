import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { h } from "vue";
import Button from "../Button/Button.vue";
import { UIcon } from "../Icon";
import type { ButtonProps } from "../Button/types";

library.add(faUser, faSpinner);

const mountButton = (props: Partial<ButtonProps> = {}, slots = {}) =>
  mount(Button, {
    props: {
      nativeType: "button",
      duration: 500,
      ...props,
    },
    slots,
    global: {
      components: { UIcon },
    },
  });

describe("Button 按钮", () => {
  it("默认渲染为 button 元素，带 u-button 类", () => {
    const wrapper = mountButton();
    expect(wrapper.element.tagName).toBe("BUTTON");
    expect(wrapper.classes()).toContain("u-button");
  });

  it("tag 变化时渲染对应元素", () => {
    expect(mountButton({ tag: "a" }).element.tagName).toBe("A");
    expect(mountButton({ tag: "div" }).element.tagName).toBe("DIV");
  });

  it("tag 可以是组件", () => {
    const RouterLink = h("a", { class: "router-link" });
    const wrapper = mountButton({ tag: () => RouterLink });
    expect(wrapper.classes()).toContain("u-button");
  });

  it("tag 为 button 时应用 nativeType", () => {
    expect(mountButton({ nativeType: "submit" }).attributes("type")).toBe(
      "submit",
    );
    expect(mountButton({ nativeType: "reset" }).attributes("type")).toBe(
      "reset",
    );
    expect(mountButton({ nativeType: "button" }).attributes("type")).toBe(
      "button",
    );
  });

  it("tag 非 button 时不渲染 type 属性", () => {
    const wrapper = mountButton({ tag: "a", nativeType: "submit" });
    expect(wrapper.attributes("type")).toBeUndefined();
  });

  it("type 生成对应类名", () => {
    for (const type of [
      "primary",
      "success",
      "warning",
      "danger",
      "info",
    ] as const) {
      expect(mountButton({ type }).classes()).toContain(`u-button--${type}`);
    }
  });

  it("size 生成对应类名", () => {
    for (const size of ["large", "default", "small"] as const) {
      expect(mountButton({ size }).classes()).toContain(`u-button--${size}`);
    }
  });

  it("plain / round / circle 生成对应状态类", () => {
    expect(mountButton({ plain: true }).classes()).toContain("is-plain");
    expect(mountButton({ round: true }).classes()).toContain("is-round");
    expect(mountButton({ circle: true }).classes()).toContain("is-circle");
  });

  it("disabled 时 button 元素被禁用", () => {
    const wrapper = mountButton({ disabled: true });
    expect(wrapper.attributes("disabled")).toBeDefined();
  });

  it("loading 时同时禁用 button", () => {
    const wrapper = mountButton({ loading: true });
    expect(wrapper.attributes("disabled")).toBeDefined();
  });

  it("未 disabled 且未 loading 时不渲染 disabled 属性", () => {
    const wrapper = mountButton();
    expect(wrapper.attributes("disabled")).toBeUndefined();
  });

  it("loading 时渲染 loading 图标并带 is-loading 类", () => {
    const wrapper = mountButton({ loading: true });
    expect(wrapper.classes()).toContain("is-loading");
    expect(wrapper.find(".u-button__icon-loading").exists()).toBe(true);
  });

  it("loading 时优先展示 loading 图标，隐藏常规 icon", () => {
    const wrapper = mountButton({ loading: true, icon: "user" });
    expect(wrapper.find(".u-button__icon-loading").exists()).toBe(true);
    expect(wrapper.find(".u-button__icon").exists()).toBe(false);
  });

  it("loading 时不渲染默认 slot 内容", () => {
    const wrapper = mountButton({ loading: true }, { default: () => "提交" });
    expect(wrapper.text()).not.toContain("提交");
  });

  it("loading 时渲染 loading slot", () => {
    const wrapper = mountButton(
      { loading: true },
      { loading: () => "加载中..." },
    );
    expect(wrapper.text()).toContain("加载中...");
    expect(wrapper.find(".u-button__icon-loading").exists()).toBe(false);
  });

  it("loadingIcon 可自定义 loading 图标名", () => {
    const wrapper = mountButton({ loading: true, loadingIcon: "spinner" });
    expect(wrapper.find(".u-button__icon-loading").exists()).toBe(true);
  });

  it("非 loading 且有 icon 时渲染 icon", () => {
    const wrapper = mountButton({ icon: "user" });
    expect(wrapper.find(".u-button__icon").exists()).toBe(true);
  });

  it("非 loading 且无 icon 时不渲染 icon", () => {
    const wrapper = mountButton();
    expect(wrapper.find(".u-button__icon").exists()).toBe(false);
  });

  it("渲染默认 slot 内容", () => {
    const wrapper = mountButton({}, { default: () => "提交" });
    expect(wrapper.text()).toBe("提交");
  });
});

describe("Button 点击", () => {
  it("点击触发 click 事件并透传 MouseEvent", async () => {
    const wrapper = mountButton({ throttled: false });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
    expect(wrapper.emitted("click")![0][0]).toBeInstanceOf(MouseEvent);
  });

  it("throttled 开启时同一窗口内多次点击只触发一次", async () => {
    const wrapper = mountButton({ throttled: true, duration: 200 });
    await wrapper.trigger("click");
    await wrapper.trigger("click");
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("throttled 关闭时多次点击每次都触发", async () => {
    const wrapper = mountButton({ throttled: false });
    await wrapper.trigger("click");
    await wrapper.trigger("click");
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(3);
  });
});

describe("Button 暴露的 ref", () => {
  it("expose.ref 指向根 button 元素", () => {
    const wrapper = mountButton();
    const exposed = wrapper.vm as unknown as {
      ref: HTMLButtonElement | null;
    };
    expect(exposed.ref).toBe(wrapper.element);
  });
});
