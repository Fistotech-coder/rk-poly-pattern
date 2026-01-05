import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  //  base: "RK_POLY_APP_2",
    assetsInclude: ["**/*.glb", "**/*.gltf"]
})
