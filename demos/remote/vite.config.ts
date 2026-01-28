import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import appInfo from './appInfo.mjs';
import injectRemoteScript from './vite.plugin.inject-remote-script';

console.log('appInfo', appInfo.getPublicPathOrUrl(`http://localhost:8888`, false));
// https://vite.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  return {
    base: appInfo.getPublicPathOrUrl(`http://localhost:8888`, false),
    define: {
      ...(mode === 'development' && {
        __VUE_HMR_RUNTIME__:
          '(globalThis.__VUE_HMR_RUNTIME__ || (globalThis.__VUE_HMR_RUNTIME__ = { createRecord: () => {}, rerender: () => {}, reload: () => {}, CHANGED_FILE: null }))',
      }),
    },
    plugins: [
      UnoCSS(),
      vue(),
      mode === 'development' && injectRemoteScript(),
      viteExternalsPlugin({
        vue: 'Vue',
      }),
    ],
    css: {
      devSourcemap: true,
    },
    server: {
      /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
      host: true, // host: "0.0.0.0"
      /** 端口号 */
      port: 8888, // 设置了端口就不会自动累加
      /** 是否自动打开浏览器 */
      open: false,
      /** 跨域设置允许 */
      cors: true,
      /** 端口被占用时，是否直接退出 */
      strictPort: false,
      /** 开启跨域，方便本机上别的项目调试当前模块 */
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      },
      /** 接口代理 */
      proxy: {
        '/api': {
          target: '', // 需要反向代理的IP地址
          ws: false,
          /** 是否允许跨域 */
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    preview: {
      host: true,
      port: 8888,
    },
    build: {
      target: 'chrome72',
      sourcemap: true,
      cssCodeSplit: false, // 确保CSS不被分割，全部内联到JS中
      rollupOptions: {
        output: {
          // dir: helDevUtils.cst.HEL_DIST_DIR, // 因为不发布到线上，所以不需要指定输出目录
          format: 'umd',
          globals: {
            ...appInfo.externals,
          },
        },
        external: Object.keys(appInfo.externals),
      },
    },
  };
});
