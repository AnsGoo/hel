import { helConsts, logModeEnum } from '../consts';
import { getHelSingletonHost } from './globalRef';
import { getLsItem, getSearchObj, isNull, setLsItem } from './util';

const { LS_LOG_FILTER, LS_LOG_MODE } = helConsts;
const { NONE, LOG, TRACE } = logModeEnum;

export interface IHelMicroDebug {
  logMode: number;
  logFilter: string;
  isInit: boolean;
}

export const inner = {
  isIncludeFilter(firstArg: string, logFilter: string): boolean {
    if (!logFilter.includes(',')) {
      return firstArg.includes(logFilter);
    }
    const filterList: string[] = logFilter.split(',');
    return filterList.some((item) => firstArg.includes(item));
  },
  getLogFilter(): string {
    return getHelMicroDebug().logFilter;
  },
  setLogFilter(value: string, memVal: boolean = true): void {
    getHelMicroDebug().logFilter = value;
    memVal && setLsItem(LS_LOG_FILTER, value);
  },
  setLogMode(value: string | number, memVal: boolean = true): void {
    const modeNum = parseInt(value as string, 10);
    if ([NONE, LOG, TRACE].includes(modeNum)) {
      getHelMicroDebug().logMode = modeNum;
      memVal && setLsItem(LS_LOG_MODE, modeNum);
    }
  },
  getLogMode(): number {
    return getHelMicroDebug().logMode;
  },
};

let helMicroDebug: IHelMicroDebug = {} as IHelMicroDebug;

function initMicroDebug(): void {
  if (getHelMicroDebug().isInit) {
    return;
  }

  getHelMicroDebug().isInit = true;
  const searchObj = getSearchObj();
  const { hellog, hellogf } = searchObj;

  // 优先读 url 上的控制参数 hellog，再读 localStorage 里的控制参数
  const logMode = hellog || getLsItem(LS_LOG_MODE) || NONE;
  inner.setLogMode(logMode, false);

  // 优先读 url 上的控制参数 hellogf
  const logFilter = hellogf || getLsItem(LS_LOG_FILTER) || '';
  inner.setLogFilter(logFilter, false);
}

function makeHelMicroDebug(): IHelMicroDebug {
  return {
    logMode: NONE,
    logFilter: '',
    isInit: false,
  };
}

export function ensureHelMicroDebug(): void {
  helMicroDebug = getHelSingletonHost().__HEL_MICRO_DEBUG__;
  if (!isNull(helMicroDebug)) {
    // 兼容老版本库生成的 __HEL_MICRO_DEBUG__ 对象
    if (helMicroDebug.logMode === undefined) {
      helMicroDebug.logMode = NONE;
      helMicroDebug.logFilter = '';
    }
    return;
  }

  helMicroDebug = makeHelMicroDebug();
  getHelSingletonHost().__HEL_MICRO_DEBUG__ = helMicroDebug;
  try {
    initMicroDebug();
  } catch (err) {}
}

/** 采用缓存一次值后便不再从 search 推导的策略，方便单页面应用路由变化后，依然可以打印log */
export function allowLog(): boolean {
  return inner.getLogMode() !== NONE;
}

export function getHelMicroDebug(): IHelMicroDebug {
  return helMicroDebug;
}

const logPrefix = '  %c--> HEL LOG:';
const colorDesc = 'color:#ad4e00;font-weight:600';
export function log(...args: any[]): void {
  if (!allowLog()) {
    return;
  }
  const logFn = inner.getLogMode() === LOG ? console.log : console.trace || console.log;
  const [firstArg, ...rest] = args;
  if (typeof firstArg !== 'string') {
    return logFn(logPrefix, colorDesc, ...args);
  }

  const logFilter = inner.getLogFilter();
  const logParams = [`${logPrefix} ${firstArg}`, colorDesc, ...rest];
  if (logFilter) {
    inner.isIncludeFilter(firstArg, logFilter) && logFn(...logParams);
    return;
  }
  logFn(...logParams);
}

const labelTimes: Record<string, number> = {};

export function perfMark(label: string): void {
  if (!allowLog() || labelTimes[label]) {
    return;
  }
  labelTimes[label] = Date.now();
}

export function perfPeek(label: string, subLabel: string, clear: boolean): void {
  if (!allowLog() || !labelTimes[label]) {
    return;
  }
  const start = labelTimes[label];
  log(`[[ PerfCheck ]] (${label}/${subLabel}) costs ${Date.now() - start} ms`);
  if (clear) {
    clearPerfMark(label);
  }
}

export function clearPerfMark(label: string): void {
  labelTimes[label] = 0;
}
