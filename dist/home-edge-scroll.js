import {mobileLayout} from './mobile-layout.js';
const maxSpeed = 560; // CSS pixels per second

export function installHomeEdgeScroll(home) {
 const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
 let speed = 0;
 let frame = 0;
 let lastTime;
 let remainder = 0;

 function stop() {
  cancelAnimationFrame(frame);
  frame = 0;
  speed = 0;
  lastTime = undefined;
  remainder = 0;
 }

 function scroll(time) {
  const root = document.scrollingElement;
  const atEdge = speed < 0 ? root.scrollTop <= 0 : root.scrollTop >= root.scrollHeight - root.clientHeight - 1;
  if (mobileLayout.matches || home.hidden || reducedMotion.matches || atEdge) {
   stop();
   return;
  }

  const elapsed = Math.min(time - (lastTime ?? time), 32);
  lastTime = time;
  const distance = remainder + speed * elapsed / 1000;
  const pixels = Math.trunc(distance);
  remainder = distance - pixels;
  if (pixels) window.scrollBy(0, pixels);
  frame = requestAnimationFrame(scroll);
 }

 window.addEventListener('pointermove', event => {
  if (mobileLayout.matches || home.hidden || event.pointerType !== 'mouse' || reducedMotion.matches) return;
  const edge = window.innerHeight / 3;
  const top = Math.max(0, 1 - event.clientY / edge);
  const bottom = Math.max(0, 1 - (window.innerHeight - event.clientY) / edge);
  speed = maxSpeed * (bottom - top);
  if (!speed) stop();
  else if (!frame) frame = requestAnimationFrame(scroll);
 }, {passive: true});

 window.addEventListener('pointerout', event => {
  if (!event.relatedTarget) stop();
 });
 window.addEventListener('blur', stop);
 window.addEventListener('hashchange', stop);
 window.addEventListener('resize', stop);
 reducedMotion.addEventListener('change', stop);
}
