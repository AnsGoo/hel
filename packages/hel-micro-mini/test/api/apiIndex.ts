import { runTest } from '../testKit';

runTest(({ api, describe }) => {
  describe('test apiIndex', () => {
    test('expose 2 apis', () => {
      expect(api).toBeTruthy();
      // hel-micro-mini 包只导出了两个方法：eventBus 和 preFetchLib
      const apiKeys = Object.keys(api).filter((apiName) => apiName !== 'default');
      expect(apiKeys.length).toBe(2);
      expect(apiKeys).toContain('eventBus');
      expect(apiKeys).toContain('preFetchLib');
    });
  });
});
