import { defineConfig, presetAttributify, presetUno } from 'unocss';
// 根据class查属性https://unocss.dev/interactive/       根据属性查classhttps://tailwindcss.com/docs/font-size
export default defineConfig({
  /** 预设 */
  presets: [
    /** 属性化模式 & 无值的属性模式 */
    presetAttributify(),
    /** 默认预设 */
    presetUno(),
  ],
});
