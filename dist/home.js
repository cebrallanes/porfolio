import {spaceLabels} from './label-spacing.js';
import {mobileLayout, mobileType} from './mobile-layout.js';
import {fitLargeInk, ink, measure} from './type-ink.js';

// Coordinates follow the ten-column desktop grid in Dsk Prototype.
const blocks = [
 [['Cecilia',1],['Victoria',6],['Braña',3],['Llanes',7],['Cairús',4],['Testa',1],['Gorostiaga',-10],['Ottón',3],['Bertón',5],['Testa',4],['Aramburú',-10],['Umpiérrez',2],['Cairús',6]],
 [['Cuasini',1],['Prince',6],['Protazonio',4],['Villarreal',-9],['Corujo',4],['Cereijo',1],['Blengio',-9],['Gay',3],['Sochi',5],['Bengochea',3],['[?]',-10],['Bertalot',2],['Scampini',6]],
 [['Ubiría',1],['Sande',6],['Tourn',3],['Testa',7],['Montenegro',4],['[?]',1],['Pizzala',-9],['Valdés',3],['Mirazzo',5],['Introini',4],['Michelín',-10],['Colombo',2],['de Olalde',6]],
 [['Rivoire',1],['[?]',6],['Colombo',2],['Méndez',-9],['Sosa',4],['Bertinat',1],['Entruinne',-10],['Milazzo',3],['[?]',5],['Flores',4],['Birriel',-10],['[?]',2],['Fontana',6]],
 [['Grill',1],['Cugliota',6],['Gorosterrazú',1],['[?]',7],['Gilles',4],['Scampini',1],['Yrazoqui',-9],['Arbelo',3],['Besson',5],['Colombo',4],['Fernández',-10],['Batocci',2],['Berruti',6]],
];
const destinations = [['bio','Biografía'],['obra','Obra'],['statement','Declaración de artista'],['links','Enlaces']];
const smallLabels = [
 ['Porfolio digital',1,5,'top'],['“Cebra”',1,4],['Artista visual y gráfica',2,9],
 ['2003',3,1],['Cuchilla de Machín',3,5],['Canelones',3,7],['Uruguay',3,10],
 ['Licenciada en Artes Visuales',4,1],['Diplomada en Gestión Cultural',4,3],
 ['Diseño gráfico',6,6],['Ilustración',7,4],['Fotografía',7,5],
 ['Video',9,3],['Arte contemporáneo',10,7],['“Cebra”',11,6],
 ['©2026',13,1],['Montevideo',13,3],['@cebrallanes',13,-10,'top'],
];
const labelColumns = [
 {},
 {'Cuchilla de Machín':3,'Canelones':8},
 {},
 {},
 {'2003':5,'Cuchilla de Machín':6,'Canelones':8},
];
const esc = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function placement(col){
 return `grid-column:${Math.abs(col)};justify-self:${col<0?'end':'start'}`;
}
let smallSize=12, largeSize=94.41, textGap=20, bracketTravel=3.6, homeObserver;
const mobileColumns=[1,6,3,6,4,1,-10,3,4,3,4,1,-10];
function baseline(text,top=false){
 const metrics=measure(text,smallSize);
 return top
  ? `margin-top:${topBaseline()-metrics.actualBoundingBoxAscent}px`
  : `margin-bottom:${-metrics.actualBoundingBoxDescent}px`;
}
const pageLabels=['Página',...destinations.map((_,i)=>`[${i+1}]`)];
const topBaseline=()=>Math.max(...['Porfolio digital',...pageLabels]
 .map(text=>measure(text,smallSize).actualBoundingBoxAscent));
function pages(top){
 const numbered=destinations.map(([id,label],i)=>`<a class="home-ink home-link" href="#${id}" aria-label="${label}" style="${baseline(`[${i+1}]`,top)}">${ink(String(i+1),smallSize,true)}</a>`);
 return `<nav class="home-pages ${top?'top':''}" aria-label="Páginas"><span class="home-ink" role="img" aria-label="Página" style="${baseline('Página',top)}">${ink('Página',smallSize)}</span><span>${numbered[0]}${numbered[1]}</span><span>${numbered[2]}${numbered[3]}</span></nav>`;
}

function renderRow(text,col,row,columns){
 const labels=smallLabels.filter(([,labelRow])=>labelRow===row);
 const destination=destinations[row-7];
 const hasPages=[1,5,9].includes(row);
 const positions=labels.map(([label, ,preferredColumn,edge])=>{
  const column=columns[label]??preferredColumn;
  const alignment=edge==='top'&&row!==1?'':baseline(label,edge==='top');
  return `<span class="home-ink home-label ${edge||''}" style="${placement(column)};${alignment}" role="img" aria-label="${esc(label)}">${ink(label,smallSize)}</span>`;
 }).join('');
 const sectionLink=destination
  ? `<a class="home-ink home-link home-section-link" href="#${destination[0]}" aria-label="${destination[1]}" style="${baseline(`[${destination[1]}]`)}">${ink(destination[1],smallSize,true)}</a>`
  : '';
 return `<div class="home-row">
  <span class="home-ink home-name" style="${placement(col)}" role="img" aria-label="${esc(text)}">${esc(text)}</span>
  ${sectionLink}
  ${positions}
  ${hasPages?pages(row===1):''}
 </div>`;
}

const svgNamespace='http://www.w3.org/2000/svg';

