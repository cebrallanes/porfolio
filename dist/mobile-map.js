import {stories} from './illustrated-map.js';
import {mobileLayout} from './mobile-layout.js';

export function installMobileMap(map) {
 const story=document.createElement('section');
 story.className='mobile-only mobile-map-stories';
 story.setAttribute('aria-label','Relatos de Mundo Potolitis');
 story.innerHTML='<div class="mobile-story-controls"><button type="button">&lt; Anterior</button><span></span><button type="button">Siguiente &gt;</button></div><div class="mobile-story" aria-live="polite"><p></p></div>';
 map.after(story);
 const [prev,next]=story.querySelectorAll('button');
 let index=0;
 function show(step) {
  index=(index+step+stories.length)%stories.length;
  story.querySelector('.mobile-story-controls span').textContent=`${index+1} / ${stories.length}`;
  story.querySelector('p').textContent=stories[index].text;
 }
 prev.onclick=()=>show(-1);
 next.onclick=()=>show(1);
 show(0);

 const art=map.querySelector('.illustrated-art');
 let zoom=1;
 function setZoom(value,x=map.clientWidth/2,y=map.clientHeight/2) {
  const next=Math.max(1,Math.min(6,value));
  const ratio=next/zoom;
  const left=(map.scrollLeft+x)*ratio-x;
  const top=(map.scrollTop+y)*ratio-y;
  zoom=next;
  art.style.setProperty('--map-zoom',`${zoom*100}%`);
  map.scrollLeft=left;
  map.scrollTop=top;
 }
 // Double click or double tap zooms around the selected point.
 map.addEventListener('dblclick', event => {
  if (map.hasAttribute('data-pinching')) return;
  event.preventDefault();
  const rect = map.getBoundingClientRect();
  setZoom(zoom > 1 ? 1 : 2, event.clientX - rect.left, event.clientY - rect.top);
 });
 // Trackpad pinch and Ctrl + wheel zoom the map instead of the whole page.
 map.addEventListener('wheel', event => {
  if (mobileLayout.matches || !(event.ctrlKey || event.metaKey)) return;
  event.preventDefault();
  const rect = map.getBoundingClientRect();
  const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? map.clientHeight : 1);
  setZoom(zoom * Math.exp(-pixels * 0.01), event.clientX - rect.left, event.clientY - rect.top);
 }, {passive: false});
 const points=new Map();
 const distance=([a,b])=>Math.hypot(b.x-a.x,b.y-a.y);
 map.addEventListener('pointerdown',e=>{
  if(e.button!==0 || e.target.closest('button, .illustrated-story'))return;
  if(!mobileLayout.matches && zoom===1)return;
  if (!points.size) delete map.dataset.pinching;
  map.setPointerCapture(e.pointerId);
  points.set(e.pointerId,{x:e.clientX,y:e.clientY});
 });
 map.addEventListener('pointermove',e=>{
  const old=points.get(e.pointerId);
  if(!old)return;
  const before=[...points.values()];
  points.set(e.pointerId,{x:e.clientX,y:e.clientY});
  const after=[...points.values()];
  if(after.length===2 && distance(before)>0){
   map.dataset.pinching = "";
   const rect=map.getBoundingClientRect();
   const midpoint=(items,axis)=>(items[0][axis]+items[1][axis])/2;
   setZoom(zoom*distance(after)/distance(before),midpoint(before,'x')-rect.left,midpoint(before,'y')-rect.top);
   map.scrollLeft+=midpoint(before,'x')-midpoint(after,'x');
   map.scrollTop+=midpoint(before,'y')-midpoint(after,'y');
  } else if(after.length===1) {
   map.scrollLeft+=old.x-e.clientX;
   map.scrollTop+=old.y-e.clientY;
  }
 });
 for(const name of ['pointerup','pointercancel','lostpointercapture'])map.addEventListener(name,e=>points.delete(e.pointerId));
 map.querySelector('img').draggable=false;
}
