import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { UIcon } from "../Icon";
import Switch from "../Switch/Switch.vue";

library.add(faSpinner);

const mountSwitch = (props: Record<string, unknown> = {}) =>
  mount(Switch, {
    props: {
      modelValue: false,
      ...props,
    },
    global: {
      components: { UIcon },
    },
    attachTo: document.body,
  });

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Switch 基础", () => {
  it("渲染容器和开关主体", () => {
    const wrapper = mountSwitch();
    expect(wrapper.classes()).toContain("u-switch");
    expect(wrapper.find(".u-switch__core").exists()).toBe(true);
    expect(wrapper.find(".u-switch__action").exists()).toBe(true);
  });

  it("size 生成对应类名", () => {
    for (const size of ["large", "default", "small"] as const) {
      expect(mountSwitch({ size }).classes()).toContain(`u-switch--${size}`);
    }
  });

  it("modelValue 等于 activeValue 时添加 is-checked", () => {
    expect(mountSwitch({ modelValue: true }).classes()).toContain("is-checked");
  });

  it("modelValue 等于 inactiveValue 时不添加 is-checked", () => {
    expect(mountSwitch({ modelValue: false }).classes()).not.toContain(
      "is-checked",
    );
  });

  it("disabled 时添加 is-disabled 且 input 被禁用", () => {
    const wrapper = mountSwitch({ disabled: true });
    expect(wrapper.classes()).toContain("is-disabled");
    expect(wrapper.find("input").attributes("disabled")).toBeDefined();
  });

  it("loading 时添加 is-loading 且渲染加载图标", () => {
    const wrapper = mountSwitch({ loading: true });
    expect(wrapper.classes()).toContain("is-loading");
    expect(wrapper.find(".u-switch__loading").exists()).toBe(true);
  });

  it("name 透传到 input", () => {
    const wrapper = mountSwitch({ name: "enabled" });
    expect(wrapper.find("input").attributes("name")).toBe("enabled");
  });
});

describe("Switch 切换", () => {
  it("点击触发 update:modelValue，值为 activeValue", async () => {
    const wrapper = mountSwitch({ modelValue: false });
    await wrapper.find(".u-switch").trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0][0]).toBe(true);
  });

  it("已选中时点击返回 inactiveValue", async () => {
    const wrapper = mountSwitch({ modelValue: true });
    await wrapper.find(".u-switch").trigger("click");
    expect(wrapper.emitted("update:modelValue")![0][0]).toBe(false);
  });

  it("同时触发 change 事件", async () => {
    const wrapper = mountSwitch({ modelValue: false });
    await wrapper.find(".u-switch").trigger("click");
    expect(wrapper.emitted("change")).toBeTruthy();
    expect(wrapper.emitted("change")![0][0]).toBe(true);
  });

  it("自定义 activeValue / inactiveValue", async () => {
    const wrapper = mountSwitch({
      modelValue: "no",
      activeValue: "yes",
      inactiveValue: "no",
    });
    await wrapper.find(".u-switch").trigger("click");
    expect(wrapper.emitted("update:modelValue")![0][0]).toBe("yes");
  });

  it("disabled 时点击不触发更新", async () => {
    const wrapper = mountSwitch({ modelValue: false, disabled: true });
    await wrapper.find(".u-switch").trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  });

  it("loading 时点击不触发更新", async () => {
    const wrapper = mountSwitch({ modelValue: false, loading: true });
    await wrapper.find(".u-switch").trigger("click");
    await nextTick();
    expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  });
});

describe("Switch 文本", () => {
  it("选中时右侧显示 activeText", () => {
    const wrapper = mountSwitch({
      modelValue: true,
      activeText: "开",
      inactiveText: "关",
    });
    expect(wrapper.find(".u-switch__label--right").text()).toBe("开");
    expect(wrapper.find(".u-switch__label--left").text()).toBe("关");
  });

  it("未选中时右侧仍显示 activeText，但只有左侧高亮", () => {
    const wrapper = mountSwitch({
      modelValue: false,
      activeText: "开",
      inactiveText: "关",
    });
    expect(wrapper.find(".u-switch__label--right").text()).toBe("开");
    expect(wrapper.find(".u-switch__label--left").text()).toBe("关");
    expect(wrapper.find(".u-switch__label--left").classes()).toContain(
      "is-active",
    );
    expect(wrapper.find(".u-switch__label--right").classes()).not.toContain(
      "is-active",
    );
  });

  it("仅配置 activeText 时只渲染右侧标签", () => {
    const wrapper = mountSwitch({ modelValue: true, activeText: "开" });
    expect(wrapper.find(".u-switch__label--right").exists()).toBe(true);
    expect(wrapper.find(".u-switch__label--left").exists()).toBe(false);
  });

  it("仅配置 inactiveText 时只渲染左侧标签", () => {
    const wrapper = mountSwitch({ modelValue: false, inactiveText: "关" });
    expect(wrapper.find(".u-switch__label--left").exists()).toBe(true);
    expect(wrapper.find(".u-switch__label--right").exists()).toBe(false);
  });
});

describe("Switch 颜色", () => {
  it("activeColor 应用到 core 的背景色", () => {
    const wrapper = mountSwitch({
      modelValue: true,
      activeColor: "#13ce66",
    });
    const core = wrapper.find(".u-switch__core").element as HTMLElement;
    expect(core.style.backgroundColor).toBe("rgb(19, 206, 102)");
  });

  it("inactiveColor 应用到 core 的背景色", () => {
    const wrapper = mountSwitch({
      modelValue: false,
      inactiveColor: "#ff4949",
    });
    const core = wrapper.find(".u-switch__core").element as HTMLElement;
    expect(core.style.backgroundColor).toBe("rgb(255, 73, 73)");
  });

  it("未配置颜色时 core 不产生内联背景色", () => {
    const wrapper = mountSwitch({ modelValue: true });
    const core = wrapper.find(".u-switch__core").element as HTMLElement;
    expect(core.style.backgroundColor).toBe("");
  });
});

describe("Switch 暴露的 ref", () => {
  it("ref 指向内部 input", () => {
    const wrapper = mountSwitch();
    const exposed = wrapper.vm as unknown as { ref: HTMLInputElement | null };
    expect(exposed.ref).toBe(wrapper.find("input").element);
  });

  it("focus 聚焦 input", async () => {
    const wrapper = mountSwitch();
    const input = wrapper.find("input").element as HTMLInputElement;
    const exposed = wrapper.vm as unknown as { focus: () => void };
    exposed.focus();
    await nextTick();
    expect(document.activeElement).toBe(input);
  });

  it("blur 使 input 失焦", async () => {
    const wrapper = mountSwitch();
    const input = wrapper.find("input").element as HTMLInputElement;
    const exposed = wrapper.vm as unknown as {
      focus: () => void;
      blur: () => void;
    };
    exposed.focus();
    await nextTick();
    expect(document.activeElement).toBe(input);
    exposed.blur();
    await nextTick();
    expect(document.activeElement).not.toBe(input);
  });
});
