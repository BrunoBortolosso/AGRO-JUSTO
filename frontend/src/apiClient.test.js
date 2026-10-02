import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient, normalizeApiError, TOKEN_STORAGE_KEY } from './apiClient.js';

const createSessionStorageMock = () => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
};

describe('apiClient', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: createSessionStorageMock(),
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    globalThis.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('normaliza erros da API em formato consistente', () => {
    const normalized = normalizeApiError({ status: 401, code: 'unauthorized', message: 'Sessão expirada.' }, 'Fallback');

    expect(normalized).toEqual({
      status: 401,
      code: 'unauthorized',
      message: 'Sessão expirada.',
      details: undefined,
    });
  });

  it('envia o token em autorização e usa a URL do backend configurada', async () => {
    globalThis.sessionStorage.setItem(TOKEN_STORAGE_KEY, 'abc123');
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ ok: true }),
    });

    await apiClient.get('/health');

    expect(fetchSpy).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3333'}/health`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer abc123',
        }),
      })
    );
  });
});
