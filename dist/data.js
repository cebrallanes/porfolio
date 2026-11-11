// Contenido ficticio para revisar el diseño. Se sustituirá por proyectos publicados en Sanity.
export const projects = Array.from({length:34},(_,i)=>{
 const types=['Ilustración','Afiche','Arte de tapa','Fotografía','Identidad visual','Editorial'];
 return {id:`muestra-${i+1}`,title:`Proyecto de muestra ${String(i+1).padStart(2,'0')}`,type:types[i%types.length],year:2025-Math.floor(i/8),client:i%3===0?'Proyecto personal':'Cliente de muestra',images:i%4===0?['assets/estudio-01.svg','assets/estudio-02.svg','assets/estudio-03.svg']:[`assets/estudio-0${i%3+1}.svg`],description:'Este es un texto de muestra para revisar la lectura y la relación entre la imagen y la descripción. Acá irá la información de tu proyecto, con su contexto, proceso y créditos.',credits:'Contenido ficticio · prueba de diseño'};
});
