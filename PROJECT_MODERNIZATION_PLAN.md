# Project Modernization & Cleanup Plan

## Overview

This document outlines a comprehensive plan to modernize, clean up, and future-proof the Stride Lab running shoes library application. The analysis covers architecture, code quality, performance, security, and developer experience improvements.

## Current State Analysis

### ✅ Strengths

- **Modern Framework**: Built with Next.js 15 and React 19
- **TypeScript**: Comprehensive TypeScript implementation
- **Testing**: Jest setup with good test coverage expectations
- **Authentication**: Complete Strava OAuth integration
- **CMS Integration**: Sanity CMS for content management
- **Database**: PostgreSQL with Neon serverless
- **Styling**: Tailwind CSS + Ant Design components
- **Performance**: Image optimization and caching strategies

### ⚠️ Areas for Improvement

- **Code Organization**: Inconsistent naming conventions
- **Error Handling**: Basic error handling throughout
- **Performance**: Potential optimization opportunities
- **Security**: Some security improvements needed
- **Developer Experience**: Could benefit from better tooling
- **Documentation**: Limited inline documentation

## 🎯 Modernization Goals

1. **Code Quality & Architecture**
2. **Performance Optimization**
3. **Security Hardening**
4. **Developer Experience Enhancement**
5. **Future-Proofing**

---

## 📋 Detailed Action Plan

### 1. Code Architecture & Organization

#### 1.1 File Structure Standardization

**Priority: High**

```
Current Issues:
- Inconsistent naming: `_components` vs `components`
- Mixed file organization patterns
- Unclear separation of concerns

Recommended Changes:
src/
├── components/           # Rename _components to components
├── types/               # Rename _types to types
├── utils/               # Rename _utils to utils
├── hooks/               # Add custom hooks directory
├── lib/                 # Add shared library functions
├── constants/           # Add constants directory
└── providers/           # Add context providers
```

#### 1.2 Component Architecture

**Priority: High**

```typescript
// Current: Mixed patterns
// Recommended: Consistent component structure

// components/common/     - Reusable UI components
// components/features/   - Feature-specific components
// components/layout/     - Layout components
// components/forms/      - Form components
```

#### 1.3 TypeScript Improvements

**Priority: Medium**

```typescript
// Add strict type checking
// tsconfig.json improvements
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 2. Performance Optimization

#### 2.1 Database Query Optimization

**Priority: High**

```typescript
// Current: Multiple separate queries
// Recommended: Batch queries and better caching

// Add database indexing strategy
// Implement query result caching
// Add request deduplication
// Optimize Sanity queries with projections
```

#### 2.2 Client-Side Performance

**Priority: Medium**

```typescript
// Add React Query/TanStack Query for:
// - Caching API responses
// - Background refetching
// - Optimistic updates
// - Request deduplication

// Implement code splitting:
// - Route-based code splitting
// - Component lazy loading
// - Dynamic imports for heavy components
```

#### 2.3 Image Optimization

**Priority: Medium**

```typescript
// Current: Basic Next.js Image component
// Recommended: Enhanced optimization

// Add image placeholders
// Implement responsive images
// Add WebP/AVIF support
// Lazy loading improvements
```

### 3. Security Hardening

#### 3.1 Authentication & Authorization

**Priority: High**

```typescript
// Current: Basic JWT + cookie auth
// Recommended: Enhanced security

// Add CSRF protection
// Implement rate limiting
// Add session management
// Improve admin role verification
// Add audit logging
```

#### 3.2 Input Validation & Sanitization

**Priority: High**

```typescript
// Add comprehensive validation:
// - API input validation with Zod
// - Form validation with react-hook-form
// - SQL injection prevention
// - XSS protection
```

#### 3.3 Environment & Configuration

**Priority: Medium**

```typescript
// Add environment validation
// Implement configuration management
// Add secrets management
// Environment-specific settings
```

### 4. Error Handling & Monitoring

#### 4.1 Comprehensive Error Handling

**Priority: High**

```typescript
// Current: Basic try-catch blocks
// Recommended: Structured error handling

// Add error boundaries
// Implement error logging
// Add user-friendly error messages
// Create error tracking system
```

#### 4.2 Monitoring & Observability

**Priority: Medium**

```typescript
// Add application monitoring:
// - Performance metrics
// - Error tracking (Sentry)
// - User analytics
// - API monitoring
```

### 5. Developer Experience

#### 5.1 Code Quality Tools

**Priority: High**

```json
// Add/improve linting and formatting
{
  "eslint": "Enhanced ESLint configuration",
  "prettier": "Code formatting",
  "husky": "Git hooks",
  "lint-staged": "Pre-commit linting",
  "commitizen": "Conventional commits"
}
```

#### 5.2 Testing Enhancement

**Priority: Medium**

```typescript
// Current: Basic Jest setup
// Recommended: Comprehensive testing

// Add integration tests
// API testing with MSW
// E2E testing with Playwright
// Visual regression testing
// Performance testing
```

#### 5.3 Documentation

**Priority: Medium**

```markdown
# Add comprehensive documentation:

- API documentation
- Component documentation with Storybook
- Deployment guides
- Contributing guidelines
- Architecture decisions (ADRs)
```

### 6. Feature Enhancements

#### 6.1 Search & Filtering

**Priority: Medium**

```typescript
// Current: Basic Sanity search
// Recommended: Enhanced search

// Add search indexing
// Implement faceted search
// Add search suggestions
// Improve filter performance
```

#### 6.2 User Experience

**Priority: Medium**

```typescript
// Add progressive enhancement:
// - Offline support
// - Push notifications
// - Better mobile experience
// - Accessibility improvements
```

### 7. Infrastructure & Deployment

#### 7.1 CI/CD Pipeline

**Priority: Medium**

```yaml
# Add GitHub Actions:
# - Automated testing
# - Security scanning
# - Deployment automation
# - Performance monitoring
```

#### 7.2 Database Migrations

**Priority: Medium**

```typescript
// Add database migration system
// Implement backup strategies
// Add data validation
// Create seeding scripts
```

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

- [ ] File structure reorganization
- [ ] Enhanced TypeScript configuration
- [ ] Code quality tools setup
- [ ] Basic error handling improvements

#### 📋 Phase 1 Detailed Implementation Guide

##### 1.1 File Structure Reorganization (Week 1, Days 1-3)

**Current Structure Issues:**
```
src/
├── _components/     # Inconsistent naming
├── _types/          # Inconsistent naming
├── _utils/          # Inconsistent naming
└── app/
    ├── _components/ # Duplicated pattern
    └── shoes/
        └── _components/ # Nested inconsistency
```

**Step-by-Step Migration:**

**Day 1: Plan & Backup**
```bash
# 1. Create backup branch
git checkout -b backup/pre-restructure
git push -u origin backup/pre-restructure

# 2. Create feature branch
git checkout main
git checkout -b refactor/file-structure-phase1
```

**Day 2: Core Directory Migration**
```bash
# 3. Rename core directories
mv src/_components src/components
mv src/_types src/types
mv src/_utils src/utils

# 4. Create new directories
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/constants
mkdir -p src/providers
mkdir -p src/components/common
mkdir -p src/components/features
mkdir -p src/components/layout
mkdir -p src/components/forms
```

**Day 3: Update Import Paths**
```typescript
// 5. Update all import statements
// From: import { Component } from '@/_components/Component'
// To:   import { Component } from '@/components/Component'

// Create a script to automate this:
// scripts/update-imports.js
```

**Updated Structure:**
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── Pagination/
│   ├── features/        # Feature-specific components
│   │   ├── Auth/
│   │   ├── Shoes/
│   │   └── Reviews/
│   ├── layout/          # Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Sidebar/
│   └── forms/           # Form components
├── types/               # Type definitions
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
├── lib/                 # Third-party configurations
├── constants/           # Application constants
└── providers/           # Context providers
```

**Import Path Updates:**
```typescript
// Update tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/constants/*": ["./src/constants/*"]
    }
  }
}
```

##### 1.2 Enhanced TypeScript Configuration (Week 1, Days 4-5)

**Current tsconfig.json Issues:**
- Missing strict mode options
- No path validation
- Limited type checking

**Step-by-Step Implementation:**

**Day 4: Strict Mode Configuration**
```json
// Update tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,

    // Enhanced strict mode
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noImplicitOverride": true,

    // Additional checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noPropertyAccessFromIndexSignature": true,

    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,

    "plugins": [{ "name": "next" }],

    // Enhanced path mapping
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/constants/*": ["./src/constants/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Day 5: Type Safety Improvements**
```typescript
// Create strict type definitions
// src/types/globals.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NEXT_PUBLIC_STRAVA_CLIENT_ID: string;
      STRAVA_CLIENT_SECRET: string;
      JWT_SECRET: string;
      // Add all required env vars
    }
  }
}

