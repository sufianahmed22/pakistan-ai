import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// No src/ directory in this project — client/ itself is the Vite root.
// index.html and main.jsx live at the client/ root (see index.html <script src="./main.jsx">).
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@': __dirname,
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor_react: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          vendor_icons: ['lucide-react'],
          vendor_charts: ['recharts'],
          vendor_motion: ['framer-motion'],
          vendor_forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
          vendor_markdown: ['react-markdown', 'remark-gfm'],
        },
      },
    },
  },
});
