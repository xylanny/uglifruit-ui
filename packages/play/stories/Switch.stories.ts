import { USwitch } from "@uglifruits/components";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

const meta = {
  title: "Component/Switch",
  component: USwitch,
  args: {
    disabled: false,
    loading: false,
    size: "default",
  },
  argTypes: {
    size: { control: "select", options: ["large", "default", "small"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
} satisfies Meta<typeof USwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args: any) => ({
    components: { USwitch },
    setup() {
      const value = ref(false);
      return { args, value };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <USwitch v-bind="args" v-model="value" />
        <span>{{ value }}</span>
      </div>
    `,
  }),
};

export const WithText: Story = {
  render: (args: any) => ({
    components: { USwitch },
    setup() {
      const value = ref(true);
      return { args, value };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <USwitch v-bind="args" v-model="value" active-text="开" inactive-text="关" />
      </div>
    `,
  }),
};

export const CustomValue: Story = {
  render: (args: any) => ({
    components: { USwitch },
    setup() {
      const value = ref("yes");
      return { args, value };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <USwitch v-bind="args" v-model="value" active-value="yes" inactive-value="no" />
        <span>{{ value }}</span>
      </div>
    `,
  }),
};

export const CustomColor: Story = {
  render: (args: any) => ({
    components: { USwitch },
    setup() {
      const value = ref(true);
      return { args, value };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <USwitch v-bind="args" v-model="value" active-color="#13ce66" inactive-color="#ff4949" />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args: any) => ({
    components: { USwitch },
    setup() {
      const value = ref(true);
      return { args, value };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <USwitch v-bind="args" v-model="value" disabled />
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: (args: any) => ({
    components: { USwitch },
    setup() {
      const value = ref(true);
      return { args, value };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <USwitch v-bind="args" v-model="value" loading />
      </div>
    `,
  }),
};

export const Size: Story = {
  render: (args: any) => ({
    components: { USwitch },
    setup() {
      const value = ref(true);
      return { args, value };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <USwitch v-bind="args" v-model="value" size="large" />
        <USwitch v-bind="args" v-model="value" size="default" />
        <USwitch v-bind="args" v-model="value" size="small" />
      </div>
    `,
  }),
};
