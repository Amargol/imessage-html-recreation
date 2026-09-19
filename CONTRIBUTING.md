# Contributing

Use Node 22.13+ and the pinned pnpm version. Install with `pnpm install --frozen-lockfile`, run `pnpm run build:lib`, and start the demo with `pnpm dev`.

Edit the library in `packages/imessage-html-recreation`, not the generated `public/lib` copy. Keep it free of runtime dependencies. React belongs only in the optional wrapper. Add or change attributes in both the TypeScript declarations and documentation.

For changes to bubble geometry, compare the executable fixtures with the supplied screenshots at 440 CSS pixels. Capture actual library output, regenerate overlays, and record the environment and measurements. Do not claim pixel identity from a mostly black canvas; report foreground and silhouette measurements separately.

Before opening a pull request, run `pnpm test`, `pnpm run typecheck`, `pnpm run build:lib`, and `pnpm build`. Include generated public components with the source change. Preserve the standalone HTML path and server-safe package import.

The screenshot assets are demo-only references. Do not add private contact data or distribute proprietary fonts. No GitHub or npm publication runs automatically in this repository.
