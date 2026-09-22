import { UIcon } from "@uglifruits/components";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

const icons = [
  "search",
  "user",
  "star",
  "heart",
  "spinner",
  "check",
  "xmark",
  "plus",
];

const meta = {
  title: "Component/Icon",
  component: UIcon,

  render: (args) => ({
    components: { UIcon },
    setup: () => ({ args }),
    template: `
      <div style="font-size: 28px;">
        <UIcon v-bind="args" />
      </div>
    `,
  }),

  argTypes: {
    icon: {
      control: "select",
      options: icons,
    },
    type: {
      control: "select",
      options: ["primary", "success", "info", "warning", "danger"],
    },
    color: { control: "color" },
    size: {
      control: "select",
      options: ["2xs", "xs", "sm", "lg", "xl", "2xl", "2x", "3x", "4x", "5x"],
    },
  },
} satisfies Meta<typeof UIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Search: Story = {
  args: { icon: "search" },
};

export const Loading: Story = {
  args: { icon: "spinner", spin: true },
};

export const Heart: Story = {
  args: { icon: "heart", color: "#ff4949" },
};

export const IconList: Story = {
  args: { icon: "search" },
  render: () => ({
    components: { UIcon },
    setup: () => ({ icons }),
    template: `
      <div style="display: flex; gap: 16px; font-size: 28px;">
        <UIcon v-for="icon in icons" :key="icon" :icon="icon" />
      </div>
    `,
  }),
};
