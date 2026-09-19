# imessage-html-recreation

Composable iMessage-style HTML components with continuous bubble tails, selectable text, and independently optional conversation UI. MIT-licensed code; no runtime dependencies. Version 0.1.0 is prepared for release and has not yet been published to npm.

Copy this folder to your public assets as `imessage`, or install the local package with `npm install ./packages/imessage-html-recreation`.

```html
<script type="module" src="./imessage/index.js"></script>
<imessage-conversation>
  <imessage-bubble direction="received">How much do we owe you?</imessage-bubble>
  <imessage-bubble direction="sent" status="Read 12:53 PM">$17.64 each!</imessage-bubble>
</imessage-conversation>
```

In a bundler, import `imessage-html-recreation` once from a browser entry. The module can be imported during SSR, but creating elements requires the browser. Preserve intentional newlines and avoid indentation inside short messages.

## Elements

| Element | Attributes / purpose |
| --- | --- |
| `imessage-conversation` | `theme="dark"` or `light`; optional named `header`, `status-bar`, `composer`, `keyboard` slots |
| `imessage-bubble` | `direction="sent"` or `received`, `tail="false"`, `status`, `width`, `group="first/middle/last"` |
| `imessage-header` | `name`, `avatar`, `back="false"`, `video="false"`, `unread`; optional `avatar` slot |
| `imessage-composer` | `placeholder`, `value`, `plus="false"`, `microphone="false"` |
| `imessage-timestamp` | Centered slotted timestamp |
| `imessage-thread` | Curved reply connector |
| `imessage-status-bar` | `time`, `island="false"` |
| `imessage-keyboard` | Optional QWERTY keyboard that emits key/action events |

Leave out an element to disable it. Attributes are strings; use `="false"` to turn individual flags off.

```html
<imessage-conversation theme="dark">
  <imessage-header slot="header" name="Alex" avatar="/avatar.jpg" back="false"></imessage-header>
  <imessage-bubble direction="received">Hey!</imessage-bubble>
  <imessage-bubble direction="sent">Hello!</imessage-bubble>
  <imessage-composer slot="composer"></imessage-composer>
</imessage-conversation>
```

## Customize

```css
imessage-conversation {
  --im-background: #000;
  --im-sent-top: #2995ff;
  --im-sent-bottom: #078fff;
  --im-received: #262628;
  --im-font-size: 17px;
  --im-line-height: 20px;
  --im-max-width: 78%;
  --im-inset-x: 20px;
  --im-radius: 22;
}
```

Other properties: `--im-font`, `--im-letter-spacing`, `--im-sent-letter-spacing`, `--im-incoming-text`, `--im-outgoing-text`, `--im-muted`, `--im-padding-x`, `--im-padding-y`, `--im-message-gap`, `--im-inset-top`, `--im-inset-bottom`, `--im-thread-color`, `--im-thread-height`, `--im-glass`, `--im-chrome-text`, `--im-input`, `--im-input-border`, and `--im-composer-inset`.

## React

The optional wrapper requires React 18+. It registers custom elements after mount, forwards refs, and maps booleans to string attributes.

```tsx
import { Conversation, Bubble, Header, Composer } from 'imessage-html-recreation/react';
<Conversation>
  <Header slot="header" name="Alex" back={false} />
  <Bubble direction="received">Hey!</Bubble>
  <Bubble direction="sent">Hello!</Bubble>
  <Composer slot="composer" onSend={({ text }) => console.log(text)} />
</Conversation>
```

Also exports `Timestamp`, `Thread`, `StatusBar`, and `Keyboard`. Add `'use client'` when your framework requires it.

## Events and JavaScript

