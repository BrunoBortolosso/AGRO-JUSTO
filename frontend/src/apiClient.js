export const TOKEN_STORAGE_KEY = 'agrojusto.token';

export function normalizeApiError(error, fallbackMessage = 'Não foi possível completar a operação.') {
  if (!error) return { status: 0, code: 'unknown', message: fallbackMessage, details: undefined };

  if (typeof error === 'string') {
    return { status: 0, code: 'unknown', message: error, details: undefined };
  }

  return {
    status: error.status ?? error.response?.status ?? 0,
    code: error.code ?? error.error ?? 'unknown',
    message: error.message ?? fallbackMessage,
    details: error.details ?? error.response?.data ?? undefined,
  };
}

function getBaseUrl() {
  const configured = import.meta.env.VITE_API_URL || 'http://localhost:3333';
  return configured.replace(/\/$/, '');
}

function getStorage() {
  try {
    return typeof globalThis !== 'undefined' && globalThis.sessionStorage ? globalThis.sessionStorage : null;
  } catch {
    return null;
  }
}

function getToken() {
  const storage = getStorage();
  return storage ? storage.getItem(TOKEN_STORAGE_KEY) || '' : '';
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return response.status === 204 ? null : {};

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  const payload = await parseResponse(response);

  if (!response.ok) {
    const errorPayload = typeof payload === 'object' && payload ? payload : {};
    const apiError = normalizeApiError({
      status: response.status,
      code: errorPayload.code ?? 'request_error',
      message: errorPayload.message ?? errorPayload.error ?? 'Erro na requisição.',
      details: errorPayload.details ?? errorPayload,
    });
    throw apiError;
  }

  return payload;
}

export const apiClient = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  }),
  patch: (path, body, options = {}) => request(path, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  }),
  del: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
};
