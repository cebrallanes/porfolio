import {mobileLayout, mobileType} from './mobile-layout.js';
import {fitLargeInk, setCaptionDescent} from './type-ink.js';

const topics = [
 ['Biografía', `
  <p class="bio-text-intro">Soy una artista visual emergente basada en Montevideo, Uruguay. Soy Licenciada en Artes Visuales y Diplomada en Gestión Cultural por la Universidad Católica del Uruguay.</p>
  <p class="bio-text-right">Mi práctica abarca las áreas del diseño gráfico, la ilustración y la fotografía, con breves exploraciones sobre el espacio. Trabajo como artista gráfica enfocada a la comunicación visual y cultural. En el plano artístico, abordo la memoria íntima o colectiva como punto de partida para mi producción.</p>
  <p class="bio-text-columns bio-text-break">Entre mis trabajos destaco: el diseño gráfico realizado para el proyecto Mienten, estaban Ahí (2025) en integración con el colectivo Imágenes del Silencio; los retratos ilustrados de José Luis Pelúa Pereira y Óscar Tassino, publicados en el libro 197 historias ilustradas (2024) y expuestos en la muestra El Color de la Memoria del Centro de Exposiciones SUBTE (2025); el sistema de identidad visual para Indieween, festival de música emergente (2023, 2024, 2025); y finalmente, la obra Una casa que era linda, expuesta en la exhibición colectiva ¿Qué pasa cuando sacamos la tierra del pozo? en el Espacio de Arte Contemporáneo (2025).</p>
  <p class="bio-text-end bio-text-break">Mi nombre es Cecilia Braña Llanes, pero me podés decir Cebra.</p>
 `],
 ['Trayectoria', `
  <p class="bio-text-half">Durante mi infancia tomé clases de caricatura con el dibujante conocido como “Hogue”, Horacio Guerriero.</p>
  <p class="bio-text-end">En 2020 participé de un concurso de diseño impulsado por la Universidad ORT, y recibí el Segundo Premio por la propuesta <em>Mi pequeña cueva</em>.</p>
  <p class="bio-text-wide">En 2021 me integré como voluntaria en la gestión y producción del proyecto cultural y educativo <em>Matemáticas Cantadas</em>, impulsado por el Liceo N°2 de Montevideo, Héctor Miranda. Trabajé en el proyecto durante 2021, 2022 y 2023.</p>
  <p class="bio-text-end">Me despedí del liceo en 2021 como Bachiller en Artes y Expresión.</p>
  <p class="bio-text-offset bio-text-break">En 2022 ingresé a la Licenciatura en Artes Visuales de la Universidad Católica del Uruguay gracias a la beca de estudios que obtuve en el concurso de ilustración <em>Mostrá tu Arte</em>, impulsado por la misma Universidad el año anterior.</p>
  <p class="bio-text-right">En agosto del mismo año me postulé a la convocatoria de diseño de estampados textiles para pañuelos impulsada por Montevideo Shopping, <em>Sentirnos bien es el mejor comienzo</em>, y mi diseño fue seleccionado para acompañar su campaña de lucha contra el cáncer de mama en su décima edición.</p>
  <p class="bio-text-columns">Entre 2022 y 2025 realicé múltiples talleres, cursos y capacitaciones vinculados a las artes visuales y la comunicación visual: Montaje de Exposiciones (Niklaus Strobel, 2022); Rodaje en vivo (boquete, 2023); Posproducción de imagen (Centro Ignis, 2024); Diseño de Packaging con origen (Superlocal, 2024); Diseño de Afiche (Federico García Guzzini, 2025); Diseño de Personajes (CCE, 2025); Historieta (Andrés Alberto y gervasio Troche, 2025).</p>
  <p class="bio-text-offset">En 2023 participé como exponente en la exhibición colectiva 20 milímetros, en la Biblioteca de la Universidad Católica del Uruguay, con el fotolibro <em>Un tarro viejo</em> (2023), y participé en el concurso de ilustración de fondos de pantalla <em>Imaginario Ceibal</em>, recibiendo una Mención Especial en la categoría Laptop por la ilustración <em>Universo de aprendizajes</em>.</p>
  <p class="bio-text-end bio-text-break">En noviembre del mismo año fundé el Festival <em>Indieween</em> en colectivo con mis amigos Samuel Acosta, Pablo Varela y Nicole Borches. Trabajé en la gestión artística, producción ejecutiva y comunicación visual del proyecto durante 2023, 2024 y 2025.</p>
  <p class="bio-text-wide"><em>Indieween</em> recibió dos veces premio al “festival del año” en el evento de reconocimiento a la escena emergente uruguaya <em>Bloque Awards</em>, impulsado por El bloque radio, por su primera y tercera edición.</p>
  <p class="bio-text-offset bio-text-break">Entre 2024 y 2025 realicé múltiples cursos vinculados a la gestión cultural: Modelos y Estructuras de Gestión Artística y Teatral (Rosalía García, 2024); Marketing y Comunicación Cultural (Felipe Villarmarzo, 2024); Gestión de Sellos Discográficos 360° (CCE, 2025).</p>
  <p class="bio-text-columns">En 2025 me integré temporalmente al colectivo Imágenes del Silencio como diseñadora para llevar adelante el proyecto <em>Mienten. Estaban ahí</em>; participé como exponente y montajista en la exhibición colectiva <em>El color de la memoria</em>, en el Centro de Exposiciones SUBTE, con los retratos ilustrados de José Luis Pelúa Pereira y Óscar Tassino (2024); y participé como exponente en la exhibición colectiva <em>¿Qué pasa cuando sacamos la tierra del pozo?</em>, en el Espacio de Arte Contemporáneo, con la instalación <em>Una casa que era linda</em> (2025).</p>
  <p class="bio-text-half bio-text-break">En diciembre del mismo año me recibí como Licenciada en Artes Visuales por la Universidad Católica del Uruguay, y me diplomé en Gestión Cultural por el Centro de Educación Continua de la misma Universidad.</p>
  <p class="bio-text-end">En 2026 me integré a la agencia ++hellohello como diseñadora de comunicación de marca y diseñadora de producto súper mega archi junior.</p>
  <p class="bio-text-offset">En marzo del mismo año recibí el premio al “Arte de tapa del año” en el evento de reconocimiento a escena emergente uruguaya <em>bloque awards</em>, impulsado por el bloque radio, por el arte creado para el disco compilado <em>Indieween, Segunda Edición</em>.</p>
 `],
 ['Exposiciones', `
  <p class="bio-text-intro">En noviembre de 2023 participé como exponente en la exhibición colectiva <em>20 milímetros</em>, en la Biblioteca de la Universidad Católica del Uruguay, con el fotolibro <em>Un tarro viejo</em> (2023).</p>
  <p class="bio-text-right bio-text-break">En marzo de 2025 me integré temporalmente al colectivo Imágenes del Silencio como diseñadora para llevar adelante el proyecto <em>Mienten. Estaban ahí</em>, exhibido en las calles de Montevideo a partir de mayo del mismo año.</p>
  <p class="bio-text-offset bio-text-break">En mayo de 2025 participé como exponente y montajista en la exhibición colectiva <em>El color de la memoria</em>, en el Centro de Exposiciones SUBTE, con los retratos ilustrados de José Luis Pelúa Pereira y Óscar Tassino, publicados en el libro <em>197 historias ilustradas</em> (2024).</p>
  <p class="bio-text-offset bio-text-flush">En noviembre de 2025 participé como exponente en la exhibición colectiva <em>¿Qué pasa cuando sacamos la tierra del pozo?</em>, en el Espacio de Arte Contemporáneo, con la instalación <em>Una casa que era linda</em> (2025).</p>
 `],
 ['Reconocimientos', `
  <p class="bio-text-end">En 2012 participé del concurso de ilustración para escolares y liceales impulsado por Mosca Hermanos, <em>La Leyenda de Laridia</em>, y recibí el Primer Premio en la categoría Escolares.</p>
  <p class="bio-text-wide bio-text-break">En 2021 participé del concurso de artes visuales impulsado por la Universidad Católica del Uruguay, <em>Mostrá tu Arte</em>, y recibí el Segundo Premio por la ilustración <em>Step outside, summertime’s in bloom</em>.</p>
  <p class="bio-text-end">En 2022 me postulé a la convocatoria de diseño de estampados textiles para pañuelos impulsada por Montevideo Shopping, <em>Sentirnos bien es el mejor comienzo</em>, y mi diseño fue seleccionado para acompañar la campaña de lucha contra el cáncer de mama de ese año.</p>
  <p class="bio-text-offset">En 2023 participé del concurso de ilustración de fondos de pantalla impulsado por Ceibal, <em>Imaginario Ceibal</em>, y recibí una Mención Especial en la categoría Laptop por la ilustración <em>Universo de aprendizajes</em>.</p>
  <p class="bio-text-offset">En 2024 participé del evento de reconocimiento a la escena emergente uruguaya impulsado por El Bloque Radio, <em>Bloque Awards</em>, y recibí el Premio al Festival del Año por el festival Indieween en su primera edición.</p>
  <p class="bio-text-end bio-text-break">En 2026 participé del mismo evento, y recibí el premio al Arte de Tapa del año por el arte creado para el disco compilado <em>Indieween, Segunda Edición</em>, y el premio al Festival del Año por el festival Indieween en su tercera edición.</p>
 `],
];

