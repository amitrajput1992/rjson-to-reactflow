import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Add any path aliases here if needed
      // '@': resolve(__dirname, 'src'),
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      path: 'path-browserify',
      fs: 'browserify-fs',
      os: 'os-browserify',
      process: 'process/browser',
      buffer: 'buffer',
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
    include: ['@gmetrixr/gdash', '@gmetrixr/project-rjson'],
  },
  build: {
    outDir: 'build',
    emptyOutDir: true, // also necessary
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
