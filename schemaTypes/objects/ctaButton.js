// cms/schemaTypes/objects/ctaButton.js
// Bouton d'appel à l'action

export default {
  name: 'ctaButton',
  title: 'Bouton CTA',
  type: 'object',
  fields: [
    {
      name: 'text',
      title: 'Texte du bouton',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Ex: Voir la fiche joueur, Lire la suite, Regarder la vidéo'
    },
    {
      name: 'linkType',
      title: 'Type de lien',
      type: 'string',
      options: {
        list: [
          { title: 'URL externe', value: 'external' },
          { title: 'Article', value: 'article' },
          { title: 'Joueur', value: 'player' },
          { title: 'Club', value: 'club' }
        ],
        layout: 'radio'
      },
      initialValue: 'external'
    },
    {
      name: 'externalUrl',
      title: 'URL',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'external'
    },
    {
      name: 'linkedArticle',
      title: 'Article',
      type: 'reference',
      to: [{ type: 'article' }],
      hidden: ({ parent }) => parent?.linkType !== 'article'
    },
    {
      name: 'linkedPlayer',
      title: 'Joueur',
      type: 'reference',
      to: [{ type: 'player' }],
      hidden: ({ parent }) => parent?.linkType !== 'player'
    },
    {
      name: 'linkedClub',
      title: 'Club',
      type: 'reference',
      to: [{ type: 'club' }],
      hidden: ({ parent }) => parent?.linkType !== 'club'
    },
    {
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Principal (couleur)', value: 'primary' },
          { title: 'Secondaire (outline)', value: 'secondary' },
          { title: 'Ghost (transparent)', value: 'ghost' },
          { title: 'Gradient Octogoal', value: 'gradient' }
        ]
      },
      initialValue: 'primary'
    },
    {
      name: 'size',
      title: 'Taille',
      type: 'string',
      options: {
        list: [
          { title: 'Petit', value: 'sm' },
          { title: 'Normal', value: 'md' },
          { title: 'Grand', value: 'lg' },
          { title: 'Pleine largeur', value: 'full' }
        ]
      },
      initialValue: 'md'
    },
    {
      name: 'icon',
      title: 'Icône',
      type: 'string',
      options: {
        list: [
          { title: 'Aucune', value: 'none' },
          { title: '→ Flèche', value: 'arrow' },
          { title: '▶️ Play', value: 'play' },
          { title: '📖 Lire', value: 'read' },
          { title: '⚽ Foot', value: 'football' },
          { title: '🔗 Lien', value: 'link' }
        ]
      },
      initialValue: 'arrow'
    },
    {
      name: 'openInNewTab',
      title: 'Ouvrir dans un nouvel onglet',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.linkType !== 'external'
    }
  ],
  preview: {
    select: {
      text: 'text',
      style: 'style',
      linkType: 'linkType'
    },
    prepare({ text, style, linkType }) {
      return {
        title: `🔘 ${text}`,
        subtitle: `${style} • ${linkType}`
      }
    }
  }
}
