// components/PlayerReferenceInput.jsx
// Composant de recherche joueur intelligent pour le type playerLink
// Recherche dans Sanity ET API-Football, crée le joueur automatiquement si besoin

import { useState, useCallback, useEffect } from 'react'
import { set, unset, useClient } from 'sanity'

// Générer une clé unique pour les items d'array
const generateKey = () => Math.random().toString(36).substring(2, 10)
import { TextInput, Stack, Card, Text, Flex, Box, Spinner, Button, Badge } from '@sanity/ui'
import { SearchIcon, AddIcon, LinkIcon, UserIcon, CloseIcon } from '@sanity/icons'

// Utilise le proxy local configuré dans sanity.cli.js
const API_HOST = '/api-football'

export function PlayerReferenceInput(props) {
  const { onChange, value, path } = props
  const client = useClient({ apiVersion: '2024-01-01' })

  const playerRef = value?.player?._ref

  const [searchQuery, setSearchQuery] = useState('')
  const [sanityResults, setSanityResults] = useState([])
  const [apiResults, setApiResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  useEffect(() => {
    if (playerRef) {
      client.fetch(`*[_id == $id][0]{ _id, name, apiFootballId }`, { id: playerRef })
        .then(player => {
          if (player) setSelectedPlayer(player)
        })
        .catch(console.error)
    } else {
      setSelectedPlayer(null)
    }
  }, [playerRef, client])

  const search = useCallback(async (query) => {
    if (!query || query.length < 3) {
      setSanityResults([])
      setApiResults([])
      setShowResults(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Recherche dans Sanity
      const sanityPlayers = await client.fetch(
        `*[_type == "player" && name match $query + "*"][0...5]{ _id, name, apiFootballId }`,
        { query }
      )
      setSanityResults(sanityPlayers || [])

      // Recherche dans API-Football (5 grands championnats)
      const leagues = [61, 39, 140, 135, 78]
      const apiPromises = leagues.map(league =>
        fetch(`${API_HOST}/players?search=${encodeURIComponent(query)}&league=${league}&season=2024`)
          .then(r => r.ok ? r.json() : { response: [] })
          .catch(() => ({ response: [] }))
      )

      const apiResponses = await Promise.all(apiPromises)
      const allApiPlayers = apiResponses.flatMap(data => data.response || [])

      if (allApiPlayers.length > 0) {
        const players = allApiPlayers
          .map(item => ({
            id: item.player.id,
            name: item.player.name,
            photo: item.player.photo,
            nationality: item.player.nationality,
            age: item.player.age,
            team: item.statistics?.[0]?.team?.name || 'Sans club',
            teamLogo: item.statistics?.[0]?.team?.logo,
            position: item.statistics?.[0]?.games?.position || ''
          }))
          .filter((player, index, self) =>
            index === self.findIndex(p => p.id === player.id)
          )
          .filter(apiPlayer =>
            !(sanityPlayers || []).some(sp => sp.apiFootballId === apiPlayer.id)
          )
          .slice(0, 10)

        setApiResults(players)
      } else {
        setApiResults([])
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
      if (searchQuery.length >= 3) {
        search(searchQuery)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, search])

  const selectExistingPlayer = (player) => {
    setSelectedPlayer(player)
    setShowResults(false)
    setSearchQuery('')
    onChange(set({
      _type: 'playerLink',
      _key: generateKey(),
      player: { _type: 'reference', _ref: player._id }
    }))
  }

  const createAndSelectPlayer = async (apiPlayer) => {
    setCreating(true)
    setError(null)
    try {
      const newPlayer = await client.create({
        _type: 'player',
        name: apiPlayer.name,
        apiFootballId: apiPlayer.id,
        isPepite: false,
        isLegend: false,
        isFeatured: false
      })

      setSelectedPlayer({ _id: newPlayer._id, name: apiPlayer.name, apiFootballId: apiPlayer.id })
      setShowResults(false)
      setSearchQuery('')

      onChange(set({
        _type: 'playerLink',
        _key: generateKey(),
        player: { _type: 'reference', _ref: newPlayer._id }
      }))
    } catch (err) {
      setError('Erreur lors de la création')
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const clearSelection = () => {
    setSelectedPlayer(null)
    onChange(unset())
  }

  const translatePosition = (pos) => {
    const positions = { 'Goalkeeper': 'Gardien', 'Defender': 'Défenseur', 'Midfielder': 'Milieu', 'Attacker': 'Attaquant' }
    return positions[pos] || pos
  }

  return (
    <Stack space={2}>
      {selectedPlayer && (
        <Card padding={3} radius={2} tone="positive" style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}>
          <Flex align="center" gap={3}>
            <Flex align="center" justify="center" style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#dcfce7', border: '2px solid #22c55e' }}>
              <UserIcon style={{ color: '#22c55e', fontSize: 20 }} />
            </Flex>
            <Box flex={1}>
              <Text weight="bold" size={2}>{selectedPlayer.name}</Text>
              <Text size={1} muted>API-Football ID: {selectedPlayer.apiFootballId}</Text>
            </Box>
            <Button icon={CloseIcon} mode="ghost" tone="critical" onClick={clearSelection} padding={2} />
          </Flex>
        </Card>
      )}

      {!selectedPlayer && (
        <Stack space={3}>
          <Card padding={3} radius={2} style={{ backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6' }}>
            <Text size={1}>
              <strong>Recherche intelligente</strong> : tape un nom (min 3 lettres), sélectionne le joueur.
              S'il n'existe pas, il sera créé automatiquement.
            </Text>
          </Card>

          <Flex gap={2} align="center">
            <Box flex={1}>
              <TextInput
                placeholder="Ex: Mbappé, Messi, Haaland..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                icon={SearchIcon}
                fontSize={2}
                padding={3}
              />
            </Box>
            {(loading || creating) && <Spinner />}
          </Flex>

          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <Text size={1} muted>Encore {3 - searchQuery.length} caractère(s)...</Text>
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
                  {sanityResults.map((player) => (
                    <Card key={player._id} padding={3} radius={2} style={{ cursor: 'pointer', backgroundColor: '#f0fdf4' }} onClick={() => selectExistingPlayer(player)}>
                      <Flex align="center" gap={3}>
                        <LinkIcon style={{ color: '#22c55e' }} />
                        <Box flex={1}><Text weight="bold">{player.name}</Text></Box>
                        <Badge tone="positive" fontSize={0}>ID: {player.apiFootballId}</Badge>
                      </Flex>
                    </Card>
                  ))}
                </Stack>
              )}

              {apiResults.length > 0 && (
                <Stack space={1} padding={2}>
                  <Flex padding={2} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <Text size={1} weight="semibold" style={{ color: '#2563eb' }}>
                      Depuis API-Football ({apiResults.length}) - clic = création auto
                    </Text>
                  </Flex>
                  {apiResults.map((player) => (
                    <Card key={player.id} padding={3} radius={2} style={{ cursor: 'pointer' }} onClick={() => createAndSelectPlayer(player)}>
                      <Flex align="center" gap={3}>
                        {player.photo && (
                          <img src={player.photo} alt={player.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }} onError={(e) => e.target.style.display = 'none'} />
                        )}
                        {player.teamLogo && (
                          <img src={player.teamLogo} alt={player.team} style={{ width: 24, height: 24 }} onError={(e) => e.target.style.display = 'none'} />
                        )}
                        <Box flex={1}>
                          <Flex align="center" gap={2}>
                            <Text weight="bold">{player.name}</Text>
                            <AddIcon style={{ color: '#22c55e' }} />
                          </Flex>
                          <Flex gap={2} marginTop={1}>
                            <Text size={0} style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{player.team}</Text>
                            {player.position && <Text size={0} style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{translatePosition(player.position)}</Text>}
                          </Flex>
                        </Box>
                        <Text size={0} style={{ backgroundColor: '#dbeafe', padding: '4px 8px', borderRadius: 4, color: '#1d4ed8' }}>ID: {player.id}</Text>
                      </Flex>
                    </Card>
                  ))}
                </Stack>
              )}
            </Card>
          )}

          {showResults && sanityResults.length === 0 && apiResults.length === 0 && searchQuery.length >= 3 && !loading && (
            <Card padding={3} tone="caution" radius={2}>
              <Text>Aucun joueur trouvé pour "{searchQuery}"</Text>
              <Text size={1} muted style={{ marginTop: 4 }}>Essaie une autre orthographe</Text>
            </Card>
          )}
        </Stack>
      )}
    </Stack>
  )
}

export default PlayerReferenceInput
