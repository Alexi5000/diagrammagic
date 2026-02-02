# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e751f4c0-8ecf-4b68-92d9-99805a66e66e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e751f4c0-8ecf-4b68-92d9-99805a66e66e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- **Vite** - Lightning-fast build tool
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI component library
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible UI components
- **Mermaid.js** - Diagram rendering engine
- **TanStack Query** - Data fetching and caching

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e751f4c0-8ecf-4b68-92d9-99805a66e66e) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## 🎨 Template System

### How It Works

1. **Template Library**: 12 pre-built diagrams in `src/data/templates.ts`
2. **Navigation**: Click "Use Template" → `/editor?template={id}`
3. **Loading**: Editor reads URL param and loads matching template
4. **Validation**: Automated tests verify templates on every build

### Debugging Template Issues

**Open browser console and look for:**

✅ **Success Flow:**
```
✅ Templates module loaded {totalTemplates: 12, ...}
🎨 TemplateCard: User clicked "Use Template" {templateId: "tpl-business-funnel-003"}
🔍 Editor: URL params checked {templateId: "tpl-business-funnel-003"}
🎨 Editor: Loading template {totalTemplatesAvailable: 12}
✅ Editor: Template found and loaded {name: "Sales Funnel Pipeline", codeLength: 847}
```

❌ **Failure Flow:**
```
❌ Editor: Template not found {requestedId: "invalid-id", availableIds: [...]}
```

### Adding New Templates

1. Add to `templates` array in `src/data/templates.ts`
2. Use format: `tpl-{category}-{name}-{number}`
3. Include all required fields (id, name, description, code, type, category, difficulty)
4. Run tests: `npm run test`
5. Verify in browser console: Look for template ID in startup logs

## 🧪 Testing

Run tests:

```bash
npm run test        # Run once
npm run test:watch  # Watch mode
```

Test files follow the pattern `*.test.ts` or `*.spec.ts` and are placed alongside components or in `__tests__` directories.

## 🔒 Security

### Logging Strategy

All logging uses the centralized logger (`src/lib/logger.ts`):
- **Development:** All logs visible in console
- **Production:** Only errors logged (prevents sensitive data exposure)
- **ESLint enforced:** `no-console` rule prevents direct console usage

### API Key Storage

⚠️ **Demo/Testing Only:** API keys are stored in localStorage with explicit warnings.

**For Production:** Use Lovable Cloud or backend proxy with server-side secrets.

### Design Tokens

All magic numbers are centralized in `src/config/tokens.ts`:
- Timing values (debounce, animations)
- Dimensions (icons, buttons)
- Storage keys
- Validation limits

This ensures consistency and makes changes propagate automatically.
