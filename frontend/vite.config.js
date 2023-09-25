import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

return defineConfig({
  server: {
    proxy: {
      '/api': 'https://chat-app-darkielee.vercel.app/'
    }
  },
  plugins: [react()],
})
}