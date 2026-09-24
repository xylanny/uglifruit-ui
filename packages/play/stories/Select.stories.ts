import { USelect, USelectOption } from "@uglifruits/components";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

const meta = {
  title: "Component/Select",
  component: USelect,
  args: {
    placeholder: "请选择",
    disabled: false,
    clearable: false,
    filterable: false,
    multiple: false,
    size: "default",
  },
  argTypes: {
    size: { control: "select", options: ["large", "default", "small"] },
    disabled: { control: "boolean" },
    clearable: { control: "boolean" },
    filterable: { control: "boolean" },
    multiple: { control: "boolean" },
  },
} satisfies Meta<typeof USelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: "apple", label: "苹果" },
  { value: "banana", label: "香蕉" },
  { value: "orange", label: "橙子" },
  { value: "grape", label: "葡萄" },
];

export const Basic: Story = {
  render: (args: any) => ({
    components: { USelect, USelectOption },
    setup() {
      const value = ref("");
      return { args, value, options };
    },
    template: `
      <div style="width: 240px;">
        <USelect v-bind="args" v-model="value">
          <USelectOption v-for="o in options" :key="o.value" :value="o.value" :label="o.label" />
        </USelect>
      </div>
    `,
  }),
};

export const Clearable: Story = {
  render: (args: any) => ({
    components: { USelect, USelectOption },
    setup() {
      const value = ref("apple");
      return { args, value, options };
    },
    template: `
      <div style="width: 240px;">
        <USelect v-bind="args" v-model="value" clearable>
          <USelectOption v-for="o in options" :key="o.value" :value="o.value" :label="o.label" />
        </USelect>
      </div>
    `,
  }),
};

export const Multiple: Story = {
  render: (args: any) => ({
    components: { USelect, USelectOption },
    setup() {
      const value = ref(["apple", "banana"]);
      return { args, value, options };
    },
    template: `
      <div style="width: 320px;">
        <USelect v-bind="args" v-model="value" multiple clearable>
          <USelectOption v-for="o in options" :key="o.value" :value="o.value" :label="o.label" />
        </USelect>
      </div>
    `,
  }),
};

export const Filterable: Story = {
  render: (args: any) => ({
    components: { USelect, USelectOption },
    setup() {
      const value = ref("");
      return { args, value, options };
    },
    template: `
      <div style="width: 240px;">
        <USelect v-bind="args" v-model="value" filterable clearable>
          <USelectOption v-for="o in options" :key="o.value" :value="o.value" :label="o.label" />
        </USelect>
      </div>
    `,
  }),
};

export const DisabledOption: Story = {
  render: (args: any) => ({
    components: { USelect, USelectOption },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <div style="width: 240px;">
        <USelect v-bind="args" v-model="value">
          <USelectOption value="apple" label="苹果" />
          <USelectOption value="banana" label="香蕉（已完）" disabled />
          <USelectOption value="orange" label="橙子" />
        </USelect>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args: any) => ({
    components: { USelect, USelectOption },
    setup() {
      const value = ref("apple");
      return { args, value, options };
    },
    template: `
      <div style="width: 240px;">
        <USelect v-bind="args" v-model="value" disabled>
          <USelectOption v-for="o in options" :key="o.value" :value="o.value" :label="o.label" />
        </USelect>
      </div>
    `,
  }),
};
