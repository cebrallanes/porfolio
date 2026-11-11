import {mobileLayout} from './mobile-layout.js';

export function spaceLabels(items, bounds, gapBetween) {
 let right = bounds.right;
 for (let index = items.length - 1; index >= 0; index--) {
  const item = items[index];
  item.x = Math.min(item.left, right - item.width);
  right = item.x - gapBetween(items[index - 1], item);
 }

 let left = bounds.left;
 for (const [index, item] of items.entries()) {
  if (item.width <= bounds.width) item.x = Math.max(left, item.x);
  left = item.x + item.width + gapBetween(item, items[index + 1]);
 }
}

const groups = [
 ['body > footer', ':scope > span'],
 ['.obra-meta', ':scope > span, :scope > .filter > button, #clear'],
 ['.gallery-controls', ':scope > button, :scope > span'],
 ['.bio-meta', ':scope > span, .bio-panel-tools button'],
 ['.bio-display', '.bio-row > :is(span, a, button):not(.bio-ink), .bio-toggle'],
 ['.illustrated-heading', ':scope > span:not(.illustrated-word)'],
 ['.mobile-story-controls', ':scope > *'],
 ['.statement-composition', ':scope > span:not(.statement-word)'],
 ['.statement-footer', ':scope > *'],
 ['.links-row', ':scope > :is(span, a):not(.links-large)'],
];

export function installLabelSpacing() {
 function update() {
  const gap = mobileLayout.matches ? 10 : 20;
  const layouts = [];
  for (const [selector, labels] of groups) {
   for (const group of document.querySelectorAll(selector)) {
    if (!group.getClientRects().length) continue;
    const items = [...group.querySelectorAll(labels)].filter(label => label.getClientRects().length);
    for (const label of items) {
     label.classList.add('single-line-label');
     label.style.removeProperty('--label-offset');
    }
    layouts.push({group, items});
   }
  }

  const offsets = [];
  for (const {group, items} of layouts) {
   const bounds = group.getBoundingClientRect();
   const rows = [];
   for (const element of items) {
    const box = element.getBoundingClientRect();
    if (!box.width || !box.height) continue;
    // Group labels that occupy the same vertical band, even when grid alignment differs.
    let row = rows.find(row => box.top < row.bottom - 0.5 && box.bottom > row.top + 0.5);
    if (!row) {
     row = {top: box.top, bottom: box.bottom, items: []};
     rows.push(row);
    }
    row.items.push({element, left: box.left, width: box.width});
   }

   for (const row of rows) {
    row.items.sort((first, second) => first.left - second.left);
    spaceLabels(row.items, bounds, () => gap);
    for (const {element, x, left} of row.items) offsets.push({element, offset: x - left});
   }
  }
  for (const {element, offset} of offsets) {
   if (offset) element.style.setProperty('--label-offset', `${offset}px`);
  }
 }

 const observer = new ResizeObserver(update);
 observer.observe(document.body);
 for (const group of document.querySelectorAll('main > section')) observer.observe(group);
 const content = new MutationObserver(update);
 for (const selector of ['#projects', '.obra-meta', '.bio-display', '.mobile-story-controls']) {
  const region = document.querySelector(selector);
  if (region) content.observe(region, {childList:true, subtree:true, attributes:true, attributeFilter:['hidden']});
 }
 window.addEventListener('resize', update, {passive:true});
 window.addEventListener('hashchange', update);
 update();
}
