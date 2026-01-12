import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '5rn8u6ed',
    dataset: 'production'
  },
  // Configuration Vite pour le proxy API-Football
  vite: {
    server: {
      proxy: {
        '/api-football': {
          target: 'https://v3.football.api-sports.io',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-football/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('x-apisports-key', 'baddb54e402c0dcdc8d1bae4ebec5474')
            })
          }
        }
      }
    }
  }
})
