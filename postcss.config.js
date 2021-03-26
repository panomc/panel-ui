const production = !process.env.ROLLUP_WATCH;
const autoprefixer = require("autoprefixer");
const postcssImport = require("postcss-import");
const cssnano = require("cssnano");

module.exports = {
  plugins: [
    postcssImport(),
    autoprefixer(),
    production &&
      cssnano({
        preset: "default",
      }),
  ],
};
