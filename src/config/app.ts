import { logger } from '@/lib/logger';

/**
 * 🎯 APPLICATION CONFIGURATION
 * Single source of truth for app-wide settings
 */

export const APP_CONFIG = {
  // 📱 Application Info
  APP: {
    NAME: 'AI Diagram Creator Pro',
    VERSION: '2.0.0',
    ENVIRONMENT: import.meta.env.MODE,
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD,
  },
  
  // 🎚️ Feature Flags
  FEATURES: {
    AI_GENERATION: true,
    TEMPLATE_LIBRARY: true,
    EXPORT_SVG: true,
    DARK_MODE: true,
    SAVE_DIAGRAMS: true,
  },
  
  // 🤖 AI Configuration
  AI: {
    PROVIDER: 'openai',
    MODEL: 'gpt-4o-mini',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
  },
  
  // 📊 Analytics (future use)
  ANALYTICS: {
    ENABLED: false,
  },
} as const;

/**
 * 🚀 Validate configuration at startup
 * Logs configuration details for debugging
 */
export function validateAppConfig(): void {
  logger.info('🎯 ========================================');
  logger.info('🚀 Starting AI Diagram Creator Pro');
  logger.info('🎯 ========================================');
  logger.info(`📦 Version: ${APP_CONFIG.APP.VERSION}`);
  logger.info(`🌍 Environment: ${APP_CONFIG.APP.ENVIRONMENT}`);
  logger.info(`🎚️ Features: AI=${APP_CONFIG.FEATURES.AI_GENERATION}, Templates=${APP_CONFIG.FEATURES.TEMPLATE_LIBRARY}`);
  logger.info(`🤖 AI Model: ${APP_CONFIG.AI.MODEL}`);
  logger.info('✅ Configuration validated');
  logger.info('🎯 ========================================');
}
