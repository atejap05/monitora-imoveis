# Painel NFSe - AI Coding Instructions

## Project Architecture Overview

This is a **React 18 + TypeScript Business Intelligence dashboard** for Brazilian electronic service invoice (NFSe) data visualization and analysis. Built with **Vite** for fast development and optimized builds. The app communicates with a **Python backend via global window functions** and uses sophisticated caching for performance.

### Key Architectural Patterns

**Feature-Based Architecture**: Each page follows `pages/[FeatureName]/` structure with dedicated `components/` and `hooks/` folders for complete feature encapsulation.

**Backend Integration**: Services call Python functions exposed on `window` object (e.g., `window.get_totais_nfse_com_filtro`). All API calls are **sequential** - use `queuedBackendCall()` wrapper from `@/lib/backendQueue` to prevent backend overload.

**State Management**: Hybrid approach with **Zustand for client-state filters** (`src/state/`) and **TanStack Query for server-state** (`@tanstack/react-query`). Each page has its own filter store (e.g., `useVisaoGeralFiltersState`).

**Query Organization**: Hierarchical query keys in `src/lib/queryKeys.ts` enable granular cache invalidation. Use specific configs from `src/lib/queryConfig.ts` based on data criticality (critical/heavy/auxiliary).

## Development Patterns

### Page Structure
Every page follows this pattern:
```
pages/[PageName]/
├── [PageName].tsx          # Main component
├── components/             # Page-specific components  
└── hooks/                  # Custom hooks (useSyncData, specific queries)
```

### Data Fetching Pattern
Pages use **sync hooks** (e.g., `useSyncVisaoGeralData`) that:
1. Watch Zustand filter state changes
2. Use React Query for server state
3. Update Zustand with loading/data/error states
4. Queue backend calls sequentially

**Critical**: Always encapsulate data fetching in custom hooks within the feature's `hooks/` folder. Never call services directly from components or use raw `useEffect` + `fetch`.

### Filter Management
- **Form state**: Temporary, controlled by form components
- **Filter state**: Zustand store per page (e.g., `filters`, `submittedFilters`)
- **Submit pattern**: Only `submittedFilters` trigger data fetching

### Component Architecture
- **UI Components**: Radix-based in `src/components/ui/` (shadcn/ui pattern)
- **Business Components**: In `src/components/` (charts, tables, cards)
- **Global Filters**: Reusable filter components in `src/filters/`

## Tech Stack Details

**Core**: React 18 + Vite + TypeScript for fast development with HMR and optimized builds.

**Data & State**: TanStack Query (server state with cache/sync), Zustand (client state), React Hook Form + Zod (forms/validation).

**UI**: Shadcn/UI (copy-paste components), Tailwind CSS (utility-first), Recharts (charts), TanStack Table (data grids), Leaflet (maps).

**Development**: ESLint for code quality, React Router DOM for routing, date-fns for dates, xlsx/papaparse for exports.

## File Organization Principles

### Folder Structure Rules
- **`@types/`**: TypeScript definitions organized by feature (e.g., `convenios.types.ts`)
- **`components/`**: Generic, reusable UI components across the entire application
- **`filters/`**: Specialized form components for filter sections (FormAno, FormUF, etc.)
- **`hooks/`**: Reusable custom hooks (useDebounce, useMobile, usePrefetch)
- **`lib/`**: Utilities, configurations, singletons (queryKeys, queryConfig, backendQueue)
- **`pages/[Feature]/`**: Complete feature encapsulation with components/, hooks/, and main page component
- **`service/`**: API communication layer - one file per endpoint group (convenios.ts, ambiente.ts)
- **`state/`**: Zustand stores for global filter state management

### Import Rules
Always use `@/` path aliases instead of relative imports. Example: `import { Button } from '@/components/ui/button'` instead of `'../../../components/ui/button'`.

## Critical Development Guidelines

### Backend Communication
```typescript
// ❌ Don't call backend directly or use useEffect + fetch
const data = await window.get_totais_nfse_com_filtro(params);

// ✅ Always use queue manager + TanStack Query
const data = await queuedBackendCall(() => 
  window.get_totais_nfse_com_filtro(params), 'high'
);
```

