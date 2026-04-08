import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/FUTURE_FS_01/',  // ← THIS IS CRITICAL - matches your repo name
})