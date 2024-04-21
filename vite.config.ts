import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import svgNumbers from './src/vite/svg-numbers';

export default defineConfig({
    build: {
        assetsInlineLimit: 1024
    },
    plugins: [sveltekit(), svgNumbers()]
});
