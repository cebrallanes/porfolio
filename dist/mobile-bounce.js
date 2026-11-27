import {mobileLayout} from './mobile-layout.js';

export function installMobileBounce(page, getProjects) {
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 function makeImage() {
  const element = document.createElement('img');
  element.className = 'mobile-bounce';
  element.alt = '';
  element.hidden = true;
  return element;
 }
 let image = makeImage();
 page.append(image);
 let x=10, y=80, vx=73, vy=91, last=0, frame=0;
 let current='', urls=[], catalogKey='', cursor=0, checkedAt=-Infinity;
 const prepared = new Map();
 const failed = new Set();

 function preload() {
  let pending = [...prepared.values()].filter(entry => !entry.ready).length;
  let attempts = urls.length;
  while (prepared.size < 4 && pending < 2 && attempts-- > 0) {
   const url = urls[cursor++ % urls.length];
   if (url === current || prepared.has(url) || failed.has(url)) continue;
   const next = makeImage();
   const entry = {image: next, ready: false};
   prepared.set(url, entry);
   pending++;
   const timeout = setTimeout(reject, 15000);
   function reject() {
    clearTimeout(timeout);
    next.onload = next.onerror = null;
    if (prepared.get(url) !== entry) return;
    prepared.delete(url);
    failed.add(url);
   }
   next.onerror = reject;
   next.onload = async () => {
    try {
     if (next.decode) await next.decode();
     if (!next.naturalWidth) throw new Error('Imagen vacía');
     clearTimeout(timeout);
     next.onload = next.onerror = null;
     if (prepared.get(url) === entry) entry.ready = true;
    } catch {
     reject();
    }
   };
   next.src = url;
  }
 }
 function refresh(time) {
  if (time - checkedAt < 250) return;
  checkedAt = time;
  const nextUrls = [...new Set(getProjects().map(project => {
   const cover = project.images?.[0];
   return cover?.preview ?? cover?.url ?? cover;
  }).filter(url => typeof url === 'string' && url))];
  const key = JSON.stringify(nextUrls);
  if (key !== catalogKey) {
   catalogKey = key;
   urls = nextUrls;
   cursor = 0;
   for (const url of prepared.keys()) {
    if (!urls.includes(url)) prepared.delete(url);
   }
  }
 }
 function change() {
  const ready = [...prepared].filter(([,entry]) => entry.ready);
  if (!ready.length) return;
  const [url, entry] = ready[Math.floor(Math.random()*ready.length)];
  // Swap the already decoded element. Keep the current image until this point.
  entry.image.style.transform = `translate3d(${x}px,${y}px,0)`;
  entry.image.hidden = false;
  image.replaceWith(entry.image);
  image = entry.image;
  current = url;
  prepared.delete(url);
 }
 function tick(time) {
  frame=0;
  if (page.hidden || document.hidden || !mobileLayout.matches || reduced.matches) {
   image.hidden=true;
   last=0;
   return;
  }
  refresh(time);
  preload();
  if (!current) change();
  image.hidden=!current;
  const dt=Math.min((time-(last||time))/1000,.04);
  last=time;
  const maxX=Math.max(0,document.documentElement.clientWidth-image.offsetWidth);
  const maxY=Math.max(0,innerHeight-image.offsetHeight);
  let hit=false;
  x+=vx*dt;
  y+=vy*dt;
  if (maxX && (x<0 || x>maxX)) {
   vx=(x<0?1:-1)*(55+Math.random()*50);
   hit=true;
  }
  if (maxY && (y<0 || y>maxY)) {
   vy=(y<0?1:-1)*(55+Math.random()*50);
   hit=true;
  }
  x=Math.max(0,Math.min(x,maxX));
  y=Math.max(0,Math.min(y,maxY));
  image.style.transform=`translate3d(${x}px,${y}px,0)`;
  if(hit) change();
  frame=requestAnimationFrame(tick);
 }
 function sync() {
  if(!frame && !page.hidden && !document.hidden && mobileLayout.matches && !reduced.matches) frame=requestAnimationFrame(tick);
 }
 new MutationObserver(sync).observe(page,{attributes:true,attributeFilter:['hidden']});
 mobileLayout.addEventListener('change',sync);
 reduced.addEventListener('change',sync);
 document.addEventListener('visibilitychange',sync);
 sync();
}
