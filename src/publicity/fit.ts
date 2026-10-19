/**
 * Shrinks text marked `data-fit` until it fits its row: the parent's width minus
 * `data-fit-reserve` px (room kept for side ornaments like the lanterns). Titles
 * differ a lot in width ("ग्राहक पेठ" vs "दिवाळी बाजार"), so a fixed size can't fit all.
 *
 * Runs after fonts load, then marks <html data-publicity-ready> so render-publicity.mjs
 * screenshots only the final layout.
 */
/** Returns false if some text couldn't be made to fit even at its smallest size. */
export function fitText(root: ParentNode = document): boolean {
  let fits = true;
  root.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
    el.style.fontSize = '';
    const reserve = Number(el.dataset.fitReserve ?? 0);
    const available = el.parentElement!.clientWidth - reserve;
    let size = parseFloat(getComputedStyle(el).fontSize);
    // data-fit-min: the smallest size as a share of the original (default half)
    const min = size * Number(el.dataset.fitMin ?? 0.5);
    // offsetWidth, like clientWidth, is in the element's own px (unaffected by a zoom on an
    // ancestor); getBoundingClientRect would be zoomed and shrink titles too far.
    while (el.offsetWidth > available && size > min) {
      size -= 2;
      el.style.fontSize = `${size}px`;
    }
    if (el.offsetWidth > available + 1) fits = false;
  });
  return fits;
}

/**
 * Grows the whole content of a card (marked `data-fill`) evenly until it fills most of the
 * card, so a card with little text isn't a few small blocks spread over a tall 9:16 frame.
 * It zooms the content and narrows it by the same factor, so it never gets wider than the
 * card, and re-fits titles at each step (stopping before a title would no longer fit or
 * would look smaller than before). Content that already fills (or overflows) the card
 * is left at 1 so the overflow check still sees it.
 */
export function fillFrame(root: ParentNode = document, target = 0.94, max = 1.6) {
  root.querySelectorAll<HTMLElement>('[data-fill]').forEach((el) => {
    const box = el.parentElement!;
    const cs = getComputedStyle(box);
    const width = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const height = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const titles = [...el.querySelectorAll<HTMLElement>('[data-fit]')];
    const size = (t: HTMLElement) => parseFloat(getComputedStyle(t).fontSize);
    let base: number[] = [];
    // Natural height of the content at zoom z (height freed so it isn't stretched to the card).
    // "Too big" if a title can't fit, or would look smaller than it does at 1 (it shrinks to
    // fit the narrower width): growing the card must never cost the title its size.
    const natural = (z: number) => {
      el.style.zoom = String(z);
      el.style.width = `${width / z}px`;
      el.style.height = 'auto';
      if (!fitText(el)) return Infinity;
      if (titles.some((t, i) => size(t) * z < base[i] * 0.99)) return Infinity;
      return el.getBoundingClientRect().height;
    };
    let lo = 1, hi = max;
    const h1 = natural(1);
    base = titles.map(size);
    if (h1 < height * target) {
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        if (natural(mid) <= height * target) lo = mid; else hi = mid;
      }
    }
    natural(lo);
    // Back to filling the card, so justify-between spreads what little room is left
    el.style.height = `${height / lo}px`;
  });
}

export function fitWhenReady() {
  document.fonts.ready.then(() => {
    fitText();
    fillFrame();
    document.documentElement.dataset.publicityReady = '';
  });
}
