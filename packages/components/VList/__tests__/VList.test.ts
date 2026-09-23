import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import VList from "../VList.vue";
import { useRaf } from "@uglifruits/hooks";

/**
 * jsdom 下 requestAnimationFrame 不可控，
 * 替换成"收集回调 + 手动 flush"。
 */
let rafCallbacks: FrameRequestCallback[] = [];

const flushRaf = () => {
  const cbs = rafCallbacks;
  rafCallbacks = [];
  cbs.forEach((cb) => cb(performance.now()));
};

/**
 * 设置 scrollTop 并触发 scroll，再 flush 一帧。
 * 注意：jsdom 不钳制 scrollTop，调用方需传合法值。
 */
const scrollTo = async (wrapper: ReturnType<typeof mount>, top: number) => {
  (wrapper.element as HTMLElement).scrollTop = top;
  await wrapper.trigger("scroll");
  flushRaf();
  await nextTick();
};

/** slot 里 item 是 unknown，统一断言；null 安全 */
const label = (item: unknown, index: number) => {
  const it = item as { name?: string } | null;
  return `${index}:${it?.name ?? "null"}`;
};

/** 每个用例独立挂载，beforeEach 已 stub rAF */
const mountList = (props: Record<string, unknown> = {}, itemCount = 100) => {
  const items = Array.from({ length: itemCount }, (_, i) => ({
    id: i,
    name: `item-${i}`,
  }));
  return mount(VList, {
    props: {
      items,
      itemHeight: 50,
      containerHeight: 200,
      itemKey: "id",
      buffer: 0,
      ...props,
    },
    slots: {
      default: ({ item, index }: { item: unknown; index: number }) =>
        label(item, index),
    },
  });
};

