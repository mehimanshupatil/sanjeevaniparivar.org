# 003 — Mailto Links via DOM createElement

## Context

The contact form submits to `sanjeevani.parivar@gmail.com` via a `mailto:` link. There is no backend — this is a static site.

## Decision

Instead of `window.location.href = 'mailto:...'`, all mailto triggers use:

```ts
const a = document.createElement('a');
a.href = 'mailto:...';
a.click();
```

## Consequences

- `window.location.href` causes some browsers (particularly Safari and mobile Chrome) to navigate away from the page or trigger unwanted history entries when the mail client opens. The `createElement` approach avoids this.
- Looks like a bug to a reader unfamiliar with the constraint — do not "simplify" it back to `window.location.href`.
- The contact form still depends on the user having a mail client configured. No server-side fallback exists.
