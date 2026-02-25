import { afterAll, beforeAll, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { setupServer } from 'msw/node';
import type { ReactElement } from 'react';
import type { RenderOptions } from '@testing-library/react';

const server = setupServer();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

beforeAll(() => server.listen());
afterEach(() => {
  window.localStorage.clear();
  server.resetHandlers();
});
afterAll(() => server.close());

export const renderWithProviders = (
  ui: ReactElement,
  { ...renderOptions }: Omit<RenderOptions, 'wrapper'> = {}
) => {
  return render(ui, { ...renderOptions });
};