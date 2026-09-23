import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { h, nextTick } from "vue";
import Collapse from "../Collapse.vue";
import CollapseItem from "../CollapseItem.vue";

library.add(faAngleRight);

/**
 * v-show 在 jsdom 下通过内联 style.display 控制显示，
 * isVisible() 有时检测不准，这里统一用 style.display 判断
 */
const isShown = (wrapper: { element: Element }) =>
  (wrapper.element as HTMLElement).style.display !== "none";

describe("Collapse 折叠面板", () => {
  const createCollapse = (props = {}) => {
    return mount(Collapse, {
      props: {
        moduleValue: [],
        ...props,
      },
      slots: {
        default: () => [
          h(CollapseItem, { name: "item1", title: "标题1" }, () => "内容1"),
          h(CollapseItem, { name: "item2", title: "标题2" }, () => "内容2"),
          h(CollapseItem, { name: "item3", title: "标题3" }, () => "内容3"),
        ],
      },
    });
  };

  it("渲染折叠面板和子项", () => {
    const wrapper = createCollapse();
    expect(wrapper.classes()).toContain("u-collapse");
    expect(wrapper.findAll(".u-collapse-item")).toHaveLength(3);
  });

  it("点击头部展开/收起内容", async () => {
    const wrapper = createCollapse();
    const headers = wrapper.findAll(".u-collapse-item__header");
    const contents = wrapper.findAll(".u-collapse-item__wrapper");

    // 初始状态：全部收起
    contents.forEach((content) => {
      expect(isShown(content)).toBe(false);
    });

    // 点击第一个头部
    await headers[0].trigger("click");
    await nextTick();

    // 第一个内容展开，其余收起
    expect(isShown(contents[0])).toBe(true);
    expect(isShown(contents[1])).toBe(false);
    expect(isShown(contents[2])).toBe(false);

    // 再次点击第一个头部，收起
    await headers[0].trigger("click");
    await nextTick();
    expect(isShown(contents[0])).toBe(false);
  });

  it("支持默认展开指定项", () => {
    const wrapper = createCollapse({ moduleValue: ["item1", "item3"] });
    const contents = wrapper.findAll(".u-collapse-item__wrapper");

    expect(isShown(contents[0])).toBe(true);
    expect(isShown(contents[1])).toBe(false);
    expect(isShown(contents[2])).toBe(true);
  });

  it("手风琴模式下同时只能展开一项", async () => {
    const wrapper = createCollapse({ accordion: true, moduleValue: ["item1"] });
    const headers = wrapper.findAll(".u-collapse-item__header");
    const contents = wrapper.findAll(".u-collapse-item__wrapper");

    // 初始只展开 item1
    expect(isShown(contents[0])).toBe(true);
    expect(isShown(contents[1])).toBe(false);

    // 点击 item2
    await headers[1].trigger("click");
    await nextTick();

    // item1 收起，item2 展开
    expect(isShown(contents[0])).toBe(false);
    expect(isShown(contents[1])).toBe(true);

    // 再次点击 item2，全部收起
    await headers[1].trigger("click");
    await nextTick();
    expect(isShown(contents[0])).toBe(false);
    expect(isShown(contents[1])).toBe(false);
  });

  it("禁用状态下不可点击", async () => {
    const wrapper = mount(Collapse, {
      props: { moduleValue: [] },
      slots: {
        default: () => [
          h(
            CollapseItem,
            { name: "item1", title: "标题1", disabled: true },
            () => "内容1",
          ),
        ],
      },
    });

    const header = wrapper.find(".u-collapse-item__header");
    expect(header.classes()).toContain("is-disabled");

    await header.trigger("click");
    await nextTick();

    const content = wrapper.find(".u-collapse-item__wrapper");
    expect(isShown(content)).toBe(false);
  });

  it("触发 update:moduleValue 和 change 事件", async () => {
    const onUpdate = vi.fn();
    const onChange = vi.fn();

    const wrapper = mount(Collapse, {
      props: {
        moduleValue: [],
        "onUpdate:moduleValue": onUpdate,
        onChange,
      },
      slots: {
        default: () => [
          h(CollapseItem, { name: "item1", title: "标题1" }, () => "内容1"),
        ],
      },
    });

    const header = wrapper.find(".u-collapse-item__header");
    await header.trigger("click");
    await nextTick();

    expect(onUpdate).toHaveBeenCalledWith(["item1"]);
    expect(onChange).toHaveBeenCalledWith(["item1"]);
  });

  it("支持通过 slot 自定义标题", () => {
    const wrapper = mount(Collapse, {
      props: { moduleValue: [] },
      slots: {
        default: () => [
          h(
            CollapseItem,
            { name: "item1" },
            {
              title: () => h("span", { class: "custom-title" }, "自定义标题"),
              default: () => "内容1",
            },
          ),
        ],
      },
    });

    expect(wrapper.find(".custom-title").exists()).toBe(true);
    expect(wrapper.find(".custom-title").text()).toBe("自定义标题");
  });

  it("根据激活状态生成正确的类名", async () => {
    const wrapper = createCollapse({ moduleValue: ["item1"] });
    const headers = wrapper.findAll(".u-collapse-item__header");

    expect(headers[0].classes()).toContain("is-active");
    expect(headers[1].classes()).not.toContain("is-active");

    await headers[1].trigger("click");
    await nextTick();

    expect(headers[0].classes()).toContain("is-active");
    expect(headers[1].classes()).toContain("is-active");
  });
});
