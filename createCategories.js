const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: '5rn8u6ed',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01'
})

const categories = [
  { title: 'Actus', slug: 'actus', description: 'Toute l\'actualité foot, format rapide & populaire' },
  { title: 'Matchs', slug: 'matchs', description: 'Infos liées aux compétitions et aux résultats' },
  { title: 'Clubs', slug: 'clubs', description: 'Contenu dédié aux clubs majeurs' },
  { title: 'Joueurs', slug: 'joueurs', description: 'Fiches, portraits, tops, stats, stories' },
  { title: 'Formats Octogoal', slug: 'formats-octogoal', description: 'Tops, listes, notes, compo, moments viraux' },
  { title: 'Vidéos', slug: 'videos', description: 'Vidéos longues, extraits, shorts' },
  { title: 'Carrousels', slug: 'carrousels', description: 'Images, stats visuelles, slides, formats sociaux' },
  { title: 'Mèmes', slug: 'memes', description: 'Mèmes foot, réactions, captures, formats viraux' },
  { title: 'Sponsors', slug: 'sponsors', description: 'Page dédiée aux activations partenaires' }
]

const subcategories = {
  'actus': [
    { title: 'Ligue 1', slug: 'ligue-1' },
    { title: 'Premier League', slug: 'premier-league' },
    { title: 'Liga', slug: 'liga' },
    { title: 'Serie A', slug: 'serie-a' },
    { title: 'Bundesliga', slug: 'bundesliga' },
    { title: 'Champions League', slug: 'champions-league' },
    { title: 'Europa League', slug: 'europa-league' },
    { title: 'Mercato', slug: 'mercato' },
    { title: 'Foot International', slug: 'foot-international' }
  ],
  'matchs': [
    { title: 'Calendrier', slug: 'calendrier' },
    { title: 'Résultats', slug: 'resultats' },
    { title: 'Classements', slug: 'classements' },
    { title: 'Avant-match', slug: 'avant-match' },
    { title: 'Après-match', slug: 'apres-match' },
    { title: 'Notes du match', slug: 'notes-match' },
    { title: 'Compos officielles', slug: 'compos-officielles' }
  ],
  'clubs': [
    { title: 'Clubs Ligue 1', slug: 'clubs-ligue-1' },
    { title: 'Clubs Premier League', slug: 'clubs-pl' },
    { title: 'Clubs Liga', slug: 'clubs-liga' },
    { title: 'Clubs Serie A', slug: 'clubs-serie-a' },
    { title: 'Clubs Bundesliga', slug: 'clubs-bundesliga' },
    { title: 'Clubs Afrique', slug: 'clubs-afrique' }
  ],
  'joueurs': [
    { title: 'Tops joueurs', slug: 'tops-joueurs' },
    { title: 'Joueurs en forme', slug: 'joueurs-en-forme' },
    { title: 'Joueurs sous-cotés', slug: 'joueurs-sous-cotes' },
    { title: 'Joueurs légendaires', slug: 'joueurs-legendaires' },
    { title: 'Fiches joueurs', slug: 'fiches-joueurs' }
  ],
  'formats-octogoal': [
    { title: 'Tops & listes', slug: 'tops-listes' },
    { title: 'Moments viraux', slug: 'moments-viraux' },
    { title: 'Le joueur du jour', slug: 'joueur-du-jour' },
    { title: 'Notes graphiques', slug: 'notes-graphiques' },
    { title: 'Classements insolites', slug: 'classements-insolites' },
    { title: 'Débats / réactions', slug: 'debats-reactions' },
    { title: 'Humour / punchlines', slug: 'humour-punchlines' },
    { title: 'Stories & récits courts', slug: 'stories-recits' }
  ],
  'videos': [
    { title: 'Émissions Octogoal', slug: 'emissions-octogoal' },
    { title: 'Mid-form (10-15 min)', slug: 'mid-form' },
    { title: 'Shorts / formats courts', slug: 'shorts' },
    { title: 'Extraits', slug: 'extraits' },
    { title: 'Lives rediffusés', slug: 'lives-rediffuses' }
  ],
  'carrousels': [
    { title: 'Stats visuelles', slug: 'stats-visuelles' },
    { title: 'Compos illustrées', slug: 'compos-illustrees' },
    { title: 'Résumés graphiques', slug: 'resumes-graphiques' },
    { title: 'Tops visuels', slug: 'tops-visuels' },
    { title: 'Infographies foot', slug: 'infographies-foot' },
    { title: 'Mèmes éditos', slug: 'memes-editos' }
  ],
  'memes': [
    { title: 'Réactions', slug: 'reactions' },
    { title: 'Captures virales', slug: 'captures-virales' },
    { title: 'Mèmes Octogoal', slug: 'memes-octogoal' },
    { title: 'La tête de Momo', slug: 'tete-de-momo' },
    { title: 'Culture foot Internet', slug: 'culture-foot-internet' }
  ],
  'sponsors': [
    { title: 'Opés en cours', slug: 'opes-en-cours' },
    { title: 'Archives opés', slug: 'archives-opes' },
    { title: 'Formats sponsorisés', slug: 'formats-sponsorises' },
    { title: 'Pages partenaires', slug: 'pages-partenaires' }
  ]
}

async function createCategories() {
  console.log('🚀 Création des catégories...\n')
  const categoryRefs = {}
  for (const cat of categories) {
    try {
      const doc = await client.create({
        _type: 'category',
        title: cat.title,
        slug: { _type: 'slug', current: cat.slug },
        description: cat.description
      })
      categoryRefs[cat.slug] = doc._id
      console.log('✅ Catégorie créée: ' + cat.title)
    } catch (err) {
      console.log('❌ Erreur pour ' + cat.title + ': ' + err.message)
    }
  }
  console.log('\n🚀 Création des sous-catégories...\n')
  for (const [catSlug, subs] of Object.entries(subcategories)) {
    const parentId = categoryRefs[catSlug]
    if (!parentId) continue
    for (const sub of subs) {
      try {
        await client.create({
          _type: 'subcategory',
          title: sub.title,
          slug: { _type: 'slug', current: sub.slug },
          category: { _type: 'reference', _ref: parentId }
        })
        console.log('  ✅ ' + sub.title)
      } catch (err) {
        console.log('  ❌ ' + sub.title + ': ' + err.message)
      }
    }
  }
  console.log('\n🎉 Terminé !')
}

createCategories()
