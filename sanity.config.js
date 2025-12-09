import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {schemaTypes} from './schemaTypes'
import portableTextHtmlPreview from './plugins/portableTextHtmlPreview' // AJOUT DU PLUGIN

export default defineConfig({
  name: 'default',
  title: 'rogersanity',

  projectId: 'z9wsynas',
  dataset: 'production',

  plugins: [
    structureTool(), 
    visionTool(),
    codeInput(), // Ajout du plugin pour les blocs de code
    portableTextHtmlPreview // AJOUT DU PLUGIN HTML PREVIEW
  ],

  schema: {
    types: schemaTypes,
  },

  // Configuration pour la prévisualisation
  document: {
    productionUrl: async (prev, context) => {
      const {document} = context
      
      if (document._type === 'article') {
        const slug = document.slug?.current
        if (!slug) return prev
        
        // URL de votre site Netlify
        const baseUrl = 'https://rainbow-sunflower-84b16b.netlify.app'
        
        // Adaptez cette ligne selon votre structure d'URL
        // Pour le preview, ajouter le paramètre ?preview=true
        return `${baseUrl}/article/${slug}?preview=true`
      }
      
      return prev
    }
  }
})