const panel = document.querySelector('#bio-panel');
const display = document.querySelector('.bio-display');
const topicLabel = document.querySelector('#bio-topic');
const topicButtons = [...document.querySelectorAll('[data-bio-topic]')];
let currentTopic = 0;
const page=panel.closest('section');
const composition=panel.parentElement;
const meta=page.querySelector('.bio-meta');
const tools=page.querySelector('.bio-panel-tools');
const inline = document.createElement('section');
inline.className = 'mobile-only bio-inline';
inline.innerHTML = '<button type="button" class="bio-toggle" aria-expanded="false" aria-controls="bio-panel">Abrir</button>';
const toggle = inline.querySelector('button');
const topicRows = ['.bio-word-1', '.bio-word-2', '.bio-word-3', '.bio-word-5']
 .map(selector => page.querySelector(selector).closest('.bio-row'));
let isOpen = false;

function sizeMobilePanel() {
 if (!mobileLayout.matches || page.hidden) return;
 const panelTop = panel.getBoundingClientRect().top + window.scrollY;
 const footerHeight = isOpen ? tools.getBoundingClientRect().height : 0;
 const bottomSpacing = parseFloat(getComputedStyle(document.body).paddingBottom);
 const controlsGap = isOpen ? parseFloat(getComputedStyle(tools).marginBlockStart) : 0;
 const viewportHeight = document.documentElement.clientHeight;
 const available = viewportHeight - panelTop - footerHeight - controlsGap - bottomSpacing;
 // Keep the panel usable on very short screens where the titles already fill the viewport.
 panel.style.setProperty('--bio-panel-height', `${Math.max(64, available)}px`);
}

