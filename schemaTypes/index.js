// cms/schemaTypes/index.js - VERSION OCTOGOAL MEDIA v2.0

import blockContent from './blockContent'
import category from './category'
import subcategory from './subcategory'
import author from './author'
import article from './article'
import debate from './debate'
import vsPoll from './vsPoll'
import tag from './tag'
import youtube from './youtube'

// NOUVEAUX SCHÉMAS v2.0
import player from './player'       // Fiches joueurs détaillées
import club from './club'           // Fiches clubs avec stats
import league from './league'       // Fiches championnats/compétitions avec API-Football
import homepage from './homepage'   // Contrôle éditorial de la homepage
import table from './table'         // Tableaux dans le contenu

// BLOCS ÉDITEUR v2.0
import callout from './objects/callout'
import styledQuote from './objects/styledQuote'
import statsCard from './objects/statsCard'
import playerComparison from './objects/playerComparison'
import imageGallery from './objects/imageGallery'
import ctaButton from './objects/ctaButton'
import spoiler from './objects/spoiler'
import accordion from './objects/accordion'
import playerMention from './objects/playerMention'
import playerLink from './objects/playerLink'
import clubLink from './objects/clubLink'
import leagueLink from './objects/leagueLink'  // Lien championnat avec recherche API-Football

export const schemaTypes = [
  // ========== DOCUMENTS PRINCIPAUX ==========
  article,      // Tous types d'articles (actu, émission, flash, analyse, etc.)
  player,       // Fiches joueurs avec stats API-Football
  club,         // Fiches clubs avec effectifs et palmarès
  league,       // Fiches championnats/compétitions avec API-Football

  // ========== ÉQUIPE ==========
  author,       // Auteurs avec réseaux sociaux et rôles

  // ========== ORGANISATION ==========
  category,     // Catégories avec icônes et couleurs
  subcategory,  // Sous-catégories liées aux catégories parentes
  tag,          // Tags avec types (joueur, club, compétition, etc.)

  // ========== TYPES SPÉCIAUX ==========
  debate,       // Débats avec intervenants POUR/CONTRE
  vsPoll,       // VS Polls - Sondages communautaires (Barça vs Real, etc.)
  homepage,     // Configuration singleton de la homepage

  // ========== UTILITAIRES ==========
  blockContent, // Éditeur de texte riche
  youtube,      // Embed vidéos YouTube
  table,        // Tableaux dans le contenu

  // ========== BLOCS ÉDITEUR ==========
  callout,          // Alertes et callouts
  styledQuote,      // Citations stylées
  statsCard,        // Cartes de statistiques
  playerComparison, // Comparaison joueurs
  imageGallery,     // Galeries d'images
  ctaButton,        // Boutons CTA
  spoiler,          // Blocs spoiler
  accordion,        // Accordéons FAQ
  playerMention,    // Mention joueur (carte cliquable vers fiche)
  playerLink,       // Lien joueur avec recherche API-Football
  clubLink,         // Lien club avec recherche API-Football
  leagueLink        // Lien championnat avec recherche API-Football
]

/*
 * CHANGELOG v2.0
 * ==============
 *
 * NOUVEAUX SCHÉMAS:
 * - player: Fiches joueurs complètes avec stats carrière, palmarès,
 *   historique clubs, réseaux sociaux, intégration API-Football
 *
 * - club: Fiches clubs avec effectif, staff, stade, palmarès,
 *   stats saison, intégration API-Football
 *
 * - homepage: Contrôle éditorial complet de la homepage
 *   - Hero personnalisable (article une, style, secondaires)
 *   - Sections dynamiques (par catégorie, manuel, joueurs, clubs)
 *   - Sidebar configurable (classement, pépites, newsletter)
 *   - Breaking news et ticker défilant
 *   - Popup promotionnel
 *
 * SCHÉMAS AMÉLIORÉS:
 * - category: + icon, image, color, gradient, SEO, showInNav/Footer
 * - tag: + slug, tagType, color, linkedPlayer/Club, isTrending
 * - author: + role, expertise, socialMedia, favoriteClub, stats
 *
 * SUPPRIMÉS (fusionnés dans article):
 * - post, emission, amuseBouche, essentiel, sectionType, test
 */