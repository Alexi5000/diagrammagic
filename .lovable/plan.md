

# 🚀 Complete Implementation Plan: Landing Page Rebuild + Authentication + E2E Tests

## Executive Summary

This plan covers 4 major workstreams based on the uploaded design document and user requirements:

1. **Landing Page Rebuild** - Premium Apple-style design with Three.js background, fuchsia/purple gradients, glass-morphism cards
2. **User Authentication** - Supabase-powered auth with email/password, profile storage (username + avatar)
3. **Cloud-Saved Diagrams** - Migrate from localStorage to Supabase database with user-owned diagrams
4. **E2E Tests** - Save/Load diagram functionality tests + production verification

---

## Pre-Implementation: Evidence-Based Analysis

### Current State

| Component | Status |
|-----------|--------|
| Supabase integration | Not configured (no secrets found) |
| Authentication | None |
| Diagram storage | localStorage only |
| Landing page | Blue/violet theme, SplitText placeholders |
| E2E tests | 11 tests covering landing/editor/templates |

### Design Document Analysis (uploaded HTML)

| Element | Implementation Approach |
|---------|------------------------|
| **Font** | Afacad (Google Fonts) - clean, modern sans-serif |
| **Colors** | Fuchsia (#d946ef), Purple (#a855f7), near-black (#020202) |
| **Background** | Three.js 3D block animation with bloom post-processing |
| **Navigation** | Glass-nav with blur, fuchsia accent |
| **Cards** | Glass-morphism with purple hover borders |
| **Hero** | Large headline, animated gradient text, stats mini-bar |
| **Features** | 3-step workflow (Describe → AI Generation → Export) |
| **Bento Grid** | Feature showcase with varying card sizes |
| **FAQ** | Collapsible details with animation |
| **Footer** | CTA + grid links + copyright |

---

## Phase 1: Supabase Setup and Authentication

### 1.1 Enable Lovable Cloud

Before any database work, Lovable Cloud must be enabled to provision Supabase.

### 1.2 Database Schema

**Migration 1: Create profiles table**

```sql
-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Migration 2: Create diagrams table**

```sql
-- Create diagrams table for cloud storage
CREATE TABLE public.diagrams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    code TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.diagrams ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own diagrams"
ON public.diagrams FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own diagrams"
ON public.diagrams FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diagrams"
ON public.diagrams FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own diagrams"
ON public.diagrams FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_diagrams_user_id ON public.diagrams(user_id);
CREATE INDEX idx_diagrams_updated_at ON public.diagrams(updated_at DESC);
```

### 1.3 Files to Create

| File | Purpose |
|------|---------|
| `src/integrations/supabase/client.ts` | Supabase client initialization |
| `src/integrations/supabase/types.ts` | Generated TypeScript types |
| `src/hooks/useAuth.ts` | Authentication hook (session, user, signIn, signUp, signOut) |
| `src/hooks/useProfile.ts` | Profile management hook |
| `src/contexts/AuthContext.tsx` | Auth context provider |
| `src/pages/Auth.tsx` | Login/Signup page |
| `src/components/auth/AuthForm.tsx` | Reusable auth form component |
| `src/components/auth/ProtectedRoute.tsx` | Route guard for authenticated pages |

### 1.4 Auth Flow Implementation

**AuthContext.tsx** - Core pattern:
```typescript
// Follow Supabase best practices from instructions:
// 1. Set up auth state listener FIRST
// 2. THEN check for existing session
// 3. Use onAuthStateChange callback synchronously
// 4. Defer additional Supabase calls with setTimeout(0)
```

**Auth.tsx** - Login/Signup page:
- Toggle between login and signup modes
- Email + password fields with Zod validation
- Error handling for duplicate emails, weak passwords
- Redirect to home after successful auth
- Glass-morphism styling matching new design

---

## Phase 2: Landing Page Rebuild

### 2.1 New Color Palette (from design doc)

```typescript
// Update tailwind.config.ts
'fuchsia': {
  DEFAULT: '#d946ef',
  500: '#d946ef',
  600: '#c026d3',
  400: '#e879f9',
  300: '#f0abfc',
},
'diagram-purple': {
  DEFAULT: '#a855f7',
  600: '#9333ea',
},
'diagram-bg': '#020202',
```

### 2.2 New CSS Classes (src/index.css additions)

```css
/* Afacad font */
@import url('https://fonts.googleapis.com/css2?family=Afacad:wght@400;500;600;700&display=swap');

/* New glass styles */
.glass-nav {
  background: rgba(5, 5, 5, 0.6);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-card {
  background: rgba(20, 20, 20, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.glass-card:hover {
  border-color: rgba(216, 70, 239, 0.3);
}

/* Text gradients */
.text-gradient-primary {
  background: linear-gradient(to right, #e879f9, #a855f7, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: gradientMove 5s linear infinite;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
```

### 2.3 Three.js Background Component

**New file: `src/components/landing/ThreeBackground.tsx`**

This component will implement the 3D block animation from the design:
- Tatami-style block layout
- Neon lighting (pink + blue/cyan)
- Bloom post-processing
- Auto-rotation camera
- Breathing animation effect
- Responsive (fewer blocks on mobile)

Implementation requires:
- `three` package (needs to be installed)
- Canvas element with -z-10 positioning
- WebGL renderer with bloom pass
- Vignette overlay for text readability

### 2.4 Landing Page Components to Rebuild

| Component | Changes |
|-----------|---------|
| `Navigation.tsx` | Glass-nav, fuchsia accents, logo with icon, auth links |
| `Hero.tsx` | Live badge, gradient text, new CTAs, stats mini-bar |
| `FeatureShowcase.tsx` | 3-step workflow cards, glass-morphism |
| `BentoFeatures.tsx` (NEW) | Bento grid layout with live editor preview, templates, collaboration, security |
| `FAQ.tsx` (NEW) | Collapsible FAQ section with animation |
| `Footer.tsx` | CTA section, grid links, copyright |
| `Landing.tsx` | Integrate Three.js background, new sections |

### 2.5 Hero Section Structure

```text
Hero Section
├── Live Badge ("AI Engine V2.0 Live" with pulsing dot)
├── Headline
│   ├── "Transform Ideas Into"
│   └── "Beautiful Diagrams" (gradient animated text)
├── Subtitle (description paragraph)
├── CTAs
│   ├── "Start Creating" (gradient purple button)
│   └── "Watch Demo" (outline button)
└── Stats Mini-Bar
    ├── "10k+ Users"
    ├── "1.2M Exports"
    └── "4.9/5 Rating"
```

### 2.6 Workflow Section (3 Steps)

```text
Workflow Section
├── Section Header ("Workflow Reimagined")
├── Step Cards (grid of 3)
│   ├── 01 - Describe It (keyboard icon, NLP parsing)
│   ├── 02 - AI Generation (magic wand, highlighted card)
│   └── 03 - Export & Share (gallery icon, integration icons)
```

### 2.7 Bento Features Grid

```text
Bento Grid (2x2 + 1x1 + 1x1 layout)
├── Real-time Editor (large, 2x2, with code preview)
├── 500+ Templates (1x2, with icon)
├── Team Sync (1x1, avatar stack)
└── Enterprise (1x1, shield icon)
```

---

## Phase 3: Cloud Storage Integration

### 3.1 Update Storage Layer

**New file: `src/lib/cloudStorage.ts`**

```typescript
// Cloud storage functions using Supabase
export async function getCloudDiagrams(userId: string): Promise<Diagram[]>
export async function saveCloudDiagram(userId: string, diagram: Diagram): Promise<Diagram>
export async function updateCloudDiagram(id: string, updates: Partial<Diagram>): Promise<Diagram>
export async function deleteCloudDiagram(id: string): Promise<void>
export async function syncLocalToCloud(userId: string): Promise<void>
```

### 3.2 Update useDiagramStore Hook

Modify to:
1. Check if user is authenticated
2. If authenticated → use cloud storage
3. If not authenticated → fallback to localStorage (guest mode)
4. Provide migration function to sync local diagrams to cloud on first login

### 3.3 Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/useDiagramStore.ts` | Add auth check, cloud storage calls |
| `src/pages/Editor.tsx` | Show sync status, cloud save indicator |
| `src/pages/MyDiagrams.tsx` | Add login prompt for guests, cloud sync |
| `src/components/editor/Toolbar.tsx` | Add user avatar/auth button |

---

## Phase 4: E2E Tests for Save/Load

### 4.1 New Test File: `e2e/diagram-save-load.spec.ts`

```typescript
test.describe('Diagram Save/Load (Guest Mode)', () => {
  // Test saving diagram in guest mode (localStorage)
  test('can save diagram with title and tags')
  test('saved diagram appears in My Diagrams')
  test('can edit saved diagram')
  test('can delete saved diagram')
  test('diagram persists after page reload')
});

test.describe('Diagram Cloud Sync (Authenticated)', () => {
  // These tests require test user setup
  test('can save diagram to cloud')
  test('diagrams sync across browser sessions')
  test('can migrate local diagrams to cloud on login')
});
```

### 4.2 Production Verification

After deployment, run E2E tests against production URL:
```bash
PLAYWRIGHT_BASE_URL=https://diagrammagic.lovable.app npx playwright test
```

---

## Phase 5: Package Dependencies

### 5.1 New Dependencies Required

```json
{
  "three": "^0.160.0",
  "@types/three": "^0.160.0"
}
```

### 5.2 Supabase Setup

Lovable Cloud will auto-configure:
- `@supabase/supabase-js` 
- Environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)

---

## Implementation Order

```text
Phase 1: Supabase Setup
├── 1.1 Enable Lovable Cloud
├── 1.2 Run database migrations (profiles, diagrams)
├── 1.3 Create Supabase client integration
├── 1.4 Create AuthContext and useAuth hook
├── 1.5 Create Auth page (login/signup)
└── 1.6 Add ProtectedRoute component

Phase 2: Landing Page Rebuild
├── 2.1 Install Three.js
├── 2.2 Update tailwind.config.ts with new colors
├── 2.3 Update src/index.css with new styles
├── 2.4 Create ThreeBackground component
├── 2.5 Rebuild Navigation with auth
├── 2.6 Rebuild Hero section
├── 2.7 Create Workflow section (3 steps)
├── 2.8 Create BentoFeatures grid
├── 2.9 Create FAQ section
├── 2.10 Rebuild Footer
└── 2.11 Update Landing.tsx to compose all sections

Phase 3: Cloud Storage
├── 3.1 Create cloudStorage.ts utilities
├── 3.2 Update useDiagramStore with cloud support
├── 3.3 Add sync status to Editor
└── 3.4 Update MyDiagrams with auth prompts

Phase 4: Testing
├── 4.1 Create diagram-save-load.spec.ts
├── 4.2 Run unit tests
├── 4.3 Run E2E tests locally
└── 4.4 Verify production deployment
```

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Landing page matches design | Fuchsia/purple theme, Three.js background, glass cards |
| Authentication works | Sign up, login, logout, session persistence |
| Cloud diagrams | Save, load, edit, delete from Supabase |
| Guest mode | localStorage fallback for unauthenticated users |
| E2E tests | All existing + new save/load tests pass |
| Production | Live at diagrammagic.lovable.app |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Three.js performance | Reduce blocks on mobile, use lower pixel ratio |
| Auth redirect issues | Set proper Site URL and Redirect URLs in Supabase |
| Data loss during migration | Keep localStorage as fallback, provide export option |
| Test flakiness | Use proper waits, avoid hardcoded timeouts |

---

## Files Summary

### Files to Create

| File | Purpose |
|------|---------|
| `src/integrations/supabase/client.ts` | Supabase client |
| `src/integrations/supabase/types.ts` | TypeScript types |
| `src/hooks/useAuth.ts` | Auth hook |
| `src/hooks/useProfile.ts` | Profile hook |
| `src/contexts/AuthContext.tsx` | Auth context |
| `src/pages/Auth.tsx` | Login/Signup page |
| `src/components/auth/AuthForm.tsx` | Auth form |
| `src/components/auth/ProtectedRoute.tsx` | Route guard |
| `src/components/landing/ThreeBackground.tsx` | 3D background |
| `src/components/landing/BentoFeatures.tsx` | Bento grid |
| `src/components/landing/FAQ.tsx` | FAQ section |
| `src/components/landing/Workflow.tsx` | 3-step section |
| `src/lib/cloudStorage.ts` | Cloud CRUD functions |
| `e2e/diagram-save-load.spec.ts` | Save/Load E2E tests |

### Files to Modify

| File | Changes |
|------|---------|
| `tailwind.config.ts` | Add fuchsia colors, new gradients |
| `src/index.css` | Afacad font, glass styles, animations |
| `src/App.tsx` | Wrap with AuthContext, add /auth route |
| `src/components/landing/Navigation.tsx` | New design, auth links |
| `src/components/landing/Hero.tsx` | Complete redesign |
| `src/components/landing/Footer.tsx` | New CTA footer |
| `src/components/landing/FeatureShowcase.tsx` | Remove or integrate into Workflow |
| `src/components/landing/StatsSection.tsx` | Merge into Hero |
| `src/pages/Landing.tsx` | Integrate Three.js, new sections |
| `src/hooks/useDiagramStore.ts` | Add cloud storage support |
| `src/pages/Editor.tsx` | Add auth awareness |
| `src/pages/MyDiagrams.tsx` | Add auth prompts |
| `package.json` | Add three dependency |

### Database Migrations

| Migration | Purpose |
|-----------|---------|
| `create_profiles_table.sql` | User profiles with username, avatar |
| `create_diagrams_table.sql` | Cloud diagram storage with RLS |

---

## Technical Notes

### State Management Architecture

The current approach uses `useDiagramStore` hook with localStorage. The refactored version will:

1. **Maintain backward compatibility** - Guest mode continues to work
2. **Add auth-aware layer** - Checks `useAuth()` for user session
3. **Use optimistic updates** - UI updates immediately, syncs in background
4. **Handle offline gracefully** - Queue changes, sync when online

### Memoization Analysis (Per Requirements)

The existing `useMemo` in `MyDiagrams.tsx` for sorting:

- **State Change**: `diagrams` array or `sortBy` option
- **Invalidation Target**: Sorted array computation
- **Necessity**: Sorting is O(n log n) and should not run on every render

This memoization is **structurally correct** because:
1. The state graph is properly partitioned (sort is derived state)
2. Invalidation only occurs when source data changes
3. The cost is computational, not architectural

No additional memoization is proposed in this plan.

