import type { App, Plugin } from "vue";
import { each } from "lodash-es";

type SFCWithInstall<T> = T & {
  install: (app: App) => void;
};
/**
 * 为单个组件绑上install方法，使其既能作为组件使用，也能作为插件注册
 *
 * @param component 原始组件，用泛型保留其原始类型
 * @returns 带有install方法的组件
 */
export function attachInstall<T>(component: T): SFCWithInstall<T> {
  (component as SFCWithInstall<T>).install = (app: App) => {
    const componentName = (component as any).name;
    app.component(componentName, component as Plugin);
  };

  return component as SFCWithInstall<T>;
}

/**
 * 将多个增强为Vue Plugin的Vue自定义组件合并成一个总插件
 *
 * @param componentPlugs - 已经过withInstall处理、带install方法的组件数组
 * @returns 一个总插件，安装时会依次注册所有传入的组件
 */
export function createInstaller(componentPlugs: Plugin[]): (app: App) => void {
  return (app: App) => {
    each(componentPlugs, (p) => app.use(p));
  };
}
