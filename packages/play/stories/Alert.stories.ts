import { UAlert } from "@uglifruits/components";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

const meta = {
  title: "Component/Alert",
  component: UAlert,

  args: {
    type: "info",
    closable: true,
    showIcon: true,
    center: false,
  },

  argTypes: {
    type: {
      control: "select",
      options: ["success", "warning", "danger", "info"],
    },
    title: { control: "text" },
    description: { control: "text" },
    closable: { control: "boolean" },
    showIcon: { control: "boolean" },
    center: { control: "boolean" },
    closeText: { control: "text" },
  },
} satisfies Meta<typeof UAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ==================== 类型 ==================== */

/**
 * 四种类型：success / warning / danger / info
 * 每种类型有独立的背景、边框、文字、图标颜色
 */
export const Type: Story = {
  render: (args) => ({
    components: { UAlert },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 480px;">
        <UAlert v-bind="args" type="success" title="成功" description="操作已完成" />
        <UAlert v-bind="args" type="warning" title="警告" description="请注意潜在风险" />
        <UAlert v-bind="args" type="danger" title="错误" description="操作失败，请重试" />
        <UAlert v-bind="args" type="info" title="提示" description="这是一条普通提示" />
      </div>
    `,
  }),
};

/* ==================== 内容 ==================== */

/**
 * 只有标题、只有描述、标题 + 描述
 */
export const Content: Story = {
  render: (args) => ({
    components: { UAlert },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 480px;">
        <UAlert v-bind="args" title="只有标题" />
        <UAlert v-bind="args" description="只有描述，没有标题" />
        <UAlert v-bind="args" title="标题 + 描述" description="这是详细描述" />
      </div>
    `,
  }),
};

/* ==================== 图标 ==================== */

/**
 * showIcon 控制图标显隐
 */
export const ShowIcon: Story = {
  render: (args) => ({
    components: { UAlert },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 480px;">
        <UAlert v-bind="args" :show-icon="true" title="显示图标" description="showIcon = true" />
        <UAlert v-bind="args" :show-icon="false" title="隐藏图标" description="showIcon = false" />
      </div>
    `,
  }),
};

/* ==================== 关闭 ==================== */

/**
 * closable 与 closeText
 * 点击关闭后组件隐藏，close 事件可在 Actions 面板看到
 */
export const Closable: Story = {
  render: (args) => ({
    components: { UAlert },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 480px;">
        <UAlert v-bind="args" title="默认关闭按钮（图标）" />
        <UAlert v-bind="args" title="文字关闭按钮" close-text="关闭" />
        <UAlert v-bind="args" title="不可关闭" :closable="false" />
      </div>
    `,
  }),
};

/* ==================== 居中 ==================== */

/**
 * center 控制内容是否居中
 */
export const Center: Story = {
  render: (args) => ({
    components: { UAlert },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 480px;">
        <UAlert v-bind="args" title="默认左对齐" description="内容靠左" />
        <UAlert v-bind="args" :center="true" title="居中" description="内容居中" />
      </div>
    `,
  }),
};
