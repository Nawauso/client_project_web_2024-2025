import * as Api from '../../api/ApiService';
import apiInstance from '../../api/AxiosInstance';

jest.mock('@/api/AxiosInstance', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  },
}));

const mocked = apiInstance as unknown as { get: jest.Mock; put: jest.Mock };

describe('ApiService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('fetchGenres returns array (fallback empty)', async () => {
    mocked.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Action' }] });
    await expect(Api.fetchGenres()).resolves.toEqual([{ id: 1, name: 'Action' }]);

    mocked.get.mockResolvedValueOnce({ data: null });
    await expect(Api.fetchGenres()).resolves.toEqual([]);
  });

  test('fetchProviders returns array (fallback empty)', async () => {
    mocked.get.mockResolvedValueOnce({ data: [{ id: 20, name: 'Netflix' }] });
    await expect(Api.fetchProviders()).resolves.toEqual([{ id: 20, name: 'Netflix' }]);

    mocked.get.mockResolvedValueOnce({ data: undefined });
    await expect(Api.fetchProviders()).resolves.toEqual([]);
  });

  test('fetchSelectedCriteria normalizes shape', async () => {
    mocked.get.mockResolvedValueOnce({ data: { genres: [1,2], providers: [10] } });
    await expect(Api.fetchSelectedCriteria()).resolves.toEqual({ genres: [1,2], providers: [10] });

    mocked.get.mockResolvedValueOnce({ data: { genres: 'oops', providers: null } });
    await expect(Api.fetchSelectedCriteria()).resolves.toEqual({ genres: [], providers: [] });
  });

  test('saveSelectedCriteria calls PUT correctly', async () => {
    mocked.put.mockResolvedValueOnce({ status: 204 });
    await Api.saveSelectedCriteria([1], [10]);
    expect(mocked.put).toHaveBeenCalledWith('/criterias/selected', { genres: [1], providers: [10] });
  });
});
