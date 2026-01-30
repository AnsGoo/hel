import { purify } from './commonUtil';

interface InjectOptions {
  fn: Function;
  fnName: string;
  arg1PlatObjFnKeys: string[];
}

interface InectPlatToModOptions {
  ignoreKeys?: string[];
  arg1PlatObjFnKeys?: string[];
}

function injectPlat(platform: string, injectOptions: InjectOptions): Function {
  const { fn, fnName, arg1PlatObjFnKeys } = injectOptions;
  const handleArg1 = arg1PlatObjFnKeys.includes(fnName);

  return (...args: any[]) => {
    const mergePlatObj = (obj: any) => ({ platform, ...purify(obj || {}) });
    const [arg1, arg2] = args;
    if (handleArg1) {
      args[0] = mergePlatObj(arg1);
    } else {
      args[1] = mergePlatObj(arg2);
    }
    return fn.apply(this, args);
  };
}

export function inectPlatToMod(platform: string, mod: any, options?: InectPlatToModOptions): any {
  const { ignoreKeys = [], arg1PlatObjFnKeys = [] } = options || {};
  const newObj: any = {};
  Object.keys(mod).forEach((mayFnName) => {
    const mayFn = mod[mayFnName];
    if (ignoreKeys.includes(mayFnName)) {
      newObj[mayFnName] = mayFn;
      return;
    }

    const valueType = typeof mayFn;
    if (valueType && valueType === 'object') {
      newObj[mayFnName] = inectPlatToMod(platform, mayFn, options);
      return;
    }

    if (valueType === 'function') {
      newObj[mayFnName] = injectPlat(platform, {
        arg1PlatObjFnKeys,
        fn: mayFn,
        fnName: mayFnName,
      });
      return;
    }

    newObj[mayFnName] = mayFn;
  });

  return newObj;
}