`imessage:send` carries `{ text }`. Header buttons emit `imessage:back`, `imessage:profile`, `imessage:video`; the composer emits `imessage:add` and `imessage:microphone`. Keyboard letters, space, delete, and return emit `imessage:key` with `{ key }`; mode, shift and dictation buttons emit `imessage:keyboard-action` for the host to implement. All events bubble across Shadow DOM. The React callbacks are `onSend`, `onBack`, `onProfile`, `onVideo`, `onAdd`, `onMicrophone`, `onKey`, and `onKeyboardAction`, with `(detail, event)` arguments.

The composer clears after submission. Applications decide whether to append a bubble or perform any external action. The library never sends real messages, opens contacts, or makes calls.

Exports include `createConversation({messages,header,name,avatar,back,video,composer,keyboard,statusBar,theme})`, `register()`, `ready()`, and the pure `bubblePath(width,height,{tail,radius})` helper. A message record has `text`, optional `direction`, `status`, `tail`, `group`, and `width`. The factory uses textContent and never interprets message HTML. Call `bubble.refresh()` after a CSS-only radius change or `await ready()` before a browser screenshot.

## Fidelity

Measured SVG bubble geometry follows the rendered text. Original screenshot references, comparison fixtures, and overlays live in the repository/demo, outside this npm package. Apple fonts are used through the system stack and are not redistributed. The non-Apple fallback has a small optical size adjustment; native Apple rendering, emoji, antialiasing, and glass effects can differ. Chrome rendering and SSR imports were checked; Safari and Firefox are not independently verified. This is not a pixel-identical reproduction on every platform.

Code: MIT. Independent project, not affiliated with or endorsed by Apple.

### Complete configuration

Use individual HTML elements, the React wrappers, or the text-only factory. Boolean shortcuts remain supported; option objects expose the full controls.

```js
import { createConversation } from './index.js';

const conversation = createConversation({
  theme: 'dark',
  scrollable: true,
  height: 956,
  statusBar: {
    time: '10:24', clock: true, island: false,
    signal: true, wifi: true, battery: true,
  },
  header: { name: 'Alex', photo: true, back: true, unread: '12', video: true },
  timestamp: 'Today 10:24 AM',
  messages: [
    { direction: 'received', text: 'How much do we owe you?' },
    { direction: 'sent', text: '$17.64 each!', status: 'Delivered' },
    { direction: 'sent', text: 'Just sent the split.',
      timestamp: 'Today 10:25 AM', status: 'Read 10:26 AM' },
  ],
  composer: { plus: true, microphone: false, placeholder: 'iMessage' },
  keyboard: true,
});
document.body.append(conversation);
```

`scrollable: false` creates a content-height composition. `scrollable: true` fixes the height and scrolls only the messages; status bar, header, composer, and keyboard remain in place. Use a height that leaves space for the enabled components (956px is the keyboard preset). Call `conversation.scrollToEnd()` when needed; slotted-message additions automatically scroll to the end.

HTML has the same switches: `<imessage-conversation scrollable="true" style="--im-height:956px">`, `<imessage-status-bar time="10:24" clock="false" signal="true" wifi="false" battery="true" island="false">`, and `<imessage-header photo="false" unread="12">`. Empty `unread` hides the count. `photo="false"` removes the avatar and compacts the header. Omit a component to remove it entirely.

Add `<imessage-timestamp>` anywhere in the stack. A bubble's `status` is a plain-text label: omit it, use `Delivered`, use `Read 10:26 AM`, or supply custom text. All text remains local; no messages are sent through Apple services.


## Accurate device sizing — recommended integration

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

### Message arrival animations

Add `entrance` to newly inserted bubbles for a short upward glide and expansion, with direction-aware origins, smooth space allocation, and a delayed receipt fade. Existing messages stay still. Motion respects `prefers-reduced-motion` and preserves the final device sizing.

```html
<imessage-bubble direction="sent" entrance>On my way!</imessage-bubble>
```

In React use `<Bubble direction="sent" entrance>On my way!</Bubble>`. Append messages with stable keys so previous bubbles are not remounted. Call `bubble.reveal()` to replay an entry explicitly. Omit `entrance` for static compositions and screenshot comparisons.
