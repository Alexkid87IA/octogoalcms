import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {schemaTypes} from './schemaTypes'
import portableTextHtmlPreview from './plugins/portableTextHtmlPreview'

export default defineConfig({
  name: 'default',
  title: 'Octogoal CMS',

  projectId: '5rn8u6ed',
  dataset: 'production',

  plugins: [
    structureTool(), 
    visionTool(),
    codeInput(),
    portableTextHtmlPreview
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    productionUrl: async (prev, context) => {
      const {document} = context
      
      if (document._type === 'article') {
        const slug = document.slug?.current
        if (!slug) return prev
        
        const baseUrl = 'https://octogoalmedia.vercel.app'
        
        return `${baseUrl}/article/${slug}?preview=true`
      }
      
      return prev
    }
  }
})