### Data Fetching Pattern (NEVER useEffect + fetch)
```typescript
// ✅ Use TanStack Query with hierarchical keys and proper config
const { data } = useQuery({
  queryKey: QUERY_KEYS.visaoGeralData(filters),
  queryFn: () => queuedBackendCall(() => fetchNotasFiscais(filters)),
  enabled: !!filters,
  ...criticalQueryConfig // From queryConfig.ts
});
```

### Filter State Management
```typescript
// ✅ Read/update filters via Zustand stores
const { filters, setFilters, submittedFilters } = useConveniosFiltersState();

// ✅ Only submittedFilters trigger data fetching
useEffect(() => {
  if (isSuccess) {
    setData(data);
    setError(null);
  }
}, [isSuccess, data]);
```

### Unidirectional Data Flow
**User Interaction** → **Form Component** → **Zustand Store** → **Custom Hook** → **TanStack Query** → **Service Layer** → **Backend API** → **Cache & Render**

### Prefetching
Use `usePrefetch` hook for intelligent data preloading between related pages. Call `prefetchRelatedPages()` when filters change to improve navigation UX.

## TypeScript Patterns

### Filter Types
- `TFilter`: General page filters (year, UF, municipality, etc.)
- `TContribuintesFilter`: Specific to contributors page
- Form types mirror filter types but use `string | null` for form controls

### Service Types
Services are strongly typed with response interfaces in `src/@types/`. Backend functions are typed via window augmentation with optional properties and `//@ts-ignore`.

## Component Guidelines

### Layout Components
- `MainLayout`: Handles sidebar, header, and responsive behavior
- Sticky header with `HEADER_HEIGHT = 94px` constant
- Sidebar toggle via `useSidebar` context

### Chart Components  
Use **Recharts** with consistent styling. Chart data should be memoized and handle loading/error states gracefully.

### Table Components
Use `@tanstack/react-table` for complex tables with pagination, sorting, and selection. Basic tables use `BasicTable` component.

## Key Files to Reference

- `src/lib/queryConfig.ts` - React Query configurations by data type
- `src/lib/queryKeys.ts` - Hierarchical cache key structure  
- `src/lib/backendQueue.ts` - Sequential backend call management
- `src/hooks/usePrefetch.ts` - Intelligent prefetching strategies
- `src/@types/` - Complete TypeScript definitions
- `src/state/` - Zustand stores for filter management

## Project Features

**Main Pages**: VisaoGeral (dashboard), Contribuintes (map analysis), Ambiente (emissions monitoring), Convenios (municipality agreements), Consultas (document search), NotasFiscais (invoice analysis), Volumetria (temporal analysis).

**UI Stack**: Shadcn/UI + Radix primitives + Tailwind CSS. Always use `src/components/ui/` base components for new UI elements.

## Common Operations

**Adding New Feature/Page**:
1. Create `src/@types/[feature].types.ts` - TypeScript definitions
2. Create `src/state/[feature]FiltersState.ts` - Zustand store for filters
3. Create `src/service/[feature].ts` - API communication functions
4. Create `src/pages/[FeatureName]/` structure:
   - `[FeatureName].tsx` - Main page component
   - `hooks/use[FeatureName]Data.ts` - Custom hook with TanStack Query
   - `components/` - Feature-specific components
5. Add route in `App.tsx` and navigation in `Sidebar/SidebarNav.tsx`
6. Add query keys in `src/lib/queryKeys.ts`

**Adding New Filter**: 
1. Update types in `@types/[feature].types.ts`
2. Add to Zustand store in `src/state/[feature]FiltersState.ts` 
3. Create/update form component in feature's `components/` folder
4. Update query key to include new filter
5. Update service function to handle new parameter

**Code Style Rules**:
- Use `function Component() {}` syntax, not arrow functions for components
- Use `@/` imports instead of relative paths
- Never use `useEffect` with `fetch` - always use TanStack Query
- Use Tailwind classes, avoid inline styles
- Use Shadcn/UI components as building blocks

The codebase prioritizes **performance through intelligent caching** and **maintainability through clear separation of concerns** between form state, filter state, and server state.