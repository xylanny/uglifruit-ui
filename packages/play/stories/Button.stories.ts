import { UButton } from "@uglifruits/components";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

const meta = {
  title: "Component/Button",
  component: UButton,

  args: {
    tag: "button",
    nativeType: "button",
    throttled: false,
  },

  argTypes: {
    tag: {
      control: "select",
      options: ["button", "a", "div"],
    },
    nativeType: {
      control: "select",
      options: ["button", "submit", "reset"],
    },
    type: {
      control: "select",
      options: ["primary", "success", "warning", "danger", "info"],
    },
    size: {
      control: "select",
      options: ["large", "default", "small"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    throttled: { control: "boolean" },
    plain: { control: "boolean" },
    round: { control: "boolean" },
    circle: { control: "boolean" },
  },
} satisfies Meta<typeof UButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tag: Story = {
  render: (args: any) => ({
    components: { UButton },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <UButton v-bind="args" tag="button">button</UButton>
        <UButton v-bind="args" tag="a" href="https://example.com">a 链接</UButton>
        <UButton v-bind="args" tag="div">div 容器</UButton>
      </div>
    `,
  }),
};

export const NativeType: Story = {
  render: (args: any) => ({
    components: { UButton },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 12px;">
        <UButton v-bind="args" native-type="button">button</UButton>
        <UButton v-bind="args" native-type="submit">submit</UButton>
        <UButton v-bind="args" native-type="reset">reset</UButton>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args: any) => ({
    components: { UButton },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <UButton v-bind="args">普通</UButton>
        <UButton v-bind="args" disabled>禁用</UButton>
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: (args: any) => ({
    components: { UButton },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <UButton v-bind="args">普通</UButton>
        <UButton v-bind="args" loading>加载中</UButton>
        <UButton v-bind="args" loading loading-icon="spinner">自定义图标</UButton>
      </div>
    `,
  }),
};

export const Throttled: Story = {
  render: (args: any) => ({
    components: { UButton },
    setup() {
      const countA = ref(0);
      const countB = ref(0);
      return { args, countA, countB };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <UButton v-bind="args" :throttled="true" :duration="500" @click="countA++">
          节流（{{ countA }}）
        </UButton>
        <UButton v-bind="args" :throttled="false" @click="countB++">
          不节流（{{ countB }}）
        </UButton>
      </div>
    `,
  }),
};

export const Shape: Story = {
  render: (args: any) => ({
    components: { UButton },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <UButton v-bind="args" type="primary">默认</UButton>
        <UButton v-bind="args" type="primary" plain>朴素</UButton>
        <UButton v-bind="args" type="primary" round>圆角</UButton>
        <UButton v-bind="args" type="primary" circle>+</UButton>
      </div>
    `,
  }),
};
