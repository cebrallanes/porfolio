import {defineArrayMember, defineField, defineType} from 'sanity';

export const projectType = defineType({
  name: 'projectType',
  title: 'Tipo de proyecto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre',
      type: 'string',
      description: 'Por ejemplo, Ilustración o Identidad visual. Podés usar el mismo tipo en varios proyectos.',
      validation: rule => rule.required().custom(value =>
        !value || value.trim() === value && value.length ? true : 'Escribí el nombre sin espacios al principio ni al final.'
      ),
    }),
  ],
});

export const project = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Título', type: 'string', validation: rule => rule.required()}),
    defineField({
      name: 'projectType',
      title: 'Tipo de proyecto',
      type: 'reference',
      to: [{type: 'projectType'}],
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
      validation: rule => rule.required().integer().min(1000).max(9999),
    }),
    defineField({
      name: 'client',
      title: 'Cliente',
      type: 'string',
      description: 'Podés escribir «Proyecto personal» si corresponde.',
    }),
    defineField({
      name: 'images',
      title: 'Imágenes',
      type: 'array',
      description: 'Arrastralas para ordenarlas. La primera es la que se ve al pasar el cursor y al abrir el proyecto.',
      validation: rule => rule.required().min(1),
      of: [defineArrayMember({
        type: 'image',
        validation: rule => rule.required().assetRequired(),
        fields: [defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Describí brevemente lo que se ve en esta imagen.',
          validation: rule => rule.required(),
        })],
        preview: {select: {title: 'alt', media: 'asset'}},
      })],
    }),
    defineField({name: 'description', title: 'Descripción', type: 'text', rows: 5}),
    defineField({name: 'credits', title: 'Créditos', type: 'text', rows: 2}),
  ],
  orderings: [{
    title: 'Año (más reciente primero)',
    name: 'yearDescending',
    by: [{field: 'year', direction: 'desc'}, {field: 'title', direction: 'asc'}],
  }],
  preview: {
    select: {title: 'title', type: 'projectType.title', year: 'year', media: 'images.0'},
    prepare: ({title, type, year, media}) => ({
      title, subtitle: [type, year].filter(Boolean).join(' · '), media,
    }),
  },
});
