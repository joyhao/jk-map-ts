import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import path from 'path';
const pathSrc = path.resolve(__dirname, 'src');

export default defineConfig({
  plugins: [glsl()],
  resolve: {
    alias: {
      '@': pathSrc,
      '@cqMap': pathSrc + '/cqMap'
    }
  }
});
