/**
 * 🎨 DESIGN TOKENS - Single Source of Truth
 * Following Uncle Bob's Clean Code principles:
 * - Single Responsibility: Each token category has one purpose
 * - Self-Documenting: Emojis + clear names eliminate need for comments
 * - AI-Proof: Type-safe access prevents misuse
 */

export const TOKENS = {
  // ⏱️ TIMING (milliseconds)
  TIMING: {
    DEBOUNCE_FAST: 150,
    DEBOUNCE_DEFAULT: 300,
    ANIMATION_FAST: 150,
    ANIMATION_DEFAULT: 300,
    ANIMATION_SLOW: 500,
    ANIMATION_SLOWER: 700,
    ANIMATION_DELAY_PANEL: 100,
    TIMEOUT_RENDER: 300,
    TIMEOUT_THEME_SWITCH: 10,
  },
  
  // 📏 DIMENSIONS (pixels)
  DIMENSIONS: {
    ICON_SM: 16,
    ICON_MD: 24,
    ICON_LG: 40,
    BUTTON_HEIGHT: 36,
    TOOLBAR_HEIGHT: 60,
    LOGO_SIZE: 40,
  },
  
  // 🎭 PARTICLES (responsive - for Hyperspeed background)
  PARTICLES: {
    MOBILE: 50,
    TABLET: 75,
    DESKTOP: 100,
    SPEED: 2,
    SIZE: 2,
  },
  
  // 📝 TEXT LIMITS (validation boundaries)
  LIMITS: {
    TITLE_MIN: 1,
    TITLE_MAX: 100,
    DESCRIPTION_MAX: 500,
    TAG_MIN: 1,
    TAG_MAX: 30,
    PROMPT_MIN: 3,
    PROMPT_MAX: 1000,
    CODE_MIN: 1,
    CODE_MAX: 50000,
  },
  
  // 🔐 STORAGE KEYS (localStorage)
  STORAGE: {
    DIAGRAMS: 'ai-diagrams',
    API_KEY: 'openai-api-key',
    VERSION: 1,
  },
  
  // ✨ SHIMMER EFFECT (ShinyText animation)
  SHIMMER: {
    WIDTH: 200,
    SPEED: 3,
    COLOR: 'rgba(255, 255, 255, 0.8)',
  },
  
  // 🎬 SPLIT TEXT ANIMATION (SplitText animation)
  SPLIT_TEXT: {
    DELAY_MS: 50,
    DURATION_SEC: 0.5,
  },
  
  // 🖥️ GRID PATTERN (CSS background)
  GRID: {
    SIZE: 50,
    OPACITY: 0.2,
  },
  
  // 🎯 Z-INDEX LAYERS (stacking context)
  Z_INDEX: {
    BACKGROUND: -10,
    BACKGROUND_OVERLAY: -1,
    CONTENT: 1,
    TOOLBAR: 50,
    MODAL: 100,
    TOAST: 200,
  },
} as const;

// 🔒 Type-safe token access with runtime validation
export type TokenCategory = keyof typeof TOKENS;
export type TokenKey<T extends TokenCategory> = keyof typeof TOKENS[T];
export type TokenPath = `${TokenCategory}.${string}`;

/**
 * ✅ Get token with runtime validation
 * Throws if token doesn't exist (fail fast)
 */
export function getToken<T extends TokenCategory>(
  category: T,
  key: TokenKey<T>
): number | string {
  const tokens = TOKENS[category] as Record<string, number | string>;
  const value = tokens[key as string];
  
  if (value === undefined) {
    throw new Error(`❌ Token not found: ${category}.${String(key)}`);
  }
  
  return value;
}

/**
 * 🧪 Validate all tokens at startup
 * Ensures no negative values or NaN
 */
export function validateTokens(): void {
  const errors: string[] = [];
  
  for (const [category, tokens] of Object.entries(TOKENS)) {
    for (const [key, value] of Object.entries(tokens)) {
      if (typeof value === 'number') {
        if (isNaN(value)) {
          errors.push(`${category}.${key} is NaN`);
        }
        if (value < 0 && category !== 'Z_INDEX') {
          errors.push(`${category}.${key} is negative: ${value}`);
        }
      }
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`❌ Token validation failed:\n${errors.join('\n')}`);
  }
}
