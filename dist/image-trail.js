import {mobileLayout} from './mobile-layout.js';
const trainLength = 5;
const carSpacing = 42;
const imageChangeDistance = 105;
const controls = 'nav, a[href], button, input, select, textarea, [role="button"], [contenteditable]';
const navigationMargin = 20;

export function installImageTrail(page, getProjects, {linkProjects = true} = {}) {
 const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
 const findNavigation = () => [
  ...document.querySelector('body > header').querySelectorAll(controls),
  ...page.querySelectorAll(controls),
 ];
 let navigation=findNavigation();
 mobileLayout.addEventListener('change',()=>{hide();navigation=findNavigation();});
 const trail = document.createElement('div');
 trail.className = 'home-trail';
 trail.hidden = true;

 if (!linkProjects) trail.setAttribute('aria-hidden', 'true');
 const lead = document.createElement(linkProjects ? 'a' : 'div');
 lead.className = 'home-trail-lead';
 const cars = Array.from({length: trainLength}, () => {
  const image = document.createElement('img');
  image.alt = '';
  image.draggable = false;
  return {image, x: 0, y: 0};
 });
 for (const {image} of cars.slice(1).reverse()) trail.append(image);
 lead.append(cars[0].image);
 trail.append(lead);
 page.append(trail);

 let cursor = null;
 let frame = 0;
 let lastTime = 0;
 let distance = 0;
 let projectIndex = 0;
 let catalog;
 const trailProjects = [];

 function updateImages() {
  cars.forEach(({image}, index) => {
   const project = trailProjects[index];
   image.hidden = !project;
   if (!project) return;
   const cover = project.images[0];
   const source = cover.preview ?? cover.url ?? cover;
   if (image.getAttribute('src') !== source) image.src = source;
  });
  if (!linkProjects) return;
  const front = trailProjects[0];
  lead.href = `#obra/${encodeURIComponent(front.id)}`;
  lead.setAttribute('aria-label', `Ver ${front.title} en Obra`);
 }

 function overControl(x, y) {
  return navigation.some(element => {
   const {top, right, bottom, left, width, height} = element.getBoundingClientRect();
   return width > 0 && height > 0
    && x >= left - navigationMargin && x <= right + navigationMargin
    && y >= top - navigationMargin && y <= bottom + navigationMargin;
  });
 }

 function hide() {
  trail.hidden = true;
  cursor = null;
  distance = 0;
  lastTime = 0;
  trailProjects.length = 0;
  cancelAnimationFrame(frame);
  frame = 0;
 }

 function draw(time) {
  frame = 0;
  if (mobileLayout.matches || !cursor || page.hidden || reducedMotion.matches) {
   hide();
   return;
  }
  const easing = lastTime ? 1 - Math.exp(-(time - lastTime) / 65) : 1;
  lastTime = time;
  const front = cars[0];
  front.x = cursor.x;
  front.y = cursor.y;
  lead.style.transform = `translate3d(${front.x}px,${front.y}px,0) translate(-50%,-50%)`;

  let moving = false;
  for (let i = 1; i < trailProjects.length; i++) {
   const car = cars[i], ahead = cars[i - 1];
   const dx = ahead.x - car.x, dy = ahead.y - car.y;
   const excess = Math.hypot(dx, dy) - carSpacing;
   if (excess > 0.5) {
    const step = easing * excess / (excess + carSpacing);
    car.x += dx * step;
    car.y += dy * step;
    moving = true;
   }
   car.image.style.transform = `translate3d(${car.x}px,${car.y}px,0) translate(-50%,-50%)`;
  }
  if (moving) frame = requestAnimationFrame(draw);
 }

 page.addEventListener('pointermove', event => {
  if (mobileLayout.matches || event.pointerType !== 'mouse' || reducedMotion.matches) return;
  const projects = getProjects();
  if (!projects.length) return;
  const x = event.clientX, y = event.clientY;
  if (overControl(x, y)) {
   hide();
   return;
  }

  if (catalog !== projects) {
   hide();
   projectIndex = 0;
   catalog = projects;
  }
  if (!cursor) {
   for (const car of cars) Object.assign(car, {x, y});
   trailProjects.push(projects[projectIndex]);
   updateImages();
   trail.hidden = false;
  } else {
   distance += Math.hypot(x - cursor.x, y - cursor.y);
   if (distance >= imageChangeDistance) {
    projectIndex = (projectIndex + 1) % projects.length;
    distance %= imageChangeDistance;
    trailProjects.unshift(projects[projectIndex]);
    if (trailProjects.length > trainLength) trailProjects.pop();
    updateImages();
   }
  }
  cursor = {x, y};
  if (!frame) frame = requestAnimationFrame(draw);
 });
 page.addEventListener('pointerleave', hide);
 window.addEventListener('scroll', () => {
  if (cursor && overControl(cursor.x, cursor.y)) hide();
 }, {passive: true});
 window.addEventListener('blur', hide);
 window.addEventListener('hashchange', hide);
 reducedMotion.addEventListener('change', hide);
 document.addEventListener('keydown', event => {
  if (event.key === 'Escape') hide();
 });
}
