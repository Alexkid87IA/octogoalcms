// actions/PreviewAction.jsx
// Action personnalisée pour prévisualiser un article sur le frontend

import { EyeOpenIcon } from '@sanity/icons'

// URL de base du frontend (à modifier selon l'environnement)
const FRONTEND_URL = {
  development: 'http://localhost:5173',
  production: 'https://octogoalmedia.com' // Remplace par ton URL de prod
}

export function PreviewAction(props) {
  const { draft, published } = props

  // Utiliser le brouillon si disponible, sinon le publié
  const doc = draft || published

  // Si pas de document ou pas de slug, désactiver
  if (!doc?.slug?.current) {
    return {
      label: 'Preview',
      icon: EyeOpenIcon,
      disabled: true,
      title: 'Ajoute un slug pour prévisualiser',
      onHandle: () => {},
    }
  }

  return {
    label: draft ? 'Preview brouillon' : 'Preview',
    icon: EyeOpenIcon,
    title: draft
      ? `Prévisualiser le brouillon sur le frontend`
      : `Voir l'article publié sur le frontend`,
    onHandle: () => {
      // Déterminer l'URL de base (dev ou prod)
      const isDev = window.location.hostname === 'localhost'
      const baseUrl = isDev ? FRONTEND_URL.development : FRONTEND_URL.production

      // Construire l'URL de preview
      const previewUrl = `${baseUrl}/article/${doc.slug.current}?preview=true`

      // Ouvrir dans un nouvel onglet
      window.open(previewUrl, '_blank')
    },
  }
}
