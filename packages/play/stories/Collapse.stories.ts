import { UCollapse, UCollapseItem } from "@uglifruits/components";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

const meta = {
  title: "Component/Collapse",
  component: UCollapse,

  render: (args) => ({
    components: { UCollapse, UCollapseItem },
    setup: () => ({ args }),
    template: `
      <div style="width: 480px;">
        <UCollapse v-bind="args">
          <UCollapseItem name="item1" title="标题一">
            这是第一项的内容。
          </UCollapseItem>
          <UCollapseItem name="item2" title="标题二">
            这是第二项的内容。
          </UCollapseItem>
          <UCollapseItem name="item3" title="标题三">
            这是第三项的内容。
          </UCollapseItem>
        </UCollapse>
      </div>
    `,
  }),

  argTypes: {
    moduleValue: {
      control: "object",
    },
    accordion: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof UCollapse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    moduleValue: [],
  },
};

export const Accordion: Story = {
  args: {
    moduleValue: ["item1"],
    accordion: true,
  },
};

export const Disabled: Story = {
  args: {
    moduleValue: [],
  },
  render: (args: any) => ({
    components: { UCollapse, UCollapseItem },
    setup: () => ({ args }),
    template: `
      <div style="width: 480px;">
        <UCollapse v-bind="args">
          <UCollapseItem name="item1" title="标题一">
            这是第一项的内容。
          </UCollapseItem>
          <UCollapseItem name="item2" title="标题二" disabled>
            这是被禁用的第二项，不可点击。
          </UCollapseItem>
          <UCollapseItem name="item3" title="标题三">
            这是第三项的内容。
          </UCollapseItem>
        </UCollapse>
      </div>
    `,
  }),
};
