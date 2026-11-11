import {esESLocale} from '@sanity/locale-es-es';
import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {project, projectType} from './schema.js';

export default defineConfig({
  name: 'cebra',
  title: 'Cebra · Portfolio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({
    structure: S => S.list().title('Portfolio').items([
      S.documentTypeListItem('project').title('Proyectos'),
      S.documentTypeListItem('projectType').title('Tipos de proyecto'),
    ]),
  }), esESLocale()],
  schema: {types: [project, projectType]},
});
