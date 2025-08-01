// https://vitejs.dev/config/
import { defineConfig } from 'vite';
import path from 'path';
import viteSourceLocator from 'your-source-locator-plugin'; // Replace with actual import
import react from '@vitejs/plugin-react'; // Assuming this is your import

export default defineConfig(({ mode }) => ({
  base: '/linkedin-booster/', // Add this line for GitHub Pages
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
