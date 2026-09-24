import { UTag } from "@uglifruits/components";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

const meta = {
  title: "Component/Tag",
  component: UTag,

  args: {
    type: "primary",
    size: "default",
    effect: "light",
    closable: false,
    round: false,
    disabled: false,
  },

  argTypes: {
    type: {
      control: "select",
      options: ["primary", "success", "warning", "danger", "info"],
    },
    size: {
      control: "select",
      options: ["large", "default", "small"],
    },
    effect: {
      control: "select",
      options: ["light", "dark", "plain"],
    },
    closable: { control: "boolean" },
    round: { control: "boolean" },
    disabled: { control: "boolean" },
    closeIcon: { control: "text" },
  },
} satisfies Meta<typeof UTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Type: Story = {
  render: (args) => ({
    components: { UTag },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 8px; align-items: center;">
        <UTag v-bind="args" type="primary">primary</UTag>
        <UTag v-bind="args" type="success">success</UTag>
        <UTag v-bind="args" type="warning">warning</UTag>
        <UTag v-bind="args" type="danger">danger</UTag>
        <UTag v-bind="args" type="info">info</UTag>
      </div>
    `,
  }),
};

export const Size: Story = {
  render: (args) => ({
    components: { UTag },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 8px; align-items: center;">
        <UTag v-bind="args" size="large">large</UTag>
        <UTag v-bind="args" size="default">default</UTag>
        <UTag v-bind="args" size="small">small</UTag>
      </div>
    `,
  }),
};

export const Effect: Story = {
  render: (args) => ({
    components: { UTag },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 8px;">
          <UTag v-bind="args" type="primary" effect="light">light</UTag>
          <UTag v-bind="args" type="primary" effect="dark">dark</UTag>
          <UTag v-bind="args" type="primary" effect="plain">plain</UTag>
        </div>
        <div style="display: flex; gap: 8px;">
          <UTag v-bind="args" type="success" effect="light">light</UTag>
          <UTag v-bind="args" type="success" effect="dark">dark</UTag>
          <UTag v-bind="args" type="success" effect="plain">plain</UTag>
        </div>
        <div style="display: flex; gap: 8px;">
          <UTag v-bind="args" type="danger" effect="light">light</UTag>
          <UTag v-bind="args" type="danger" effect="dark">dark</UTag>
          <UTag v-bind="args" type="danger" effect="plain">plain</UTag>
        </div>
      </div>
    `,
  }),
};

export const Round: Story = {
  render: (args) => ({
    components: { UTag },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 8px; align-items: center;">
        <UTag v-bind="args" :round="false">默认</UTag>
        <UTag v-bind="args" :round="true">圆形</UTag>
      </div>
    `,
  }),
};

export const Closable: Story = {
  render: (args) => ({
    components: { UTag },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 8px;">
          <UTag v-bind="args" :closable="true">默认关闭</UTag>
          <UTag v-bind="args" :closable="true" close-icon="check">自定义图标</UTag>
        </div>
        <div style="display: flex; gap: 8px;">
          <UTag v-bind="args" :closable="true">
            自定义关闭
            <template #close>×</template>
          </UTag>
        </div>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    components: { UTag },
    setup() {
      return { args };
    },
    template: `
      <div style="display: flex; gap: 8px; align-items: center;">
        <UTag v-bind="args" :disabled="false">正常</UTag>
        <UTag v-bind="args" :disabled="true">禁用</UTag>
        <UTag v-bind="args" :disabled="true" :closable="true">禁用 + 关闭</UTag>
      </div>
    `,
  }),
};
