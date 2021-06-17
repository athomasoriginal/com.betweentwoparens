const fs = require("fs");

const filter = require("./src/filter");

const Prism = require("prismjs");
const PrismLoader = require("prismjs/components/index");
PrismLoader(["bash", "js", "clojure"]);

// @note import plugins
const pluginRss = require("@11ty/eleventy-plugin-rss");
const svgContents = require("eleventy-plugin-svg-contents");

const mdOptions = {
  html: true,
  langPrefix: "bride-code-",
};

// @note custom markdown parsing
const markdownIt = require("markdown-it")(mdOptions);
const markdownItAnchor = require("markdown-it-anchor");
const pluginMarkdownTOC = require("eleventy-plugin-toc");

const mdAnchorOpts = {
  permalink: true,
  permalinkClass: "anchor-link",
  permalinkSymbol: "#",
  level: [2],
};

// @note it appears that if you want custom fence html wrapping pre, code you
// must overwrite the fence renderer as follows.  This is outlined in this issue
// https://github.com/markdown-it/markdown-it/issues/269 and in addition, this is
// also documented in the render architecture documentation here:
// https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
// Even with this information, I could just be wrong and was rushing through to
// a solution so if there is something better available, for example, maybe
// specifying the `highlight:` option actually works(?), then we can happily
// replace this.
markdownIt.renderer.rules.fence = function (tokens, idx, options, env, slf) {
  var token = tokens[idx],
    info = token.info ? markdownIt.utils.unescapeAll(token.info).trim() : "",
    langName = "",
    langAttrs = "",
    highlighted,
    i,
    arr,
    tmpAttrs,
    tmpToken;

  if (info) {
    arr = info.split(/(\s+)/g);
    langName = arr[0];
    langAttrs = arr.slice(2).join("");
  }

  highlighted = Prism.highlight(
    token.content,
    Prism.languages[langName],
    langName
  );

  if (info) {
    i = token.attrIndex("class");
    tmpAttrs = token.attrs ? token.attrs.slice() : [];

    if (i < 0) {
      tmpAttrs.push(["class", options.langPrefix + langName]);
    } else {
      tmpAttrs[i] = tmpAttrs[i].slice();
      tmpAttrs[i][1] += " " + options.langPrefix + langName;
    }

    // Fake token just to render attributes
    tmpToken = {
      attrs: tmpAttrs,
    };

    return (
      '<div class="bride-highlight" ' +
      "> <pre" +
      slf.renderAttrs(tmpToken) +
      "><code" +
      slf.renderAttrs(tmpToken) +
      ">" +
      highlighted +
      "</code></pre></div>\n"
    );
  }

  return (
    "<pre><code" +
    slf.renderAttrs(token) +
    ">" +
    highlighted +
    "</code></pre>\n"
  );
};

module.exports = function (eleventyConfig) {
  // @configuration avoid using .gitignore to tell eleventy what should/should
  // not be watched
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addPassthroughCopy("./src/css");

  eleventyConfig.addPassthroughCopy("./src/site.webmanifest");

  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  eleventyConfig.addFilter("dateFilter", filter.dateFilter);

  eleventyConfig.addFilter("w3cDate", filter.w3cDate);

  // @configuration rock an RSS feed
  eleventyConfig.addPlugin(pluginRss);

  // @configuration inline SVG
  eleventyConfig.addPlugin(svgContents);

  // @configuration markdown table of contents
  eleventyConfig.addPlugin(pluginMarkdownTOC);

  // @configuration add custom markdown parsing library
  eleventyConfig.setLibrary(
    "md",
    markdownIt.use(markdownItAnchor, mdAnchorOpts)
  );

  // Override Browsersync defaults (used only with --serve)
  // ---------------------------------------------------------------------------
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync("./dist/404.html");
          // Add 404 http status code in request header.
          res.writeHead(404, {"Content-Type": "text/html; charset=UTF-8"});
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
