// components/PlayerSearchInput.jsx
// Composant de recherche de joueur via API-Football
// Tape un nom → recherche automatique → sélectionne → ID + nom auto-remplis

import { useState, useCallback, useEffect } from 'react'
import { set, unset, useFormValue } from 'sanity'
import { TextInput, Stack, Card, Text, Flex, Box, Spinner, Button } from '@sanity/ui'
import { SearchIcon, CheckmarkCircleIcon, UserIcon } from '@sanity/icons'

// Utilise le proxy local pour éviter les erreurs CORS
const API_HOST = '/api-football'

export function PlayerSearchInput(props) {
  const { onChange, value, path } = props

  // Récupérer le nom actuel du document
  const currentName = useFormValue(['name'])

  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [showResults, setShowResults] = useState(false)

  // Recherche de joueurs via API-Football
  const searchPlayers = useCallback(async (query) => {
    if (!query || query.length < 3) {
      setResults([])
      setShowResults(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Recherche dans les 5 grands championnats en parallèle
      const leagues = [61, 39, 140, 135, 78] // Ligue 1, PL, La Liga, Serie A, Bundesliga
      const apiPromises = leagues.map(league =>
        fetch(`${API_HOST}/players?search=${encodeURIComponent(query)}&league=${league}&season=2024`)
          .then(r => r.ok ? r.json() : { response: [] })
          .catch(() => ({ response: [] }))
      )
      const apiResponses = await Promise.all(apiPromises)
      const allResults = apiResponses.flatMap(data => data.response || [])

      if (allResults.length > 0) {
        const players = allResults
          .map(item => ({
            id: item.player.id,
            name: item.player.name,
            firstname: item.player.firstname,
            lastname: item.player.lastname,
            photo: item.player.photo,
            age: item.player.age,
            nationality: item.player.nationality,
            team: item.statistics?.[0]?.team?.name || 'Sans club',
            teamLogo: item.statistics?.[0]?.team?.logo,
            position: item.statistics?.[0]?.games?.position || '',
            league: item.statistics?.[0]?.league?.name || ''
          }))
          .filter((player, index, self) =>
            index === self.findIndex(p => p.id === player.id)
          )
          .slice(0, 12)

        setResults(players)
        setShowResults(true)
      } else {
        setResults([])
        setShowResults(true)
      }
    } catch (err) {
      setError('Erreur lors de la recherche. Vérifie ta connexion.')
      console.error('API Football error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce la recherche (attendre 500ms après la frappe)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        searchPlayers(searchQuery)
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, searchPlayers])

  // Sélectionner un joueur
  const selectPlayer = (player) => {
    setSelectedPlayer(player)
    setShowResults(false)
    setSearchQuery('')

    // Mettre à jour l'ID API-Football
    onChange(set(player.id))
  }

  // Effacer la sélection
  const clearSelection = () => {
    setSelectedPlayer(null)
    onChange(unset())
  }

  // Position traduite
  const translatePosition = (pos) => {
    const positions = {
      'Goalkeeper': 'Gardien',
      'Defender': 'Défenseur',
      'Midfielder': 'Milieu',
      'Attacker': 'Attaquant'
    }
    return positions[pos] || pos
  }

  return (
    <Stack space={3}>
      {/* Joueur sélectionné ou déjà existant */}
      {(selectedPlayer || value) && (
        <Card padding={3} radius={2} shadow={1} tone="positive" style={{ backgroundColor: '#f0fdf4' }}>
          <Flex align="center" gap={3}>
            {selectedPlayer?.photo ? (
              <img
                src={selectedPlayer.photo}
                alt={selectedPlayer.name}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #22c55e'
                }}
              />
            ) : (
              <Flex
                align="center"
                justify="center"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  border: '3px solid #22c55e'
                }}
              >
                <UserIcon style={{ fontSize: 24, color: '#22c55e' }} />
              </Flex>
            )}
            <Box flex={1}>
              <Flex align="center" gap={2}>
                <CheckmarkCircleIcon style={{ color: '#22c55e', fontSize: 20 }} />
                <Text weight="bold" size={2}>
                  {selectedPlayer?.name || currentName || 'Joueur sélectionné'}
                </Text>
              </Flex>
              <Text size={1} muted style={{ marginTop: 4 }}>
                {selectedPlayer ? (
                  <>
                    {selectedPlayer.team}
                    {selectedPlayer.position && ` • ${translatePosition(selectedPlayer.position)}`}
                    {selectedPlayer.nationality && ` • ${selectedPlayer.nationality}`}
                  </>
                ) : (
                  `ID API-Football: ${value}`
                )}
              </Text>
              <Text size={0} style={{ marginTop: 4, color: '#16a34a', fontWeight: 600 }}>
                ID: {selectedPlayer?.id || value}
              </Text>
            </Box>
            <Button
              text="Changer"
              tone="caution"
              mode="ghost"
              onClick={clearSelection}
              style={{ flexShrink: 0 }}
            />
          </Flex>

          {selectedPlayer && (
            <Card padding={2} marginTop={3} radius={2} tone="primary" style={{ backgroundColor: '#eff6ff' }}>
              <Text size={1}>
                <strong>N'oublie pas</strong> de remplir le champ "Nom du joueur" ci-dessous avec : <strong>{selectedPlayer.name}</strong>
              </Text>
            </Card>
          )}
        </Card>
      )}

      {/* Champ de recherche */}
      {!selectedPlayer && !value && (
        <Stack space={3}>
          <Card padding={3} radius={2} tone="primary" style={{ backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6' }}>
            <Text size={1} weight="semibold" style={{ color: '#1d4ed8' }}>
              Comment ça marche ?
            </Text>
            <Text size={1} muted style={{ marginTop: 4 }}>
              1. Tape le nom d'un joueur (min. 3 lettres)<br/>
              2. Sélectionne le bon joueur dans la liste<br/>
              3. L'ID sera automatiquement rempli
            </Text>
          </Card>

          <Flex align="center" gap={2}>
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
            {loading && <Spinner />}
          </Flex>

          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <Text size={1} muted>Encore {3 - searchQuery.length} caractère(s)...</Text>
          )}

          {error && (
            <Card padding={3} tone="critical" radius={2}>
              <Text size={1}>{error}</Text>
            </Card>
          )}

          {/* Résultats de recherche */}
          {showResults && results.length > 0 && (
            <Card padding={2} radius={2} shadow={2} style={{ maxHeight: 450, overflowY: 'auto' }}>
              <Stack space={1}>
                <Flex padding={2} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <Text size={1} weight="semibold" style={{ color: '#6b7280' }}>
                    {results.length} résultat(s) pour "{searchQuery}"
                  </Text>
                </Flex>
                {results.map((player) => (
                  <Card
                    key={player.id}
                    padding={3}
                    radius={2}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid transparent'
                    }}
                    tone="default"
                    onClick={() => selectPlayer(player)}
                  >
                    <Flex align="center" gap={3}>
                      <img
                        src={player.photo}
                        alt={player.name}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #e5e7eb'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://media.api-sports.io/football/players/0.png'
                        }}
                      />
                      {player.teamLogo && (
                        <img
                          src={player.teamLogo}
                          alt={player.team}
                          style={{ width: 28, height: 28 }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      )}
                      <Box flex={1}>
                        <Text weight="bold" size={2}>{player.name}</Text>
                        <Text size={1} muted style={{ marginTop: 2 }}>
                          {player.team}
                          {player.league && ` • ${player.league}`}
                        </Text>
                        <Flex gap={2} marginTop={1}>
                          {player.position && (
                            <Text size={0} style={{
                              backgroundColor: '#f3f4f6',
                              padding: '2px 6px',
                              borderRadius: 4,
                              color: '#4b5563'
                            }}>
                              {translatePosition(player.position)}
                            </Text>
                          )}
                          {player.nationality && (
                            <Text size={0} style={{
                              backgroundColor: '#f3f4f6',
                              padding: '2px 6px',
                              borderRadius: 4,
                              color: '#4b5563'
                            }}>
                              {player.nationality}
                            </Text>
                          )}
                          {player.age && (
                            <Text size={0} style={{
                              backgroundColor: '#f3f4f6',
                              padding: '2px 6px',
                              borderRadius: 4,
                              color: '#4b5563'
                            }}>
                              {player.age} ans
                            </Text>
                          )}
                        </Flex>
                      </Box>
                      <Text size={0} style={{
                        backgroundColor: '#dbeafe',
                        padding: '4px 8px',
                        borderRadius: 4,
                        color: '#1d4ed8',
                        fontWeight: 600
                      }}>
                        ID: {player.id}
                      </Text>
                    </Flex>
                  </Card>
                ))}
              </Stack>
            </Card>
          )}

          {showResults && results.length === 0 && searchQuery.length >= 3 && !loading && (
            <Card padding={4} tone="caution" radius={2}>
              <Stack space={2} align="center">
                <Text size={2}>Aucun joueur trouvé pour "{searchQuery}"</Text>
                <Text size={1} muted>Essaie avec une autre orthographe ou le nom complet</Text>
              </Stack>
            </Card>
          )}
        </Stack>
      )}
    </Stack>
  )
}

export default PlayerSearchInput
