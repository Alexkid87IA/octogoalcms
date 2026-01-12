// cms/deskStructure.js
// Structure personnalisée du Studio Sanity pour Octogoal

export const deskStructure = (S) =>
  S.list()
    .title('Octogoal CMS')
    .items([
      // ========== HOMEPAGE (Singleton) ==========
      S.listItem()
        .title('🏠 Homepage')
        .id('homepage')
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
            .title('Configuration Homepage')
        ),

      S.divider(),

      // ========== CONTENU ==========
      S.listItem()
        .title('📝 Contenu')
        .child(
          S.list()
            .title('Contenu')
            .items([
              // Articles
              S.listItem()
                .title('📰 Tous les articles')
                .schemaType('article')
                .child(
                  S.documentTypeList('article')
                    .title('Tous les articles')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),

              // Articles par type de contenu
              S.listItem()
                .title('📂 Par type de contenu')
                .child(
                  S.list()
                    .title('Type de contenu')
                    .items([
                      S.listItem()
                        .title('📰 Actus')
                        .child(
                          S.documentList()
                            .title('Actus')
                            .filter('_type == "article" && contentType == "actu"')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('🎬 Émissions')
                        .child(
                          S.documentList()
                            .title('Émissions')
                            .filter('_type == "article" && contentType == "emission"')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('⚡ Flash')
                        .child(
                          S.documentList()
                            .title('Flash')
                            .filter('_type == "article" && contentType == "flash"')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('📊 Analyses')
                        .child(
                          S.documentList()
                            .title('Analyses')
                            .filter('_type == "article" && contentType == "analyse"')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('👤 Portraits')
                        .child(
                          S.documentList()
                            .title('Portraits')
                            .filter('_type == "article" && contentType == "portrait"')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('😂 Mèmes')
                        .child(
                          S.documentList()
                            .title('Mèmes')
                            .filter('_type == "article" && contentType == "meme"')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('📋 Tops / Listes')
                        .child(
                          S.documentList()
                            .title('Tops / Listes')
                            .filter('_type == "article" && contentType == "top"')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                    ])
                ),

              // Articles mis en avant
              S.listItem()
                .title('⭐ Mise en avant')
                .child(
                  S.list()
                    .title('Mise en avant')
                    .items([
                      S.listItem()
                        .title('🌟 À la une')
                        .child(
                          S.documentList()
                            .title('À la une')
                            .filter('_type == "article" && isFeatured == true')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('🔥 Tendances')
                        .child(
                          S.documentList()
                            .title('Tendances')
                            .filter('_type == "article" && isTrending == true')
                            .defaultOrdering([{ field: 'trendingOrder', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('⭐ Essentiels')
                        .child(
                          S.documentList()
                            .title('Essentiels')
                            .filter('_type == "article" && isEssential == true')
                            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        ),
                    ])
                ),

              S.divider(),

              // Débats
              S.listItem()
                .title('🗣️ Débats')
                .schemaType('debate')
                .child(S.documentTypeList('debate').title('Débats')),

              // VS Polls
              S.listItem()
                .title('⚔️ VS Polls')
                .schemaType('vsPoll')
                .child(
                  S.documentTypeList('vsPoll')
                    .title('VS Polls')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),

              // VS Polls à la une
              S.listItem()
                .title('⭐ VS à la une')
                .child(
                  S.documentList()
                    .title('VS Polls à la une')
                    .filter('_type == "vsPoll" && featured == true')
                ),
            ])
        ),

      // ========== JOUEURS & CLUBS ==========
      S.listItem()
        .title('⚽ Joueurs & Clubs')
        .child(
          S.list()
            .title('Joueurs & Clubs')
            .items([
              // Joueurs
              S.listItem()
                .title('⚽ Tous les joueurs')
                .schemaType('player')
                .child(
                  S.documentTypeList('player')
                    .title('Tous les joueurs')
                    .defaultOrdering([{ field: 'name', direction: 'asc' }])
                ),

              // Joueurs par statut
              S.listItem()
                .title('📊 Par statut')
                .child(
                  S.list()
                    .title('Joueurs par statut')
                    .items([
                      S.listItem()
                        .title('⭐ Mis en avant')
                        .child(
                          S.documentList()
                            .title('Joueurs mis en avant')
                            .filter('_type == "player" && isFeatured == true')
                        ),
                      S.listItem()
                        .title('💎 Pépites')
                        .child(
                          S.documentList()
                            .title('Pépites')
                            .filter('_type == "player" && isPepite == true')
                        ),
                      S.listItem()
                        .title('👑 Légendes')
                        .child(
                          S.documentList()
                            .title('Légendes')
                            .filter('_type == "player" && isLegend == true')
                        ),
                    ])
                ),

              S.divider(),

              // Clubs
              S.listItem()
                .title('🏟️ Tous les clubs')
                .schemaType('club')
                .child(
                  S.documentTypeList('club')
                    .title('Tous les clubs')
                    .defaultOrdering([{ field: 'name', direction: 'asc' }])
                ),

              // Top clubs
              S.listItem()
                .title('👑 Top clubs européens')
                .child(
                  S.documentList()
                    .title('Top clubs')
                    .filter('_type == "club" && isTopClub == true')
                ),
            ])
        ),

      // ========== ORGANISATION ==========
      S.listItem()
        .title('📂 Organisation')
        .child(
          S.list()
            .title('Organisation')
            .items([
              S.listItem()
                .title('📁 Catégories')
                .schemaType('category')
                .child(
                  S.documentTypeList('category')
                    .title('Catégories')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.listItem()
                .title('📂 Sous-catégories')
                .schemaType('subcategory')
                .child(
                  S.documentTypeList('subcategory')
                    .title('Sous-catégories')
                ),
              S.listItem()
                .title('🏷️ Tags')
                .schemaType('tag')
                .child(
                  S.documentTypeList('tag')
                    .title('Tags')
                    .defaultOrdering([{ field: 'title', direction: 'asc' }])
                ),
              S.listItem()
                .title('🔥 Tags tendances')
                .child(
                  S.documentList()
                    .title('Tags tendances')
                    .filter('_type == "tag" && isTrending == true')
                ),
            ])
        ),

      // ========== ÉQUIPE ==========
      S.listItem()
        .title('👥 Équipe')
        .child(
          S.list()
            .title('Équipe')
            .items([
              S.listItem()
                .title('✍️ Tous les auteurs')
                .schemaType('author')
                .child(
                  S.documentTypeList('author')
                    .title('Auteurs')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.listItem()
                .title('⭐ Auteurs mis en avant')
                .child(
                  S.documentList()
                    .title('Auteurs mis en avant')
                    .filter('_type == "author" && isFeatured == true')
                ),
              S.listItem()
                .title('🔇 Anciens auteurs')
                .child(
                  S.documentList()
                    .title('Anciens auteurs')
                    .filter('_type == "author" && isActive == false')
                ),
            ])
        ),

      S.divider(),

      // ========== OUTILS ==========
      S.listItem()
        .title('🛠️ Outils')
        .child(
          S.list()
            .title('Outils')
            .items([
              // Articles brouillons / non publiés
              S.listItem()
                .title('📝 Brouillons')
                .child(
                  S.documentList()
                    .title('Articles non publiés')
                    .filter('_type == "article" && !defined(publishedAt)')
                ),
              // Articles sans image
              S.listItem()
                .title('🖼️ Sans image')
                .child(
                  S.documentList()
                    .title('Articles sans image')
                    .filter('_type == "article" && !defined(mainImage)')
                ),
              // Articles sans catégorie
              S.listItem()
                .title('📁 Sans catégorie')
                .child(
                  S.documentList()
                    .title('Articles sans catégorie')
                    .filter('_type == "article" && (!defined(categories) || count(categories) == 0)')
                ),
            ])
        ),
    ])

// Résoudre les types de documents dans le studio
export const defaultDocumentNodeResolver = (S, { schemaType }) => {
  // Singleton pour homepage
  if (schemaType === 'homepage') {
    return S.document().views([S.view.form()])
  }

  return S.document().views([S.view.form()])
}
