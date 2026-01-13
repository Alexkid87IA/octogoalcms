// components/LeagueReferenceInput.jsx
// Composant de recherche championnat intelligent pour le type leagueLink
// Recherche dans Sanity ET API-Football, crée le championnat automatiquement si besoin

import { useState, useCallback, useEffect } from 'react'
import { set, unset, useClient } from 'sanity'
import { TextInput, Stack, Card, Text, Flex, Box, Spinner, Button, Badge } from '@sanity/ui'
import { SearchIcon, AddIcon, LinkIcon, CloseIcon } from '@sanity/icons'

const generateKey = () => Math.random().toString(36).substring(2, 10)
const API_HOST = '/api-football'

// Championnats populaires pré-définis pour accès rapide
const POPULAR_LEAGUES = [
  { id: 61, name: 'Ligue 1', country: 'France', emoji: '🇫🇷' },
  { id: 39, name: 'Premier League', country: 'England', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 140, name: 'La Liga', country: 'Spain', emoji: '🇪🇸' },
  { id: 135, name: 'Serie A', country: 'Italy', emoji: '🇮🇹' },
  { id: 78, name: 'Bundesliga', country: 'Germany', emoji: '🇩🇪' },
  { id: 2, name: 'Champions League', country: 'Europe', emoji: '⭐' },
  { id: 3, name: 'Europa League', country: 'Europe', emoji: '🟠' },
  { id: 848, name: 'Conference League', country: 'Europe', emoji: '🟢' },
  { id: 4, name: 'Euro', country: 'Europe', emoji: '🇪🇺' },
  { id: 1, name: 'World Cup', country: 'World', emoji: '🌍' }
]

