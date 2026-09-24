import { UInput } from "@uglifruits/components";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

const meta = {
  title: "Component/Input",
  component: UInput,

  args: {
    placeholder: "请输入内容",
    type: "text",
    disabled: false,
    readonly: false,
    clearable: false,
    showPassword: false,
  },

  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "tel", "url"],
    },
    size: {
      control: "select",
      options: ["large", "default", "small"],
    },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    clearable: { control: "boolean" },
    showPassword: { control: "boolean" },
  },
} satisfies Meta<typeof UInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args: any) => ({
    components: { UInput },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <div style="width: 320px;">
        <UInput v-bind="args" v-model="value" />
        <p style="margin-top: 8px; color: #666;">当前值：{{ value }}</p>
      </div>
    `,
  }),
};

export const Size: Story = {
  render: (args: any) => ({
    components: { UInput },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 320px;">
        <UInput v-bind="args" size="large" placeholder="large" />
        <UInput v-bind="args" size="default" placeholder="default" />
        <UInput v-bind="args" size="small" placeholder="small" />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args: any) => ({
    components: { UInput },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 320px;">
        <UInput v-bind="args" placeholder="普通" />
        <UInput v-bind="args" disabled model-value="禁用状态" />
        <UInput v-bind="args" readonly model-value="只读状态" />
      </div>
    `,
  }),
};

export const Clearable: Story = {
  render: (args: any) => ({
    components: { UInput },
    setup() {
      const value = ref("可清空的内容");
      return { args, value };
    },
    template: `
      <div style="width: 320px;">
        <UInput v-bind="args" v-model="value" clearable />
      </div>
    `,
  }),
};

export const Password: Story = {
  render: (args: any) => ({
    components: { UInput },
    setup() {
      const value = ref("secret");
      return { args, value };
    },
    template: `
      <div style="width: 320px;">
        <UInput v-bind="args" v-model="value" type="password" show-password />
      </div>
    `,
  }),
};

export const WithIcon: Story = {
  render: (args: any) => ({
    components: { UInput },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 320px;">
        <UInput v-bind="args" prefix-icon="user" placeholder="用户名" />
        <UInput v-bind="args" suffix-icon="magnifying-glass" placeholder="搜索" />
      </div>
    `,
  }),
};
