import { getSharedCache } from '../wrap/cache';

interface ISubApp {
  name: string;
  [key: string]: any;
}

export function getAppMeta(appName: string, platform: string): any {
  const { appName2app } = getSharedCache(platform);
  return appName2app[appName];
}

export function setAppMeta(appMeta: ISubApp, platform: string): void {
  const { appName2app } = getSharedCache(platform);
  appName2app[appMeta.name] = appMeta;
}
