// cms/schemaTypes/table.js
// Schéma pour les tableaux dans le contenu

export default {
  name: 'table',
  title: 'Tableau',
  type: 'object',
  fields: [
    {
      name: 'caption',
      title: 'Titre du tableau',
      type: 'string',
      description: 'Titre affiché au-dessus du tableau (optionnel)'
    },
    {
      name: 'rows',
      title: 'Lignes',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'row',
          title: 'Ligne',
          fields: [
            {
              name: 'cells',
              title: 'Cellules',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'cell',
                  title: 'Cellule',
                  fields: [
                    {
                      name: 'content',
                      title: 'Contenu',
                      type: 'string'
                    },
                    {
                      name: 'isHeader',
                      title: 'Cellule d\'en-tête',
                      type: 'boolean',
                      initialValue: false
                    },
                    {
                      name: 'colspan',
                      title: 'Colspan',
                      type: 'number',
                      description: 'Nombre de colonnes à fusionner',
                      initialValue: 1
                    },
                    {
                      name: 'rowspan',
                      title: 'Rowspan',
                      type: 'number',
                      description: 'Nombre de lignes à fusionner',
                      initialValue: 1
                    }
                  ],
                  preview: {
                    select: {
                      content: 'content',
                      isHeader: 'isHeader'
                    },
                    prepare({ content, isHeader }) {
                      return {
                        title: content || '(vide)',
                        subtitle: isHeader ? 'En-tête' : 'Cellule'
                      }
                    }
                  }
                }
              ]
            },
            {
              name: 'isHeaderRow',
              title: 'Ligne d\'en-tête',
              type: 'boolean',
              initialValue: false
            }
          ],
          preview: {
            select: {
              cells: 'cells',
              isHeaderRow: 'isHeaderRow'
            },
            prepare({ cells, isHeaderRow }) {
              const cellCount = cells?.length || 0
              const preview = cells?.slice(0, 3).map(c => c.content).join(' | ') || ''
              return {
                title: isHeaderRow ? `🔷 ${preview}` : preview,
                subtitle: `${cellCount} cellule${cellCount > 1 ? 's' : ''}`
              }
            }
          }
        }
      ]
    },
    {
      name: 'hasHeaderRow',
      title: 'Première ligne = en-tête',
      type: 'boolean',
      description: 'La première ligne sera stylée comme en-tête',
      initialValue: true
    },
    {
      name: 'striped',
      title: 'Lignes alternées',
      type: 'boolean',
      description: 'Alterner les couleurs de fond des lignes',
      initialValue: true
    },
    {
      name: 'bordered',
      title: 'Bordures',
      type: 'boolean',
      description: 'Afficher les bordures du tableau',
      initialValue: true
    }
  ],
  preview: {
    select: {
      caption: 'caption',
      rows: 'rows'
    },
    prepare({ caption, rows }) {
      const rowCount = rows?.length || 0
      return {
        title: caption || 'Tableau',
        subtitle: `${rowCount} ligne${rowCount > 1 ? 's' : ''}`,
        media: () => '📊'
      }
    }
  }
}
