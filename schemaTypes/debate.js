export default {
    name: 'debate',
    title: 'Débat',
    type: 'document',
    fields: [
      {
        name: 'question',
        title: 'Question du débat',
        type: 'string',
        description: 'La question principale du débat (ex: "Faut-il interdire l\'IA dans les écoles ?")',
        validation: Rule => Rule.required()
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        description: 'URL unique pour ce débat',
        options: {
          source: 'question',
          maxLength: 96
        },
        validation: Rule => Rule.required()
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        description: 'Brève description du sujet du débat',
        validation: Rule => Rule.required()
      },
      {
        name: 'category',
        title: 'Catégorie',
        type: 'string',
        description: 'Catégorie du débat (ex: "Tech & Éducation")',
        validation: Rule => Rule.required()
      },
      {
        name: 'isActive',
        title: 'Débat actif',
        type: 'boolean',
        description: 'Indique si ce débat est actuellement actif et doit être affiché',
        initialValue: true
      },
      {
        name: 'publishedAt',
        title: 'Date de publication',
        type: 'datetime',
        description: 'Date de publication du débat',
        validation: Rule => Rule.required()
      },
      {
        name: 'forPerson',
        title: 'Intervenant POUR',
        type: 'object',
        description: 'Personne défendant la position POUR',
        fields: [
          {
            name: 'name',
            title: 'Nom',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'role',
            title: 'Rôle/Fonction',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'image',
            title: 'Photo',
            type: 'image',
            options: {
              hotspot: true
            },
            validation: Rule => Rule.required()
          },
          {
            name: 'argument',
            title: 'Argument principal',
            type: 'text',
            validation: Rule => Rule.required()
          },
          {
            name: 'credentials',
            title: 'Crédits/Expérience',
            type: 'string',
            description: 'Expérience ou crédits professionnels (ex: "15 ans d\'expérience en pédagogie numérique")'
          },
          {
            name: 'publications',
            title: 'Nombre de publications',
            type: 'number',
            validation: Rule => Rule.min(0)
          },
          {
            name: 'citations',
            title: 'Nombre de citations',
            type: 'number',
            validation: Rule => Rule.min(0)
          }
        ],
        validation: Rule => Rule.required()
      },
      {
        name: 'againstPerson',
        title: 'Intervenant CONTRE',
        type: 'object',
        description: 'Personne défendant la position CONTRE',
        fields: [
          {
            name: 'name',
            title: 'Nom',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'role',
            title: 'Rôle/Fonction',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'image',
            title: 'Photo',
            type: 'image',
            options: {
              hotspot: true
            },
            validation: Rule => Rule.required()
          },
          {
            name: 'argument',
            title: 'Argument principal',
            type: 'text',
            validation: Rule => Rule.required()
          },
          {
            name: 'credentials',
            title: 'Crédits/Expérience',
            type: 'string',
            description: 'Expérience ou crédits professionnels (ex: "Docteur en sciences de l\'éducation")'
          },
          {
            name: 'publications',
            title: 'Nombre de publications',
            type: 'number',
            validation: Rule => Rule.min(0)
          },
          {
            name: 'citations',
            title: 'Nombre de citations',
            type: 'number',
            validation: Rule => Rule.min(0)
          }
        ],
        validation: Rule => Rule.required()
      },
      {
        name: 'stats',
        title: 'Statistiques',
        type: 'object',
        description: 'Statistiques du débat',
        fields: [
          {
            name: 'participants',
            title: 'Nombre de participants',
            type: 'number',
            initialValue: 0,
            validation: Rule => Rule.min(0)
          },
          {
            name: 'comments',
            title: 'Nombre de commentaires',
            type: 'number',
            initialValue: 0,
            validation: Rule => Rule.min(0)
          },
          {
            name: 'votesFor',
            title: 'Votes POUR',
            type: 'number',
            initialValue: 0,
            validation: Rule => Rule.min(0)
          },
          {
            name: 'votesAgainst',
            title: 'Votes CONTRE',
            type: 'number',
            initialValue: 0,
            validation: Rule => Rule.min(0)
          }
        ]
      },
      {
        name: 'relatedArticles',
        title: 'Articles liés',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'title',
                title: 'Titre',
                type: 'string',
                validation: Rule => Rule.required()
              },
              {
                name: 'article',
                title: 'Article',
                type: 'reference',
                to: [{ type: 'article' }],
                description: 'Référence à un article existant'
              }
            ],
            preview: {
              select: {
                title: 'title'
              }
            }
          }
        ]
      }
    ],
    preview: {
      select: {
        title: 'question',
        subtitle: 'category',
        media: 'forPerson.image'
      }
    }
  }
  