// src/types/api.ts
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

##### 1.3 Code Quality Tools Setup (Week 2, Days 1-3)

**Day 1: ESLint Configuration**
```bash
# Install dependencies
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint-config-next eslint-plugin-react-hooks
npm install -D eslint-plugin-jsx-a11y eslint-plugin-import
```

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-template": "error"
  }
}
```

**Day 2: Prettier & Formatting**
```bash
# Install Prettier
npm install -D prettier eslint-config-prettier
```

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

```
// .prettierignore
.next
node_modules
.env*
public
*.md
```

**Day 3: Git Hooks & Automation**
```bash
# Install Husky and lint-staged
npm install -D husky lint-staged
npx husky install
```

```json
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{js,jsx,json,css,md}": [
      "prettier --write"
    ]
  }
}
```

```bash
# Create git hooks
echo 'npx lint-staged' > .husky/pre-commit
echo 'npm run type-check' > .husky/pre-push
```

##### 1.4 Basic Error Handling Improvements (Week 2, Days 4-5)

**Day 4: Error Boundary Implementation**
```typescript
// src/components/common/ErrorBoundary/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
    // Add error logging service here
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Day 5: API Error Handling**
```typescript
// src/utils/api.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleApiResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || 'API request failed',
      response.status,
      errorData.code
    );
  }

  return response.json();
}

// src/utils/error-logger.ts
export function logError(
  error: Error,
  context?: Record<string, unknown>
): void {
  console.error('Error:', error.message, {
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });

  // Add external error logging service integration
  // e.g., Sentry, LogRocket, etc.
}
```

#### ✅ Phase 1 Deliverables Checklist

**Week 1:**
- [x] File structure migrated to consistent naming
- [x] Import paths updated throughout codebase
- [x] TypeScript strict mode enabled
- [x] Enhanced type definitions created
- [x] No TypeScript errors in build

**Week 2:**
- [x] ESLint configuration implemented
- [x] Prettier formatting applied
- [x] Git hooks configured
- [x] Error boundary components created
- [x] Basic API error handling implemented
- [x] All code passes linting and formatting checks

**✅ PHASE 1 COMPLETED - See PHASE_1_REPORT.md for detailed progress**

#### 🔍 Testing Phase 1 Changes

```bash
# Verify everything works
npm run type-check    # No TypeScript errors
npm run lint         # No ESLint errors
npm run format:check # Code is properly formatted
npm run build        # Application builds successfully
npm run dev          # Development server starts without issues
```

#### 📝 Phase 1 Success Criteria

1. **File Structure**: Consistent naming conventions across all directories
2. **TypeScript**: Strict mode enabled with zero errors
3. **Code Quality**: ESLint and Prettier configured and passing
4. **Git Workflow**: Pre-commit hooks preventing bad code from being committed
5. **Error Handling**: Basic error boundaries and API error handling in place
6. **Development Experience**: Faster feedback loop with automated tooling

**Estimated Time**: 2 weeks (80 hours)
**Risk Level**: Low (mostly organizational changes)
**Dependencies**: None
**Rollback Plan**: Revert to backup branch if issues arise

### Phase 2: Security & Performance (Weeks 3-4)

- [ ] Authentication hardening
- [ ] Input validation implementation
- [ ] Database query optimization
- [ ] Caching strategy implementation

#### 📋 Phase 2 Detailed Implementation Guide

##### 2.1 Authentication Hardening (Week 3, Days 1-3)

**Current Security Issues:**
```typescript
// Basic JWT implementation without comprehensive security measures
// Missing CSRF protection
// No rate limiting
// Basic session management
```

**Step-by-Step Implementation:**

**Day 1: CSRF Protection & Security Headers**
```typescript
// src/middleware.ts - Enhanced security middleware
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/utils/auth/jwt';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // CSP header for XSS protection
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  // CSRF protection for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const token = request.headers.get('X-CSRF-Token') || request.cookies.get('csrf-token')?.value;
    const sessionToken = request.cookies.get('session-token')?.value;

    if (!token || !sessionToken || !verifyCsrfToken(token, sessionToken)) {
      return new Response('CSRF token invalid', { status: 403 });
    }
  }

  return response;
}
```

**Day 2: Enhanced Session Management**
```typescript
// src/utils/auth/session.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  sessionId: string;
}

export class SessionManager {
  private static readonly SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
  private static readonly COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  };

  static async createSession(payload: Omit<SessionPayload, 'iat' | 'exp' | 'sessionId'>): Promise<string> {
    const sessionId = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);

    const token = await new SignJWT({ ...payload, sessionId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(now + (7 * 24 * 60 * 60)) // 7 days
      .sign(this.SECRET);

    // Store session in database for revocation capability
    await this.storeSession(sessionId, payload.userId);

    return token;
  }

  static async verifySession(token: string): Promise<SessionPayload | null> {
    try {
      const { payload } = await jwtVerify(token, this.SECRET);

      // Check if session is still valid in database
      const isValid = await this.isSessionValid(payload.sessionId as string);
      if (!isValid) {
        return null;
      }

      return payload as SessionPayload;
    } catch {
      return null;
    }
  }

  static async revokeSession(sessionId: string): Promise<void> {
    // Remove session from database
    await this.removeSession(sessionId);
  }

  private static async storeSession(sessionId: string, userId: string): Promise<void> {
    // Implementation depends on your database
    // Store session ID with user ID and creation timestamp
  }

  private static async isSessionValid(sessionId: string): Promise<boolean> {
    // Check database for session existence and validity
    return true; // Placeholder
  }

  private static async removeSession(sessionId: string): Promise<void> {
    // Remove session from database
  }
}
```

**Day 3: Rate Limiting & Audit Logging**
```typescript
// src/utils/auth/rate-limiter.ts
import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  blockDurationMs: number;
}

export class RateLimiter {
  private static attempts = new Map<string, { count: number; resetTime: number; blockedUntil?: number }>();

  static async checkLimit(
    request: NextRequest,
    config: RateLimitConfig = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 5,
      blockDurationMs: 60 * 60 * 1000, // 1 hour
    }
  ): Promise<{ allowed: boolean; retryAfter?: number }> {
    const identifier = this.getIdentifier(request);
    const now = Date.now();
    const current = this.attempts.get(identifier);

    // Check if currently blocked
    if (current?.blockedUntil && current.blockedUntil > now) {
      return { allowed: false, retryAfter: Math.ceil((current.blockedUntil - now) / 1000) };
    }

    // Reset window if expired
    if (!current || current.resetTime <= now) {
      this.attempts.set(identifier, { count: 1, resetTime: now + config.windowMs });
      return { allowed: true };
    }

    // Increment attempts
    current.count++;

    // Block if exceeded
    if (current.count > config.maxAttempts) {
      current.blockedUntil = now + config.blockDurationMs;
      await this.logSecurityEvent('RATE_LIMIT_EXCEEDED', { identifier, attempts: current.count });
      return { allowed: false, retryAfter: Math.ceil(config.blockDurationMs / 1000) };
    }

    this.attempts.set(identifier, current);
    return { allowed: true };
  }

  private static getIdentifier(request: NextRequest): string {
    // Combine IP and User-Agent for better tracking
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    return `${ip}:${Buffer.from(userAgent).toString('base64').slice(0, 16)}`;
  }

  private static async logSecurityEvent(event: string, data: Record<string, unknown>): Promise<void> {
    // Log security events for monitoring
    console.warn(`Security Event: ${event}`, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  }
}

// src/utils/auth/audit-logger.ts
export interface AuditEvent {
  userId?: string;
  action: string;
  resource: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export class AuditLogger {
  static async log(event: AuditEvent): Promise<void> {
    // Store audit logs in database
    // Consider using a separate audit table for compliance
    console.info('Audit Log:', event);

    // In production, also send to external monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to monitoring service (e.g., Sentry, LogRocket)
    }
  }

  static async logAuthEvent(
    action: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'SIGNUP' | 'PASSWORD_RESET',
    userId: string | null,
    request: NextRequest,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      userId: userId || undefined,
      action,
      resource: 'AUTH',
      ip: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date(),
      metadata,
    });
  }
}
```

##### 2.2 Input Validation Implementation (Week 3, Days 4-5)

