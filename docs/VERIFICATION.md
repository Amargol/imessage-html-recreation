# Reference verification

The distributed visual comparison uses the message-only screenshot, which contains no profile photo. Earlier full-device captures were removed from the distribution because they included a personal portrait. Full conversation and keyboard HTML fixtures remain available with a generated fictional avatar. Historical numerical measurements are retained as historical results, not as verification of the updated header.

For each case, the script saves the original region, the HTML screenshot, a 50% blend, an absolute RGB difference, and a labeled side-by-side image. It does not register, translate, warp, or optimize a capture to inflate scores.

The primary sent bubble silhouette is measured in an explicit region of interest. A blue color mask isolates its body, and enclosed text holes are filled. Intersection over union (IoU) measures the resulting silhouette overlap. It excludes typography, emoji, read receipts, and chrome, and must not be described as an overall fidelity score. Mean absolute RGB error (0–255) is reported for the full crop, all non-dark pixels, and the primary bubble region. The non-dark error prevents the large black background from dominating the conclusion.

Known differences remain: SF font contours on Apple devices versus the calibrated Linux fallback; emoji shapes; antialiasing and image compression; subtle gradient/color-profile effects; header glass blending; blank rather than live-activity status island; and keyboard icon details. The keyboard is a visual component with letter/space/delete/return behavior, not a native OS keyboard. The distributed original is `public/references/messages.jpg`.

## Reproduce

1. Run `pnpm run build:lib` and `pnpm dev`.
2. Open `public/examples/messages.html` through the running server (URL paths `/examples/...`). Wait for the module and fonts to load.
3. Capture at DPR 1 with a viewport at least 440px wide. Save the top-aligned captures as `messages.jpg` in one directory.
4. Run `python scripts/verify-screenshots.py /absolute/path/to/captures` (Pillow, NumPy, and SciPy).
5. Review the rendered overlays rather than relying only on the numerical result.

## Functional checks

Checked in the browser: message presets and edits, adding/removing messages, HTML escaping, optional header/back/input/add controls, local composer submission, overlay controls, and standalone HTML export preparation. The downloadable Blob link was confirmed; the QA browser did not expose a download-completion event for Blob URLs, so the browser-to-file transfer remains unverified. Package checks cover server-safe imports, finite geometry, React server rendering with false flags and escaped text, source/distribution agreement, and TypeScript compilation.

A 390px-wide responsive fixture is included at `/examples/mobile-playground.html`. WebMCP registration is feature-detected; this QA browser did not expose `document.modelContext`, so the optional agent tool could not be executed in this environment. Its unavailable state does not affect the visible demo.