function placePanel() {
 if (!mobileLayout.matches) {
  composition.prepend(panel);
  panel.tabIndex = 0;
  panel.style.removeProperty('--bio-panel-height');
  meta.append(tools, topicLabel);
  inline.remove();
  return;
 }
 if (isOpen) topicRows[currentTopic].after(inline);
 else display.append(inline);

 inline.classList.toggle('bio-inline-open', isOpen);
 toggle.textContent = isOpen ? 'Cerrar' : 'Abrir';
 toggle.setAttribute('aria-expanded', String(isOpen));
 panel.tabIndex = isOpen ? 0 : -1;
 inline.append(topicLabel, panel, tools);
 sizeMobilePanel();
}

export function fitBioType() {
 setCaptionDescent(display);
 for(const ink of page.querySelectorAll('.bio-ink')){
  const hit=ink.querySelector('.bio-hit');
  fitLargeInk(ink,'0px',mobileLayout.matches?mobileType.large:94.41);
  if(hit)ink.append(hit);
 }
 placePanel();
}

function selectTopic(index) {
 if (mobileLayout.matches) isOpen = true;
 showBioTopic(index);
 if (mobileLayout.matches) {
  panel.scrollTop = 0;
  inline.scrollIntoView({block: 'nearest'});
 }
}

export function resetBio() {
 isOpen=false;
 showBioTopic(0);
}

export function showBioTopic(index) {
 currentTopic = (index + topics.length) % topics.length;
 const [label, content] = topics[currentTopic];
 topicLabel.textContent = label;
 panel.innerHTML = content;
 panel.scrollTop = 0;
 for (const button of topicButtons) {
  if (Number(button.dataset.bioTopic) === currentTopic) button.setAttribute('aria-current', 'true');
  else button.removeAttribute('aria-current');
 }
 placePanel();
}

export function initializeBio() {
 fitBioType();
 const observer = new ResizeObserver(sizeMobilePanel);
 observer.observe(page);
 observer.observe(tools);
 window.addEventListener('resize', sizeMobilePanel, {passive: true});
 toggle.addEventListener('click', () => {
  if (isOpen) resetBio();
  else selectTopic(0);
  toggle.focus({preventScroll: true});
 });
 for (const [selector,index] of [['.bio-word-1',0],['.bio-word-2',1],['.bio-word-3',2],['.bio-word-5',3]]) {
  const word=page.querySelector(selector);
  const button=document.createElement('button');
  button.type='button';
  button.className='mobile-only bio-hit';
  button.setAttribute('aria-label',topics[index][0]);
  button.addEventListener('click',()=>selectTopic(index));
  word.removeAttribute('aria-hidden');
  word.append(button);
 }
 for (const button of topicButtons) {
  button.addEventListener('click', () => selectTopic(Number(button.dataset.bioTopic)));
 }
 document.querySelector('#bio-prev').addEventListener('click', () => selectTopic(currentTopic - 1));
 document.querySelector('#bio-next').addEventListener('click', () => selectTopic(currentTopic + 1));
}
