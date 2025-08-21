# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo containing a React calendar library published as `@vinctus/calendar` with the following structure:

- `packages/library/` - The main calendar library package
- `packages/demo/` - Demo application for testing the library
- Root workspace manages both packages via npm workspaces

## Development Commands

**Build the library:**
```bash
npm run build
```

**Run development server (demo app):**
```bash
npm run dev
```

**Run tests:**
```bash
npm run test
```

**Clean all dependencies and build artifacts:**
```bash
npm run clean
```

**Publish library:**
```bash
npm run publish
```

## Architecture

### Library Package (`packages/library/`)

- **Entry point:** `src/index.ts` - exports Calendar component and types
- **Main component:** `src/Calendar/index.tsx` - contains all calendar logic and rendering
- **Build system:** Rollup with dual output (CJS + ESM) and separate CSS extraction
- **Styling:** SCSS with PostCSS processing, outputs to `dist/index.css`
- **Types:** Full TypeScript support with generated `.d.ts` files

### Core Calendar Features

- Month grid generation with previous/next month days
- Event rendering with color coding and strikethrough support
- Internationalization support via locale objects
- Click handlers for days, events, and "more events"
- Day selection functionality
- Responsive event truncation with "more" indicator

### Key Types

- `CalendarEvent` - Base event type with date, title, color, and optional styling
- `CalendarProps<T>` - Generic props supporting custom event types extending CalendarEvent
- `CalendarLocale` - Locale configuration for days, months, and formatting

### Build Configuration

- **Rollup config:** Dual build for library (CJS/ESM) + TypeScript declarations
- **CSS:** Extracted to separate file via PostCSS, minified with Sass preprocessing
- **External deps:** React, React DOM, and React Router marked as peer dependencies
- **TypeScript:** Strict mode enabled with comprehensive type checking

### Demo Application

- Vite-based React app using Ant Design components
- Shows calendar with sample events and navigation controls
- Demonstrates all calendar features including event styling and callbacks

## Localization

The library supports multiple locales through the `CalendarLocale` interface:
- English (`en`) and French (`fr`) locales included
- Locale defines day names, month names, "more" text, and time formatting
- Custom locales can be passed via the `locale` prop