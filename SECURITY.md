# Security Policy

## 🔐 Overview

This document outlines the security practices implemented in AI Diagram Creator Pro.

## 📋 Logging

All logging is centralized through `src/lib/logger.ts`:

| Environment | Behavior |
|-------------|----------|
| Development | All logs visible (debug, info, warn, error) |
| Production | Only errors logged |

**ESLint Enforcement:** The `no-console` rule prevents direct console usage, forcing all logging through the centralized logger.

```typescript
// ❌ Not allowed (ESLint error)
console.log('user data', userData);

// ✅ Correct approach
import { logger } from '@/lib/logger';
logger.info('User action logged', { userId: user.id });
```

## 🔑 API Key Handling

### Current Implementation (Demo/Testing)

API keys are stored in browser localStorage:
- Keys are visible in browser DevTools
- Users are explicitly warned about this
- Intended for development/testing only

### Production Recommendations

For production deployment:
1. Use Lovable Cloud (backend proxy)
2. Store API keys in server-side environment variables
3. Never expose keys to client-side code
4. Implement rate limiting on proxy endpoints

## ✅ Data Validation

All user inputs are validated using Zod schemas (`src/lib/validation.ts`):

| Field | Constraints |
|-------|-------------|
| Title | 1-100 characters |
| Description | 0-500 characters |
| Tags | 1-30 characters each |
| Prompt | 3-1000 characters |
| Code | 1-50000 characters |

Validation runs client-side before storage operations.

## 🛡️ XSS Protection

- Content Security Policy configured in deployment
- Mermaid.js library trusted for diagram rendering
- No raw HTML rendering from user input
- React's built-in XSS protection for all components

## 🔄 Design Tokens

All magic numbers centralized in `src/config/tokens.ts`:
- Prevents scattered, inconsistent values
- Type-safe access with runtime validation
- Single source of truth for configuration

## 📝 Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** open a public GitHub issue
2. Open a private security advisory on GitHub
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/security.html)
- [Lovable Cloud Documentation](https://docs.lovable.dev/features/cloud)
