// cms/schemaTypes/blockContent.js
// Schéma blockContent avec support YouTube, Instagram ET Twitter

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
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'}
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
          description: 'Collez l\'URL complète du post Instagram',
          validation: Rule => Rule.required()
            .uri({
              scheme: ['http', 'https']
            })
            .custom(url => {
              if (!url || !url.includes('instagram.com')) {
                return 'L\'URL doit être un lien Instagram valide'
              }
              return true
            })
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
          description: 'Collez l\'URL complète du tweet',
          validation: Rule => Rule.required()
            .uri({
              scheme: ['http', 'https']
            })
            .custom(url => {
              if (!url || (!url.includes('twitter.com') && !url.includes('x.com'))) {
                return 'L\'URL doit être un lien Twitter/X valide'
              }
              return true
            })
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
    // Bloc de code désactivé temporairement
    // defineArrayMember({
    //   type: 'code',
    //   title: 'Bloc de code',
    // })
  ],
})