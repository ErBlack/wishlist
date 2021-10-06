const yaml = require('yaml');

module.exports = function(eleventyConfig) {
  eleventyConfig.addDataExtension('yml', contents => yaml.parse(contents));
  eleventyConfig.addPassthroughCopy('wishlist');

  return {
    dir: {
      input: "src",
      output: "build"
    },
    passthroughFileCopy: true
  }
};