import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    hookTimeout: 180000, // 3 minutes for initial binary cache
    testTimeout: 60000,
  },
});
