import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The name the site goes by. The dating build sets VITE_OWNER=Chin; see compose.yaml.
process.env.VITE_OWNER ??= 'Chintamani'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