**Day 4: Zod Schema Implementation**
```typescript
// src/schemas/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// src/schemas/shoes.ts
export const shoeFilterSchema = z.object({
  brand: z.string().optional(),
  category: z.enum(['road', 'trail', 'track', 'gravel', 'gym-treadmill']).optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
  sortBy: z.enum(['name', 'price', 'rating', 'releaseDate']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const shoeReviewSchema = z.object({
  shoeId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  content: z.string().min(10, 'Review must be at least 10 characters').max(5000),
  pros: z.array(z.string().max(100)).max(5).optional(),
  cons: z.array(z.string().max(100)).max(5).optional(),
  recommendedFor: z.array(z.enum(['beginner', 'intermediate', 'advanced'])).optional(),
});
```

**Day 5: API Route Validation**
```typescript
// src/utils/api/validation.ts
import { NextRequest } from 'next/server';
import { ZodSchema, ZodError } from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: { field: string; message: string }[];
}

export async function validateRequestBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ field: 'general', message: 'Invalid request format' }],
    };
  }
}

export function validateSearchParams<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): ValidationResult<T> {
  try {
    const params = Object.fromEntries(searchParams);
    // Convert numeric strings to numbers where appropriate
    const processedParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (!isNaN(Number(value)) && value !== '') {
        acc[key] = Number(value);
      } else if (value === 'true' || value === 'false') {
        acc[key] = value === 'true';
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, unknown>);

    const data = schema.parse(processedParams);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ field: 'general', message: 'Invalid search parameters' }],
    };
  }
}

// Enhanced API route wrapper
export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (request: NextRequest, data: T) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const validation = await validateRequestBody(request, schema);

    if (!validation.success) {
      return Response.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    return handler(request, validation.data!);
  };
}
```

##### 2.3 Database Query Optimization (Week 4, Days 1-3)

**Day 1: Query Analysis & Indexing Strategy**
```sql
-- Database performance analysis queries
-- Identify slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Add strategic indexes for common queries
CREATE INDEX CONCURRENTLY idx_shoes_category_brand ON shoes(category, brand_id);
CREATE INDEX CONCURRENTLY idx_shoes_price_range ON shoes(price) WHERE price IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_reviews_shoe_rating ON reviews(shoe_id, rating);
CREATE INDEX CONCURRENTLY idx_shoes_release_date ON shoes(release_date) WHERE release_date IS NOT NULL;

-- Partial indexes for filtered queries
CREATE INDEX CONCURRENTLY idx_shoes_active ON shoes(id) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_reviews_approved ON reviews(shoe_id, created_at) WHERE is_approved = true;

-- Composite index for common filter combinations
CREATE INDEX CONCURRENTLY idx_shoes_filter_combo ON shoes(category, brand_id, price, release_date)
WHERE is_active = true;
```

**Day 2: Query Optimization & Caching**
```typescript
// src/utils/database/optimized-queries.ts
import { sql } from '@vercel/postgres';

export interface ShoeQueryOptions {
  category?: string;
  brandId?: string;
  priceMin?: number;
  priceMax?: number;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class OptimizedQueries {
  // Optimized shoe listing with proper joins and pagination
  static async getShoes(options: ShoeQueryOptions) {
    const { category, brandId, priceMin, priceMax, page, limit, sortBy, sortOrder } = options;
    const offset = (page - 1) * limit;

    // Build dynamic query with parameterized values
    let query = `
      SELECT
        s.id, s.name, s.slug, s.price, s.image_url, s.release_date,
        b.name as brand_name, b.slug as brand_slug,
        AVG(r.rating) as average_rating,
        COUNT(r.id) as review_count
      FROM shoes s
      INNER JOIN brands b ON s.brand_id = b.id
      LEFT JOIN reviews r ON s.id = r.shoe_id AND r.is_approved = true
      WHERE s.is_active = true
    `;

    const params: unknown[] = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND s.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (brandId) {
      query += ` AND s.brand_id = $${paramIndex}`;
      params.push(brandId);
      paramIndex++;
    }

    if (priceMin !== undefined) {
      query += ` AND s.price >= $${paramIndex}`;
      params.push(priceMin);
      paramIndex++;
    }

    if (priceMax !== undefined) {
      query += ` AND s.price <= $${paramIndex}`;
      params.push(priceMax);
      paramIndex++;
    }

    query += ` GROUP BY s.id, s.name, s.slug, s.price, s.image_url, s.release_date, b.name, b.slug`;

    // Add sorting
    const sortMapping: Record<string, string> = {
      name: 's.name',
      price: 's.price',
      rating: 'average_rating',
      releaseDate: 's.release_date',
    };

    if (sortMapping[sortBy]) {
      query += ` ORDER BY ${sortMapping[sortBy]} ${sortOrder.toUpperCase()}`;
    }

    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await sql.query(query, params);

    // Get total count for pagination (with same filters)
    let countQuery = `
      SELECT COUNT(DISTINCT s.id) as total
      FROM shoes s
      INNER JOIN brands b ON s.brand_id = b.id
      WHERE s.is_active = true
    `;

    const countParams: unknown[] = [];
    let countParamIndex = 1;

    if (category) {
      countQuery += ` AND s.category = $${countParamIndex}`;
      countParams.push(category);
      countParamIndex++;
    }

    if (brandId) {
      countQuery += ` AND s.brand_id = $${countParamIndex}`;
      countParams.push(brandId);
      countParamIndex++;
    }

    if (priceMin !== undefined) {
      countQuery += ` AND s.price >= $${countParamIndex}`;
      countParams.push(priceMin);
      countParamIndex++;
    }

    if (priceMax !== undefined) {
      countQuery += ` AND s.price <= $${countParamIndex}`;
      countParams.push(priceMax);
      countParamIndex++;
    }

    const countResult = await sql.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    return {
      shoes: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Cached brand listings
  static async getBrands() {
    const cacheKey = 'brands:all';
    const cached = await CacheManager.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const result = await sql`
      SELECT b.id, b.name, b.slug, COUNT(s.id) as shoe_count
      FROM brands b
      LEFT JOIN shoes s ON b.id = s.brand_id AND s.is_active = true
      GROUP BY b.id, b.name, b.slug
      HAVING COUNT(s.id) > 0
      ORDER BY b.name
    `;

    await CacheManager.set(cacheKey, JSON.stringify(result.rows), 3600); // 1 hour cache
    return result.rows;
  }
}
```

**Day 3: Advanced Caching Strategy**
```typescript
// src/utils/cache/cache-manager.ts
interface CacheOptions {
  ttl?: number; // seconds
  tags?: string[];
  revalidateOnAccess?: boolean;
}

export class CacheManager {
  private static cache = new Map<string, { data: string; expires: number; tags: string[] }>();

  static async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);

    if (!item || item.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  static async set(key: string, data: string, ttl = 300, tags: string[] = []): Promise<void> {
    this.cache.set(key, {
      data,
      expires: Date.now() + (ttl * 1000),
      tags,
    });
  }

  static async invalidate(pattern: string): Promise<void> {
    const keys = Array.from(this.cache.keys()).filter(key => key.includes(pattern));
    keys.forEach(key => this.cache.delete(key));
  }

  static async invalidateByTag(tag: string): Promise<void> {
    const entries = Array.from(this.cache.entries());
    entries.forEach(([key, value]) => {
      if (value.tags.includes(tag)) {
        this.cache.delete(key);
      }
    });
  }
}

// src/utils/cache/query-cache.ts
export class QueryCache {
  static async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = await CacheManager.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const data = await fetcher();
    await CacheManager.set(
      key,
      JSON.stringify(data),
      options.ttl,
      options.tags
    );

    return data;
  }

  static generateKey(prefix: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, unknown>);

    return `${prefix}:${Buffer.from(JSON.stringify(sortedParams)).toString('base64')}`;
  }
}
```

##### 2.4 Performance Monitoring Implementation (Week 4, Days 4-5)

**Day 4: Performance Metrics Collection**
```typescript
// src/utils/monitoring/performance.ts
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  labels?: Record<string, string>;
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetric[] = [];

  static recordMetric(name: string, value: number, unit = 'ms', labels?: Record<string, string>): void {
    this.metrics.push({
      name,
      value,
      unit,
      timestamp: new Date(),
      labels,
    });

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService({ name, value, unit, labels });
    }
  }

  static async measureAsync<T>(name: string, fn: () => Promise<T>, labels?: Record<string, string>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.recordMetric(name, duration, 'ms', { ...labels, status: 'success' });
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(name, duration, 'ms', { ...labels, status: 'error' });
      throw error;
    }
  }

  static measureSync<T>(name: string, fn: () => T, labels?: Record<string, string>): T {
    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      this.recordMetric(name, duration, 'ms', { ...labels, status: 'success' });
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(name, duration, 'ms', { ...labels, status: 'error' });
      throw error;
    }
  }

  private static sendToMonitoringService(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    // Send to external monitoring service (e.g., DataDog, New Relic)
  }
}

// Usage example in API routes
export async function GET(request: NextRequest) {
  return PerformanceMonitor.measureAsync('api.shoes.list', async () => {
    const searchParams = new URL(request.url).searchParams;
    const validation = validateSearchParams(searchParams, shoeFilterSchema);

    if (!validation.success) {
      return Response.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const shoes = await OptimizedQueries.getShoes(validation.data);
    return Response.json(shoes);
  }, { endpoint: '/api/shoes' });
}
```