export function LeagueReferenceInput(props) {
  const { onChange, value, path } = props
  const client = useClient({ apiVersion: '2024-01-01' })

  const leagueRef = value?.league?._ref

  const [searchQuery, setSearchQuery] = useState('')
  const [sanityResults, setSanityResults] = useState([])
  const [apiResults, setApiResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [showQuickPick, setShowQuickPick] = useState(true)

  useEffect(() => {
    if (leagueRef) {
      client.fetch(`*[_id == $id][0]{ _id, name, apiFootballId, country, logo }`, { id: leagueRef })
        .then(league => {
          if (league) setSelectedLeague(league)
        })
        .catch(console.error)
    } else {
      setSelectedLeague(null)
    }
  }, [leagueRef, client])

  const search = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSanityResults([])
      setApiResults([])
      setShowResults(false)
      setShowQuickPick(true)
      return
    }

    setLoading(true)
    setError(null)
    setShowQuickPick(false)

    try {
      // Recherche dans Sanity
      const sanityLeagues = await client.fetch(
        `*[_type == "league" && name match $query + "*"][0...5]{ _id, name, apiFootballId, country, logo }`,
        { query }
      )
      setSanityResults(sanityLeagues || [])

      // Recherche dans API-Football
      const response = await fetch(`${API_HOST}/leagues?search=${encodeURIComponent(query)}`)

      if (response.ok) {
        const data = await response.json()
        if (data.response && data.response.length > 0) {
          const leagues = data.response
            .map(item => ({
              id: item.league.id,
              name: item.league.name,
              logo: item.league.logo,
              country: item.country?.name || 'International',
              countryCode: item.country?.code || '',
              type: item.league.type || 'league'
            }))
            .filter((league, index, self) =>
              index === self.findIndex(l => l.id === league.id)
            )
            .filter(apiLeague =>
              !(sanityLeagues || []).some(sl => sl.apiFootballId === apiLeague.id)
            )
            .slice(0, 10)

          setApiResults(leagues)
        } else {
          setApiResults([])
        }
      }

      setShowResults(true)
    } catch (err) {
      console.error('Search error:', err)
      setError('Erreur de recherche')
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        search(searchQuery)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, search])

  const selectExistingLeague = (league) => {
    setSelectedLeague(league)
    setShowResults(false)
    setSearchQuery('')
    onChange(set({
      _type: 'leagueLink',
      _key: generateKey(),
      league: { _type: 'reference', _ref: league._id }
    }))
  }

  const createAndSelectLeague = async (apiLeague) => {
    console.log('createAndSelectLeague called with:', apiLeague)
    setCreating(true)
    setError(null)
    try {
      // Vérifier si le championnat existe déjà par apiFootballId
      const existing = await client.fetch(
        `*[_type == "league" && apiFootballId == $id][0]{ _id, name, apiFootballId }`,
        { id: apiLeague.id }
      )
      console.log('Existing check:', existing)

      if (existing) {
        selectExistingLeague(existing)
        return
      }

      console.log('Creating new league in Sanity...')
      const newLeague = await client.create({
        _type: 'league',
        name: apiLeague.name,
        slug: { _type: 'slug', current: apiLeague.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
        apiFootballId: apiLeague.id,
        country: apiLeague.country,
        countryCode: apiLeague.countryCode || '',
        logo: apiLeague.logo || '',
        type: apiLeague.type === 'Cup' ? 'cup' : 'league',
        currentSeason: new Date().getFullYear(),
        isFeatured: POPULAR_LEAGUES.some(pl => pl.id === apiLeague.id)
      })
      console.log('New league created:', newLeague)

      setSelectedLeague({ _id: newLeague._id, name: apiLeague.name, apiFootballId: apiLeague.id, country: apiLeague.country, logo: apiLeague.logo })
      setShowResults(false)
      setSearchQuery('')

      onChange(set({
        _type: 'leagueLink',
        _key: generateKey(),
        league: { _type: 'reference', _ref: newLeague._id }
      }))
      console.log('onChange called successfully')
    } catch (err) {
      setError('Erreur lors de la création: ' + err.message)
      console.error('createAndSelectLeague error:', err)
    } finally {
      setCreating(false)
    }
  }

  const quickSelectLeague = async (popularLeague) => {
    console.log('quickSelectLeague called with:', popularLeague)
    setCreating(true)
    setError(null)
    try {
      // Vérifier si existe dans Sanity
      const existing = await client.fetch(
        `*[_type == "league" && apiFootballId == $id][0]{ _id, name, apiFootballId, country, logo }`,
        { id: popularLeague.id }
      )
      console.log('Existing league in Sanity:', existing)

      if (existing) {
        selectExistingLeague(existing)
        setCreating(false)
        return
      }

      // Récupérer les infos depuis API-Football
      console.log('Fetching from API-Football...')
      const response = await fetch(`${API_HOST}/leagues?id=${popularLeague.id}`)
      console.log('API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('API data:', data)

        if (data.response && data.response.length > 0) {
          const leagueData = data.response[0]
          await createAndSelectLeague({
            id: leagueData.league.id,
            name: leagueData.league.name,
            logo: leagueData.league.logo,
            country: leagueData.country?.name || popularLeague.country,
            countryCode: leagueData.country?.code || '',
            type: leagueData.league.type || 'league'
          })
        } else {
          // Fallback: créer avec les infos locales si API ne retourne rien
          console.log('API returned empty, using local data')
          await createAndSelectLeague({
            id: popularLeague.id,
            name: popularLeague.name,
            logo: null,
            country: popularLeague.country,
            countryCode: '',
            type: 'league'
          })
        }
      } else {
        // Fallback si API échoue
        console.log('API failed, using local data')
        await createAndSelectLeague({
          id: popularLeague.id,
          name: popularLeague.name,
          logo: null,
          country: popularLeague.country,
          countryCode: '',
          type: 'league'
        })
      }
    } catch (err) {
      setError('Erreur lors de la sélection: ' + err.message)
      console.error('quickSelectLeague error:', err)
    } finally {
      setCreating(false)
    }
  }

  const clearSelection = () => {
    setSelectedLeague(null)
    onChange(unset())
  }

  return (
    <Stack space={2}>
      {selectedLeague && (
        <Card padding={3} radius={2} tone="positive" style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d' }}>
          <Flex align="center" gap={3}>
            {selectedLeague.logo ? (
              <img
                src={selectedLeague.logo}
                alt={selectedLeague.name}
                style={{ width: 44, height: 44, objectFit: 'contain' }}
                onError={(e) => e.target.style.display = 'none'}
              />
            ) : (
              <Flex align="center" justify="center" style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#fde68a', border: '2px solid #f59e0b' }}>
                <span style={{ fontSize: 20 }}>🏆</span>
              </Flex>
            )}
            <Box flex={1}>
              <Text weight="bold" size={2}>{selectedLeague.name}</Text>
              <Text size={1} muted>{selectedLeague.country} • ID: {selectedLeague.apiFootballId}</Text>
            </Box>
            <Button icon={CloseIcon} mode="ghost" tone="critical" onClick={clearSelection} padding={2} />
          </Flex>
        </Card>
      )}

      {!selectedLeague && (
        <Stack space={3}>
          <Card padding={3} radius={2} style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b' }}>
            <Text size={1}>
              <strong>Sélection de championnat</strong> : clique sur un championnat populaire ou recherche par nom.
            </Text>
          </Card>

          {/* Quick Pick - Championnats populaires */}
          {showQuickPick && (
            <Stack space={2}>
              <Text size={1} weight="semibold" style={{ color: '#92400e' }}>Championnats populaires</Text>
              <Flex wrap="wrap" gap={2}>
                {POPULAR_LEAGUES.map((league) => (
                  <Button
                    key={league.id}
                    mode="ghost"
                    tone="primary"
                    onClick={() => quickSelectLeague(league)}
                    disabled={creating}
                    padding={2}
                    style={{
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fcd34d',
                      borderRadius: 8
                    }}
                  >
                    <Flex align="center" gap={2}>
                      <span>{league.emoji}</span>
                      <Text size={1}>{league.name}</Text>
                    </Flex>
                  </Button>
                ))}
              </Flex>
            </Stack>
          )}

          <Flex gap={2} align="center">
            <Box flex={1}>
              <TextInput
                placeholder="Rechercher un championnat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                icon={SearchIcon}
                fontSize={2}
                padding={3}
              />
            </Box>
            {(loading || creating) && <Spinner />}
          </Flex>

          {searchQuery.length === 1 && (
            <Text size={1} muted>Encore 1 caractère...</Text>
          )}

          {error && (
            <Card padding={3} tone="critical" radius={2}>
              <Text size={1}>{error}</Text>
            </Card>
          )}

          {showResults && (sanityResults.length > 0 || apiResults.length > 0) && (
            <Card radius={2} shadow={2} style={{ maxHeight: 400, overflowY: 'auto' }}>
              {sanityResults.length > 0 && (
                <Stack space={1} padding={2}>
                  <Flex padding={2} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <Text size={1} weight="semibold" style={{ color: '#059669' }}>
                      Dans ton CMS ({sanityResults.length})
                    </Text>
                  </Flex>
                  {sanityResults.map((league) => (
                    <Card key={league._id} padding={3} radius={2} style={{ cursor: 'pointer', backgroundColor: '#f0fdf4' }} onClick={() => selectExistingLeague(league)}>
                      <Flex align="center" gap={3}>
                        {league.logo && (
                          <img src={league.logo} alt={league.name} style={{ width: 28, height: 28, objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                        )}
                        <LinkIcon style={{ color: '#22c55e' }} />
                        <Box flex={1}>
                          <Text weight="bold">{league.name}</Text>
                          <Text size={0} muted>{league.country}</Text>
                        </Box>
                        <Badge tone="positive" fontSize={0}>ID: {league.apiFootballId}</Badge>
                      </Flex>
                    </Card>
                  ))}
                </Stack>
              )}

              {apiResults.length > 0 && (
                <Stack space={1} padding={2}>
                  <Flex padding={2} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <Text size={1} weight="semibold" style={{ color: '#d97706' }}>
                      Depuis API-Football ({apiResults.length}) - clic = ajout auto
                    </Text>
                  </Flex>
                  {apiResults.map((league) => (
                    <Card key={league.id} padding={3} radius={2} style={{ cursor: 'pointer' }} onClick={() => createAndSelectLeague(league)}>
                      <Flex align="center" gap={3}>
                        {league.logo && (
                          <img src={league.logo} alt={league.name} style={{ width: 32, height: 32, objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                        )}
                        <Box flex={1}>
                          <Flex align="center" gap={2}>
                            <Text weight="bold">{league.name}</Text>
                            <AddIcon style={{ color: '#22c55e' }} />
                          </Flex>
                          <Flex gap={2} marginTop={1}>
                            <Text size={0} style={{ backgroundColor: '#fef3c7', padding: '2px 6px', borderRadius: 4 }}>{league.country}</Text>
                            <Text size={0} style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{league.type}</Text>
                          </Flex>
                        </Box>
                        <Text size={0} style={{ backgroundColor: '#fef3c7', padding: '4px 8px', borderRadius: 4, color: '#92400e' }}>ID: {league.id}</Text>
                      </Flex>
                    </Card>
                  ))}
                </Stack>
              )}
            </Card>
          )}

          {showResults && sanityResults.length === 0 && apiResults.length === 0 && searchQuery.length >= 2 && !loading && (
            <Card padding={3} tone="caution" radius={2}>
              <Text>Aucun championnat trouvé pour "{searchQuery}"</Text>
              <Text size={1} muted style={{ marginTop: 4 }}>Essaie une autre orthographe (ex: "Ligue 1", "Premier League")</Text>
            </Card>
          )}
        </Stack>
      )}
    </Stack>
  )
}

export default LeagueReferenceInput
