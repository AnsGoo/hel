import { isMasterApp } from 'hel-iso';
import { libReady } from 'hel-lib-proxy';
import 'uno.css';
import { LIB_NAME } from './configs/subApp';

console.log('远程组件main.js开始执行  vue是否存在？', window.Vue);
(async function () {
  try {
    const libProperties = await import('./exp/libProperties.ts');
    libReady(LIB_NAME, libProperties);

    if (isMasterApp() && import.meta.env.DEV) {
      await import('./loadApp');
    } else {
      console.log('当前是远程组件模式，不加载loadApp');
    }
  } catch (error) {
    console.error('远程组件main.js执行出错:', error);
    throw error;
  }
})().catch(console.error);
