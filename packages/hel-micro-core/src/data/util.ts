import { safeGetMap, setSubMapValue } from '../base/util';
import { DEFAULT_ONLINE_VER, helLoadStatus } from '../consts';
import { getSharedCache } from '../wrap/cache';

interface GetCustomDataOptions {
  versionId?: string;
  platform?: string;
}

interface SetVerLoadStatusOptions {
  versionId?: string;
  platform?: string;
}

interface GetVerLoadStatusOptions {
  versionId?: string;
  platform?: string;
}

const innerUtil = {
  getCustomData(appName: string, customKey: string, options: GetCustomDataOptions): any {
    const { versionId, platform } = options;
    const { appName2verCustomData } = getSharedCache(platform);
    const customMap = safeGetMap(appName2verCustomData, appName);
    const dataMap = safeGetMap(customMap, customKey);
    return dataMap[versionId || DEFAULT_ONLINE_VER];
  },

  getAppMeta(appName: string, platform?: string): any {
    const { appName2app } = getSharedCache(platform);
    return appName2app[appName];
  },

  setVerLoadStatus(appName: string, loadStatus: number, statusMapKey: string, options: SetVerLoadStatusOptions = {}): void {
    const { versionId, platform } = options || {};
    const appVerLoadStatus = getSharedCache(platform)[statusMapKey];
    const versionIdVar = versionId || DEFAULT_ONLINE_VER;
    setSubMapValue(appVerLoadStatus, appName, versionIdVar, loadStatus);
  },

  getVerLoadStatus(appName: string, statusMapKey: string, options: GetVerLoadStatusOptions = {}): number {
    const { versionId, platform } = options || {};
    const appVerLoadStatus = getSharedCache(platform)[statusMapKey];
    const versionIdVar = versionId || DEFAULT_ONLINE_VER;
    return appVerLoadStatus[appName]?.[versionIdVar] || helLoadStatus.NOT_LOAD;
  },

  // 预防一些未升级的老模块未写 DEFAULT_ONLINE_VER 的值到 libOrAppMap 里
  ensureOnlineModule(libOrAppMap: Record<string, any>, appName: string, platform?: string): void {
    if (libOrAppMap[DEFAULT_ONLINE_VER]) {
      return;
    }
    const appMeta = innerUtil.getAppMeta(appName, platform);
    const onlineModule = libOrAppMap[appMeta?.online_version];
    if (onlineModule) {
      libOrAppMap[DEFAULT_ONLINE_VER] = onlineModule;
    }
  },
};

export default innerUtil;
