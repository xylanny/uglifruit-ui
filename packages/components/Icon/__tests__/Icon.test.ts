import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Icon from "../Icon.vue";

// 前提：将图标注册进FontAwesome的library
library.add(faUser);

describe("图标渲染", () => {
  it("将Props交给FontAwesome组件", () => {
    const wrapper = mount(Icon, { props: { icon: faUser } });
    expect(wrapper.element.tagName).toBe("I");
    expect(wrapper.classes()).toContain("ta-icon");
    const svg = wrapper.find("svg");
    expect(svg.exists()).toBe(true);
    expect(svg.classes()).toContain("fa-user");
  });

  it("支持用字符串名字引用已注册的图标", () => {
    const wrapper = mount(Icon, { props: { icon: "user" } });
    const svg = wrapper.find("svg");
    expect(svg.exists()).toBe(true);
    expect(svg.attributes("data-icon")).toBe("user");
  });

  it("根据type Prop生成形状相关的类名，不传时不生成", () => {
    for (const type of [
      "primary",
      "success",
      "info",
      "warning",
      "danger",
    ] as const) {
      expect(
        mount(Icon, { props: { icon: faUser, type } }).classes(),
      ).toContain(`ta-icon--${type}`);
    }
    expect(
      mount(Icon, { props: { icon: faUser } })
        .classes()
        .filter((name) => name.startsWith("ta-icon--")),
    ).toEqual([]);
  });

  it("将color Prop应用在内联样式上", () => {
    const wrapper = mount(Icon, {
      props: { icon: faUser, color: "#ff4949" },
    });
    expect((wrapper.element as HTMLElement).style.color).toBe(
      "rgb(255, 73, 73)",
    );
  });

  it("不会将type、color Prop透传给FontAwesome组件", () => {
    const wrapper = mount(Icon, {
      props: { icon: faUser, type: "primary", color: "#ff4949" },
    });
    const svg = wrapper.find("svg");
    expect(svg.attributes("type")).toBeUndefined();
    expect(svg.attributes("color")).toBeUndefined();
  });

  it("将其余Props原样转发给FontAwesome组件", () => {
    const wrapper = mount(Icon, {
      props: { icon: faUser, spin: true, size: "2x", fixedWidth: true },
    });
    const classes = wrapper.find("svg").classes();
    expect(classes).toContain("fa-spin");
    expect(classes).toContain("fa-2x");
    expect(classes).toContain("fa-fw");
  });

  it("将未声明接收的prop($attrs)落到根元素", () => {
    const wrapper = mount(Icon, {
      props: { icon: faUser },
      attrs: { id: "my-icon", "data-test": "icon", class: "extra" },
    });
    expect(wrapper.attributes("id")).toBe("my-icon");
    expect(wrapper.attributes("data-test")).toBe("icon");
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(["ta-icon", "extra"]),
    );
  });
});
