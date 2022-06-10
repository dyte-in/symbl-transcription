import { defineConfig } from 'vite';
import pkg from './package.json';

const publicDependencies = Object.keys(pkg.dependencies).filter((dependency) => !dependency.startsWith('@dyte-in/'));

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['cjs', 'es'],
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: publicDependencies,
        },
    },
});
