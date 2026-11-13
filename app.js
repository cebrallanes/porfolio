import {installWorkScrollPreview} from './work-scroll-preview.js';
import {installLabelSpacing} from './label-spacing.js';
import {mobileLayout, mobileType} from './mobile-layout.js';
import {installMobileBounce} from './mobile-bounce.js?v=ajustes-1';
import {installMobileMap} from './mobile-map.js?v=ajustes-2';
import {projects as sampleProjects} from './data.js?v=more-samples';
import {sanityConfig} from './sanity-config.js?v=production-1';
import {loadSanityProjects} from './sanity-projects.js';
import {renderHome} from './home.js?v=label-spacing';
import {fitLargeInk, setCaptionDescent} from './type-ink.js';
import {initializeBio,resetBio,fitBioType} from './bio.js?v=mobile-3';
import {installTextOverlap} from './type-overlap.js?v=mobile-1';
import {installContactBoxes, renderMobileLinks} from './links.js?v=mobile-rows';
import {installHomeEdgeScroll} from './home-edge-scroll.js?v=mobile-1';
import {installImageTrail} from './image-trail.js?v=ajustes-1';
import {statementPhotos} from './statement-photos.js?v=1';
import {installIllustratedMap} from './illustrated-map.js';
const $=s=>document.querySelector(s);
let projects = sanityConfig.projectId ? [] : sampleProjects;
let catalogStatus = sanityConfig.projectId ? 'idle' : 'ready';
const selected={types:new Set(),years:new Set()};
let openId=null,mode='image';const slides=new Map();
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function matches(p,types,years){return(!types.size||types.has(p.type))&&(!years.size||years.has(String(p.year)));}
function renderFilterOptions(){
 const types = [...new Set(projects.map(project => project.type))].sort((a,b) => a.localeCompare(b,'es'));
 const years = [...new Set(projects.map(project => project.year))].sort((a,b) => b-a);
 for(const [key, values] of Object.entries({types, years})){
  $(`#${key}-toggle`).disabled = !values.length;
  $(`#${key}`).innerHTML = values.map(value => `<label><input type="checkbox" value="${escape(value)}"><span class="checkmark" aria-hidden="true"><span>[</span><span class="check-x">x</span><span>]</span></span><span>${escape(value)}</span></label>`).join('');
 }
}
function initializeFilters(){
 for(const key of Object.keys(selected)){
  const options = $(`#${key}`), toggle = $(`#${key}-toggle`);
  options.addEventListener('change',event=>{
   const {checked,value}=event.target;
   checked ? selected[key].add(value) : selected[key].delete(value);
   render();
  });
  toggle.addEventListener('click',()=>{
   options.hidden=!options.hidden;
   toggle.setAttribute('aria-expanded',String(!options.hidden));
  });
 }
 renderFilterOptions();
}
async function loadCatalog(){
 if(catalogStatus==='ready'||catalogStatus==='loading') return;
 catalogStatus='loading';
 render();
 try{
  projects=await loadSanityProjects(sanityConfig);
  catalogStatus='ready';
  renderFilterOptions();
 }catch(error){
  catalogStatus='error';
  console.error(error);
 }
 render();
 if(currentPage()==='obra') openLinkedProject();
}
function render(){const list=projects.filter(p=>matches(p,selected.types,selected.years));if(!list.some(p=>p.id===openId))openId=null;$('#projects').innerHTML=list.map(p=>{const active=openId===p.id,full=active&&mode==='full',hasText=Boolean(p.description?.trim() || p.credits?.trim()),expanded=active&&(full||!hasText),slide=slides.get(p.id)||0,image=p.images[slide],cover=p.images[0];return `<article class="project${active?' active':''}" data-id="${escape(p.id)}"><div class="project-head"><button class="row-open" aria-expanded="${active}" aria-controls="detail-${escape(p.id)}" aria-label="${active?'Cerrar':'Abrir imagen de'} ${escape(p.title)}"><span class="project-name"><span class="arrow" aria-hidden="true">&gt;</span>${escape(p.title)}</span><span class="project-type">${escape(p.type)}</span><span class="project-year">${p.year}</span><span class="project-client">${escape(p.client)}</span></button><button class="more bracket" aria-expanded="${expanded}" aria-controls="detail-${escape(p.id)}">${expanded?'Ver menos':'Ver más'}</button></div>${active?`<div class="detail" id="detail-${escape(p.id)}"><div class="media"><img src="${escape(image.url ?? image)}" alt="${escape(image.alt ?? `Composición gráfica de muestra ${slide+1}`)}" width="600" height="760">${p.images.length>1?`<div class="gallery-controls"><button class="prev" aria-label="Imagen anterior" >&lt; Anterior</button><span class="count">${slide+1} / ${p.images.length}</span><button class="next" aria-label="Imagen siguiente" >Siguiente &gt;</button></div>`:''}</div>${full&&hasText?`<div class="description"><p>${escape(p.description).replace(/\r?\n/g,'<br>')}</p><small>${escape(p.credits)}</small></div>`:''}</div>`:`<img class="project-preview" src="${escape(cover.preview ?? cover.url ?? cover)}" alt="" loading="lazy" width="120" height="160">`}</article>`;}).join('');const empty=$('#empty');
 empty.hidden=list.length>0;
 if(!empty.hidden){
  const messages={idle:'Cargando proyectos…',loading:'Cargando proyectos…',error:'No se pudieron cargar los proyectos. Volvé a abrir Obra para reintentar.'};
  empty.textContent=messages[catalogStatus] ?? (projects.length ? 'No hay proyectos con esta combinación de filtros.' : 'Todavía no hay proyectos publicados.');
 }const filtered=selected.types.size+selected.years.size>0;$('#clear').hidden=!filtered;}
