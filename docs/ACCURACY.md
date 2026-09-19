# Integrating without changing the proportions

The library is calibrated in a **440 × 956 logical CSS-pixel coordinate system**, matching the supplied full-device reference's aspect ratio (1320 × 2868 at 3×). This is a reference profile, not a claim that every iPhone uses these dimensions.

Use `<imessage-viewport>` for a screenshot-like device composition. It lays out content at its logical width and height, then scales the whole canvas uniformly to the available width. At a displayed width of 330px, everything scales by 0.75: text, bubble padding, tails, header, icons, and composer. The resulting height is 717px. Text does not rewrap just because the surrounding landing-page column gets narrower.

```html
<script type="module" src="./imessage/index.js"></script>
<div style="max-width:380px">
  <imessage-viewport width="440" height="956">
    <imessage-conversation scrollable="true" style="--im-height:956px">
      <imessage-status-bar slot="status-bar" time="9:41"></imessage-status-bar>
      <imessage-header slot="header" name="Alex" avatar="./alex.png"></imessage-header>
      <imessage-timestamp>Today 9:41 AM</imessage-timestamp>
      <imessage-bubble direction="received">How much do we owe you?</imessage-bubble>
      <imessage-bubble direction="sent" status="Read 9:41 AM">$17.64 each!</imessage-bubble>
      <imessage-composer slot="composer"></imessage-composer>
    </imessage-conversation>
  </imessage-viewport>
</div>
```

React exports `Viewport` with `width` and `height` props; use the same nesting. For a flat message-only crop, choose a logical height that fits the messages and omit `scrollable`; continue to scale uniformly. The editor already renders its previews at a fixed 440px logical width before scaling.

## Preserve the reference geometry

- Keep default 17px text, 20px line height, 20px horizontal conversation insets, 10px message gaps, and 78% maximum bubble width. Internal fallback-font compensation is already included; do not apply another correction.
- Keep the 58px status bar, 100px profile header with 60px portrait, 44px navigation controls, and native composer. Do not replace components with approximately styled copies.
- Use one scale factor on the entire canvas. Do not shrink only the text, tighten only the margins, or stretch width and height independently to fit a card. Do not combine percentage-width layout with independent font-size breakpoints.
- Surrounding page styles can override custom-element host styles. CSS resets such as `* { margin: 0 }` must be scoped away from conversation descendants, or restore bubble margins explicitly: `imessage-bubble { margin:0 auto 10px 0 } imessage-bubble[direction="sent"] { margin-left:auto; margin-right:0 }`. Shadow DOM protects internal styles, not host styles.
- Use an iframe with a minimal stylesheet when embedding into an unknown CSS environment. This is how the editor isolates exported compositions.
- Treat decorative bezels as outside the screenshot canvas. Do not subtract a thick border from the logical viewport or invent an arbitrary phone aspect ratio.
- For another device profile, set its actual logical dimensions and recalibrate against that device's screenshot; changing viewport width can legitimately change line wrapping.

## Check the result

Use the same text and logical dimensions as the reference. Compare at the same displayed scale, checking line breaks, received/sent alignment, bubble tails, header size, and composer placement. Use the editor's message overlay for bubble geometry. Check desktop and mobile displays without modifying the internal layout. Test on Safari/iOS for final font and emoji fidelity; Linux fallback rendering and approximate Liquid Glass cannot be claimed as pixel-identical to iOS.

All example portraits must be fictional or explicitly supplied for public reuse. The current demo uses a generated fictional portrait; personal profile screenshots are excluded from the current downloadable source.
