import { defineConfig } from '@tanstack/start/config'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react()
  ],
  server: {
    preset: 'vercel'
  },
  vite: {
    resolve: {
      alias: {
        '@': '/app'
      }
    }
  }
})