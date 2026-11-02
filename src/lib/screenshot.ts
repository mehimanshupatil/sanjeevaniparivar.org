// Shared by the browser exports (donation receipt, personal invitation cards). modern-screenshot copies
// each element's measured width and lays the text out again inside an SVG image; on phones with a
// fractional device pixel ratio (2.625, 2.75, …) the text comes out a fraction of a pixel wider there,
// so a label that just fit wraps to a second line and spills over the next element. Text that is on one
// line on screen is kept on one line in the image.
import { domToBlob, type Options } from 'modern-screenshot';

const MARK = 'data-one-line';

/** Is this element's text laid out on a single line? (all its line boxes share one centre line) */
function onOneLine(el: Element): boolean {
  const range = document.createRange();
  range.selectNodeContents(el);
  const rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
  if (!rects.length) return false;
  const centres = rects.map((r) => r.top + r.height / 2);
  const size = parseFloat(getComputedStyle(el).fontSize) || 16;
  return Math.max(...centres) - Math.min(...centres) < size * 0.6;
}

/** Marks the nearest non-inline box around each piece of text that sits on one line; returns the marked elements */
function markOneLine(root: HTMLElement): Element[] {
  const marked = new Set<Element>();
  for (const el of [root, ...root.querySelectorAll('*')]) {
    if (![...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim())) continue;
    let box = el;
    while (box !== root && box.parentElement && getComputedStyle(box).display.startsWith('inline')) box = box.parentElement;
    if (!marked.has(box) && onOneLine(box)) marked.add(box);
  }
  for (const el of marked) el.setAttribute(MARK, '');
  return [...marked];
}

/** domToBlob, with single-line text kept on one line in the image */
export async function snapshot(node: HTMLElement, options: Options): Promise<Blob> {
  await document.fonts.ready;
  const marked = markOneLine(node);
  try {
    return await domToBlob(node, {
      ...options,
      onCloneEachNode: (cloned) => {
        if (cloned instanceof Element && cloned.hasAttribute(MARK)) (cloned as HTMLElement).style.whiteSpace = 'nowrap';
      },
    });
  } finally {
    for (const el of marked) el.removeAttribute(MARK);
  }
}
