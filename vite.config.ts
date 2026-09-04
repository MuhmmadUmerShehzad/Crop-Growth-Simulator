import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'unity-webgl-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url) {
            const cleanUrl = req.url.split('?')[0];
            if (cleanUrl.endsWith('.wasm.unityweb')) {
              res.setHeader('Content-Type', 'application/wasm');
            } else if (cleanUrl.endsWith('.framework.js.unityweb') || cleanUrl.endsWith('.js.unityweb')) {
              res.setHeader('Content-Type', 'application/javascript');
            } else if (cleanUrl.endsWith('.data.unityweb')) {
              res.setHeader('Content-Type', 'application/octet-stream');
            } else if (cleanUrl.endsWith('.wasm.br')) {
              res.setHeader('Content-Type', 'application/wasm');
              res.setHeader('Content-Encoding', 'br');
            } else if (cleanUrl.endsWith('.framework.js.br') || cleanUrl.endsWith('.js.br')) {
              res.setHeader('Content-Type', 'application/javascript');
              res.setHeader('Content-Encoding', 'br');
            } else if (cleanUrl.endsWith('.data.br')) {
              res.setHeader('Content-Type', 'application/octet-stream');
              res.setHeader('Content-Encoding', 'br');
            }
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 3000,
    open: true,
    watch: {
      ignored: ['**/*.csv', '**/Data/**', '**/public/unitybuild/**'],
    },
    proxy: {
      '/api': {
        target: 'https://web-production-03afe.up.railway.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