function addOverlapLayer(element,nameId,maskId){
 const svg=element.querySelector('svg');
 const mask=document.createElementNS(svgNamespace,'mask');
 mask.id=maskId;
 mask.setAttribute('maskUnits','userSpaceOnUse');
 mask.setAttribute('mask-type','alpha');
 // Leave room for the brackets to move on hover and keyboard focus.
 mask.setAttribute('x','-4');
 mask.setAttribute('y','0');
 mask.setAttribute('width',Number(svg.getAttribute('width'))+8);
 mask.setAttribute('height',svg.getAttribute('height'));
 const silhouette=document.createElementNS(svgNamespace,'use');
 silhouette.setAttribute('href',`#${nameId}`);
 silhouette.setAttribute('font-size',largeSize);
 mask.append(silhouette);

 const layer=document.createElementNS(svgNamespace,'g');
 layer.setAttribute('class','home-overlap');
 layer.setAttribute('mask',`url(#${maskId})`);
 layer.append(...[...svg.children].map(glyph=>glyph.cloneNode(true)));
 svg.append(mask,layer);
 return {silhouette,layer};
}

// Reserve the opening on both sides of adjacent page numbers at rest.
function gapBetween(first,second){
 return textGap+(first?.pageNumber||second?.pageNumber?2*bracketTravel:0);
}

function layoutSmallText(items,bounds,atTop){
 const lines=[];
 let line=[];
 let width=0;
 for(const item of items){
  const gap=gapBetween(line.at(-1),item);
  if(line.length&&width+gap+item.width>bounds.width){
   lines.push(line);
   line=[];
   width=0;
  }
  width+=(line.length?gap:0)+item.width;
  line.push(item);
 }
 if(line.length) lines.push(line);
 const lineHeight=Math.max(0,...items.map(item=>item.height));
 for(const [index,line] of lines.entries()){
  spaceLabels(line,bounds,gapBetween);
  for(const item of line)item.y=(atTop?index:index-lines.length+1)*(lineHeight+textGap);
  for(const [index,item] of line.entries()){
   const previous=line[index-1];
   const next=line[index+1];
   const leftRoom=previous?(item.x-previous.x-previous.width-textGap)/2:bracketTravel;
   const rightRoom=next?(next.x-item.x-item.width-textGap)/2:bracketTravel;
   item.hoverLeft=item.pageNumber?Math.min(leftRoom,rightRoom):leftRoom;
   item.hoverRight=item.pageNumber?item.hoverLeft:rightRoom;
  }
 }
 return lines.length?lines.length*(lineHeight+textGap)-textGap:0;
}

export function renderHome(){
 homeObserver?.disconnect();
 const mobile=mobileLayout.matches;
 smallSize=mobile?mobileType.small:12; largeSize=mobile?mobileType.large:94.41;
 textGap=mobile?10:20; bracketTravel=mobile?0:3.6;
 const target=document.querySelector('#home-blocks');
 target.innerHTML=blocks.map((names,index)=>`<section class="home-block" aria-label="Bloque ${index+1}">
  ${names.map(([text,col],i)=>renderRow(text,mobile&&index===0?mobileColumns[i]:col,i+1,mobile?{}:labelColumns[index])).join('')}
 </section>`).join('');
 const rows=[...target.querySelectorAll('.home-row')].map((row,index)=>{
  const [name,...labels]=row.querySelectorAll('.home-ink');
  fitLargeInk(name,'0px',largeSize);
  const nameId=`home-silhouette-${index}`;
  name.querySelector('text').id=nameId;
  const captions=labels.map((element,labelIndex)=>({
   element,
   top:Boolean(element.closest('.top')),
   pageNumber:element.matches('.home-pages a'),
   ...addOverlapLayer(element,nameId,`home-overlap-${index}-${labelIndex}`),
  }));
  const nav=mobile?row.querySelector('.home-pages'):null;
  // Lay out mobile navigation as one box to keep its internal spacing fixed.
  const items=[{element:name},...captions.filter(({element})=>!nav?.contains(element))];
  if(nav)items.push({element:nav,top:nav.classList.contains('top')});
  return {row,items,captions};
 });
 const observer=new ResizeObserver(()=>{
  const bounds=target.getBoundingClientRect();
  if(!bounds.width) return;
  for(const {items} of rows){
   for(const item of items){
    const box=item.element.getBoundingClientRect();
    item.left=box.left-(parseFloat(item.element.style.translate)||0);
    item.width=box.width;
    item.height=box.height;
   }
  }
  for(const {row,items} of rows){
   const [name,...small]=items;
   const top=layoutSmallText(small.filter(item=>item.top),bounds,true);
   const bottom=layoutSmallText(small.filter(item=>!item.top),bounds,false);
   const minHeight=top+bottom+(top&&bottom?textGap:0);
   row.style.minHeight=minHeight?`${minHeight}px`:'';
   name.x=Math.min(name.left,bounds.right-name.width);
   name.y=0;
   for(const {element,x,y,left,hoverLeft,hoverRight} of items){
    element.style.translate=x===left&&y===0?'':`${x-left}px ${y}px`;
    if(element.matches('a')){
     element.style.setProperty('--hover-left',`${Math.max(0,Math.min(bracketTravel,hoverLeft))}px`);
     element.style.setProperty('--hover-right',`${Math.max(0,Math.min(bracketTravel,hoverRight))}px`);
    }
   }
  }
  for(const {items,captions} of rows){
   const [name]=items;
   const nameBox=name.element.querySelector('svg').getBoundingClientRect();
   for(const {element,silhouette,layer} of captions){
    const box=element.getBoundingClientRect();
    const overlaps=box.left-4<nameBox.right&&box.right+4>nameBox.left
     &&box.top<nameBox.bottom&&box.bottom>nameBox.top;
    layer.style.display=overlaps?'':'none';
    if(overlaps){
     silhouette.setAttribute('x',nameBox.left-box.left);
     silhouette.setAttribute('y',nameBox.top-box.top);
    }
   }
  }
 });
 observer.observe(target);
 homeObserver=observer;
}
