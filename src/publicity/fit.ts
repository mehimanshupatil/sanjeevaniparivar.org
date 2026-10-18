/**
 * Shrinks text marked `data-fit` until it fits its row: the parent's width minus
 * `data-fit-reserve` px (room kept for side ornaments like the lanterns). Titles
 * differ a lot in width ("ग्राहक पेठ" vs "दिवाळी बाजार"), so a fixed size can't fit all.
 *
 * Runs after fonts load, then marks <html data-publicity-ready> so render-publicity.mjs
 * screenshots only the final layout.
 */
export function fitText(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
    el.style.fontSize = '';
    const reserve = Number(el.dataset.fitReserve ?? 0);
    const available = el.parentElement!.clientWidth - reserve;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const min = size * 0.5;
    while (el.getBoundingClientRect().width > available && size > min) {
      size -= 2;
      el.style.fontSize = `${size}px`;
    }
  });
}

export function fitWhenReady() {
  document.fonts.ready.then(() => {
    fitText();
    document.documentElement.dataset.publicityReady = '';
  });
}
