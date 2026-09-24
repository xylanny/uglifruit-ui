import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Input from "../Input/Input.vue";
import { UIcon } from "../Icon";
import type { InputProps } from "../Input/types";

const mountInput = (props: Partial<InputProps> = {}, slots = {}) =>
  mount(Input, {
    props: {
      modelValue: "",
      ...props,
    },
    slots,
    global: {
      components: { UIcon },
    },
  });

describe("Input 输入框", () => {
  it("默认渲染 input 元素，带 u-input 类", () => {
    const wrapper = mountInput();
    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.classes()).toContain("u-input");
  });

  it("size 生成对应类名", () => {
    for (const size of ["large", "default", "small"] as const) {
      expect(mountInput({ size }).classes()).toContain(`u-input--${size}`);
    }
  });

  it("type 透传到原生 input", () => {
    expect(mountInput({ type: "email" }).find("input").attributes("type")).toBe(
      "email",
    );
    expect(
      mountInput({ type: "number" }).find("input").attributes("type"),
    ).toBe("number");
  });

  it("placeholder 透传到原生 input", () => {
    const wrapper = mountInput({ placeholder: "请输入" });
    expect(wrapper.find("input").attributes("placeholder")).toBe("请输入");
  });

  it("disabled 时 input 被禁用并带 is-disabled 类", () => {
    const wrapper = mountInput({ disabled: true });
    expect(wrapper.find("input").attributes("disabled")).toBeDefined();
    expect(wrapper.classes()).toContain("is-disabled");
  });

  it("readonly 时 input 只读", () => {
    const wrapper = mountInput({ readonly: true });
    expect(wrapper.find("input").attributes("readonly")).toBeDefined();
  });

  it("modelValue 渲染到 input value", () => {
    const wrapper = mountInput({ modelValue: "hello" });
    expect(wrapper.find("input").element.value).toBe("hello");
  });

  it("输入触发 update:modelValue 与 input 事件", async () => {
    const wrapper = mountInput();
    await wrapper.find("input").setValue("abc");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual(["abc"]);
    expect(wrapper.emitted("input")).toBeTruthy();
  });

  it("change 事件透传", async () => {
    const wrapper = mountInput();
    await wrapper.find("input").trigger("change");
    expect(wrapper.emitted("change")).toBeTruthy();
  });

  it("focus / blur 事件透传并更新 is-focus 类", async () => {
    const wrapper = mountInput();
    await wrapper.find("input").trigger("focus");
    expect(wrapper.emitted("focus")).toBeTruthy();
    expect(wrapper.classes()).toContain("is-focus");

    await wrapper.find("input").trigger("blur");
    expect(wrapper.emitted("blur")).toBeTruthy();
    expect(wrapper.classes()).not.toContain("is-focus");
  });

  it("maxlength / minlength 透传到原生 input", () => {
    const wrapper = mountInput({ maxlength: 10, minlength: 2 });
    expect(wrapper.find("input").attributes("maxlength")).toBe("10");
    expect(wrapper.find("input").attributes("minlength")).toBe("2");
  });

  it("prefixIcon 渲染前缀图标", () => {
    const wrapper = mountInput({ prefixIcon: "user" });
    expect(wrapper.find(".u-input__prefix-icon").exists()).toBe(true);
  });

  it("suffixIcon 渲染后缀图标", () => {
    const wrapper = mountInput({ suffixIcon: "search" });
    expect(wrapper.find(".u-input__suffix-icon").exists()).toBe(true);
  });

  it("clearable 且有值且聚焦时渲染清空图标", async () => {
    const wrapper = mountInput({ clearable: true, modelValue: "abc" });
    expect(wrapper.find(".u-input__clear-icon").exists()).toBe(false);

    await wrapper.find("input").trigger("focus");
    expect(wrapper.find(".u-input__clear-icon").exists()).toBe(true);
  });

  it("点击清空图标触发 clear 并重置值", async () => {
    const wrapper = mountInput({ clearable: true, modelValue: "abc" });
    await wrapper.find("input").trigger("focus");
    await wrapper.find(".u-input__clear-icon").trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual([""]);
    expect(wrapper.emitted("clear")).toBeTruthy();
  });

  it("showPassword 时切换密码可见性", async () => {
    const wrapper = mountInput({ type: "password", showPassword: true });
    expect(wrapper.find("input").attributes("type")).toBe("password");

    await wrapper.find(".u-input__suffix-icon").trigger("click");
    expect(wrapper.find("input").attributes("type")).toBe("text");

    await wrapper.find(".u-input__suffix-icon").trigger("click");
    expect(wrapper.find("input").attributes("type")).toBe("password");
  });
});

describe("Input 暴露的方法", () => {
  it("expose.ref 指向 input 元素", () => {
    const wrapper = mountInput();
    const exposed = wrapper.vm as unknown as {
      ref: HTMLInputElement | null;
    };
    expect(exposed.ref).toBe(wrapper.find("input").element);
  });

  it("expose.focus / blur 可调用", () => {
    const wrapper = mountInput();
    const exposed = wrapper.vm as unknown as {
      focus: () => void;
      blur: () => void;
    };
    expect(() => exposed.focus()).not.toThrow();
    expect(() => exposed.blur()).not.toThrow();
  });

  it("expose.clear 重置值", () => {
    const wrapper = mountInput({ modelValue: "abc" });
    const exposed = wrapper.vm as unknown as { clear: () => void };
    exposed.clear();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual([""]);
    expect(wrapper.emitted("clear")).toBeTruthy();
  });
});
