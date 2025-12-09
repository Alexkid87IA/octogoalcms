// cms/schemaTypes/index.js - VERSION NETTOYÉE AVEC YOUTUBE

import blockContent from './blockContent'
import category from './category'
import subcategory from './subcategory'
import author from './author'
import article from './article'  // Article centralisé pour tout
import debate from './debate'   // Gardé car structure spécifique
import tag from './tag'
import youtube from './youtube' // NOUVEAU : Import du schéma YouTube

export const schemaTypes = [
  // Types principaux
  article,      // Gère articles, émissions, amuse-bouches, essentiels, etc.
  author,
  
  // Organisation
  category,
  subcategory,
  tag,
  
  // Types spéciaux
  debate,       // Structure unique pour les débats
  
  // Utilitaires
  blockContent,
  youtube       // NOUVEAU : Ajout du type YouTube pour les embeds vidéo
  
  // SUPPRIMÉS:
  // - post (fusionné avec article)
  // - emission (géré via contentType dans article)
  // - amuseBouche (géré via contentType dans article)
  // - essentiel (géré via isEssential dans article)
  // - sectionType (remplacé par contentType)
  // - test (inutile)
]