import { isMasterApp } from 'hel-iso';
import { bindVueRuntime, preFetchLib } from 'hel-micro';
import * as Vue from 'vue';

bindVueRuntime({
  Vue,
});
(async function () {
  try {
    if (isMasterApp()) {
      console.log('主应用模式，加载loadApp...');
      const component = await preFetchLib('hel-monorepo-vite-vue3-remote/hello2', {
        custom: {
          host: 'http://localhost:8888',
          skipFetchHelMeta: false,
          enable: true,
          trust: true,
        },
      });
      await import('./loadApp');

      console.log(component);
    }
  } catch (error) {
    console.error('主应用main.js执行出错:', error);
    throw error;
  }
})().catch(console.error);
