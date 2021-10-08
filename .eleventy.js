const yaml = require('yaml');
const Image = require('@11ty/eleventy-img');

async function imageShortcode(src, alt, className) {
    const {
        webp: [data],
    } = await Image(src, {
        outputDir: 'dist/wishlist/img',
        widths: [640],
        formats: ['webp'],
    });

    return `<img class="${className}" src="/wishlist${data.url}" alt="${alt}" loading="lazy" decoding="async">`;
}

async function srcShortcode(src) {
    const {
        webp: [{ url }],
    } = await Image(src, {
        outputDir: 'dist/wishlist/img',
        widths: [512],
        formats: ['webp'],
    });

    return url;
}

module.exports = function (eleventyConfig) {
    eleventyConfig.addDataExtension('yml', contents => yaml.parse(contents));
    eleventyConfig.addPassthroughCopy('wishlist');
    eleventyConfig.addLiquidFilter('isUrl', value => String(value).indexOf('http') === 0);
    eleventyConfig.addLiquidFilter('host', value => new URL(value).host);
    eleventyConfig.addLiquidShortcode('image', imageShortcode);
    eleventyConfig.addLiquidShortcode('src', srcShortcode);

    return {
        dir: {
            input: 'src',
            output: 'dist',
        },
        passthroughFileCopy: true,
    };
};
