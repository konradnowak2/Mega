import base from './vite.config.js';

export default {
  ...base,
  build: {
    outDir: 'rendered',
    manifest: true,
    rollupOptions: { input: 'client.js' },
  },
};
