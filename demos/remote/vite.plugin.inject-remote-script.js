export default function injectRemoteScript() {
  return {
    name: 'inject-remote-script',
    transformIndexHtml(html) {
      // 先删除原有的 /src/main.js 脚本标签
      let modifiedHtml = html.replace(/<script[^>]*src=["'][^"']*\/src\/main\.(js|ts)["'][^>]*><\/script>\s*/gi, '');

      // 然后注入新的远程脚本标签
      return modifiedHtml.replace('</body>', '  <script type="module" src="http://localhost:8888/src/main.ts"></script>\n  </body>');
    },
  };
}