**Day 5: Database Connection Optimization**
```typescript
// src/utils/database/connection-pool.ts
import { Pool } from 'pg';

class DatabasePool {
  private static instance: Pool;

  static getInstance(): Pool {
    if (!this.instance) {
      this.instance = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20, // Maximum number of connections
        idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
        connectionTimeoutMillis: 10000, // Timeout after 10 seconds
        maxUses: 7500, // Close connection after 7500 uses
      });

      this.instance.on('connect', () => {
        PerformanceMonitor.recordMetric('db.connection.created', 1, 'count');
      });

      this.instance.on('error', (err) => {
        console.error('Database pool error:', err);
        PerformanceMonitor.recordMetric('db.connection.error', 1, 'count');
      });
    }

    return this.instance;
  }

  static async query<T = unknown>(text: string, params?: unknown[]): Promise<{ rows: T[] }> {
    const client = this.getInstance();

    return PerformanceMonitor.measureAsync('db.query', async () => {
      const result = await client.query(text, params);
      return { rows: result.rows };
    }, { query: text.slice(0, 50) });
  }
}
```

#### ✅ Phase 2 Deliverables Checklist

**Week 3:**
- [ ] CSRF protection implemented
- [ ] Enhanced session management with revocation
- [ ] Rate limiting for authentication endpoints
- [ ] Audit logging for security events
- [ ] Zod schemas for all API inputs
- [ ] Request validation middleware

**Week 4:**
- [ ] Database indexes optimized
- [ ] Query performance improved
- [ ] Caching strategy implemented
- [ ] Performance monitoring added
- [ ] Database connection pooling optimized
- [ ] Cache invalidation strategies

**Estimated Time**: 2 weeks (80 hours)
**Risk Level**: Medium (requires careful testing)
**Dependencies**: Phase 1 completion
**Rollback Plan**: Feature flags for gradual rollout

### Phase 3: Features & UX (Weeks 5-6)

- [ ] Search enhancement
- [ ] Performance optimization
- [ ] Mobile experience improvements
- [ ] Accessibility audit and fixes

#### 📋 Phase 3 Detailed Implementation Guide

##### 3.1 Search Enhancement (Week 5, Days 1-3)

**Current Search Limitations:**
```typescript
// Basic Sanity CMS search
// No autocomplete or suggestions
// Limited filtering capabilities
// No search analytics
```

**Step-by-Step Implementation:**

**Day 1: Advanced Search Infrastructure**
```typescript
// src/utils/search/search-engine.ts
import { sql } from '@vercel/postgres';

export interface SearchQuery {
  q: string;
  filters: {
    category?: string[];
    brand?: string[];
    priceRange?: [number, number];
    rating?: number;
  };
  sort: {
    field: 'relevance' | 'price' | 'rating' | 'release_date';
    order: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    limit: number;
  };
}

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
  relevanceScore: number;
  highlightedText?: string;
}

export class SearchEngine {
  static async search(query: SearchQuery): Promise<{
    results: SearchResult[];
    totalCount: number;
    facets: SearchFacets;
    suggestions?: string[];
  }> {
    const { q, filters, sort, pagination } = query;

    // Full-text search with PostgreSQL
    let searchQuery = `
      SELECT
        s.id, s.name, s.slug, s.price, s.image_url,
        b.name as brand, s.category,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as review_count,
        ts_rank(
          to_tsvector('english', s.name || ' ' || s.description || ' ' || b.name),
          plainto_tsquery('english', $1)
        ) as relevance_score,
        ts_headline(
          'english',
          s.name || ' ' || s.description,
          plainto_tsquery('english', $1),
          'MaxWords=10, MinWords=5'
        ) as highlighted_text
      FROM shoes s
      INNER JOIN brands b ON s.brand_id = b.id
      LEFT JOIN reviews r ON s.id = r.shoe_id AND r.is_approved = true
      WHERE s.is_active = true
    `;

    const params: unknown[] = [q];
    let paramIndex = 2;

    // Add full-text search condition
    if (q.trim()) {
      searchQuery += ` AND to_tsvector('english', s.name || ' ' || s.description || ' ' || b.name)
                       @@ plainto_tsquery('english', $1)`;
    }

    // Apply filters
    if (filters.category?.length) {
      searchQuery += ` AND s.category = ANY($${paramIndex})`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.brand?.length) {
      searchQuery += ` AND b.slug = ANY($${paramIndex})`;
      params.push(filters.brand);
      paramIndex++;
    }

    if (filters.priceRange) {
      searchQuery += ` AND s.price BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(filters.priceRange[0], filters.priceRange[1]);
      paramIndex += 2;
    }

    searchQuery += ` GROUP BY s.id, s.name, s.slug, s.price, s.image_url, b.name, s.category, s.description`;

    // Apply rating filter after grouping
    if (filters.rating) {
      searchQuery += ` HAVING COALESCE(AVG(r.rating), 0) >= $${paramIndex}`;
      params.push(filters.rating);
      paramIndex++;
    }

    // Apply sorting
    const sortMap = {
      relevance: 'relevance_score DESC',
      price: `s.price ${sort.order}`,
      rating: `rating ${sort.order}`,
      release_date: `s.release_date ${sort.order}`,
    };

    searchQuery += ` ORDER BY ${sortMap[sort.field]}`;

    // Add pagination
    const offset = (pagination.page - 1) * pagination.limit;
    searchQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(pagination.limit, offset);

    const [results, totalCount, facets, suggestions] = await Promise.all([
      sql.query(searchQuery, params),
      this.getSearchCount(q, filters),
      this.getSearchFacets(q, filters),
      this.getSearchSuggestions(q),
    ]);

    return {
      results: results.rows as SearchResult[],
      totalCount,
      facets,
      suggestions,
    };
  }

  private static async getSearchCount(q: string, filters: SearchQuery['filters']): Promise<number> {
    // Similar query to above but only counting
    // Implementation here...
    return 0; // Placeholder
  }

  private static async getSearchFacets(q: string, filters: SearchQuery['filters']): Promise<SearchFacets> {
    // Get facet counts for filtering
    const facetQueries = await Promise.all([
      sql`SELECT category, COUNT(*) as count FROM shoes WHERE is_active = true GROUP BY category`,
      sql`SELECT b.name, b.slug, COUNT(*) as count FROM shoes s JOIN brands b ON s.brand_id = b.id WHERE s.is_active = true GROUP BY b.id, b.name, b.slug`,
    ]);

    return {
      categories: facetQueries[0].rows,
      brands: facetQueries[1].rows,
      priceRanges: [
        { min: 0, max: 100, count: 0 },
        { min: 100, max: 200, count: 0 },
        { min: 200, max: 300, count: 0 },
        { min: 300, max: 999, count: 0 },
      ],
    };
  }

  private static async getSearchSuggestions(q: string): Promise<string[]> {
    if (q.length < 2) return [];

    // Get suggestions based on popular searches and shoe names
    const suggestions = await sql`
      SELECT s.name, COUNT(sl.id) as search_count
      FROM shoes s
      LEFT JOIN search_logs sl ON sl.query ILIKE '%' || s.name || '%'
      WHERE s.name ILIKE '%' || ${q} || '%'
      GROUP BY s.name
      ORDER BY search_count DESC, s.name
      LIMIT 5
    `;

    return suggestions.rows.map(row => row.name);
  }
}

interface SearchFacets {
  categories: { category: string; count: number }[];
  brands: { name: string; slug: string; count: number }[];
  priceRanges: { min: number; max: number; count: number }[];
}
```

**Day 2: Search UI Components**
```typescript
// src/components/features/search/SearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from '@/hooks/useDebounce';

interface SearchBarProps {
  placeholder?: string;
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
}

