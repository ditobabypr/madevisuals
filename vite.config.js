import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // This project lives inside a OneDrive-synced folder — OneDrive's own
    // file-sync activity doesn't reliably fire the native filesystem events
    // chokidar (Vite's watcher) depends on, so edits (especially to public/
    // assets) can silently fail to trigger a reload. Polling instead of
    // waiting on those events fixes it, at the cost of a little CPU.
    watch: {
      usePolling: true,
      interval: 100,
    },
    // Static files in public/ (logos, videos, posters) were getting served
    // from browser cache under their unchanged URL after being swapped on
    // disk, showing the old file until a hard refresh.
    headers: {
      'Cache-Control': 'no-store',
    },
  },
})
