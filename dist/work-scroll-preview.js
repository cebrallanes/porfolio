import {mobileLayout} from './mobile-layout.js';

export function installWorkScrollPreview(page) {
 const list = page.querySelector('#projects');
 let highlighted;
 let pendingFrame = 0;

 function update() {
  pendingFrame = 0;
  const rows = list.children;
  let next;
  if (mobileLayout.matches && !page.hidden && rows.length) {
   // Keep the reference line at the first row's original viewport position.
   const reference = list.getBoundingClientRect().top + window.scrollY;
   let left = 0;
   let right = rows.length;
   while (left < right) {
    const middle = Math.floor((left + right) / 2);
    if (rows[middle].getBoundingClientRect().top <= reference + 0.5) left = middle + 1;
    else right = middle;
   }
   next = rows[Math.max(0, left - 1)];
  }
  if (next === highlighted) return;
  highlighted?.classList.remove('scroll-preview');
  next?.classList.add('scroll-preview');
  highlighted = next;
 }

 function scheduleUpdate() {
  if (!pendingFrame) pendingFrame = requestAnimationFrame(update);
 }

 window.addEventListener('scroll', scheduleUpdate, {passive:true});
 window.addEventListener('resize', scheduleUpdate, {passive:true});
 mobileLayout.addEventListener('change', scheduleUpdate);
 const changes = new MutationObserver(scheduleUpdate);
 changes.observe(list, {childList:true});
 changes.observe(page, {attributes:true,attributeFilter:['hidden']});
 const layout = new ResizeObserver(scheduleUpdate);
 layout.observe(page);
 scheduleUpdate();
}
