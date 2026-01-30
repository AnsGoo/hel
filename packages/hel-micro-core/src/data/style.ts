import { log } from '../base/microDebug';
import { safeGetMap, setSubMapValue } from '../base/util';
import { DEFAULT_ONLINE_VER, helLoadStatus } from '../consts';
import { getSharedCache } from '../wrap/cache';

interface GetAppStyleStrOptions {
  platform?: string;
  versionId?: string;
}

interface SetAppStyleStrOptions {
  platform?: string;
  versionId?: string;
}

interface SetVerExtraCssListOptions {
  versionId?: string;
  platform?: string;
}

interface GetVerExtraCssListOptions {
  versionId?: string;
  platform?: string;
}

export function getAppStyleStr(appName: string, options: GetAppStyleStrOptions = {}): string {
  const { platform, versionId } = options || {};
  const { appName2verStyleStr, appName2styleStr } = getSharedCache(platform);

  // TODO: 暂未考虑接入 strictMatchVer
  const fallbackStyleStr = appName2styleStr[appName] || '';
  // 兼容老包未写 versionId 的情况
  if (!versionId) {
    return fallbackStyleStr;
  }

  return appName2verStyleStr[appName]?.[versionId] || fallbackStyleStr || '';
}

export function setAppStyleStr(appName: string, str: string, options: SetAppStyleStrOptions = {}): void {
  const { platform, versionId } = options || {};
  const { appName2verStyleStr, appName2verStyleFetched, appName2styleStr } = getSharedCache(platform);
  // 兼容老包未写 versionId 的情况
  if (!versionId) {
    appName2styleStr[appName] = str;
    return;
  }

  setSubMapValue(appName2verStyleStr, appName, versionId, str);
  setSubMapValue(appName2verStyleFetched, appName, versionId, helLoadStatus.LOADED);
}

export function setVerExtraCssList(appName: string, cssList: string[], inputOptions: SetVerExtraCssListOptions = {}): void {
  const options = inputOptions || {};
  const { versionId, platform } = options;
  const sharedCache = getSharedCache(platform);
  const { appName2verExtraCssList } = sharedCache;

  log('[[ core:setVerExtraCssList ]] cssList:', cssList);
  const verExtraCssListMap = safeGetMap(appName2verExtraCssList, appName);
  // 记录第一个载入的版本号对应 css 资源
  if (!verExtraCssListMap[DEFAULT_ONLINE_VER]) {
    setSubMapValue(appName2verExtraCssList, appName, DEFAULT_ONLINE_VER, cssList);
  }
  if (versionId) {
    setSubMapValue(appName2verExtraCssList, appName, versionId, cssList);
  }
}

export function getVerExtraCssList(appName: string, inputOptions: GetVerExtraCssListOptions = {}): string[] {
  const options = inputOptions || {};
  const { versionId, platform } = options;
  const sharedCache = getSharedCache(platform);
  const { appName2verExtraCssList } = sharedCache;
  const verExtraCssListMap = safeGetMap(appName2verExtraCssList, appName);
  const cssList = verExtraCssListMap[versionId] || verExtraCssListMap[DEFAULT_ONLINE_VER] || [];
  log('[[ core:getVerExtraCssList ]] options,cssList:', options, cssList);
  return cssList;
}
