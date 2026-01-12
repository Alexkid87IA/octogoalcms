// cms/schemaTypes/objects/playerMention.js
// Bloc pour mentionner un joueur dans un article
// Crée une carte cliquable qui renvoie vers la fiche joueur (via API-Football ID)

import {defineType} from 'sanity'

export default defineType({
  name: 'playerMention',
  title: 'Mention Joueur',
  type: 'object',
  icon: () => '⚽',
  fields: [
    {
      name: 'player',
      title: 'Joueur',
      type: 'reference',
      to: [{type: 'player'}],
      description: 'Sélectionne un joueur du CMS',
      validation: Rule => Rule.required()
    },
    {
      name: 'displayStyle',
      title: 'Style d\'affichage',
      type: 'string',
      options: {
        list: [
          {title: 'Carte complète', value: 'card'},
          {title: 'Inline (dans le texte)', value: 'inline'},
          {title: 'Mini carte', value: 'mini'}
        ],
        layout: 'radio'
      },
      initialValue: 'card'
    },
    {
      name: 'showBio',
      title: 'Afficher la bio Octogoal',
      type: 'boolean',
      description: 'Afficher notre analyse du joueur',
      initialValue: true,
      hidden: ({parent}) => parent?.displayStyle === 'inline'
    },
    {
      name: 'customText',
      title: 'Texte personnalisé',
      type: 'string',
      description: 'Texte à afficher (par défaut: nom du joueur)',
      hidden: ({parent}) => parent?.displayStyle !== 'inline'
    }
  ],
  preview: {
    select: {
      playerName: 'player.name',
      apiId: 'player.apiFootballId',
      style: 'displayStyle'
    },
    prepare({playerName, apiId, style}) {
      const styleLabels = {
        'card': 'Carte',
        'inline': 'Inline',
        'mini': 'Mini'
      }
      return {
        title: `⚽ ${playerName || 'Joueur non sélectionné'}`,
        subtitle: `ID: ${apiId || '?'} • Style: ${styleLabels[style] || 'Carte'}`
      }
    }
  }
})