export function SearchBar({ placeholder = 'Search shoes...', showSuggestions = true, onSearch }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestionList, setShowSuggestionList] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedGetSuggestions = useDebouncedCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      setSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    if (showSuggestions && query) {
      debouncedGetSuggestions(query);
    }
  }, [query, showSuggestions, debouncedGetSuggestions]);

  const handleSearch = (searchQuery: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    params.delete('page'); // Reset to first page

    router.push(`/shoes/search?${params.toString()}`);
    onSearch?.(searchQuery);
    setShowSuggestionList(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestionList || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          handleSearch(suggestions[selectedSuggestion]);
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestionList(false);
        setSelectedSuggestion(-1);
        break;
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestionList(true)}
          onBlur={() => setTimeout(() => setShowSuggestionList(false), 200)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search for running shoes"
          aria-expanded={showSuggestionList}
          aria-haspopup="listbox"
        />

        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {showSuggestionList && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <ul role="listbox" className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                role="option"
                aria-selected={index === selectedSuggestion}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  index === selectedSuggestion ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
                onClick={() => handleSearch(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// src/components/features/search/SearchFilters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface SearchFiltersProps {
  categories: FilterOption[];
  brands: FilterOption[];
  priceRanges: { min: number; max: number; count: number }[];
  onFiltersChange?: (filters: Record<string, unknown>) => void;
}

export function SearchFilters({ categories, brands, priceRanges, onFiltersChange }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll('category')
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll('brand')
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number] | null>(
    searchParams.get('priceMin') && searchParams.get('priceMax')
      ? [parseInt(searchParams.get('priceMin')!), parseInt(searchParams.get('priceMax')!)]
      : null
  );

  const updateURL = () => {
    const params = new URLSearchParams(searchParams);

    // Update categories
    params.delete('category');
    selectedCategories.forEach(cat => params.append('category', cat));

    // Update brands
    params.delete('brand');
    selectedBrands.forEach(brand => params.append('brand', brand));

    // Update price range
    params.delete('priceMin');
    params.delete('priceMax');
    if (selectedPriceRange) {
      params.set('priceMin', selectedPriceRange[0].toString());
      params.set('priceMax', selectedPriceRange[1].toString());
    }

    params.delete('page'); // Reset pagination
    router.push(`/shoes/search?${params.toString()}`);

    onFiltersChange?.({
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange: selectedPriceRange,
    });
  };

  useEffect(() => {
    updateURL();
  }, [selectedCategories, selectedBrands, selectedPriceRange]);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.value} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories(prev => [...prev, category.value]);
                  } else {
                    setSelectedCategories(prev => prev.filter(c => c !== category.value));
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">
                {category.label} ({category.count})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Brand</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map(brand => (
            <label key={brand.value} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBrands(prev => [...prev, brand.value]);
                  } else {
                    setSelectedBrands(prev => prev.filter(b => b !== brand.value));
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">
                {brand.label} ({brand.count})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map(range => (
            <label key={`${range.min}-${range.max}`} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange?.[0] === range.min && selectedPriceRange?.[1] === range.max}
                onChange={() => setSelectedPriceRange([range.min, range.max])}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">
                ${range.min} - ${range.max === 999 ? '999+' : range.max} ({range.count})
              </span>
            </label>
          ))}
        </div>
        {selectedPriceRange && (
          <button
            onClick={() => setSelectedPriceRange(null)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Clear price filter
          </button>
        )}
      </div>
    </div>
  );
}
```

**Day 3: Search Analytics & Tracking**
```typescript
// src/utils/analytics/search-tracking.ts
export interface SearchEvent {
  query: string;
  resultsCount: number;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  filters?: Record<string, unknown>;
  clickedResults?: string[];
}

export class SearchAnalytics {
  static async trackSearch(event: Omit<SearchEvent, 'timestamp' | 'sessionId'>): Promise<void> {
    const sessionId = this.getSessionId();

    const searchEvent: SearchEvent = {
      ...event,
      sessionId,
      timestamp: new Date(),
    };

    // Store in database for analytics
    await this.storeSearchEvent(searchEvent);

    // Send to analytics service
    if (typeof window !== 'undefined') {
      // Client-side analytics
      this.sendToAnalytics(searchEvent);
    }
  }

  static async trackResultClick(query: string, resultId: string, position: number): Promise<void> {
    await this.storeClickEvent({
      query,
      resultId,
      position,
      sessionId: this.getSessionId(),
      timestamp: new Date(),
    });
  }

  private static getSessionId(): string {
    if (typeof window === 'undefined') return 'server';

    let sessionId = sessionStorage.getItem('search-session-id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('search-session-id', sessionId);
    }
    return sessionId;
  }

  private static async storeSearchEvent(event: SearchEvent): Promise<void> {
    try {
      await fetch('/api/analytics/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to track search event:', error);
    }
  }

  private static async storeClickEvent(event: {
    query: string;
    resultId: string;
    position: number;
    sessionId: string;
    timestamp: Date;
  }): Promise<void> {
    try {
      await fetch('/api/analytics/search-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to track click event:', error);
    }
  }

  private static sendToAnalytics(event: SearchEvent): void {
    // Integration with analytics services
    if (window.gtag) {
      window.gtag('event', 'search', {
        search_term: event.query,
        results_count: event.resultsCount,
      });
    }
  }
}
```

##### 3.2 Performance Optimization (Week 5, Days 4-5)

**Day 4: Client-Side Performance**
```typescript
// src/utils/performance/code-splitting.ts
import { lazy } from 'react';

// Lazy load heavy components
export const CompareModal = lazy(() =>
  import('@/components/features/shoes/CompareModal').then(m => ({ default: m.CompareModal }))
);

export const ShoeDetailsModal = lazy(() =>
  import('@/components/features/shoes/ShoeDetailsModal')
);

export const ReviewForm = lazy(() =>
  import('@/components/features/reviews/ReviewForm')
);

// src/components/common/LazyWrapper.tsx
'use client';

import { Suspense, ComponentType } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface LazyWrapperProps {
  Component: ComponentType<any>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

export function LazyWrapper({ Component, fallback, ...props }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
}

// src/hooks/useInfiniteScroll.ts
import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  hasMore: boolean;
  isLoading: boolean;
}

export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions
) {
  const { threshold = 100, hasMore, isLoading } = options;

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      callback();
    }
  }, [callback, threshold, isLoading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
}

// src/hooks/useImageOptimization.ts
import { useState, useEffect } from 'react';

export function useImageOptimization(src: string, quality = 75) {
  const [optimizedSrc, setOptimizedSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();

    // Generate optimized URL
    const url = new URL(src);
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('f', 'webp');

    img.onload = () => {
      setOptimizedSrc(url.toString());
      setIsLoading(false);
    };

    img.onerror = () => {
      setError('Failed to load image');
      setOptimizedSrc(src); // Fallback to original
      setIsLoading(false);
    };

    img.src = url.toString();
  }, [src, quality]);

  return { src: optimizedSrc, isLoading, error };
}
```

**Day 5: Bundle Optimization**
```typescript
// next.config.ts - Enhanced optimization
const nextConfig = {
  // ... existing config

  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },

  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer in development
    if (dev && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: false,
        })
      );
    }

    // Optimize imports
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    };

    return config;
  },

  images: {
    domains: ['your-image-domain.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // PWA configuration
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'offlineCache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
        },
      },
    ],
  },
};
```

##### 3.3 Mobile Experience Improvements (Week 6, Days 1-3)

**Day 1: Responsive Design Enhancement**
```typescript
// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// src/hooks/useViewport.ts
export function useViewport() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return { isMobile, isTablet, isDesktop };
}

// src/components/features/shoes/MobileShoeCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';

interface MobileShoeCardProps {
  shoe: {
    id: string;
    name: string;
    brand: string;
    price: number;
    rating: number;
    imageUrl: string;
    category: string;
  };
  onQuickView: (shoeId: string) => void;
  onAddToCompare: (shoeId: string) => void;
}

export function MobileShoeCard({ shoe, onQuickView, onAddToCompare }: MobileShoeCardProps) {
  const [showActions, setShowActions] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setShowActions(true),
    onSwipedRight: () => setShowActions(false),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <div
      {...swipeHandlers}
      className="relative bg-white rounded-lg shadow-md overflow-hidden touch-pan-y"
    >
      {/* Main content */}
      <div className={`transition-transform duration-200 ${showActions ? '-translate-x-16' : ''}`}>
        <div className="aspect-square relative">
          <Image
            src={shoe.imageUrl}
            alt={shoe.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={false}
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">{shoe.name}</h3>
          <p className="text-gray-600 text-sm">{shoe.brand}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg font-bold">${shoe.price}</span>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600 ml-1">{shoe.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe actions */}
      <div className="absolute right-0 top-0 h-full w-16 bg-blue-500 flex flex-col">
        <button
          onClick={() => onQuickView(shoe.id)}
          className="flex-1 flex items-center justify-center text-white hover:bg-blue-600"
          aria-label="Quick view"
        >
          👁️
        </button>
        <button
          onClick={() => onAddToCompare(shoe.id)}
          className="flex-1 flex items-center justify-center text-white hover:bg-blue-600 border-t border-blue-400"
          aria-label="Add to compare"
        >
          ⚖️
        </button>
      </div>

      {/* Swipe hint */}
      {!showActions && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white bg-opacity-75 px-2 py-1 rounded">
          ← Swipe
        </div>
      )}
    </div>
  );
}

