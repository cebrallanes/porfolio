import {mobileLayout} from './mobile-layout.js';

export function installMobileBounce(page, getProjects) {
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const image = document.createElement('img');
 image.className = 'mobile-bounce';
 image.alt = '';
 image.hidden = true;
 page.append(image);
 let x=10, y=80, vx=73, vy=91, last=0, frame=0;
 let current='';
 function change() {
  const urls = [...new Set(getProjects().map(project=>project.images[0]).filter(Boolean))];
  const alternatives=urls.filter(url=>url!==current);
  if (!alternatives.length) return;
  current=alternatives[Math.floor(Math.random()*alternatives.length)];
  image.src=current;
 }
 function tick(time) {
  frame=0;
  if (page.hidden || document.hidden || !mobileLayout.matches || reduced.matches) {
   image.hidden=true;
   last=0;
   return;
  }
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
