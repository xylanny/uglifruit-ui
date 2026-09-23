import { UList } from "@uglifruits/components";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

const meta: Meta = {
  title: "Component/List",
  component: UList as any,

  render: (args: any) => ({
    components: { UList: UList as any },
    setup: () => ({ args }),
    template: `
      <div style="width: 360px;">
        <UList v-bind="args" />
      </div>
    `,
  }),

  argTypes: {
    items: { control: "object" },
    itemHeight: { control: "number" },
    containerHeight: { control: "text" },
    buffer: { control: "number" },
  },
};

export default meta;
type Story = StoryObj;

const basicItems = Array.from({ length: 100000 }, (_, i) => `列表项 ${i + 1}`);

export const Normal: Story = {
  args: {
    items: basicItems,
    itemHeight: 40,
    containerHeight: 400,
    buffer: 10,
  },
};

export const Slot: Story = {
  args: {
    items: basicItems,
    itemHeight: 56,
    containerHeight: 400,
    buffer: 10,
  },
  render: (args: any) => ({
    components: { UVList: UList as any },
    setup: () => ({ args }),
    template: `
      <div style="width: 360px;">
        <UList v-bind="args">
          <template #default="{ item, index }">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span
                :style="{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: index % 2 === 0 ? '#e6f0ff' : '#f0e6ff',
                  color: index % 2 === 0 ? '#3370ff' : '#7a33ff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }"
              >
                {{ index + 1 }}
              </span>
              <span>{{ item }}</span>
            </div>
          </template>
        </UList>
      </div>
    `,
  }),
};

export const ScrollControl: Story = {
  args: {
    items: basicItems,
    itemHeight: 40,
    containerHeight: 400,
    buffer: 10,
  },
  render: (args: any) => ({
    components: { UVList: UList as any },
    setup() {
      const listRef = ref<any>(null);

      function scrollToIndex(index: number) {
        listRef.value?.scrollToIndex(index);
      }

      return { args, listRef, scrollToIndex };
    },
    template: `
      <div style="width: 360px;">
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          <button @click="scrollToIndex(0)">顶部</button>
          <button @click="scrollToIndex(49999)">中间</button>
          <button @click="scrollToIndex(99999)">底部</button>
        </div>
        <UList ref="listRef" v-bind="args" />
      </div>
    `,
  }),
};
