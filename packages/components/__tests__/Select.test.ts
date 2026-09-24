import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleDown,
  faCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { h, nextTick } from "vue";
import { UIcon } from "../Icon";
import { UTag } from "../Tag";
import Select from "../Select/Select.vue";
import SelectOption from "../Select/SelectOption.vue";

library.add(faAngleDown, faCheck, faCircleXmark);

const mountSelect = (props: Record<string, unknown> = {}, slots = {}) =>
  mount(Select, {
    props: { placeholder: "请选择", ...props },
    slots,
    global: { components: { UIcon, UTag } },
    attachTo: document.body,
  });

describe("Select 基础", () => {
  it("渲染容器与占位符", () => {
    const wrapper = mountSelect();
    expect(wrapper.classes()).toContain("u-select");
    expect(wrapper.find(".u-select__placeholder").text()).toBe("请选择");
  });

  it("size 生成对应类名", () => {
    for (const size of ["large", "default", "small"] as const) {
      expect(mountSelect({ size }).classes()).toContain(`u-select--${size}`);
    }
  });

  it("disabled 添加 is-disabled 类", () => {
    expect(mountSelect({ disabled: true }).classes()).toContain("is-disabled");
  });

  it("multiple 添加 is-multiple 类", () => {
    expect(mountSelect({ multiple: true }).classes()).toContain("is-multiple");
  });

  it("filterable 渲染输入框", () => {
    expect(
      mountSelect({ filterable: true }).find(".u-select__input").exists(),
    ).toBe(true);
  });
});

describe("Select 选项", () => {
  const slots = {
    default: () => [
      h(SelectOption, { value: "a", label: "A" }),
      h(SelectOption, { value: "b", label: "B" }),
    ],
  };

  it("点击触发器显示菜单", async () => {
    const wrapper = mountSelect({}, slots);
    await wrapper.find(".u-select__trigger").trigger("click");
    await nextTick();
    expect(wrapper.find(".u-select__menu").isVisible()).toBe(true);
  });

  it("渲染选项列表", async () => {
    const wrapper = mountSelect({}, slots);
    await wrapper.find(".u-select__trigger").trigger("click");
    await nextTick();
    expect(wrapper.findAll(".u-select-option")).toHaveLength(2);
  });

  it("选中触发 update:modelValue 与 change", async () => {
    const wrapper = mountSelect({}, slots);
    await wrapper.find(".u-select__trigger").trigger("click");
    await nextTick();
    await wrapper.find(".u-select-option").trigger("click");
    expect(wrapper.emitted("update:modelValue")![0][0]).toBe("a");
    expect(wrapper.emitted("change")).toBeTruthy();
  });

  it("单选选中后关闭菜单", async () => {
    const wrapper = mountSelect({}, slots);
    await wrapper.find(".u-select__trigger").trigger("click");
    await nextTick();
    await wrapper.find(".u-select-option").trigger("click");
    await nextTick();
    expect(wrapper.find(".u-select__menu").isVisible()).toBe(false);
  });

  it("disabled 选项不响应点击", async () => {
    const wrapper = mountSelect(
      {},
      {
        default: () => [
          h(SelectOption, { value: "a", label: "A", disabled: true }),
        ],
      },
    );
    await wrapper.find(".u-select__trigger").trigger("click");
    await nextTick();
    await wrapper.find(".u-select-option").trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  });
});

describe("Select 多选", () => {
  const slots = {
    default: () => [
      h(SelectOption, { value: "a", label: "A" }),
      h(SelectOption, { value: "b", label: "B" }),
    ],
  };

  it("选中项加入数组", async () => {
    const wrapper = mountSelect({ multiple: true, modelValue: [] }, slots);
    await wrapper.find(".u-select__trigger").trigger("click");
    await nextTick();
    await wrapper.findAll(".u-select-option")[0].trigger("click");
    await nextTick();
    await wrapper.setProps({ modelValue: ["a"] });
    await nextTick();
    await wrapper.findAll(".u-select-option")[1].trigger("click");

    expect(wrapper.emitted("update:modelValue")![0][0]).toEqual(["a"]);
    expect(wrapper.emitted("update:modelValue")![1][0]).toEqual(["a", "b"]);
  });

  it("再次点击取消选中", async () => {
    const wrapper = mountSelect({ multiple: true, modelValue: ["a"] }, slots);
    await wrapper.find(".u-select__trigger").trigger("click");
    await nextTick();
    await wrapper.findAll(".u-select-option")[0].trigger("click");
    expect(wrapper.emitted("update:modelValue")![0][0]).toEqual([]);
  });

  it("multipleLimit 限制最大选中数", async () => {
    const wrapper = mountSelect(
      { multiple: true, multipleLimit: 1, modelValue: ["a"] },
      slots,
    );
    await wrapper.find(".u-select__trigger").trigger("click");
    await nextTick();
    await wrapper.findAll(".u-select-option")[1].trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  });
});

describe("Select 清空", () => {
  it("clearable 悬停显示清空图标", async () => {
    const wrapper = mountSelect({ clearable: true, modelValue: "a" });
    await wrapper.find(".u-select").trigger("mouseenter");
    await nextTick();
    expect(wrapper.find(".u-select__icon--clear").exists()).toBe(true);
  });

  it("点击清空触发 clear 事件", async () => {
    const wrapper = mountSelect({ clearable: true, modelValue: "a" });
    await wrapper.find(".u-select").trigger("mouseenter");
    await nextTick();
    await wrapper.find(".u-select__icon--clear").trigger("click");
    expect(wrapper.emitted("clear")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0][0]).toBeUndefined();
  });

  it("多选清空重置为空数组", async () => {
    const wrapper = mountSelect({
      clearable: true,
      multiple: true,
      modelValue: ["a", "b"],
    });
    await wrapper.find(".u-select").trigger("mouseenter");
    await nextTick();
    await wrapper.find(".u-select__icon--clear").trigger("click");
    expect(wrapper.emitted("update:modelValue")![0][0]).toEqual([]);
  });
});

describe("Select 筛选", () => {
  const slots = {
    default: () => [
      h(SelectOption, { value: "apple", label: "苹果" }),
      h(SelectOption, { value: "banana", label: "香蕉" }),
    ],
  };

  it("输入过滤选项", async () => {
    const wrapper = mountSelect({ filterable: true }, slots);
    await wrapper.find(".u-select__trigger").trigger("click");
    await nextTick();
    await wrapper.find(".u-select__input").setValue("苹");
    await nextTick();

    const visible = wrapper
      .findAll(".u-select-option")
      .filter((o) => o.isVisible());
    expect(visible).toHaveLength(1);
    expect(visible[0].text()).toContain("苹果");
  });

  it("无匹配显示 noMatchText", async () => {
    const wrapper = mountSelect(
      { filterable: true, noMatchText: "无匹配数据" },
      slots,
    );
    await wrapper.find(".u-select__trigger").trigger("click");
    await nextTick();
    await wrapper.find(".u-select__input").setValue("zzz");
    await nextTick();
    expect(wrapper.find(".u-select__empty").text()).toBe("无匹配数据");
  });
});

describe("Select 暴露的 ref", () => {
  it("ref 指向根元素", () => {
    const wrapper = mountSelect();
    expect((wrapper.vm as unknown as { ref: HTMLElement }).ref).toBe(
      wrapper.element,
    );
  });
});
