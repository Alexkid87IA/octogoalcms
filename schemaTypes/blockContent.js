// cms/schemaTypes/blockContent.js
// Schéma blockContent mis à jour avec support YouTube, Instagram ET Twitter

import {defineType, defineArrayMember} from 'sanity'

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Styles let you set what your user can mark up blocks with. These
      // correspond with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
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
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property — e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'}
        ],
        // Annotations can be any object structure — e.g. a link or a footnote.
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
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
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
    // EXISTANT : Bloc pour intégrer un post Instagram
    defineArrayMember({
      name: 'instagram',
      type: 'object',
      title: 'Post Instagram',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'URL du post Instagram',
          description: 'Collez l\'URL complète du post Instagram (ex: https://www.instagram.com/p/ABC123/)',
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
          description: 'Une description alternative si le post ne se charge pas'
        }
      ],
      preview: {
        select: {
          url: 'url',
          caption: 'caption'
        },
        prepare({url, caption}) {
          // Extrait l'ID du post de l'URL
          const postId = url ? url.split('/p/')[1]?.split('/')[0] : null
          return {
            title: caption || 'Post Instagram',
            subtitle: postId ? `Post: ${postId}` : 'Ajoutez une URL',
            media: () => '📷' // Emoji comme icône
          }
        }
      }
    }),
    // NOUVEAU : Bloc pour intégrer un tweet Twitter/X
    defineArrayMember({
      name: 'twitter',
      type: 'object',
      title: 'Tweet Twitter/X',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'URL du tweet',
          description: 'Collez l\'URL complète du tweet (ex: https://twitter.com/user/status/123456789)',
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
          description: 'Une description alternative si le tweet ne se charge pas'
        }
      ],
      preview: {
        select: {
          url: 'url',
          caption: 'caption'
        },
        prepare({url, caption}) {
          // Extrait l'ID du tweet de l'URL
          const tweetId = url ? url.match(/status\/(\d+)/)?.[1] : null
          return {
            title: caption || 'Tweet',
            subtitle: tweetId ? `Tweet ID: ${tweetId}` : 'Ajoutez une URL',
            media: () => '🐦' // Emoji Twitter comme icône
          }
        }
      }
    }),
    // EXISTANT : Bloc pour intégrer une vidéo YouTube
    defineArrayMember({
      type: 'youtube',
      title: 'Vidéo YouTube'
    }),
    // OPTIONNEL : Bloc de code avec coloration syntaxique
    defineArrayMember({
      type: 'code',
      title: 'Bloc de code',
      options: {
        language: 'javascript',
        languageAlternatives: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'Python', value: 'python'},
          {title: 'PHP', value: 'php'},
          {title: 'JSON', value: 'json'},
          {title: 'Bash', value: 'bash'}
        ]
      }
    })
  ],
})