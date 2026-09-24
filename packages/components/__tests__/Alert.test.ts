import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Alert from "../Alert/Alert.vue";
import { UIcon } from "../Icon";
import type { AlertProps } from "../Alert/types";

library.add(
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faTriangleExclamation,
  faXmark,
);

const mountAlert = (props: Partial<AlertProps> = {}, slots = {}) =>
  mount(Alert, {
    props: {
      type: "info",
      ...props,
    },
    slots,
    global: {
      components: { UIcon },
    },
  });

describe("Alert 警告", () => {
  it("默认渲染根元素，带 u-alert 类和 u-alert--info 类", () => {
    const wrapper = mountAlert();
    expect(wrapper.classes()).toContain("u-alert");
    expect(wrapper.classes()).toContain("u-alert--info");
  });

  it("type 变化时生成对应类名", () => {
    for (const type of ["success", "warning", "danger", "info"] as const) {
      expect(mountAlert({ type }).classes()).toContain(`u-alert--${type}`);
    }
  });

  it("center 时生成 is-center 类", () => {
    expect(mountAlert({ center: true }).classes()).toContain("is-center");
    expect(mountAlert({ center: false }).classes()).not.toContain("is-center");
  });

  it("通过 title prop 渲染标题", () => {
    const wrapper = mountAlert({ title: "操作成功" });
    expect(wrapper.find(".u-alert__title").text()).toBe("操作成功");
  });

  it("通过 description prop 渲染描述", () => {
    const wrapper = mountAlert({ description: "这是一段描述" });
    expect(wrapper.find(".u-alert__description").text()).toBe("这是一段描述");
  });

  it("title slot 覆盖 title prop", () => {
    const wrapper = mountAlert(
      { title: "prop 标题" },
      { title: () => "slot 标题" },
    );
    expect(wrapper.find(".u-alert__title").text()).toBe("slot 标题");
  });

  it("默认 slot 覆盖 description prop", () => {
    const wrapper = mountAlert(
      { description: "prop 描述" },
      { default: () => "slot 描述" },
    );
    expect(wrapper.find(".u-alert__description").text()).toBe("slot 描述");
  });

  it("无标题和无描述时不渲染对应块", () => {
    const wrapper = mountAlert();
    expect(wrapper.find(".u-alert__title").exists()).toBe(false);
    expect(wrapper.find(".u-alert__description").exists()).toBe(false);
  });

  it("showIcon 默认 true，渲染图标", () => {
    const wrapper = mountAlert();
    expect(wrapper.find(".u-alert__icon").exists()).toBe(true);
  });

  it("showIcon=false 时不渲染图标", () => {
    const wrapper = mountAlert({ showIcon: false });
    expect(wrapper.find(".u-alert__icon").exists()).toBe(false);
  });

  it("closable 默认 true，渲染关闭按钮", () => {
    const wrapper = mountAlert();
    expect(wrapper.find(".u-alert__close").exists()).toBe(true);
  });

  it("closable=false 时不渲染关闭按钮", () => {
    const wrapper = mountAlert({ closable: false });
    expect(wrapper.find(".u-alert__close").exists()).toBe(false);
  });

  it("closeText 有值时关闭按钮显示文字", () => {
    const wrapper = mountAlert({ closeText: "关闭" });
    expect(wrapper.find(".u-alert__close").text()).toBe("关闭");
  });

  it("无 closeText 时关闭按钮显示图标", () => {
    const wrapper = mountAlert();
    expect(wrapper.find(".u-alert__close .u-icon").exists()).toBe(true);
  });

  it("点击关闭按钮触发 close 事件并透传 MouseEvent", async () => {
    const wrapper = mountAlert();

    await wrapper.find(".u-alert__close").trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
    expect(wrapper.emitted("close")![0][0]).toBeInstanceOf(MouseEvent);
  });

  it("点击关闭后组件从 DOM 移除", async () => {
    const wrapper = mountAlert({ title: "提示" });
    expect(wrapper.find(".u-alert").exists()).toBe(true);

    await wrapper.find(".u-alert__close").trigger("click");

    expect(wrapper.find(".u-alert").exists()).toBe(false);
  });

  it("closable=false 时组件不会被关闭", async () => {
    const wrapper = mountAlert({ closable: false, title: "提示" });

    expect(wrapper.find(".u-alert").exists()).toBe(true);
    expect(wrapper.find(".u-alert__close").exists()).toBe(false);
    // 没有关闭按钮，DOM 始终存在
    expect(wrapper.find(".u-alert").exists()).toBe(true);
  });
});
