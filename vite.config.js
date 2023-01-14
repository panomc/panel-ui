import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  ssr: {
    noExternal: ["chart.js"],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8088'
    }
  }
};

export default config;
