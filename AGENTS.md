# iMessage recreation maintenance

Read `docs/ACCURACY.md` before changing any conversation presentation, default styles, examples, or exports.

Preserve the 440 × 956 reference profile by scaling a fixed logical canvas uniformly. Use the public `Viewport` / `imessage-viewport` component for full-device embeds. Never create a responsive phone by independently changing font size, bubble spacing, header dimensions, and canvas height. Use the real library composer and header instead of hand-styled approximations. Check host styles for interference from global CSS resets.

Compare matching content at matching logical dimensions against the message reference. Keep library source, browser distribution, examples, docs, and source download synchronized. Preserve optional controls and the flat/scrollable modes. Use only the fictional demo portrait; do not restore personal photos from older source history.
