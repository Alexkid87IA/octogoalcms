// schemaTypes/objects/leagueLink.js
// Type objet pour lier un championnat avec recherche API-Football intégrée

import {defineType} from 'sanity'
import LeagueReferenceInput from '../../components/LeagueReferenceInput'

export default defineType({
  name: 'leagueLink',
  title: 'Lien Championnat',
  type: 'object',
  fields: [
    {
      name: 'league',
      title: 'Championnat',
      type: 'reference',
      to: [{type: 'league'}],
      // validation: Rule => Rule.required()
    }
  ],
  components: {
    input: LeagueReferenceInput
  },
  preview: {
    select: {
      leagueName: 'league.name',
      leagueId: 'league.apiFootballId',
      country: 'league.country'
    },
    prepare({ leagueName, leagueId, country }) {
      return {
        title: leagueName || 'Championnat non sélectionné',
        subtitle: leagueId ? `${country || ''} • ID: ${leagueId}` : ''
      }
    }
  }
})
