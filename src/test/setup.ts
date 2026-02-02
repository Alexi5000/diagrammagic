import '@testing-library/jest-dom';

/**
 * Polyfill for window.matchMedia
 * Required for components using useMediaQuery or responsive hooks
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

/**
 * Polyfill for ResizeObserver
 * Required for components using resize detection
 */
(window as typeof globalThis).ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
