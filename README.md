# Uglifruits UI

一个基于 Vue 3 + TypeScript 的轻量组件库。

[![npm version](https://img.shields.io/npm/v/@uglifruits/ui.svg)](https://www.npmjs.com/package/@uglifruits/ui)
[![license](https://img.shields.io/npm/l/@uglifruits/ui.svg)](./LICENSE)
[![Vue 3](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

## 简介

Uglifruits UI 是一套面向中后台场景的 Vue 3 组件库，使用 TypeScript 编写，提供完整的类型定义。设计上参考 Element Plus，但更轻量、更易定制。

- 组件按需引入，产物同时提供 ESM 与 UMD
- 样式基于 CSS 变量，主题定制无需重新编译
- 每个组件独立目录，便于二次开发和替换

## 特性

- **TypeScript**：完整的类型定义，支持泛型推导
- **CSS 变量**：主题色、圆角、间距全部可通过变量覆盖
- **按需引入**：只打包用到的组件，UMD 版本可直接 CDN 引入
- **暗色模式**：内置暗色主题变量
- **测试覆盖**：核心组件均有单元测试

## 快速开始

### 1. 安装

```bash
pnpm add @uglifruits/ui
# 或
npm install @uglifruits/ui
# 或
yarn add @uglifruits/ui
```

### 2. 安装图标依赖

本库的图标组件基于 [Font Awesome](https://fontawesome.com/) 实现，需要额外安装以下依赖：

```bash
pnpm add @fortawesome/fontawesome-svg-core \
         @fortawesome/free-solid-svg-icons \
         @fortawesome/vue-fontawesome
```

| 依赖 | 用途 |
|---|---|
| `@fortawesome/fontawesome-svg-core` | Font Awesome 核心，提供 `library` 与图标注册能力 |
| `@fortawesome/free-solid-svg-icons` | 免费实心图标集，本库默认使用 `fas` 前缀 |
| `@fortawesome/vue-fontawesome` | Vue 3 的 Font Awesome 组件封装 |

> **说明**：这三个包被声明为 `peerDependencies`，需要由使用方自行安装，避免版本冲突。

### 3. 最小示例

```vue
<script setup lang="ts">
import { ref } from "vue";
import { UButton, USwitch } from "@uglifruits/ui";
import "@uglifruits/ui/style.css";

const enabled = ref(false);
</script>

<template>
  <USwitch v-model="enabled" active-text="开" inactive-text="关" />
  <UButton type="primary" @click="enabled = !enabled">切换</UButton>
</template>
```

## 引入方式

### 完整引入

```ts
import { createApp } from "vue";
import UglifruitsUI from "@uglifruits/ui";
import "@uglifruits/ui/style.css";

createApp(App).use(UglifruitsUI).mount("#app");
```

### 按需引入

```ts
import { UButton, USelect, USelectOption } from "@uglifruits/ui";
```

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@uglifruits/ui/dist/es/index.css" />
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/@uglifruits/ui/dist/umd/index.umd.js"></script>
<script>
  const { createApp } = Vue;
  createApp({
    template: `<u-button type="primary">按钮</u-button>`,
  }).use(UglifruitsUI).mount("#app");
</script>
```

## 图标使用

本库的 `UIcon` 组件默认使用 Font Awesome 的 `fas` 前缀。使用前需要先注册图标：

```ts
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faSpinner,
  faAngleDown,
  faCheck,
  faXmark,
  faCircleXmark,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faUser,
  faSpinner,
  faAngleDown,
  faCheck,
  faXmark,
  faCircleXmark,
  faEye,
  faEyeSlash,
);
```

然后在模板中使用：

```vue
<template>
  <UIcon icon="user" />
  <UIcon icon="spinner" spin />
</template>
```

> **提示**：如果使用了本库的 `Input`（密码可见性切换）、`Select`（多选标签关闭）、`Collapse`（折叠箭头）等组件，请务必注册对应的图标，否则控制台会输出 `Could not find one or more icon(s)` 警告。
>
> 各组件依赖的图标见下表：

| 组件 | 依赖图标 |
|---|---|
| Input | `eye`、`eye-slash` |
| Select | `angle-down`、`check`、`circle-xmark`、`xmark` |
| Switch | `spinner` |
| Collapse | `angle-right` |
| Button | `spinner`（loading 状态） |

## 主题定制

所有视觉变量都定义为 CSS 变量，可在全局覆盖：

```css
:root {
  --u-color-primary: #6366f1;
  --u-border-radius-base: 6px;
  --u-font-size-base: 14px;
}
```

暗色模式：

```css
[data-theme="dark"] {
  --u-color-bg: #1e1e1e;
  --u-color-text: #e5e5e5;
}
```

## 组件

### 通用

| 组件 | 说明 |
|---|---|
| Button | 按钮 |
| Icon | 图标 |

### 数据录入

| 组件 | 说明 |
|---|---|
| Input | 输入框 |
| Select | 选择器 |
| Switch | 开关 |

### 数据展示

| 组件 | 说明 |
|---|---|
| Tag | 标签 |
| Alert | 警告 |
| Collapse | 折叠面板 |
| List | 列表 |

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动 Storybook
pnpm dev

# 构建
pnpm build

# 运行测试
pnpm test

# 类型检查
pnpm typecheck
```

## 贡献

1. Fork 本仓库
2. 新建分支：`git checkout -b feat/your-feature`
3. 提交改动：`git commit -m "feat: add xxx"`
4. 推送分支：`git push origin feat/your-feature`
5. 提交 Pull Request

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)。

## 常见问题

**Q：为什么组件样式没生效？**

A：需要手动引入样式文件：`import "@uglifruits/ui/style.css"`。

**Q：为什么控制台提示找不到图标？**

A：本库依赖 Font Awesome，需要先安装三个 peer 依赖，并用 `library.add()` 注册用到的图标。详见 [图标使用](#图标使用)。

**Q：支持 Vue 2 吗？**

A：不支持，本库基于 Vue 3 的 Composition API 和 `<script setup>`。

**Q：如何只打包用到的组件？**

A：使用具名导入即可，构建工具会做 tree-shaking。

**Q：为什么安装时提示缺少 `@fortawesome/*` 依赖？**

A：这三个包是 `peerDependencies`，需要显式安装，详见 [安装图标依赖](#2-安装图标依赖)。

## 许可证

[MIT](./LICENSE)