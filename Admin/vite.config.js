import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  server: {
    port: 5174, // <-- change this to your desired port
    open: true, // optional: opens the browser automatically
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  } 
})
