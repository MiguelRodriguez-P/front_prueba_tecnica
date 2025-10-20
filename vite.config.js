import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Importa el plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Agrega el plugin
  ],
  // Puedes eliminar el bloque 'css.postcss' si usas este plugin
})