$('#projects').addEventListener('click',e=>{const button=e.target.closest('button'),article=e.target.closest('.project');if(!button||!article)return;const id=article.dataset.id,p=projects.find(p=>p.id===id);if(!p)return;let focusClass;if(button.matches('.row-open')){openId=openId===id?null:id;mode='image';focusClass='.row-open';}else if(button.matches('.more')){if(openId===id&&(mode==='full'||!(p.description?.trim() || p.credits?.trim())))openId=null;else{openId=id;mode='full';}focusClass='.more';}else if(button.matches('.prev,.next')){const next=((slides.get(id)||0)+(button.matches('.next')?1:-1)+p.images.length)%p.images.length;slides.set(id,next);focusClass=button.matches('.next')?'.next':'.prev';}render();const focus=$(`[data-id="${CSS.escape(id)}"] ${focusClass}`);if(focus&&!focus.disabled)focus.focus({preventScroll:true});});
$('#clear').addEventListener('click',()=>{selected.types.clear();selected.years.clear();document.querySelectorAll('.options input').forEach(i=>i.checked=false);render();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.options').forEach(el=>{el.hidden=true;$(`#${el.id}-toggle`).setAttribute('aria-expanded','false');});}});
const pageTitles={inicio:'Inicio',bio:'Biografía','bio-ilustrada':'Mi pequeña biografía ilustrada',obra:'Obra',statement:'Declaración de artista',links:'Enlaces'};
function navigate(page){
 const home=page==='inicio';
 const bio=page==='bio';
 const statement=page==='statement';
 const illustrated=page==='bio-ilustrada';
 document.body.classList.toggle('home-view',home);
 document.body.classList.toggle('bio-view',bio);
 document.body.classList.toggle('illustrated-view',illustrated);
 document.body.classList.toggle('statement-view',statement);
 document.body.classList.toggle('links-view',page==='links');
 document.body.classList.toggle('work-view',page==='obra');
 $('#home-page').hidden=!home;
 $('#obra').hidden=page!=='obra';
 $('#bio-page').hidden=!bio;
 $('#illustrated-page').hidden=!illustrated;
 if(illustrated){
  $('.illustrated-map').scrollTop=0;
  setCaptionDescent($('.mobile-story-controls'));
 }
 $('#statement-page').hidden=!statement;
 $('#links-page').hidden=page!=='links';
 document.querySelectorAll('header [data-page]').forEach(b=>{
  b.removeAttribute('aria-current');
  if(b.dataset.page===page)b.setAttribute('aria-current','page');
 });
 if(bio){resetBio();setCaptionDescent($('.bio-display'));}
 const composition={statement:'.statement-composition',links:'.links-composition','bio-ilustrada':'.illustrated-heading'}[page];
 if(composition)setCaptionDescent($(composition));
 if(page==='links')setCaptionDescent($('.links-mobile-composition'));
 document.title=pageTitles[page]+' — Cebra';
 window.scrollTo(0,0);
 if(page==='obra')openLinkedProject();
 if(home || page==='obra')loadCatalog();
}
function openLinkedProject(){
 const prefix='#obra/';
 if(!location.hash.startsWith(prefix)) return;
 const target=location.hash.slice(prefix.length);
 const project=projects.find(item=>encodeURIComponent(item.id)===target);
 if(!project) return;
 selected.types.clear();
 selected.years.clear();
 document.querySelectorAll('.options input').forEach(input=>{input.checked=false;});
 openId=project.id;
 mode='full';
 slides.set(project.id,0);
 render();
 const row=$(`[data-id="${CSS.escape(project.id)}"] .row-open`);
 row.focus({preventScroll:true});
 row.scrollIntoView({block:'start'});
}
function currentPage(){
 const hash=location.hash.slice(1);
 if(hash.startsWith('obra/'))return 'obra';
 return Object.hasOwn(pageTitles,hash)?hash:'inicio';
}
document.querySelectorAll('header [data-page]').forEach(b=>b.addEventListener('click',()=>{location.hash=b.dataset.page;}));
$('#home').addEventListener('click',()=>{location.hash='inicio';});
window.addEventListener('hashchange',()=>navigate(currentPage()));
function fitEditorialType(){
 const size=mobileLayout.matches?mobileType.large:94.41;
 for(const word of document.querySelectorAll('.statement-word, .links-large, .illustrated-word'))fitLargeInk(word,'0px',size);
 for(const composition of document.querySelectorAll('.statement-composition, .links-composition, .links-mobile-composition, .illustrated-heading'))setCaptionDescent(composition);
}
renderMobileLinks($('#links-page'));
fitEditorialType();
mobileLayout.addEventListener('change',()=>{
 fitEditorialType();
 fitBioType();
 fitWorkTitle();
 renderHome();
});
const workTitle=$('#title');
workTitle.setAttribute('aria-label', workTitle.textContent);
function fitWorkTitle(){
 const size=mobileLayout.matches?mobileType.large:94.41;
 fitLargeInk(workTitle,getComputedStyle(workTitle).letterSpacing,size);
}
fitWorkTitle();

initializeFilters();render();renderHome();initializeBio();navigate(currentPage());

function fitFilterLabels(){
 const context=document.createElement('canvas').getContext('2d');context.font='400 12px Arial';
 for(const el of document.querySelectorAll('.obra-meta > span, .obra-meta > .filter > button, #clear')){
  const text=el.textContent, m=context.measureText(text);
  el.classList.add('tight-label');
  el.style.setProperty('--ink-height',`${m.actualBoundingBoxAscent+m.actualBoundingBoxDescent}px`);
  const baseline=(12-m.fontBoundingBoxAscent-m.fontBoundingBoxDescent)/2+m.fontBoundingBoxAscent;
  el.style.setProperty('--ink-top',`${m.actualBoundingBoxAscent-baseline}px`);
  el.innerHTML=`<span class="label-ink">${escape(text)}</span>`;
 }
}
fitFilterLabels();
installMobileMap($('.illustrated-map'));
installLabelSpacing();
installWorkScrollPreview($('#obra'));
installTextOverlap($('#bio-page'), '.bio-ink svg',
 '.bio-row > :not(.bio-ink), .bio-meta > span, .bio-panel-tools button, #bio-panel p',
 {scrollTargets: [$('#bio-panel')], changingContent: $('#bio-panel')});
installTextOverlap($('#statement-page'), '.statement-word svg',
 '.statement-composition > :not(.statement-word), .statement-page-number, .statement-reading h2, .statement-footer > *');
installTextOverlap($('#obra'), '#title svg',
 '.obra-meta > span, .obra-meta .filter > button, #clear, .options label');
installTextOverlap($('#links-page'), '.links-large svg',
 '.links-row > :not(.links-large):not(.mobile-contact), .links-page-number');
installContactBoxes($('#links-page'));

installTextOverlap($('#illustrated-page'), '.illustrated-word svg',
 '.illustrated-heading > :not(.illustrated-word)');
installIllustratedMap($('.illustrated-map'));
installImageTrail($('#home-page'), () => projects);
installHomeEdgeScroll($('#home-page'));

const statementTrail = statementPhotos.map(path => ({images: [path]}));
installImageTrail($('#statement-page'), () => statementTrail, {linkProjects: false});

installMobileBounce($('#home-page'),()=>projects);
installMobileBounce($('#statement-page'),()=>statementTrail);
