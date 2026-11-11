const esc = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');

const context = document.createElement('canvas').getContext('2d');
export function measure(text,size,letterSpacing="0px"){
 context.letterSpacing=letterSpacing;
 context.font=`400 ${size}px Arial`;
 return context.measureText(text);
}
export function ink(text,size,brackets=false,letterSpacing="0px"){
 const value=brackets?`[${text}]`:text;
 const metrics=measure(value,size,letterSpacing);
 const x=metrics.actualBoundingBoxLeft, y=metrics.actualBoundingBoxAscent;
 const width=x+metrics.actualBoundingBoxRight, height=y+metrics.actualBoundingBoxDescent;
 const glyphs=brackets
  ? `<text class="home-bracket-left" x="${x}" y="${y}">[</text><text x="${x+context.measureText('[').width}" y="${y}">${esc(text)}</text><text class="home-bracket-right" x="${x+context.measureText(`[${text}`).width}" y="${y}">]</text>`
  : `<text x="${x}" y="${y}">${esc(text)}</text>`;
 return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="Arial" font-size="${size}" font-weight="400" style="letter-spacing:${letterSpacing}" aria-hidden="true">${glyphs}</svg>`;
}

// Size the layout box from the top of the ink to its baseline.
// The full SVG stays available for painting and overlap masks.
export function fitLargeInk(element, letterSpacing = '0px', size = 94.41) {
 const value = element.textContent;
 const metrics = measure(value, size, letterSpacing);
 element.style.width = `${metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight}px`;
 element.style.height = `${metrics.actualBoundingBoxAscent}px`;
 element.classList.add('large-ink');
 element.innerHTML = ink(value, size, false, letterSpacing);
}

export function setCaptionDescent(element) {
 const style = getComputedStyle(element);
 context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
 const {fontBoundingBoxAscent, fontBoundingBoxDescent} = context.measureText('Mg');
 const descent = (parseFloat(style.lineHeight) - fontBoundingBoxAscent + fontBoundingBoxDescent) / 2;
 element.style.setProperty('--caption-descent', `${descent}px`);
}
