 export default {
     name: 'essentiel',
     title: 'Essentiel (Top 5)',
     type: 'document',
     fields: [
       {
         name: 'title',
         title: 'Titre de l\u0027essentiel',
         type: 'string',
         validation: (Rule) => Rule.required().error('Un titre est requis.'),
       },
       {
         name: 'description',
         title: 'Description courte',
         type: 'text',
         rows: 3,
         validation: (Rule) => Rule.required().error('Une description est requise.'),
       },
       {
         name: 'linkedContent',
         title: 'Contenu lié (Article, Amuse-bouche, ou Émission)',
         type: 'reference',
         to: [
           { type: 'post' }, 
           { type: 'amuseBouche' }, 
           { type: 'emission' }
         ],
         validation: (Rule) => Rule.required().error('Un lien vers un contenu est requis.'),
       },
       {
         name: 'order',
         title: 'Ordre d\u0027affichage (1 à 5)',
         type: 'number',
         description: 'Utilisez un nombre de 1 à 5 pour définir la position. Les doublons seront triés par date de création.',
         validation: (Rule) => Rule.min(1).max(5).integer(),
       },
     ],
     preview: {
       select: {
         title: 'title',
         subtitle: 'order',
       },
       prepare(selection) {
         const {title, subtitle} = selection
         return {
           title: title,
           subtitle: subtitle ? `Position: ${subtitle}` : 'Aucun ordre défini'
         }
       }
     },
     orderings: [
        {
          title: 'Ordre d\u0027affichage, Ascendant',
          name: 'orderAsc',
          by: [{field: 'order', direction: 'asc'}]
        }
      ]
   }
