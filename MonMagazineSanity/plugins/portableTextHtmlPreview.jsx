import React, { useState } from 'react'
import { toHTML } from '@portabletext/to-html'

// Composant pour le bouton HTML
const HtmlPreviewButton = (props) => {
  const [showHtml, setShowHtml] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')

  // Ne montrer le bouton que pour le champ "body" ou "content"
  const shouldShowButton = props.path?.[0] === 'body' || 
                          props.path?.[0] === 'content' || 
                          props.path?.[0] === 'detailedContent' ||
                          props.schemaType?.name === 'body'

  const convertToHtml = () => {
    try {
      // Récupérer la valeur actuelle du Portable Text
      // props.value peut être partiel, donc on essaie de récupérer le document complet
      let portableTextValue = props.value || []
      
      // Si on a accès au document complet via le contexte
      if (props.document && props.path && props.path[0]) {
        const fieldName = props.path[0]
        portableTextValue = props.document[fieldName] || portableTextValue
      }
      
      // S'assurer que c'est un tableau
      if (!Array.isArray(portableTextValue)) {
        portableTextValue = []
      }
      
      console.log('Contenu à convertir:', portableTextValue) // Pour debug
      
      // Configuration pour la conversion
      const htmlConfig = {
        components: {
          types: {
            image: ({value}) => {
              const imageUrl = value.asset?._ref 
                ? `https://cdn.sanity.io/images/z9wsynas/production/${value.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`
                : ''
              return `<img src="${imageUrl}" alt="${value.alt || ''}" />`
            },
            code: ({value}) => {
              return `<pre><code class="language-${value.language}">${value.code}</code></pre>`
            }
          },
          marks: {
            strong: ({children}) => `<strong>${children}</strong>`,
            em: ({children}) => `<em>${children}</em>`,
            code: ({children}) => `<code>${children}</code>`,
            underline: ({children}) => `<u>${children}</u>`,
            'strike-through': ({children}) => `<s>${children}</s>`,
            link: ({value, children}) => {
              const target = value?.blank ? 'target="_blank" rel="noopener"' : ''
              return `<a href="${value?.href}" ${target}>${children}</a>`
            }
          },
          block: {
            h1: ({children}) => `<h1>${children}</h1>`,
            h2: ({children}) => `<h2>${children}</h2>`,
            h3: ({children}) => `<h3>${children}</h3>`,
            h4: ({children}) => `<h4>${children}</h4>`,
            blockquote: ({children}) => `<blockquote>${children}</blockquote>`,
            normal: ({children}) => `<p>${children}</p>`,
          },
          list: {
            bullet: ({children}) => `<ul>${children}</ul>`,
            number: ({children}) => `<ol>${children}</ol>`,
          },
          listItem: {
            bullet: ({children}) => `<li>${children}</li>`,
            number: ({children}) => `<li>${children}</li>`,
          },
        }
      }

      // Convertir en HTML
      const html = toHTML(portableTextValue, htmlConfig)
      
      // Formater le HTML avec des retours à la ligne et indentation
      const formatHtml = (html) => {
        // Ajouter des retours à la ligne après chaque balise fermante
        let formatted = html
          .replace(/></g, '>\n<')
          .replace(/<\/(p|h1|h2|h3|h4|blockquote|li|ul|ol|div)>/g, '</$1>\n')
          .replace(/<(p|h1|h2|h3|h4|blockquote|li|ul|ol|div)>/g, '\n<$1>')
          
        // Indenter le code
        const lines = formatted.split('\n')
        let indentLevel = 0
        const indentedLines = lines.map(line => {
          const trimmedLine = line.trim()
          if (!trimmedLine) return ''
          
          // Réduire l'indentation pour les balises fermantes
          if (trimmedLine.startsWith('</')) {
            indentLevel = Math.max(0, indentLevel - 1)
          }
          
          const indentedLine = '  '.repeat(indentLevel) + trimmedLine
          
          // Augmenter l'indentation pour les balises ouvrantes
          if (trimmedLine.startsWith('<') && !trimmedLine.startsWith('</') && 
              !trimmedLine.endsWith('/>') && 
              (trimmedLine.includes('<ul') || trimmedLine.includes('<ol') || 
               trimmedLine.includes('<blockquote'))) {
            indentLevel++
          }
          
          return indentedLine
        })
        
        return indentedLines.filter(line => line).join('\n')
      }
      
      const formattedHtml = formatHtml(html)
      setHtmlContent(formattedHtml)
      setShowHtml(true)
    } catch (error) {
      console.error('Erreur de conversion:', error)
      setHtmlContent('Erreur lors de la conversion')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlContent).then(() => {
      alert('HTML copié dans le presse-papiers!')
    })
  }

  // Si ce n'est pas le bon champ, afficher juste le composant par défaut
  if (!shouldShowButton) {
    return props.renderDefault(props)
  }

  return (
    <>
      <div style={{ marginBottom: '10px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
        <button
          type="button"
          onClick={convertToHtml}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          📄 Voir le HTML
        </button>
        
        {showHtml && (
          <button
            type="button"
            onClick={() => setShowHtml(false)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ✕ Fermer
          </button>
        )}
      </div>

      {showHtml && (
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Aperçu HTML:</strong>
            <button
              type="button"
              onClick={copyToClipboard}
              style={{
                padding: '6px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              📋 Copier
            </button>
          </div>
          <pre style={{
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px',
            maxWidth: '100%',
            fontSize: '12px',
            fontFamily: 'Monaco, Consolas, monospace',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            wordBreak: 'break-all'
          }}>
            <code>{htmlContent}</code>
          </pre>
        </div>
      )}
      
      {/* Le contenu original de l'éditeur */}
      {props.renderDefault(props)}
    </>
  )
}

// Exporter le plugin
export default {
  name: 'portable-text-html-preview',
  form: {
    components: {
      input: HtmlPreviewButton
    }
  }
}