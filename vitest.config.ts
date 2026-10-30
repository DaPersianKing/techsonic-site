import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    restoreMocks: true,
    // Keep jsdom workers within a predictable memory/CPU budget on local and CI hosts.
    maxWorkers: 2,
  },
});
