import {defineCliConfig} from 'sanity/cli';

const connection = {
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
};

export default defineCliConfig({api: connection});
