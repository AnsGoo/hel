import * as apis from 'index';
import * as util from './util';

const semverApi = false;
const platform = 'hel';

// hel-micro-mini 包只导出了两个方法，没有 createOriginInstance 方法
export const ins = apis;
export const ori = apis;

export type Api = typeof ori;

function makeTestKitContext(api: Api, platform: string, semverApi: boolean) {
  const isIns = !semverApi; // 非语义化版本 api 配置（ semverApi=false ） 即是实例 api
  return {
    api,
    isIns,
    semverApi,
    platform,
    describe: (label: string, describeCb: any) => {
      const mark = isIns ? 'ins' : 'ori';
      describe(`${mark}: ${label}`, describeCb);
    },
    util,
  };
}

export function runTest(cb: (kitCtx: ReturnType<typeof makeTestKitContext>) => void) {
  cb(makeTestKitContext(ins, platform, semverApi));
  // hel-micro-mini 包没有 core 属性，所以只运行一个测试
}

