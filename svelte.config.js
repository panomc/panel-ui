import SveltePreprocess from "svelte-preprocess";
import NodeAdapter from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    legacy: true,
  },
  kit: {
    adapter: NodeAdapter(),

    paths: {
      base: process.env.DEV ? "" : "/panel",
    },
  },

  preprocess: SveltePreprocess(),

  onwarn: (warning, handler) => {
    if (warning.code === "a11y-invalid-attribute") return;
    if (warning.code === "a11y-missing-attribute") return;

    handler(warning);
  },
};

export default config;
