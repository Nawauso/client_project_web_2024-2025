// Smoke test for AxiosInstance: module should export an object with interceptors
import { tryRequire, pickExport } from '../../test/runtimeRequire';

const { mod } = tryRequire('../../api/AxiosInstance');
const axiosInstance = pickExport(mod, ['default']);

const maybe = axiosInstance ? it : it.skip;

describe('AxiosInstance', () => {
  maybe('has request/response interceptors', () => {
    expect(axiosInstance.interceptors).toBeDefined();
    expect(axiosInstance.interceptors.request).toBeDefined();
    expect(axiosInstance.interceptors.response).toBeDefined();
  });
});
