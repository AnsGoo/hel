/*
|-----------------------------------------------------------------------------------
|
| 为尽量减少第三方依赖，同时也方便上层库调用 hel 内部通用的一些工具函数抽象到 commonUtil文件
|
|-----------------------------------------------------------------------------------
*/
import { getGlobalThis } from './globalRef';
import * as util from './util';

export function noop(...args: any[]): any[] {
  return args;
}

export function hasProp(obj: object, key: string | symbol): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function isServer(): boolean {
  const globalThis = getGlobalThis();
  return !!globalThis.process && !!globalThis.global && !globalThis.document;
}

export function safeParse<T = any>(jsonStr: string | any, defaultValue?: T, errMsg?: string): T {
  // 防止传入进来的已经是 json 对象
  if (jsonStr && typeof jsonStr !== 'string') {
    return jsonStr as T;
  }
  try {
    const result = JSON.parse(jsonStr); // 避免 JSON.parse('null') ---> null
    return (result || defaultValue) as T;
  } catch (err) {
    if (defaultValue !== undefined) return defaultValue;
    if (errMsg) throw new Error(errMsg);
    throw err;
  }
}

export const isNull = util.isNull;

export const noDupPush = util.noDupPush;

export const okeys = util.okeys;

export function merge2List<T>(list1: T[], list2: T[]): T[] {
  const mergedList: T[] = [];
  list1.forEach((v) => noDupPush(mergedList, v));
  list2.forEach((v) => noDupPush(mergedList, v));
  return mergedList;
}

export function purify<T extends object>(obj: T, isValueValid?: (value: any) => boolean): Partial<T> {
  // isValidVal or isNull
  const isValidFn = isValueValid || ((value) => !isNull(value));
  const pureObj: Partial<T> = {};
  okeys(obj).forEach((key) => {
    if (isValidFn(obj[key])) pureObj[key] = obj[key];
  });
  return pureObj;
}

export function getObjsVal<T>(objs: Array<Record<string, any>>, key: string, backupVal: T): T {
  let val: T = backupVal;
  for (const item of objs) {
    const mayValidVal = item[key];
    if (![null, undefined, ''].includes(mayValidVal)) {
      val = mayValidVal as T;
      break;
    }
  }
  return val;
}

/**
 * for pretty format multi line string when use \`...\`
 * @param {*} mayLineBreakStr
 * @param {'MULTI' | 'ONE'} [mode='MULTI']
 * @returns
 */
export function pfstr(mayLineBreakStr: string, mode: 'MULTI' | 'ONE' = 'MULTI'): string {
  const lines = mayLineBreakStr.split('\n');
  const lastIdx = lines.length - 1;
  const formatLine = lines
    .map((line, idx) => {
      if (!line && (idx === 0 || idx === lastIdx)) {
        return '';
      }
      const replaceBr = (line: string, hasBrStr: string, noBrStr: string = ''): string => {
        let result = line;
        if (line.endsWith('<br/>')) {
          result = line.substring(0, result.length - 5);
          return `${result}${hasBrStr}`;
        }
        return `${result}${noBrStr}`;
      };

      let result = line.trimStart?.() || line; // 去头部所有空格
      if (mode === 'MULTI') {
        return `${replaceBr(result, '')}\n`;
      }
      result = replaceBr(result, '\n', ' ');
      return result;
    })
    .join('');
  return formatLine;
}

export function nbstr(mayLineBreakStr: string): string {
  return pfstr(mayLineBreakStr, 'ONE');
}

export function nbalert(mayLineBreakStr: string, alertInDev: boolean = true): void {
  const g = getGlobalThis();
  const str = nbstr(mayLineBreakStr);
  const alert = g.alert || noop;
  if (alertInDev) {
    g.location?.port && alert(str);
    return;
  }
  alert(str);
}

export function setDataset(el: HTMLElement, key: string, val: string): void {
  if (el.dataset) {
    el.dataset[key] = val;
  } else {
    el.setAttribute(`data-${key}`, val);
  }
}

export function disableNode(node: HTMLElement | HTMLInputElement): void {
  // 只能连续命名，否则会报错
  // failed to set a named property on 'DOMStringMap': 'hel-disabled' is not a valid property name.
  setDataset(node, 'heldisabled', '1');
  node.disabled = true;
}
