const path = require('node:path');
const postcssGlobalData = require('@csstools/postcss-global-data');
const postcssCustomMedia = require('postcss-custom-media');

// Makes the breakpoints in src/styles/media.css available to every
// stylesheet, including Astro component <style> blocks.
module.exports = {
  plugins: [
    postcssGlobalData({ files: [path.join(__dirname, 'src/styles/media.css')] }),
    postcssCustomMedia(),
  ],
};
