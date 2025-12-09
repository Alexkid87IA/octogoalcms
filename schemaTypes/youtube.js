// cms/schemaTypes/youtube.js
// FICHIER À CRÉER - Nouveau schéma pour gérer les vidéos YouTube dans le contenu

export default {
  name: 'youtube',
  type: 'object',
  title: 'Vidéo YouTube',
  fields: [
    {
      name: 'url',
      type: 'url',
      title: 'URL YouTube',
      description: 'Collez l\'URL complète de la vidéo YouTube (ex: https://www.youtube.com/watch?v=...)',
      validation: Rule => Rule.required().uri({
        scheme: ['http', 'https']
      }).custom((url) => {
        if (!url) return true;
        
        // Vérifier que c'est bien une URL YouTube valide
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)/;
        if (!youtubeRegex.test(url)) {
          return 'L\'URL doit être une URL YouTube valide';
        }
        return true;
      })
    },
    {
      name: 'caption',
      type: 'string',
      title: 'Légende (optionnel)',
      description: 'Description ou contexte de la vidéo'
    },
    {
      name: 'startTime',
      type: 'number',
      title: 'Temps de début (secondes)',
      description: 'Optionnel : démarrer la vidéo à un moment précis',
      validation: Rule => Rule.min(0)
    },
    {
      name: 'autoplay',
      type: 'boolean',
      title: 'Lecture automatique',
      description: 'Démarrer automatiquement la vidéo (sans son)',
      initialValue: false
    }
  ],
  preview: {
    select: {
      url: 'url',
      caption: 'caption'
    },
    prepare({ url, caption }) {
      // Extraire l'ID de la vidéo pour l'aperçu
      let videoId = '';
      if (url) {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
        if (match) {
          videoId = match[1];
        }
      }
      
      return {
        title: caption || 'Vidéo YouTube',
        subtitle: videoId ? `ID: ${videoId}` : url,
        media: () => '🎥' // Emoji comme icône
      };
    }
  }
}