describe("VList 虚拟列表", () => {
  beforeEach(() => {
    rafCallbacks = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      rafCallbacks = rafCallbacks.filter((_, i) => i !== id - 1);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ==================== 渲染 + 滚动 ====================

  it("只渲染可视区域内的条目，滚动后窗口跟随 scrollTop 移动", async () => {
    const wrapper = mountList({}, 100);

    let rendered = wrapper.findAll(".u-vlist__item");
    expect(rendered).toHaveLength(4);
    expect(rendered[0].text()).toBe("0:item-0");
    expect(rendered[3].text()).toBe("3:item-3");

    // 滚过 4 条：scrollTop = 200
    await scrollTo(wrapper, 200);

    rendered = wrapper.findAll(".u-vlist__item");
    expect(rendered).toHaveLength(4);
    expect(rendered[0].text()).toBe("4:item-4");
    expect(rendered[3].text()).toBe("7:item-7");

    // 内容层偏移 = startIndex * itemHeight = 4 * 50 = 200
    expect(wrapper.find(".u-vlist__content").attributes("style")).toContain(
      "translateY(200px)",
    );
  });

  it("滚到顶部时 startIndex 被钳制为 0", async () => {
    const wrapper = mountList({ buffer: 2 }, 100);

    // scrollTop 远小于 buffer * itemHeight，startIndex 会被 clamp 到 0
    await scrollTo(wrapper, 10);

    expect(wrapper.findAll(".u-vlist__item")[0].text()).toBe("0:item-0");
  });

  it("滚到底部时 endIndex 不超过 items.length", async () => {
    const wrapper = mountList({}, 10);

    // 内容总高 10*50=500，容器 200，最大合法 scrollTop = 300
    await scrollTo(wrapper, 300);

    const rendered = wrapper.findAll(".u-vlist__item");
    expect(rendered).toHaveLength(4);
    expect(rendered[0].text()).toBe("6:item-6");
    expect(rendered[3].text()).toBe("9:item-9");
  });

  // ==================== containerHeight 多种单位 ====================

  it("containerHeight 支持 number / px / vh / 非法值", () => {
    // number
    expect(
      mountList({ containerHeight: 200 }, 100).findAll(".u-vlist__item"),
    ).toHaveLength(4);

    // px
    expect(
      mountList({ containerHeight: "200px" }, 100).findAll(".u-vlist__item"),
    ).toHaveLength(4);

    // vh：jsdom window.innerHeight 默认 768，10vh = 76.8 → ceil(76.8/50) = 2
    expect(
      mountList({ containerHeight: "10vh" }, 100).findAll(".u-vlist__item"),
    ).toHaveLength(2);

    // 非法值兜底 400 → ceil(400/50) = 8
    expect(
      mountList({ containerHeight: "abc" }, 100).findAll(".u-vlist__item"),
    ).toHaveLength(8);
  });

  // ==================== getKey 各分支 ====================

  it("itemKey 为字符串时从对象取字段", () => {
    const wrapper = mountList({ itemKey: "id" }, 100);
    expect(wrapper.findAll(".u-vlist__item")).toHaveLength(4);
  });

  it("itemKey 为函数时返回值作为 key", () => {
    const wrapper = mountList(
      { itemKey: (item: { id: number }) => item.id },
      100,
    );
    expect(wrapper.findAll(".u-vlist__item")).toHaveLength(4);
  });

  it("itemKey 函数返回 symbol 时退化为 index", () => {
    const wrapper = mountList({ itemKey: () => Symbol("k") }, 100);
    expect(wrapper.findAll(".u-vlist__item")).toHaveLength(4);
  });

  it("itemKey 未提供时退化为 index", () => {
    const wrapper = mountList({ itemKey: undefined }, 100);
    expect(wrapper.findAll(".u-vlist__item")).toHaveLength(4);
  });

  it("item 为 null 时字符串 itemKey 退化为 index", () => {
    const items = [null, null, null, null, null];
    const wrapper = mountList({ items, itemKey: "id" }, items.length);
    expect(wrapper.findAll(".u-vlist__item")).toHaveLength(4);
  });

  it("item 为原始值（非对象）时字符串 itemKey 退化为 index", () => {
    const items = [1, 2, 3, 4, 5];
    const wrapper = mountList({ items, itemKey: "id" }, items.length);
    expect(wrapper.findAll(".u-vlist__item")).toHaveLength(4);
  });

  // ==================== rangeChange ====================

  it("rangeChange 仅在范围真正变化时触发", async () => {
    const onRangeChange = vi.fn();
    const wrapper = mountList({ onRangeChange }, 100);

    // immediate: true，首屏触发一次
    expect(onRangeChange).toHaveBeenCalledTimes(1);
    expect(onRangeChange).toHaveBeenLastCalledWith({ start: 0, end: 4 });

    // 滚到 20px，仍在第 0 条范围内，range 不变
    await scrollTo(wrapper, 20);
    expect(onRangeChange).toHaveBeenCalledTimes(1);

    // 滚到 50px，startIndex 变为 1
    await scrollTo(wrapper, 50);
    expect(onRangeChange).toHaveBeenCalledTimes(2);
    expect(onRangeChange).toHaveBeenLastCalledWith({ start: 1, end: 5 });
  });

  // ==================== scroll 事件 ====================

  it("触发 scroll 事件并透传原始 Event", async () => {
    const onScroll = vi.fn();
    const wrapper = mountList({ onScroll }, 100);

    await scrollTo(wrapper, 100);

    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(onScroll.mock.calls[0][0]).toBeInstanceOf(Event);
  });

  // ==================== rAF 节流 ====================

  it("同一帧内多次滚动只提交一次渲染", async () => {
    const wrapper = mountList({}, 100);
    const el = wrapper.element as HTMLElement;

    // 同一帧内连续三次 scroll，rAF 尚未 flush
    el.scrollTop = 50;
    await wrapper.trigger("scroll");
    el.scrollTop = 100;
    await wrapper.trigger("scroll");
    el.scrollTop = 150;
    await wrapper.trigger("scroll");

    // rAF 还没执行，渲染窗口应该还没变
    expect(wrapper.findAll(".u-vlist__item")[0].text()).toBe("0:item-0");

    // flush 一帧：只应用最后一次的 scrollTop = 150 → startIndex = 3
    flushRaf();
    await nextTick();

    expect(wrapper.findAll(".u-vlist__item")[0].text()).toBe("3:item-3");
  });

  // ==================== scrollToXxx ====================

  it("scrollToIndex 立即更新渲染窗口并做边界钳制", async () => {
    const wrapper = mountList({}, 10);
    const vm = wrapper.vm as unknown as { scrollToIndex: (i: number) => void };

    vm.scrollToIndex(5);
    await nextTick();
    let rendered = wrapper.findAll(".u-vlist__item");
    expect(rendered[0].text()).toBe("5:item-5");

    // 越界向下：钳到 items.length - 1
    vm.scrollToIndex(9999);
    await nextTick();
    rendered = wrapper.findAll(".u-vlist__item");
    expect(rendered[rendered.length - 1].text()).toBe("9:item-9");

    // 越界向上：钳到 0
    vm.scrollToIndex(-5);
    await nextTick();
    rendered = wrapper.findAll(".u-vlist__item");
    expect(rendered[0].text()).toBe("0:item-0");
  });

  it("空数组时 scrollToIndex 不报错", async () => {
    const wrapper = mountList({}, 0);
    const vm = wrapper.vm as unknown as { scrollToIndex: (i: number) => void };

    expect(() => vm.scrollToIndex(0)).not.toThrow();
    expect(wrapper.findAll(".u-vlist__item")).toHaveLength(0);
  });

  it("scrollToTop / scrollToBottom 定位正确", async () => {
    const wrapper = mountList({}, 10);
    const vm = wrapper.vm as unknown as {
      scrollToTop: () => void;
      scrollToBottom: () => void;
    };

    // 滚到底：scrollTop = contentHeight - containerHeight = 500 - 200 = 300
    vm.scrollToBottom();
    await nextTick();
    let rendered = wrapper.findAll(".u-vlist__item");
    expect(rendered[0].text()).toBe("6:item-6");
    expect(rendered[rendered.length - 1].text()).toBe("9:item-9");

    // 滚回顶部
    vm.scrollToTop();
    await nextTick();
    rendered = wrapper.findAll(".u-vlist__item");
    expect(rendered[0].text()).toBe("0:item-0");
  });

  it("组件卸载后调用 scrollToXxx 不报错", async () => {
    const wrapper = mountList({}, 10);
    const vm = wrapper.vm as unknown as { scrollToTop: () => void };

    wrapper.unmount();
    // 此时 _ref.value 为 null，setScrollTop 提前 return
    expect(() => vm.scrollToTop()).not.toThrow();
  });

  // ==================== 数据变化 ====================

  it("数据减少时重新计算渲染窗口", async () => {
    const wrapper = mountList({}, 100);
    expect(wrapper.findAll(".u-vlist__item")).toHaveLength(4);

    await wrapper.setProps({
      items: [
        { id: 0, name: "item-0" },
        { id: 1, name: "item-1" },
      ],
    });

    expect(wrapper.findAll(".u-vlist__item")).toHaveLength(2);
    expect(wrapper.find(".u-vlist__phantom").attributes("style")).toContain(
      "height: 100px",
    );
  });

  it("空数据不渲染条目，幽灵层高度为 0", () => {
    const wrapper = mountList({}, 0);
    expect(wrapper.findAll(".u-vlist__item")).toHaveLength(0);
    expect(wrapper.find(".u-vlist__phantom").attributes("style")).toContain(
      "height: 0px",
    );
  });

  it("buffer 会在可视区上下各多渲染", () => {
    const wrapper = mountList({ buffer: 2 }, 100);
    // visibleCount(4) + buffer*2(4) = 8
    expect(wrapper.findAll(".u-vlist__item")).toHaveLength(8);
  });
});

// ==================== useRaf 自身覆盖 ====================

describe("useRaf 节流执行器", () => {
  beforeEach(() => {
    rafCallbacks = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      rafCallbacks = rafCallbacks.filter((_, i) => i !== id - 1);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("同一帧多次 schedule 只执行一次", () => {
    const fn = vi.fn();
    const wrapper = mount({
      setup() {
        const { schedule } = useRaf(fn);
        return { schedule };
      },
      template: "<div />",
    });

    const vm = wrapper.vm as unknown as { schedule: () => void };
    vm.schedule();
    vm.schedule();
    vm.schedule();

    expect(rafCallbacks).toHaveLength(1);
    expect(fn).not.toHaveBeenCalled();

    flushRaf();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("cancel 能取消待执行的回调", () => {
    const fn = vi.fn();
    const wrapper = mount({
      setup() {
        const { schedule, cancel } = useRaf(fn);
        return { schedule, cancel };
      },
      template: "<div />",
    });

    const vm = wrapper.vm as unknown as {
      schedule: () => void;
      cancel: () => void;
    };

    vm.schedule();
    expect(rafCallbacks).toHaveLength(1);
    vm.cancel();
    expect(rafCallbacks).toHaveLength(0);

    flushRaf();
    expect(fn).not.toHaveBeenCalled();
  });

  it("无 pending 时 cancel 不报错", () => {
    const wrapper = mount({
      setup() {
        const { cancel } = useRaf(() => {});
        return { cancel };
      },
      template: "<div />",
    });

    const vm = wrapper.vm as unknown as { cancel: () => void };
    expect(() => vm.cancel()).not.toThrow();
  });
});

it("未提供默认 slot 时渲染 fallback 内容", () => {
  const items = [1, 2, 3, 4, 5];
  const wrapper = mount(VList, {
    props: {
      items,
      itemHeight: 50,
      containerHeight: 200,
      buffer: 0,
    },
  });

  const rendered = wrapper.findAll(".u-vlist__item");
  expect(rendered).toHaveLength(4);
  expect(rendered[0].text()).toBe("1");
  expect(rendered[3].text()).toBe("4");
});

it("内容高度小于容器高度时 scrollToBottom 不出现负 scrollTop", async () => {
  const wrapper = mountList({}, 3);
  const vm = wrapper.vm as unknown as { scrollToBottom: () => void };

  vm.scrollToBottom();
  await nextTick();

  // 内容 150 < 容器 200，maxScrollTop = max(150-200, 0) = 0
  expect((wrapper.element as HTMLElement).scrollTop).toBe(0);
});
