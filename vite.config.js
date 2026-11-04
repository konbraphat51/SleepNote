import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base './' keeps asset URLs relative so the app works on any GitHub Pages path.
export default defineConfig({
  plugins: [vue()],
  base: './',
})
