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

/** Each line of text inside root, with its box as fractions of root's: for a PDF's invisible text layer */
export function textLines(root: HTMLElement): { x: number; y: number; w: number; h: number; text: string }[] {
  const page = root.getBoundingClientRect();
  const lines: { x: number; y: number; w: number; h: number; text: string }[] = [];
  const range = document.createRange();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? '';
    let line: { text: string; left: number; top: number; right: number; bottom: number } | undefined;
    const flush = () => {
      if (line?.text.trim()) {
        lines.push({
          x: (line.left - page.left) / page.width, y: (line.top - page.top) / page.height,
          w: (line.right - line.left) / page.width, h: (line.bottom - line.top) / page.height,
          text: line.text.replace(/\s+/g, ' ').trim(),
        });
      }
      line = undefined;
    };
    // Word by word, so text that wraps becomes one entry per line
    for (const m of text.matchAll(/\S+\s*/g)) {
      range.setStart(node, m.index);
      range.setEnd(node, m.index + m[0].trimEnd().length);
      const r = range.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (line && Math.abs((r.top + r.bottom) / 2 - (line.top + line.bottom) / 2) < r.height / 2) {
        line.text += m[0];
        line.left = Math.min(line.left, r.left); line.right = Math.max(line.right, r.right);
        line.top = Math.min(line.top, r.top); line.bottom = Math.max(line.bottom, r.bottom);
      } else {
        flush();
        line = { text: m[0], left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      }
    }
    flush();
  }
  return lines;
}
