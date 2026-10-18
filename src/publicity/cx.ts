/** Joins class names, skipping falsy ones. Deliberately not `cn`: no Tailwind conflict
 *  merging, so template markup stays exactly as written (renders are compared pixel-for-pixel). */
export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');
