const fs = require("fs");

const filter = require("./src/filter");

// @note import plugins
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  // @configuration avoid using .gitignore to tell eleventy what should/should
  // not be watched
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addPassthroughCopy("./src/css");

  eleventyConfig.addFilter("dateFilter", filter.dateFilter);

  eleventyConfig.addFilter("w3cDate", filter.w3cDate);

  // @configuration rock an RSS feed
  eleventyConfig.addPlugin(pluginRss);

  // Override Browsersync defaults (used only with --serve)
  // ---------------------------------------------------------------------------
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync("./dist/404.html");
          // Add 404 http status code in request header.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    passthroughFileCopy: true,
  };
};
