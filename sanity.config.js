import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Octogoal CMS',
  projectId: '5rn8u6ed',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
