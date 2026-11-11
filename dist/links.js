import {mobileLayout} from './mobile-layout.js';
export function installContactBoxes(page) {
 const box = page.querySelector('#links-contact-box');
 const triggers = page.querySelectorAll('.links-contact');
 let active = null;
 let following = false;
 let holdTimer = 0;
 let holdStart = null;

 function cancelHold() {
  clearTimeout(holdTimer);
  holdTimer = 0;
  holdStart = null;
 }

 function openAtTrigger(trigger) {
  following = false;
  show(trigger);
  const area = trigger.getBoundingClientRect();
  position(area.left + area.width / 2, area.top + area.height / 2);
  box.focus({preventScroll:true});
 }

 function show(trigger) {
  if (trigger === active) return;
  active?.setAttribute('aria-expanded', 'false');
  active = trigger;
  active.setAttribute('aria-expanded', 'true');
  const {destination, address} = trigger.dataset;
  box.textContent = address || destination;
  if (destination) box.href = destination;
  else box.removeAttribute('href');
  box.hidden = false;
 }

 function close(restoreFocus = false) {
  cancelHold();
  if (!active) return;
  const trigger = active;
  active = null;
  following = false;
  trigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus) trigger.focus({preventScroll:true});
  box.hidden = true;
 }

 function position(x, y) {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  box.style.left = `${Math.max(0, Math.min(x - box.offsetWidth / 2, width - box.offsetWidth))}px`;
  box.style.top = `${Math.max(0, Math.min(y - box.offsetHeight / 2, height - box.offsetHeight))}px`;
 }

 for (const trigger of triggers) {
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', box.id);
  trigger.addEventListener('click', event => {
   if (mobileLayout.matches && event.detail !== 0) {
    event.preventDefault();
    return;
   }
   openAtTrigger(trigger);
  });
  trigger.addEventListener('pointerdown', event => {
   if (!mobileLayout.matches || event.button !== 0) return;
   cancelHold();
   holdStart = {x:event.clientX, y:event.clientY, pointerId:event.pointerId};
   holdTimer = setTimeout(() => {
    holdTimer = 0;
    openAtTrigger(trigger);
   }, 450);
  });
  trigger.addEventListener('contextmenu', event => {
   if (mobileLayout.matches) event.preventDefault();
  });
 }

 document.addEventListener('pointermove', event => {
  if (holdStart && event.pointerId === holdStart.pointerId &&
      Math.hypot(event.clientX-holdStart.x, event.clientY-holdStart.y) > 10) cancelHold();
  if (mobileLayout.matches || page.hidden || event.pointerType === 'touch') return;
  // The box itself stays clickable. Inspect the element underneath it to know
  // whether the pointer is still over a large contact label.
  const {clientX, clientY} = event;
  const trigger = document.elementsFromPoint(clientX, clientY)
   .map(element => element.closest('.links-contact')).find(Boolean);
  if (trigger) {
   following = true;
   show(trigger);
   position(clientX, clientY);
  } else if (following) close();
 });
 document.addEventListener('pointerup', cancelHold);
 document.addEventListener('pointercancel', cancelHold);
 mobileLayout.addEventListener('change', () => close());
 document.documentElement.addEventListener('pointerleave', () => {
  if (following) close();
 });
 document.addEventListener('pointerdown', event => {
  if (event.target !== box && !event.target.closest('.links-contact')) close();
 });
 document.addEventListener('keydown', event => {
  if (event.key === 'Escape') close(document.activeElement === box);
 });
 box.addEventListener('blur', () => {
  if (!following) close();
 });
 window.addEventListener('scroll', () => {
  cancelHold();
  if (following || mobileLayout.matches) close();
 }, {passive:true});
 window.addEventListener('hashchange', () => close());
}

export function renderMobileLinks(page) {
 const desktop = page.querySelector('.links-composition');
 const contacts = [...desktop.querySelectorAll('.links-contact')];
 const mobile = document.createElement('div');
 mobile.className = 'mobile-only links-mobile-composition';
 mobile.innerHTML = `
  <div class="links-row">
   <span class="links-large" aria-hidden="true">Enlaces</span>
   <span style="grid-column:7">Cecilia Braña Llanes</span>
   <span class="links-right" style="grid-column:10">Mvd, Uy</span>
  </div>
  <div class="links-row links-mobile-intro">
   <span style="grid-column:1">Hablemos :)</span>
   <span style="grid-column:5">Lic. en Artes Visuales</span>
   <span class="links-right" style="grid-column:10">Dipl. en Gestión Cultural</span>
  </div>
  <div class="links-row" data-contact="0"></div>
  <div class="links-row" data-contact="1"></div>
  <div class="links-row" data-contact="2" data-text="ceciliabrana" data-end>
   <span class="links-caption-top" style="grid-column:1">Diseño gráfico</span>
   <span style="grid-column:1">Ilustración</span>
  </div>
  <div class="links-row" data-contact="2" data-text="@gmail.com"></div>
  <div class="links-row" data-contact="3" data-text="(+598)">
   <span class="links-right" style="grid-column:10">Artista visual y gráfica</span>
  </div>
  <div class="links-row" data-contact="3" data-text="098 400 930" data-end>
   <span style="grid-column:1">Foto y video</span>
  </div>
  <div class="links-row" data-contact="4" data-text="in@cebrallanes"></div>
  <div class="links-row" data-contact="5" data-text="spotify" data-end>
   <span style="grid-column:1">Arte contemporáneo</span>
  </div>
  <div class="links-row" data-contact="5" data-text="@cebrallanes"></div>
  <div class="links-row" data-contact="6"></div>
  <footer class="links-row links-mobile-footer" aria-label="Enlaces de navegación">
   <span style="grid-column:1">©2026</span>
   <a class="bracket" style="grid-column:5" href="#bio">Biografía</a>
   <a class="bracket" style="grid-column:8" href="#obra">Obra</a>
   <a class="bracket links-right" style="grid-column:10" href="#links">Enlaces</a>
  </footer>`;
 for (const row of mobile.querySelectorAll('[data-contact]')) {
  const contact = contacts[Number(row.dataset.contact)].cloneNode(true);
  contact.removeAttribute('style');
  contact.classList.remove('links-spotify');
  contact.textContent = row.dataset.text ?? contact.textContent;
  row.prepend(contact);
 }
 desktop.after(mobile);
}
