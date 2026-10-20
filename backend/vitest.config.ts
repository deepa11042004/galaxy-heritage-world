import { defineConfig } from 'vitest/config';

// Integration tests talk to the (remote) MySQL database, so allow generous timeouts.
export default defineConfig({ test: { testTimeout: 60000, hookTimeout: 120000, fileParallelism: false } });