// src/components/layout/MobileNavigation.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/shoes', label: 'Shoes', icon: '👟' },
  { href: '/brands', label: 'Brands', icon: '🏷️' },
  { href: '/reviews', label: 'Reviews', icon: '⭐' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center py-2 px-1 text-xs ${
              pathname === item.href
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

**Day 2: Touch Interactions**
```typescript
// src/hooks/useTouch.ts
import { useState, useCallback } from 'react';

export interface TouchState {
  isPressed: boolean;
  position: { x: number; y: number } | null;
}

export function useTouch() {
  const [touchState, setTouchState] = useState<TouchState>({
    isPressed: false,
    position: null,
  });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchState({
      isPressed: true,
      position: { x: touch.clientX, y: touch.clientY },
    });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchState.isPressed) return;

    const touch = e.touches[0];
    setTouchState(prev => ({
      ...prev,
      position: { x: touch.clientX, y: touch.clientY },
    }));
  }, [touchState.isPressed]);

  const handleTouchEnd = useCallback(() => {
    setTouchState({
      isPressed: false,
      position: null,
    });
  }, []);

  return {
    touchState,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

// src/components/common/TouchFeedback.tsx
'use client';

import { useState } from 'react';

interface TouchFeedbackProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  disabled?: boolean;
}

export function TouchFeedback({ children, className = '', onPress, disabled = false }: TouchFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={`transition-transform duration-150 ${
        isPressed && !disabled ? 'scale-95 bg-gray-100' : ''
      } ${disabled ? 'opacity-50' : ''} ${className}`}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={() => {
        setIsPressed(false);
        if (!disabled && onPress) {
          onPress();
        }
      }}
      onTouchCancel={() => setIsPressed(false)}
    >
      {children}
    </div>
  );
}
```

**Day 3: PWA Implementation**
```typescript
// src/lib/pwa/service-worker.ts
const CACHE_NAME = 'stride-lab-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

const STATIC_FILES = [
  '/',
  '/shoes',
  '/brands',
  '/offline',
  '/manifest.json',
];

// Install event
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_FILES);
    })
  );
});

// Activate event
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event: FetchEvent) => {
  // API requests - Network first
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Static assets - Cache first
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      // Return offline page for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('/offline');
      }
    })
  );
});

// public/manifest.json
{
  "name": "Stride Lab - Running Shoes Library",
  "short_name": "Stride Lab",
  "description": "Your complete directory of running shoes",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["sports", "shopping"],
  "lang": "en",
  "dir": "ltr"
}
```

##### 3.4 Accessibility Audit and Fixes (Week 6, Days 4-5)

**Day 4: Accessibility Infrastructure**
```typescript
// src/hooks/useAccessibility.ts
import { useEffect, useRef } from 'react';

export function useAccessibilityAnnouncement() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
}

export function useKeyboardNavigation(
  containerRef: React.RefObject<HTMLElement>,
  onEnter?: () => void,
  onEscape?: () => void
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          onEnter?.();
          break;
        case 'Escape':
          e.preventDefault();
          onEscape?.();
          break;
        case 'Tab':
          // Trap focus within container if needed
          const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, onEnter, onEscape]);
}

// src/components/common/SkipToContent.tsx
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                 bg-blue-600 text-white px-4 py-2 rounded z-50
                 focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      Skip to main content
    </a>
  );
}

// src/components/common/AccessibleModal.tsx
'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useKeyboardNavigation, useAccessibilityAnnouncement } from '@/hooks/useAccessibility';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function AccessibleModal({ isOpen, onClose, title, children, className = '' }: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { announce } = useAccessibilityAnnouncement();

  useKeyboardNavigation(modalRef, undefined, onClose);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus the modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

      // Announce modal opening
      announce(`Modal opened: ${title}`);

      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }

      // Restore scrolling
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, title, announce]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 ${className}`}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
```

**Day 5: Accessibility Testing & Compliance**
```typescript
// src/utils/accessibility/testing.ts
export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  rule: string;
  element: string;
  message: string;
  severity: number;
}

export class AccessibilityChecker {
  static async runAudit(): Promise<AccessibilityIssue[]> {
    const issues: AccessibilityIssue[] = [];

    // Check for missing alt text
    document.querySelectorAll('img:not([alt])').forEach((img, index) => {
      issues.push({
        type: 'error',
        rule: 'img-alt',
        element: `img:nth-child(${index + 1})`,
        message: 'Image missing alt text',
        severity: 3,
      });
    });

    // Check for missing form labels
    document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').forEach((input, index) => {
      const id = input.getAttribute('id');
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);

      if (!hasLabel) {
        issues.push({
          type: 'error',
          rule: 'label',
          element: `input:nth-child(${index + 1})`,
          message: 'Form input missing accessible label',
          severity: 3,
        });
      }
    });

    // Check color contrast (simplified)
    document.querySelectorAll('*').forEach((element, index) => {
      const style = window.getComputedStyle(element);
      const color = style.color;
      const backgroundColor = style.backgroundColor;

      // This is a simplified check - in practice, you'd use a proper contrast checker
      if (this.hasLowContrast(color, backgroundColor)) {
        issues.push({
          type: 'warning',
          rule: 'color-contrast',
          element: `element:nth-child(${index + 1})`,
          message: 'Insufficient color contrast',
          severity: 2,
        });
      }
    });

    // Check for keyboard accessibility
    document.querySelectorAll('div[onclick], span[onclick]').forEach((element, index) => {
      if (!element.hasAttribute('tabindex') && !element.hasAttribute('role')) {
        issues.push({
          type: 'warning',
          rule: 'keyboard-accessible',
          element: `clickable:nth-child(${index + 1})`,
          message: 'Clickable element not keyboard accessible',
          severity: 2,
        });
      }
    });

    return issues;
  }

  private static hasLowContrast(color: string, backgroundColor: string): boolean {
    // Simplified contrast check - implement proper WCAG contrast calculation
    return false; // Placeholder
  }

  static generateReport(issues: AccessibilityIssue[]): void {
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      errorCount: issues.filter(i => i.type === 'error').length,
      warningCount: issues.filter(i => i.type === 'warning').length,
      issues: issues.sort((a, b) => b.severity - a.severity),
    };

    console.group('🔍 Accessibility Audit Report');
    console.log('Total Issues:', report.totalIssues);
    console.log('Errors:', report.errorCount);
    console.log('Warnings:', report.warningCount);

    if (report.issues.length > 0) {
      console.table(report.issues);
    } else {
      console.log('✅ No accessibility issues found!');
    }
    console.groupEnd();
  }
}

// Development-only accessibility testing
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(async () => {
        const issues = await AccessibilityChecker.runAudit();
        AccessibilityChecker.generateReport(issues);
      }, 1000);
    });
  }
}
```

#### ✅ Phase 3 Deliverables Checklist

**Week 5:**
- [ ] Advanced search with full-text capabilities
- [ ] Search suggestions and autocomplete
- [ ] Search analytics and tracking
- [ ] Performance monitoring implementation
- [ ] Code splitting and lazy loading
- [ ] Bundle optimization

**Week 6:**
- [ ] Mobile-responsive components
- [ ] Touch interactions and gestures
- [ ] PWA implementation with offline support
- [ ] Accessibility audit tools
- [ ] WCAG compliance improvements
- [ ] Keyboard navigation enhancements

**Estimated Time**: 2 weeks (80 hours)
**Risk Level**: Medium (UI/UX changes require user testing)
**Dependencies**: Phase 1 & 2 completion
**Testing Requirements**: Cross-device testing, accessibility testing

### Phase 4: Monitoring & Documentation (Weeks 7-8)

**Focus:** Implement comprehensive monitoring, observability, and documentation to ensure long-term maintainability and operational excellence.

#### 4.1 Application Monitoring & Observability

**Step 1: Error Tracking & Performance Monitoring**

Install and configure Sentry for error tracking:

```bash
npm install @sentry/nextjs @sentry/integrations
```

Create Sentry configuration:

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', process.env.NEXT_PUBLIC_APP_URL],
    }),
    new Sentry.Replay(),
  ],
});
```

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});
```

```javascript
// sentry.edge.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});
```

**Step 2: Web Vitals Monitoring**

Create Web Vitals monitoring:

```typescript
// src/utils/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Google Analytics
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

