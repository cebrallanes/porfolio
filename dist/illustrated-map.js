// Regions and card anchors measured against the same view of the Figma artwork.
// The lower regions include the map's 207 px scroll offset in that view.
const artwork = {left: 14, top: 265, width: 869, height: 578};
export const stories = [
 {
  label: 'Nacimiento', area: [165, 306, 332, 411], anchor: [40, 319],
  text: 'Llego al mundo durante una noche de San Juan en un hospital de Montevideo, hija de Verónica e Ignacio, a sus dieciocho años.'
 },
 {
  label: 'Cuchilla de Machín', area: [293, 308, 399, 386], anchor: [333, 269],
  text: 'A la mañana siguiente, en Cuchilla de Machín, mi familia se reunía en el que sería mi hogar, sin ellos y sin mí, a celebrar la llegada de su primera bisnieta, nieta o sobrina, según quién.'
 },
 {
  label: 'El almacén', area: [198, 350, 457, 496], anchor: [107, 392],
  text: 'Crezco junto a mamá, mi abuela Blanca, mi abuelo Luis, mi tía Ana Laura y mi tío Danilo, atendiendo su almacén y celebrando los parciales aprobados de mi madre con grandes fiestas de papel picado.'
 },
 {
  label: 'Mudanza a Montevideo', area: [269, 425, 642, 586], anchor: [329, 440],
  shape: 'polygon(50% 0, 100% 0, 100% 57%, 50% 57%, 50% 100%, 0 100%, 0 44%, 50% 44%)',
  text: 'Me mudo junto a mi madre y mi padre a Montevideo, al hogar al que más tarde se sumarían mi hermano canino, Atto, y mi hermana de mi misma especie, Lucía.'
 },
 {
  label: 'Las escuelas', area: [411, 519, 768, 647], anchor: [476, 609],
  text: 'Asisto primero a la Escuela N° 36 Bélgica, luego al Colegio Erick Erickson, al Colegio Inmaculada Concepción de las Hermanas Alemanas, y por último al Colegio Sagrada Familia.'
 },
 {
  label: 'Descubrir el dibujo', area: [252, 586, 411, 708], anchor: [188, 497],
  text: 'En mi segunda parada, descubro en el dibujo mi más grande entretenimiento, cuando nos piden que ilustremos nuestra parte favorita del cuento “Una tía rompible”, de Roy Berocay.'
 },
 {
  label: 'El taller de Hogue', area: [208, 586, 326, 724], anchor: [126, 663],
  text: 'Tiempo después asisto al taller del caricaturista uruguayo Hogue, y cuando me entero de que su nombre real es Horacio Guerreiro, decido copiarle el chiste.'
 },
 {
  label: 'Bachillerato Artístico', area: [57, 586, 208, 724], anchor: [23, 510],
  text: 'Con muchos años de antelación anuncio a mi familia: “cuando vaya al liceo voy a hacer el Bachillerato Artístico”. Para mi sorpresa, no se sorprende nadie.'
 },
 {
  label: 'La tableta gráfica', area: [403, 616, 721, 740], anchor: [440, 522],
  text: 'Para mis dieciocho años, recibo un maravilloso regalo: una tableta gráfica. Un dibujo que hago con ella gana un premio que me permite estudiar la Licenciatura en Artes Visuales con una beca.'
 },
 {
  label: 'La escena artística local', area: [313, 710, 722, 793], anchor: [432, 625],
  text: 'A la vez que completo mis estudios, descubro la escena artística underground de mi ciudad acompañando a mi pareja y músico emergente, Samuel Acosta. Allí, incursiono en la creación de arte gráfico y audiovisual para la música, la literatura y el cine independiente local, dando inicio a mi carrera como artista visual.'
 },
 {
  label: 'Anécdotas familiares y barriales', area: [704, 617, 863, 752], anchor: [525, 552],
  text: 'En el plano personal, doy comienzo a un recorrido por las anécdotas familiares y barriales, con el sueño de dejar registro de todas las pequeñas historias que el tiempo me permita ilustrar o fotografiar, firme en la creencia de que son tan valiosas como la historia oficial. Por este camino, continúo.'
 }
];

export function installIllustratedMap(map) {
 const art = map.querySelector('.illustrated-art');
 let active = null;
 let pinned = false;

 function position() {
  if (!active || !map.clientHeight) return;
  const {card, anchor} = active;
  const x = (anchor[0] - artwork.left) / artwork.width * art.clientWidth;
  const y = (anchor[1] - artwork.top) / artwork.height * art.clientHeight;
  card.style.maxHeight = `${map.clientHeight}px`;
  card.style.left = `${Math.min(x, art.clientWidth - card.offsetWidth)}px`;
  card.style.top = `${Math.max(map.scrollTop, Math.min(y, map.scrollTop + map.clientHeight - card.offsetHeight))}px`;
 }

 function close() {
  if (!active) return;
  active.card.hidden = true;
  active.card.classList.remove('is-pinned');
  active.button.setAttribute('aria-expanded', 'false');
  active = null;
  pinned = false;
 }

 function show(story, pin = false) {
  if (active !== story) close();
  active = story;
  pinned = pin;
  story.button.setAttribute('aria-expanded', 'true');
  story.card.hidden = false;
  story.card.classList.toggle('is-pinned', pin);
  position();
 }

 for (const [index, story] of stories.entries()) {
  const button = document.createElement('button');
  const card = document.createElement('p');
  const [left, top, right, bottom] = story.area;
  const id = `illustrated-story-${index + 1}`;
  button.type = 'button';
  button.className = 'illustrated-hotspot';
  button.setAttribute('aria-label', story.label);
  button.setAttribute('aria-controls', id);
  button.setAttribute('aria-describedby', id);
  button.setAttribute('aria-expanded', 'false');
  button.style.left = `${(left - artwork.left) / artwork.width * 100}%`;
  button.style.top = `${(top - artwork.top) / artwork.height * 100}%`;
  button.style.width = `${(right - left) / artwork.width * 100}%`;
  button.style.height = `${(bottom - top) / artwork.height * 100}%`;
  if (story.shape) button.style.clipPath = story.shape;
  card.id = id;
  card.className = 'illustrated-story';
  card.textContent = story.text;
  card.hidden = true;
  art.append(button, card);

  const entry = {button, card, anchor: story.anchor};
  button.addEventListener('pointerenter', event => {
   if (!pinned && event.pointerType === 'mouse') show(entry);
  });
  button.addEventListener('pointerleave', () => {
   if (!pinned && active === entry && !button.matches(':focus-visible')) close();
  });
  button.addEventListener('focus', () => {
   if (button.matches(':focus-visible')) show(entry);
  });
  button.addEventListener('blur', () => {
   if (active === entry && !pinned && !button.matches(':hover')) close();
  });
  button.addEventListener('click', () => {
   if (active === entry && pinned) close();
   else show(entry, true);
  });
 }

 document.addEventListener('pointerdown', event => {
  if (active && !event.target.closest('.illustrated-hotspot, .illustrated-story')) close();
 });
 document.addEventListener('keydown', event => {
  if (event.key === 'Escape') close();
 });
 window.addEventListener('hashchange', close);
 map.addEventListener('scroll', position, {passive: true});
 const observer = new ResizeObserver(position);
 observer.observe(map);
 observer.observe(art);
}
