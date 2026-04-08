import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: './',  // Changed from '/FUTURE_FS_01/' to './' for better routing
})