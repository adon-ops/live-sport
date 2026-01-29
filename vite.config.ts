import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
    ],
    resolve: process.env.USE_SOURCE
        ? {
              alias: {
                  'react-router': path.resolve(__dirname, 'react-router/index.ts'),
                  'react-router-dom': path.resolve(
                      __dirname,
                      'react-router-dom/index.tsx'
                  ),
              },
          }
        : {},
});