export function reportWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

Update app layout to include web vitals:

```typescript
// src/app/layout.tsx additions
'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/utils/web-vitals';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    reportWebVitals();
  }, []);

  // ... rest of layout
}
```

**Step 3: Custom Metrics & Logging**

Create application metrics utility:

```typescript
// src/utils/metrics.ts
interface MetricData {
  name: string;
  value: number;
  unit: string;
  tags?: Record<string, string>;
  timestamp?: number;
}

class MetricsLogger {
  private queue: MetricData[] = [];
  private flushInterval: number = 30000; // 30 seconds

  constructor() {
    if (typeof window !== 'undefined') {
      this.startFlushTimer();
    }
  }

  public record(metric: MetricData): void {
    this.queue.push({
      ...metric,
      timestamp: metric.timestamp || Date.now(),
    });
  }

  public recordPageView(page: string, loadTime?: number): void {
    this.record({
      name: 'page_view',
      value: 1,
      unit: 'count',
      tags: { page },
    });

    if (loadTime) {
      this.record({
        name: 'page_load_time',
        value: loadTime,
        unit: 'ms',
        tags: { page },
      });
    }
  }

  public recordUserAction(action: string, metadata?: Record<string, string>): void {
    this.record({
      name: 'user_action',
      value: 1,
      unit: 'count',
      tags: { action, ...metadata },
    });
  }

  public recordAPICall(endpoint: string, method: string, duration: number, status: number): void {
    this.record({
      name: 'api_call',
      value: duration,
      unit: 'ms',
      tags: { endpoint, method, status: status.toString() },
    });
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const metrics = [...this.queue];
    this.queue = [];

    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
      });
    } catch (error) {
      // Re-queue metrics on failure
      this.queue.unshift(...metrics);
      console.error('Failed to send metrics:', error);
    }
  }

  private startFlushTimer(): void {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }
}

export const metrics = new MetricsLogger();
```

#### 4.2 Comprehensive Testing Enhancement

**Step 1: Advanced Unit Testing Setup**

Enhance Jest configuration:

```javascript
// jest.config.js (enhanced)
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.test.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

**Step 2: Integration Testing**

Create integration test utilities:

```typescript
// src/__tests__/test-utils/integration.tsx
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export function renderWithProviders(ui: ReactElement) {
  const testQueryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={testQueryClient}>
      {ui}
    </QueryClientProvider>
  );
}

// Mock API responses
export const mockApiResponse = <T>(data: T, delay = 0): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

export const mockApiError = (message: string, status = 500): Promise<never> =>
  Promise.reject(new Error(`API Error ${status}: ${message}`));
```

**Step 3: E2E Testing Setup**

Install and configure Playwright:

```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

Create example E2E test:

```typescript
// e2e/shoe-search.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Shoe Search Functionality', () => {
  test('should search for shoes and display results', async ({ page }) => {
    await page.goto('/shoes');

    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Running Shoes');

    // Search for a shoe
    await page.fill('[data-testid="search-input"]', 'Nike Air Zoom');
    await page.press('[data-testid="search-input"]', 'Enter');

    // Verify results
    await expect(page.locator('[data-testid="shoe-card"]')).toHaveCount({ min: 1 });
    await expect(page.locator('[data-testid="search-results"]')).toContainText('Nike Air Zoom');
  });

  test('should filter shoes by brand', async ({ page }) => {
    await page.goto('/shoes');

    // Select brand filter
    await page.selectOption('[data-testid="brand-filter"]', 'Nike');

    // Verify filtered results
    await expect(page.locator('[data-testid="shoe-card"]')).toHaveCount({ min: 1 });

    // Verify all results are Nike shoes
    const shoeCards = page.locator('[data-testid="shoe-card"]');
    const count = await shoeCards.count();

    for (let i = 0; i < count; i++) {
      await expect(shoeCards.nth(i)).toContainText('Nike');
    }
  });
});
```

#### 4.3 Comprehensive Documentation

**Step 1: API Documentation**

Create OpenAPI specification:

```yaml
# docs/api/openapi.yaml
openapi: 3.0.0
info:
  title: Stride Lab API
  description: Running shoes library API
  version: 1.0.0
  contact:
    email: support@stridelab.com

servers:
  - url: https://stridelab.com/api
    description: Production server
  - url: http://localhost:3000/api
    description: Development server

paths:
  /shoes:
    get:
      summary: Get running shoes
      description: Retrieve a list of running shoes with optional filtering
      parameters:
        - name: brand
          in: query
          description: Filter by shoe brand
          required: false
          schema:
            type: string
        - name: type
          in: query
          description: Filter by shoe type
          required: false
          schema:
            type: string
            enum: [road, trail, track, gym]
        - name: page
          in: query
          description: Page number for pagination
          required: false
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          description: Number of items per page
          required: false
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  shoes:
                    type: array
                    items:
                      $ref: '#/components/schemas/RunningShoe'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
        '400':
          description: Bad request
        '500':
          description: Internal server error

components:
  schemas:
    RunningShoe:
      type: object
      required:
        - id
        - name
        - brand
        - type
      properties:
        id:
          type: string
          description: Unique shoe identifier
        name:
          type: string
          description: Shoe name
        brand:
          type: string
          description: Shoe brand
        type:
          type: string
          enum: [road, trail, track, gym]
          description: Shoe type
        price:
          type: number
          description: Shoe price in USD
        rating:
          type: number
          minimum: 0
          maximum: 5
          description: Average user rating
        imageUrl:
          type: string
          format: uri
          description: Main product image URL
        releaseDate:
          type: string
          format: date
          description: Shoe release date

    Pagination:
      type: object
      properties:
        page:
          type: integer
          description: Current page number
        limit:
          type: integer
          description: Items per page
        total:
          type: integer
          description: Total number of items
        totalPages:
          type: integer
          description: Total number of pages
```

**Step 2: Component Documentation**

Create Storybook setup for component documentation:

```bash
npx storybook@latest init
```

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;
```

Create example component story:

```typescript
// src/components/ShoeCard/ShoeCard.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { ShoeCard } from './ShoeCard';

const meta: Meta<typeof ShoeCard> = {
  title: 'Components/ShoeCard',
  component: ShoeCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for displaying running shoe information',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    shoe: {
      description: 'Running shoe data object',
    },
    onCompare: {
      description: 'Callback function when compare button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    shoe: {
      id: '1',
      name: 'Nike Air Zoom Pegasus 40',
      brand: 'Nike',
      type: 'road',
      price: 130,
      rating: 4.5,
      imageUrl: '/images/nike-pegasus-40.jpg',
      releaseDate: '2023-05-01',
    },
  },
};

export const WithoutImage: Story = {
  args: {
    shoe: {
      ...Default.args!.shoe!,
      imageUrl: undefined,
    },
  },
};

export const HighRating: Story = {
  args: {
    shoe: {
      ...Default.args!.shoe!,
      rating: 5.0,
    },
  },
};
```

**Step 3: Development Documentation**

Create comprehensive README updates:

```markdown
# README.md sections to add/update

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-org/stride-lab.git
cd stride-lab
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Set up the database
```bash
npm run db:migrate
npm run db:seed
```

5. Start the development server
```bash
npm run dev
```

## 📚 Documentation

- [API Documentation](./docs/api/README.md)
- [Component Library](http://localhost:6006) (Storybook)
- [Architecture Guide](./docs/architecture.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Deployment Guide](./docs/deployment.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📊 Monitoring

- **Error Tracking**: Sentry dashboard
- **Performance**: Web Vitals monitoring
- **Analytics**: Custom metrics dashboard
- **Uptime**: Health check endpoints

## 🔧 Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and add tests
3. Run quality checks: `npm run lint && npm run type-check`
4. Commit changes: `npm run commit` (uses commitizen)
5. Push and create PR

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```
```

#### 4.4 CI/CD Pipeline Implementation

**Step 1: GitHub Actions Workflow**

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality-checks:
    name: Quality Checks
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type checking
        run: npm run type-check

      - name: Run linting
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: quality-checks

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: stridelab_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/stridelab_test

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/stridelab_test

      - name: Upload E2E test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [quality-checks, e2e-tests]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: .next/

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build, security-scan]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.stridelab.com

    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build, security-scan]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://stridelab.com

    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

      - name: Notify Sentry of deployment
        uses: getsentry/action-release@v1
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
          SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
        with:
          environment: production
