import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {schemaTypes} from './schemaTypes'
import {deskStructure, defaultDocumentNodeResolver} from './deskStructure'

export default defineConfig({
  name: 'default',
  title: 'Octogoal CMS',
  projectId: '5rn8u6ed',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: deskStructure,
      defaultDocumentNode: defaultDocumentNodeResolver,
    }),
    visionTool(),
    media(), // Plugin de gestion des médias amélioré
  ],

  schema: {
    types: schemaTypes,
  },

  // Configuration du studio
  studio: {
    components: {
      // Ajoute le logo Octogoal dans le studio
      // logo: OctogoalLogo,
    },
  },

  // Configuration du document
  document: {
    // Actions sur les documents
    actions: (prev, context) => {
      // Pour le singleton homepage, on ne permet que la mise à jour
      if (context.schemaType === 'homepage') {
        return prev.filter(action => action.action !== 'delete' && action.action !== 'duplicate')
      }
      return prev
    },
    // Nouveau document par défaut
    newDocumentOptions: (prev, { creationContext }) => {
      // Exclure homepage des nouveaux documents
      if (creationContext.type === 'global') {
        return prev.filter(templateItem => templateItem.templateId !== 'homepage')
      }
      return prev
    },
  },
})
