import inner from './util';

interface StatusOptions {
  versionId?: string;
  platform?: string;
}

export function setVerLoadStatus(appName: string, loadStatus: number, options: StatusOptions): void {
  inner.setVerLoadStatus(appName, loadStatus, 'appName2verLoadStatus', options);
}

export function getVerLoadStatus(appName: string, options: StatusOptions): number {
  return inner.getVerLoadStatus(appName, 'appName2verLoadStatus', options);
}

export function setVerStyleStrStatus(appName: string, loadStatus: number, options: StatusOptions): void {
  inner.setVerLoadStatus(appName, loadStatus, 'appName2verStyleFetched', options);
}

export function getVerStyleStrStatus(appName: string, options: StatusOptions): number {
  return inner.getVerLoadStatus(appName, 'appName2verStyleFetched', options);
}
