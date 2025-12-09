// cms/migrations/migrate-to-unified-articles.js
// Script pour migrer les anciens types vers le nouveau format Article unifié

const {createClient} = require('@sanity/client')

// ⚠️ MODE TEST - Mettez à false pour exécuter vraiment
const DRY_RUN = true;

const client = createClient({
  projectId: 'z9wsynas',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skdV3amaujclTpvfkkecOFywcfHCZLj4b8QYtX1R5U2qOROhFsl2qQrljAez6p1TAHOa9aUGuAuDsJaf71GcrtlfGsuFTsymTmaC8xW7478USIYmB6hi0FCvjh2mV2NQAmzN6wuhjHUU1vpzyIzfu4KUlFHkehuNXMDUwRsQibxSl30mZHP8',
  useCdn: false
})

async function migrateData() {
  console.log('🚀 Début de la migration...')
  console.log(DRY_RUN ? '⚠️ MODE TEST - Aucune donnée ne sera modifiée' : '🔴 MODE RÉEL - Les données seront modifiées')
  
  try {
    // 1. Migrer les Posts vers Articles
    console.log('\n📄 Migration des Posts...')
    const posts = await client.fetch('*[_type == "post"]')
    console.log(`Trouvé ${posts.length} posts à migrer`)
    
    for (const post of posts) {
      const newArticle = {
        _id: `article-post-${post._id}`, // Nouvel ID pour éviter les conflits
        _type: 'article',
        contentType: 'article',
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        mainImage: post.mainImage,
        body: post.body,
        author: post.author,
        categories: post.categories,
        publishedAt: post.publishedAt,
        isFeatured: false,
        isEssential: false,
        isTrending: false
      }
      
      if (!DRY_RUN) {
        await client.createOrReplace(newArticle)
      }
      console.log(`${DRY_RUN ? '[TEST]' : '✅'} Post migré: ${post.title}`)
    }
    
    // 2. Migrer les Émissions
    console.log('\n🎙️ Migration des Émissions...')
    const emissions = await client.fetch('*[_type == "emission"]')
    console.log(`Trouvé ${emissions.length} émissions à migrer`)
    
    for (const emission of emissions) {
      const newArticle = {
        _id: `article-emission-${emission._id}`,
        _type: 'article',
        contentType: 'emission',
        title: emission.title,
        slug: emission.slug,
        excerpt: emission.description,
        mainImage: emission.coverImage,
        body: emission.detailedContent || [],
        videoUrl: emission.videoUrlExternal || emission.videoUrl,
        duration: emission.duration,
        guest: emission.guest?.name,
        guestDetails: emission.guest ? {
          role: emission.guest.title,
          photo: emission.guest.photo
        } : undefined,
        categories: [], // À mapper selon votre logique
        publishedAt: emission.publishedAt,
        isFeatured: emission.featured || false,
        isEssential: false,
        isTrending: false,
        stats: {
          views: emission.listens || 0,
          likes: emission.likes || 0,
          shares: 0
        }
      }
      
      if (!DRY_RUN) {
        await client.createOrReplace(newArticle)
      }
      console.log(`${DRY_RUN ? '[TEST]' : '✅'} Émission migrée: ${emission.title}`)
    }
    
    // 3. Migrer les Amuse-bouches
    console.log('\n🍿 Migration des Amuse-bouches...')
    const amuseBouches = await client.fetch('*[_type == "amuseBouche"]')
    console.log(`Trouvé ${amuseBouches.length} amuse-bouches à migrer`)
    
    for (const ab of amuseBouches) {
      const newArticle = {
        _id: `article-amuse-${ab._id}`,
        _type: 'article',
        contentType: 'amuse-bouche',
        title: ab.title,
        slug: ab.slug,
        excerpt: ab.description,
        mainImage: ab.coverImage,
        videoUrl: ab.videoUrl,
        duration: ab.duration,
        publishedAt: ab.publishedAt,
        categories: [], // À mapper
        isFeatured: false,
        isEssential: false,
        isTrending: false
      }
      
      if (!DRY_RUN) {
        await client.createOrReplace(newArticle)
      }
      console.log(`${DRY_RUN ? '[TEST]' : '✅'} Amuse-bouche migré: ${ab.title}`)
    }
    
    // 4. Marquer les articles essentiels
    console.log('\n⭐ Marquage des articles essentiels...')
    const essentiels = await client.fetch('*[_type == "essentiel"]')
    console.log(`Trouvé ${essentiels.length} essentiels à marquer`)
    
    for (const ess of essentiels) {
      if (ess.linkedContent?._ref) {
        // Trouver l'article correspondant et le marquer comme essentiel
        const refId = ess.linkedContent._ref
        const articleId = `article-post-${refId}` // Ou ajustez selon votre logique
        
        if (!DRY_RUN) {
          await client.patch(articleId)
            .set({ isEssential: true })
            .commit()
        }
        
        console.log(`${DRY_RUN ? '[TEST]' : '✅'} Article marqué comme essentiel: ${ess.title}`)
      }
    }
    
    console.log('\n' + '='.repeat(50))
    if (DRY_RUN) {
      console.log('✅ TEST TERMINÉ - Aucune donnée modifiée')
      console.log('Pour exécuter vraiment la migration, mettez DRY_RUN = false')
    } else {
      console.log('🎉 Migration terminée avec succès!')
      console.log('\n⚠️ IMPORTANT:')
      console.log('1. Vérifiez vos données dans Sanity Studio')
      console.log('2. Supprimez le token de ce fichier')
      console.log('3. Supprimez les anciens types une fois satisfait')
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
  }
}

// Exécuter la migration
migrateData()