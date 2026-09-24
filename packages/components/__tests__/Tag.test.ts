import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Tag from "../Tag/Tag.vue";
import { UIcon } from "../Icon";
import type { TagProps } from "../Tag/types";

library.add(faXmark, faCheck);

const mountTag = (props: Partial<TagProps> = {}, slots = {}) =>
  mount(Tag, {
    props: {
      type: "primary",
      ...props,
    },
    slots,
    global: {
      components: { UIcon },
    },
  });

describe("Tag 标签", () => {
  it("默认渲染 span，带 u-tag 和 u-tag--primary 类", () => {
    const wrapper = mountTag();
    expect(wrapper.element.tagName).toBe("SPAN");
    expect(wrapper.classes()).toContain("u-tag");
    expect(wrapper.classes()).toContain("u-tag--primary");
  });

  it("默认 size=default、effect=light", () => {
    const wrapper = mountTag();
    expect(wrapper.classes()).toContain("u-tag--default");
    expect(wrapper.classes()).toContain("u-tag--light");
  });

  it("type 变化时生成对应类名", () => {
    for (const type of [
      "primary",
      "success",
      "warning",
      "danger",
      "info",
    ] as const) {
      expect(mountTag({ type }).classes()).toContain(`u-tag--${type}`);
    }
  });

  it("size 变化时生成对应类名", () => {
    for (const size of ["large", "default", "small"] as const) {
      expect(mountTag({ size }).classes()).toContain(`u-tag--${size}`);
    }
  });

  it("effect 变化时生成对应类名", () => {
    for (const effect of ["light", "dark", "plain"] as const) {
      expect(mountTag({ effect }).classes()).toContain(`u-tag--${effect}`);
    }
  });

  it("round / disabled / closable 生成对应状态类", () => {
    expect(mountTag({ round: true }).classes()).toContain("is-round");
    expect(mountTag({ disabled: true }).classes()).toContain("is-disabled");
    expect(mountTag({ closable: true }).classes()).toContain("is-closable");
  });

  it("渲染默认 slot 内容", () => {
    const wrapper = mountTag({}, { default: () => "标签" });
    expect(wrapper.find(".u-tag__content").text()).toBe("标签");
  });

  it("closable 默认 false，不渲染关闭按钮", () => {
    const wrapper = mountTag();
    expect(wrapper.find(".u-tag__close").exists()).toBe(false);
  });

  it("closable=true 时渲染关闭按钮", () => {
    const wrapper = mountTag({ closable: true });
    expect(wrapper.find(".u-tag__close").exists()).toBe(true);
  });

  it("关闭按钮默认渲染 xmark 图标", () => {
    const wrapper = mountTag({ closable: true });
    expect(wrapper.find(".u-tag__close .u-icon").exists()).toBe(true);
  });

  it("closeIcon 可自定义关闭图标名", () => {
    const wrapper = mountTag({ closable: true, closeIcon: "check" });
    expect(wrapper.find(".u-tag__close .u-icon").exists()).toBe(true);
  });

  it("close slot 覆盖默认图标", () => {
    const wrapper = mountTag({ closable: true }, { close: () => "×" });
    expect(wrapper.find(".u-tag__close").text()).toBe("×");
  });

  it("点击关闭按钮触发 close 事件并透传 MouseEvent", async () => {
    const wrapper = mountTag({ closable: true });

    await wrapper.find(".u-tag__close").trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
    expect(wrapper.emitted("close")![0][0]).toBeInstanceOf(MouseEvent);
  });

  it("点击关闭按钮不冒泡到根元素的 click", async () => {
    const wrapper = mountTag({ closable: true });

    await wrapper.find(".u-tag__close").trigger("click");

    expect(wrapper.emitted("click")).toBeFalsy();
  });

  it("disabled 时点击关闭按钮不触发 close", async () => {
    const wrapper = mountTag({ closable: true, disabled: true });

    await wrapper.find(".u-tag__close").trigger("click");

    expect(wrapper.emitted("close")).toBeFalsy();
  });

  it("点击标签触发 click 事件并透传 MouseEvent", async () => {
    const wrapper = mountTag();

    await wrapper.trigger("click");

    expect(wrapper.emitted("click")).toBeTruthy();
    expect(wrapper.emitted("click")![0][0]).toBeInstanceOf(MouseEvent);
  });

  it("disabled 时点击不触发 click", async () => {
    const wrapper = mountTag({ disabled: true });

    await wrapper.trigger("click");

    expect(wrapper.emitted("click")).toBeFalsy();
  });
});
