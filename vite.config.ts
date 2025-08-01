import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react'; 
// Import your actual source locator plugin
import viteSourceLocator from 'vite-plugin-source-locator'; // Adjust if different

export default defineConfig(({ mode }) => ({
  base: '/linkedin-booster/', // Must match repo name exactly
  plugins: [
    viteSourceLocator({
      prefix: "mgx",
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
