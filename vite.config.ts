import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import sirv from 'sirv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    // Serve Productos/ and video/ as static directories in dev
    {
      name: 'serve-local-assets',
      configureServer(server) {
        server.middlewares.use(
          '/Productos',
          sirv(path.resolve(__dirname, 'Productos'), { dev: true, etag: true })
        )
        server.middlewares.use(
          '/video',
          sirv(path.resolve(__dirname, 'video'), { dev: true, etag: true })
        )
      },
    },
    // Copy Productos/ and video/ into dist/ for production builds
    viteStaticCopy({
      targets: [
        { src: 'Productos', dest: '.' },
        { src: 'video', dest: '.' },
      ],
    }),
  ],
  server: {
    port: 3000,
  },
})
