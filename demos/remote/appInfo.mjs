import helDevUtils from 'hel-dev-utils';
import pkg from './package.json';

export default helDevUtils.createVueSubApp(pkg, {
  // 如果需要上传到自定义的 cdn 地址
  // homePage: 'Your CDN host',
  npmCdnType: 'unpkg',
  homePage: 'http://localhost:8888',
  handleHomePage: false,
});
