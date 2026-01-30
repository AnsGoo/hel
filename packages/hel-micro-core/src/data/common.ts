import { noDupPush, safeGetMap } from '../base/util';
import { helConsts } from '../consts';
import { getCacheRoot } from '../wrap/cache';

const { KEY_CSS_LINK_TAG_ADDED, KEY_STYLE_TAG_ADDED, KEY_IGNORE_CSS_PREFIX_LIST, KEY_IGNORE_STYLE_TAG_KEY, KEY_IGNORE_CSS_PREFIX_2_KEYS } =
  helConsts;

function getDataMap(customKey: string): Record<string, any> {
  const { common } = getCacheRoot();
  const dataMap = safeGetMap(common, customKey);
  return dataMap;
}

/** perf: 内置的 key 已在 microShared 初始化时做了检查，此处可直接获取 */
function getDataNode(customKey: string): any {
  const { common } = getCacheRoot();
  return common[customKey]; // map or list
}

export function getCommonData(customKey: string, dataKey: string): any {
  const dataMap = getDataMap(customKey);
  const result = dataMap[dataKey];
  return result !== undefined ? result : null;
}

export function setCommonData(customKey: string, dataKey: string, data: any): void {
  const dataMap = getDataMap(customKey);
  dataMap[dataKey] = data;
}

/** 操作 commonData 的内置方法集合 */
export const commonDataUtil = {
  setIgnoreCssPrefix(cssPrefix: string): void {
    const list = getDataNode(KEY_IGNORE_CSS_PREFIX_LIST);
    noDupPush(list, cssPrefix);
  },
  setIgnoreStyleTagKey(key: string): void {
    const map = commonDataUtil.getIgnoreStyleTagMap();
    map[key] = 1;
  },
  getIgnoreStyleTagMap(): Record<string, number> {
    const map = getDataNode(KEY_IGNORE_STYLE_TAG_KEY);
    return map;
  },
  setIgnoreCssPrefixKey(ignoreCssPrefix: string, key: string): void {
    let list = getCommonData(KEY_IGNORE_CSS_PREFIX_2_KEYS, ignoreCssPrefix);
    if (!list) {
      list = [];
      setCommonData(KEY_IGNORE_CSS_PREFIX_2_KEYS, ignoreCssPrefix, list);
    }
    noDupPush(list, key);
  },
  getIgnoreCssPrefixKeys(ignoreCssPrefix: string): string[] {
    const map = getDataNode(KEY_IGNORE_CSS_PREFIX_2_KEYS);
    return map[ignoreCssPrefix] || [];
  },
  getMatchedIgnoreCssPrefix(url: string): string {
    const ignoreCssPrefixList = getDataNode(KEY_IGNORE_CSS_PREFIX_LIST);
    let matchedPrefix = '';
    for (let i = 0; i < ignoreCssPrefixList.length; i++) {
      const cssPrefix = ignoreCssPrefixList[i];
      if (url.startsWith(cssPrefix)) {
        matchedPrefix = cssPrefix;
        break;
      }
    }
    return matchedPrefix;
  },
  getIgnoreCssPrefixCssUrlList(ignoreCssPrefix: string): string[] {
    let cssUrlList = getCommonData(KEY_CSS_LINK_TAG_ADDED, ignoreCssPrefix);
    if (!cssUrlList) {
      cssUrlList = [];
      setCommonData(KEY_CSS_LINK_TAG_ADDED, ignoreCssPrefix, cssUrlList);
    }
    return cssUrlList;
  },
  setIgnoreCssPrefixCssUrl(ignoreCssPrefix: string, url: string): void {
    const cssUrlList = commonDataUtil.getIgnoreCssPrefixCssUrlList(ignoreCssPrefix);
    cssUrlList.push(url);
  },
  getStyleTagText(key: string): string {
    const text = getCommonData(KEY_STYLE_TAG_ADDED, key) || '';
    return text;
  },
  clearStyleTagText(key: string): void {
    setCommonData(KEY_STYLE_TAG_ADDED, key, '');
  },
  appendStyleTagText(key: string, text: string): void {
    const oldText = commonDataUtil.getStyleTagText(key);
    // 继续拼接新的样式字符串
    setCommonData(KEY_STYLE_TAG_ADDED, key, `${oldText} ${text}`);
  },
};
