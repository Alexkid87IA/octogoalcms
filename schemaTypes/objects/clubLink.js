// schemaTypes/objects/clubLink.js
// Type objet pour lier un club avec recherche API-Football intégrée

import {defineType} from 'sanity'
import ClubReferenceInput from '../../components/ClubReferenceInput'

export default defineType({
  name: 'clubLink',
  title: 'Lien Club',
  type: 'object',
  fields: [
    {
      name: 'club',
      title: 'Club',
      type: 'reference',
      to: [{type: 'club'}],
      validation: Rule => Rule.required()
    }
  ],
  components: {
    input: ClubReferenceInput
  },
  preview: {
    select: {
      clubName: 'club.name',
      clubId: 'club.apiFootballId'
    },
    prepare({ clubName, clubId }) {
      return {
        title: clubName || 'Club non sélectionné',
        subtitle: clubId ? `ID: ${clubId}` : ''
      }
    }
  }
})
