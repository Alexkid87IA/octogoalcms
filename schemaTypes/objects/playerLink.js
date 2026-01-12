// schemaTypes/objects/playerLink.js
// Type objet pour lier un joueur avec recherche API-Football intégrée

import {defineType} from 'sanity'
import PlayerReferenceInput from '../../components/PlayerReferenceInput'

export default defineType({
  name: 'playerLink',
  title: 'Lien Joueur',
  type: 'object',
  fields: [
    {
      name: 'player',
      title: 'Joueur',
      type: 'reference',
      to: [{type: 'player'}],
      validation: Rule => Rule.required()
    }
  ],
  components: {
    input: PlayerReferenceInput
  },
  preview: {
    select: {
      playerName: 'player.name',
      playerId: 'player.apiFootballId'
    },
    prepare({ playerName, playerId }) {
      return {
        title: playerName || 'Joueur non sélectionné',
        subtitle: playerId ? `ID: ${playerId}` : ''
      }
    }
  }
})
