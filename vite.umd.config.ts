import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        emptyOutDir: false,
        lib: {
            name: 'DyteClient',
            entry: 'src/index.ts',
            formats: ['umd'],
            fileName: (format) => `index.${format}.js`,
        },
    },
});
