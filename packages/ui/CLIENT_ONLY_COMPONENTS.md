# Client-Only Components

Some UI components require browser APIs (DOM, window, document) and cannot be server-side rendered in Next.js.

## Components

-   **PDFViewer**: Uses `pdfjs-dist` which requires DOM APIs
-   **VideoPlayer**: Uses `plyr` which requires DOM and browser APIs
-   **VideoPlayerCard**: Wrapper for VideoPlayer

## Usage

These components are exported from `@repo/ui/components/client-only` and must be imported dynamically with `{ ssr: false }`:

```tsx
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(
    () => import('@repo/ui/components/client-only').then((m) => m.VideoPlayer),
    { ssr: false },
);

const PDFViewer = dynamic(
    () => import('@repo/ui/components/client-only').then((m) => m.PDFViewer),
    { ssr: false },
);
```

## Why?

Next.js 15 with React 19 performs server-side rendering by default. Components that use browser-specific APIs will throw errors like:

-   `ReferenceError: document is not defined`
-   `ReferenceError: window is not defined`
-   `ReferenceError: DOMMatrix is not defined`

By using dynamic imports with `{ ssr: false }`, these components only load and render on the client side.

## Architecture

This separation ensures:

1. **Clean exports**: Main component index doesn't cause SSR errors
2. **Explicit intent**: Developers know these components are client-only
3. **Future apps**: New apps in the monorepo won't accidentally import SSR-breaking components
4. **Performance**: Tree-shaking works properly for server components