```

**Step 2: Package.json Scripts Update**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "commit": "cz",
    "prepare": "husky install",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

#### 4.5 Health Monitoring & Alerting

**Step 1: Health Check Endpoints**

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: 'healthy' | 'unhealthy';
    cache: 'healthy' | 'unhealthy';
    external: 'healthy' | 'unhealthy';
  };
  uptime: number;
}

async function checkDatabaseHealth(): Promise<boolean> {
  try {
    // Add your database health check
    // const result = await db.raw('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

async function checkCacheHealth(): Promise<boolean> {
  try {
    // Add your cache health check
    return true;
  } catch {
    return false;
  }
}

async function checkExternalServices(): Promise<boolean> {
  try {
    // Check external APIs (Strava, Sanity, etc.)
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const startTime = Date.now();

  const [dbHealth, cacheHealth, externalHealth] = await Promise.all([
    checkDatabaseHealth(),
    checkCacheHealth(),
    checkExternalServices(),
  ]);

  const status: HealthStatus = {
    status: dbHealth && cacheHealth && externalHealth ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: dbHealth ? 'healthy' : 'unhealthy',
      cache: cacheHealth ? 'healthy' : 'unhealthy',
      external: externalHealth ? 'healthy' : 'unhealthy',
    },
    uptime: process.uptime(),
  };

  const responseTime = Date.now() - startTime;

  return NextResponse.json(
    {
      ...status,
      responseTime: `${responseTime}ms`,
    },
    {
      status: status.status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}
```

**Step 2: Uptime Monitoring**

```typescript
// src/utils/uptime-monitor.ts
interface UptimeCheck {
  url: string;
  interval: number;
  timeout: number;
  retries: number;
}

class UptimeMonitor {
  private checks: Map<string, UptimeCheck> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  addCheck(name: string, config: UptimeCheck): void {
    this.checks.set(name, config);
    this.startMonitoring(name);
  }

  private async performCheck(name: string): Promise<boolean> {
    const config = this.checks.get(name);
    if (!config) return false;

    let attempts = 0;

    while (attempts < config.retries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const response = await fetch(config.url, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          this.handleSuccess(name);
          return true;
        }
      } catch (error) {
        attempts++;
        console.warn(`Uptime check failed for ${name}, attempt ${attempts}:`, error);
      }
    }

    this.handleFailure(name);
    return false;
  }

  private handleSuccess(name: string): void {
    // Log success, clear any alerts
    console.log(`✅ Uptime check passed: ${name}`);
  }

  private handleFailure(name: string): void {
    // Send alert, log error
    console.error(`❌ Uptime check failed: ${name}`);
    this.sendAlert(name);
  }

  private async sendAlert(serviceName: string): Promise<void> {
    // Send notification to Slack, email, etc.
    try {
      await fetch(process.env.SLACK_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 Service Down: ${serviceName}`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Service Alert*\n\n*Service:* ${serviceName}\n*Status:* Down\n*Time:* ${new Date().toISOString()}`,
              },
            },
          ],
        }),
      });
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }

  private startMonitoring(name: string): void {
    const config = this.checks.get(name);
    if (!config) return;

    const interval = setInterval(() => {
      this.performCheck(name);
    }, config.interval);

    this.intervals.set(name, interval);

    // Perform initial check
    this.performCheck(name);
  }

  stop(): void {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
  }
}

export const uptimeMonitor = new UptimeMonitor();

// Start monitoring in production
if (process.env.NODE_ENV === 'production') {
  uptimeMonitor.addCheck('main-site', {
    url: 'https://stridelab.com/api/health',
    interval: 60000, // 1 minute
    timeout: 10000,  // 10 seconds
    retries: 3,
  });
}
```

#### Phase 4 Deliverables Checklist

**Monitoring & Observability:**
- [ ] Sentry error tracking configured
- [ ] Web Vitals monitoring implemented
- [ ] Custom metrics and logging system
- [ ] Health check endpoints
- [ ] Uptime monitoring setup
- [ ] Alert system configured

**Testing Enhancement:**
- [ ] Enhanced Jest configuration with coverage thresholds
- [ ] Integration test utilities
- [ ] Playwright E2E testing setup
- [ ] Test data factories and mocks
- [ ] Performance testing suite
- [ ] Accessibility testing integration

**Documentation:**
- [ ] OpenAPI specification for all APIs
- [ ] Storybook component documentation
- [ ] Architecture documentation
- [ ] Developer onboarding guide
- [ ] Deployment procedures
- [ ] Troubleshooting guides

**CI/CD Pipeline:**
- [ ] GitHub Actions workflows
- [ ] Automated testing pipeline
- [ ] Security scanning integration
- [ ] Deployment automation
- [ ] Environment management
- [ ] Rollback procedures

**Quality Assurance:**
- [ ] Code coverage reporting
- [ ] Performance benchmarking
- [ ] Security vulnerability scanning
- [ ] Dependency auditing
- [ ] Bundle size monitoring
- [ ] Lighthouse CI integration

**Operational Excellence:**
- [ ] Log aggregation and analysis
- [ ] Performance monitoring dashboards
- [ ] Error tracking and alerting
- [ ] Backup and recovery procedures
- [ ] Incident response playbook
- [ ] Capacity planning guidelines

**File Structure for Phase 4:**
```
docs/
├── api/
│   ├── openapi.yaml
│   └── README.md
├── architecture.md
├── deployment.md
└── troubleshooting.md

.github/
└── workflows/
    ├── ci.yml
    ├── security.yml
    └── deploy.yml

e2e/
├── fixtures/
├── pages/
└── tests/
    ├── shoe-search.spec.ts
    ├── user-auth.spec.ts
    └── admin.spec.ts

src/utils/
├── monitoring/
│   ├── metrics.ts
│   ├── uptime-monitor.ts
│   └── web-vitals.ts
└── testing/
    ├── test-utils.tsx
    ├── mocks.ts
    └── factories.ts

.storybook/
├── main.ts
├── preview.ts
└── theme.ts

sentry.client.config.ts
sentry.server.config.ts
sentry.edge.config.js
playwright.config.ts
```

---

## 📊 Success Metrics

### Performance Metrics

- **Page Load Time**: < 2 seconds
- **First Contentful Paint**: < 1 second
- **Core Web Vitals**: All green
- **Bundle Size**: < 250KB initial load

### Code Quality Metrics

- **Test Coverage**: > 80%
- **TypeScript Strict Mode**: 100% compliance
- **ESLint Errors**: 0
- **Security Vulnerabilities**: 0

### User Experience Metrics

- **Accessibility Score**: > 95
- **Mobile Performance**: > 90
- **SEO Score**: > 95
- **Error Rate**: < 0.1%

---

## 🛠️ Recommended Tools & Libraries

### Development Tools

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0",
    "commitizen": "^4.0.0"
  }
}
```

### Production Dependencies

```json
{
  "dependencies": {
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "@tanstack/react-query": "^5.0.0",
    "framer-motion": "^10.0.0",
    "next-themes": "^0.2.0"
  }
}
```

### Monitoring & Analytics

```json
{
  "dependencies": {
    "@sentry/nextjs": "^7.0.0",
    "@vercel/analytics": "^1.0.0",
    "web-vitals": "^3.0.0"
  }
}
```

---

## 🔄 Migration Strategy

### Low-Risk Changes (Can be done incrementally)

1. File structure reorganization
2. TypeScript improvements
3. Code quality tools
4. Documentation improvements

### Medium-Risk Changes (Require testing)

1. Authentication enhancements
2. Database optimizations
3. Performance improvements
4. Error handling updates

### High-Risk Changes (Require careful planning)

1. Major architectural changes
2. Database schema changes
3. Breaking API changes
4. Third-party integrations

---

## 📝 Next Steps

1. **Review and Prioritize**: Review this plan and prioritize based on business needs
2. **Create Issues**: Break down each section into actionable GitHub issues
3. **Set Timeline**: Establish realistic timelines for each phase
4. **Assign Resources**: Allocate development resources
5. **Begin Implementation**: Start with Phase 1 foundation work

---

## 🎉 Expected Outcomes

After implementing this modernization plan, you can expect:

- **Improved Developer Experience**: Faster development cycles, better debugging
- **Enhanced Performance**: Faster page loads, better user experience
- **Increased Security**: Better protection against common vulnerabilities
- **Better Maintainability**: Cleaner code structure, easier to extend
- **Future-Proof Architecture**: Ready for scaling and new features
- **Higher Quality**: Comprehensive testing and monitoring

---

_This plan is designed to be implemented incrementally, allowing for continuous improvement while maintaining application stability._
