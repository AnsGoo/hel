import { getHelMicroShared } from '../base/microShared';
import { helEvents } from '../consts';

const { STYLE_TAG_ADDED, CSS_LINK_TAG_ADDED } = helEvents;

export function getHelEventBus(): any {
  return getHelMicroShared().eventBus;
}

export function getUserEventBus(): any {
  return getHelMicroShared().userEventBus;
}

export const evName = {
  styleTagAdded(groupName: string): string {
    return `${STYLE_TAG_ADDED}/${groupName}`;
  },
  cssLinkTagAdded(host: string): string {
    return `${CSS_LINK_TAG_ADDED}(${host})`;
  },
};
