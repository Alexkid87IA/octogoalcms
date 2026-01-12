// components/ClubReferenceInput.jsx
// Composant de recherche club intelligent pour le type clubLink
// Recherche dans Sanity ET API-Football, crée le club automatiquement si besoin

import { useState, useCallback, useEffect } from 'react'
import { set, unset, useClient } from 'sanity'
import { TextInput, Stack, Card, Text, Flex, Box, Spinner, Button, Badge } from '@sanity/ui'
import { SearchIcon, AddIcon, LinkIcon, HomeIcon, CloseIcon } from '@sanity/icons'

const generateKey = () => Math.random().toString(36).substring(2, 10)
const API_HOST = '/api-football'

export function ClubReferenceInput(props) {
  const { onChange, value, path } = props
  const client = useClient({ apiVersion: '2024-01-01' })

  const clubRef = value?.club?._ref

  const [searchQuery, setSearchQuery] = useState('')
  const [sanityResults, setSanityResults] = useState([])
  const [apiResults, setApiResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [selectedClub, setSelectedClub] = useState(null)

  useEffect(() => {
    if (clubRef) {
      client.fetch(`*[_id == $id][0]{ _id, name, apiFootballId }`, { id: clubRef })
        .then(club => {
          if (club) setSelectedClub(club)
        })
        .catch(console.error)
    } else {
      setSelectedClub(null)
    }
  }, [clubRef, client])

  const search = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSanityResults([])
      setApiResults([])
      setShowResults(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Recherche dans Sanity
      const sanityClubs = await client.fetch(
        `*[_type == "club" && name match $query + "*"][0...5]{ _id, name, apiFootballId }`,
        { query }
      )
      setSanityResults(sanityClubs || [])

      // Recherche dans API-Football
      const response = await fetch(`${API_HOST}/teams?search=${encodeURIComponent(query)}`)

      if (response.ok) {
        const data = await response.json()
        if (data.response && data.response.length > 0) {
          const clubs = data.response
            .map(item => ({
              id: item.team.id,
              name: item.team.name,
              logo: item.team.logo,
              country: item.team.country,
              venue: item.venue?.name || '',
              city: item.venue?.city || ''
            }))
            .filter((club, index, self) =>
              index === self.findIndex(c => c.id === club.id)
            )
            .filter(apiClub =>
              !(sanityClubs || []).some(sc => sc.apiFootballId === apiClub.id)
            )
            .slice(0, 10)

          setApiResults(clubs)
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

  const selectExistingClub = (club) => {
    setSelectedClub(club)
    setShowResults(false)
    setSearchQuery('')
    onChange(set({
      _type: 'clubLink',
      _key: generateKey(),
      club: { _type: 'reference', _ref: club._id }
    }))
  }

  const createAndSelectClub = async (apiClub) => {
    setCreating(true)
    setError(null)
    try {
      const newClub = await client.create({
        _type: 'club',
        name: apiClub.name,
        apiFootballId: apiClub.id
      })

      setSelectedClub({ _id: newClub._id, name: apiClub.name, apiFootballId: apiClub.id })
      setShowResults(false)
      setSearchQuery('')

      onChange(set({
        _type: 'clubLink',
        _key: generateKey(),
        club: { _type: 'reference', _ref: newClub._id }
      }))
    } catch (err) {
      setError('Erreur lors de la création')
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const clearSelection = () => {
    setSelectedClub(null)
    onChange(unset())
  }

  return (
    <Stack space={2}>
      {selectedClub && (
        <Card padding={3} radius={2} tone="positive" style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}>
          <Flex align="center" gap={3}>
            <Flex align="center" justify="center" style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#dcfce7', border: '2px solid #22c55e' }}>
              <HomeIcon style={{ color: '#22c55e', fontSize: 20 }} />
            </Flex>
            <Box flex={1}>
              <Text weight="bold" size={2}>{selectedClub.name}</Text>
              <Text size={1} muted>API-Football ID: {selectedClub.apiFootballId}</Text>
            </Box>
            <Button icon={CloseIcon} mode="ghost" tone="critical" onClick={clearSelection} padding={2} />
          </Flex>
        </Card>
      )}

      {!selectedClub && (
        <Stack space={3}>
          <Card padding={3} radius={2} style={{ backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b' }}>
            <Text size={1}>
              <strong>Recherche de club</strong> : tape un nom (min 2 lettres), sélectionne le club.
              S'il n'existe pas, il sera créé automatiquement.
            </Text>
          </Card>

          <Flex gap={2} align="center">
            <Box flex={1}>
              <TextInput
                placeholder="Ex: PSG, Real Madrid, Manchester..."
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
                  {sanityResults.map((club) => (
                    <Card key={club._id} padding={3} radius={2} style={{ cursor: 'pointer', backgroundColor: '#f0fdf4' }} onClick={() => selectExistingClub(club)}>
                      <Flex align="center" gap={3}>
                        <LinkIcon style={{ color: '#22c55e' }} />
                        <Box flex={1}><Text weight="bold">{club.name}</Text></Box>
                        <Badge tone="positive" fontSize={0}>ID: {club.apiFootballId}</Badge>
                      </Flex>
                    </Card>
                  ))}
                </Stack>
              )}

              {apiResults.length > 0 && (
                <Stack space={1} padding={2}>
                  <Flex padding={2} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <Text size={1} weight="semibold" style={{ color: '#d97706' }}>
                      Depuis API-Football ({apiResults.length}) - clic = création auto
                    </Text>
                  </Flex>
                  {apiResults.map((club) => (
                    <Card key={club.id} padding={3} radius={2} style={{ cursor: 'pointer' }} onClick={() => createAndSelectClub(club)}>
                      <Flex align="center" gap={3}>
                        {club.logo && (
                          <img src={club.logo} alt={club.name} style={{ width: 36, height: 36, objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                        )}
                        <Box flex={1}>
                          <Flex align="center" gap={2}>
                            <Text weight="bold">{club.name}</Text>
                            <AddIcon style={{ color: '#22c55e' }} />
                          </Flex>
                          <Flex gap={2} marginTop={1}>
                            {club.country && <Text size={0} style={{ backgroundColor: '#fef3c7', padding: '2px 6px', borderRadius: 4 }}>{club.country}</Text>}
                            {club.city && <Text size={0} style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{club.city}</Text>}
                          </Flex>
                        </Box>
                        <Text size={0} style={{ backgroundColor: '#fef3c7', padding: '4px 8px', borderRadius: 4, color: '#92400e' }}>ID: {club.id}</Text>
                      </Flex>
                    </Card>
                  ))}
                </Stack>
              )}
            </Card>
          )}

          {showResults && sanityResults.length === 0 && apiResults.length === 0 && searchQuery.length >= 2 && !loading && (
            <Card padding={3} tone="caution" radius={2}>
              <Text>Aucun club trouvé pour "{searchQuery}"</Text>
              <Text size={1} muted style={{ marginTop: 4 }}>Essaie une autre orthographe</Text>
            </Card>
          )}
        </Stack>
      )}
    </Stack>
  )
}

export default ClubReferenceInput
