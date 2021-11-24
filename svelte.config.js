import SveltePreprocess from "svelte-preprocess";
import NodeAdapter from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    legacy: true,
  },
  kit: {
    adapter: NodeAdapter(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",

    paths: {
      base: process.env.DEV ? "" : "/panel",
    },
  },

  preprocess: SveltePreprocess(),
};

export default config;

// // const sveltePreprocess = require("svelte-preprocess");
// // const pkg = require("./package.json");
//
//
// import node from "@sveltejs/adapter-node"
//
// // import pkg from "./package.json"
//
// /** @type {import('@sveltejs/kit').Config} */
// module.exports = {
//   // Consult https://github.com/sveltejs/svelte-preprocess
//   // for more information about preprocessors
//   preprocess: SveltePreprocess(),
//   kit: {
//     // By default, `npm run build` will create a standard Node app.
//     // You can create optimized builds for different platforms by
//     // specifying a different adapter
//     adapter: node(),
//
//     // hydrate the <div id="svelte"> element in src/app.html
//     target: "#svelte",
//
//     vite: {
//       ssr: {
//         // noExternal: Object.keys(pkg.dependencies || {}),
//       },
//     },
//   },
// };
