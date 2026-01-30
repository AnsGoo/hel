import { setDataset } from '../base/commonUtil';

interface MarkElFeatureOptions {
  platform: string;
  groupName: string;
  name: string;
  ver: string;
  elName: string;
}

export function markElFeature(el: HTMLElement, options: MarkElFeatureOptions): void {
  const { platform, groupName, name, ver, elName } = options;
  setDataset(el, 'el', elName);
  setDataset(el, 'plat', platform);
  setDataset(el, 'gname', groupName);
  setDataset(el, 'name', name);
  setDataset(el, 'ver', ver);
}
