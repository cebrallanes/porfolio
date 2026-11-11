// Use the large SVG glyphs as a background, then clip that background to the
// small text. Layout, selection and link hit areas stay with the original text.
export function installTextOverlap(page, largeSelector, smallSelector, {scrollTargets = [], changingContent} = {}) {
 const cache = new WeakMap();
 const background = getComputedStyle(document.documentElement).getPropertyValue('--page-background').trim();
 const serializer = new XMLSerializer();
 function glyphFor(svg) {
  if (cache.has(svg)) return cache.get(svg);
  const original = svg.querySelector('text');
  const glyph = original.cloneNode(true);
  const style = getComputedStyle(original);
  glyph.style.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  glyph.style.letterSpacing = style.letterSpacing;
  glyph.style.fill = background;
  const entry={svg, markup: serializer.serializeToString(glyph)};
  cache.set(svg,entry);
  return entry;
 }

 function update() {
  if (page.hidden) return;
  const captions = [...page.querySelectorAll(smallSelector)];
  const shapes = [...page.querySelectorAll(largeSelector)].filter(svg=>svg.getClientRects().length).map(svg=>({...glyphFor(svg),box:svg.getBoundingClientRect()}));
  const masks = captions.map(caption => {
   const box = caption.getBoundingClientRect();
   if (!box.width || !box.height) return '';
   const parts = shapes.filter(({box: title}) =>
    title.left < box.right && title.right > box.left &&
    title.top < box.bottom && title.bottom > box.top
   ).map(({svg, markup, box: title}) =>
    `<svg x="${title.left - box.left}" y="${title.top - box.top}" width="${title.width}" height="${title.height}" viewBox="${svg.getAttribute('viewBox')}">${markup}</svg>`
   );
   if (!parts.length) return '';
   const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${box.width}" height="${box.height}">${parts.join('')}</svg>`;
   return `url("data:image/svg+xml,${encodeURIComponent(mask)}")`;
  });
  captions.forEach((caption, index) => {
   caption.classList.toggle('type-overlap', Boolean(masks[index]));
   if (masks[index]) caption.style.setProperty('--type-overlap-ink', masks[index]);
   else caption.style.removeProperty('--type-overlap-ink');
  });
 }

 const observer = new ResizeObserver(update);
 observer.observe(page);
 window.addEventListener('resize', () => requestAnimationFrame(update), {passive:true});
 for (const caption of page.querySelectorAll(smallSelector)) observer.observe(caption);
 let frame = 0;
 function scheduleUpdate() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
   frame = 0;
   update();
  });
 }
 for (const target of scrollTargets) {
  observer.observe(target);
  target.addEventListener('scroll', scheduleUpdate, {passive: true});
 }
 if (changingContent) {
  new MutationObserver(scheduleUpdate).observe(changingContent, {childList: true});
 }
}
