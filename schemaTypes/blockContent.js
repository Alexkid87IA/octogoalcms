// cms/schemaTypes/blockContent.js
// Schéma blockContent avec support YouTube, Instagram, Twitter ET Tableaux

import {defineType, defineArrayMember} from 'sanity'

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'}
      ],
      marks: {
        decorators: [
          {title: 'Gras', value: 'strong'},
          {title: 'Italique', value: 'em'},
          {title: 'Souligné', value: 'underline'},
          {title: 'Barré', value: 'strike-through'},
          {title: 'Code', value: 'code'},
          {title: 'Surligné', value: 'highlight'}
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: Rule => Rule.uri({
                  scheme: ['http', 'https', 'mailto', 'tel']
                })
              },
              {
                title: 'Ouvrir dans un nouvel onglet',
                name: 'blank',
                type: 'boolean',
                initialValue: true
              }
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Légende',
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
          description: 'Important pour le SEO et l\'accessibilité'
        }
      ]
    }),
    defineArrayMember({
      name: 'instagram',
      type: 'object',
      title: 'Post Instagram',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'URL du post Instagram',
          description: 'Collez l\'URL complète du post Instagram'
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Légende (optionnel)',
        }
      ],
      preview: {
        select: {
          url: 'url',
          caption: 'caption'
        },
        prepare({url, caption}) {
          const postId = url ? url.split('/p/')[1]?.split('/')[0] : null
          return {
            title: caption || 'Post Instagram',
            subtitle: postId ? `Post: ${postId}` : 'Ajoutez une URL',
          }
        }
      }
    }),
    defineArrayMember({
      name: 'twitter',
      type: 'object',
      title: 'Tweet Twitter/X',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'URL du tweet',
          description: 'Collez l\'URL complète du tweet'
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Légende (optionnel)',
        }
      ],
      preview: {
        select: {
          url: 'url',
          caption: 'caption'
        },
        prepare({url, caption}) {
          const tweetId = url ? url.match(/status\/(\d+)/)?.[1] : null
          return {
            title: caption || 'Tweet',
            subtitle: tweetId ? `Tweet ID: ${tweetId}` : 'Ajoutez une URL',
          }
        }
      }
    }),
    defineArrayMember({
      type: 'youtube',
      title: 'Vidéo YouTube'
    }),
    defineArrayMember({
      type: 'table',
      title: 'Tableau'
    }),
    // ========== NOUVEAUX BLOCS v2.0 ==========
    defineArrayMember({
      type: 'callout',
      title: 'Callout / Alerte'
    }),
    defineArrayMember({
      type: 'styledQuote',
      title: 'Citation stylée'
    }),
    defineArrayMember({
      type: 'statsCard',
      title: 'Stats Card'
    }),
    defineArrayMember({
      type: 'playerComparison',
      title: 'Comparaison joueurs'
    }),
    defineArrayMember({
      type: 'imageGallery',
      title: 'Galerie d\'images'
    }),
    defineArrayMember({
      type: 'ctaButton',
      title: 'Bouton CTA'
    }),
    defineArrayMember({
      type: 'spoiler',
      title: 'Spoiler / Révélation'
    }),
    defineArrayMember({
      type: 'accordion',
      title: 'Accordéon / FAQ'
    }),
    defineArrayMember({
      type: 'playerMention',
      title: 'Mention Joueur'
    })
  ],
})