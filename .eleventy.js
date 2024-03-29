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
const mdIterator = require("markdown-it-for-inline");
const customContainer = require("markdown-it-container");
const markdownItAnchor = require("markdown-it-anchor");
const pluginMarkdownTOC = require("eleventy-plugin-toc");

const mdAnchorOpts = {
  permalink: markdownItAnchor.permalink.headerLink(),
  permalinkSymbol: "#",
  level: [2, 3],
};

const isEmpty = function (value) {
  return !value || value == undefined || value == "" || value.length == 0;
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

  eleventyConfig.addPassthroughCopy("./src/images");

  eleventyConfig.addPassthroughCopy("./src/css");

  eleventyConfig.addPassthroughCopy("./src/site.webmanifest");

  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  eleventyConfig.addPassthroughCopy("./src/_redirects");

  eleventyConfig.addFilter("dateFilter", filter.dateFilter);

  eleventyConfig.addFilter("w3cDate", filter.w3cDate);

  // @configuration rock an RSS feed
  eleventyConfig.addPlugin(pluginRss);

  // @configuration inline SVG
  eleventyConfig.addPlugin(svgContents);

  eleventyConfig.addCollection("blogPosts", function (collectionApi) {
    return collectionApi.getFilteredByTag("post").sort(function (a, b) {
      dateA = new Date(b.data.createdDate);
      dateB = new Date(a.data.createdDate);
      return dateA - dateB;
    });
  });

  // @configuration markdown table of contents.  If you change this, be sure to
  // also consider changing the anchor links because the anchor links + this
  // component work together
  eleventyConfig.addPlugin(pluginMarkdownTOC, {
    tags: ["h2", "h3"],
    ul: true,
  });

  // @todo this is terrible.  It's a container to hold the current footnote value
  // for the custom markdown block further down in this file.
  let currentTag;

  // @configuration configure and add custom markdown parsing library
  const markdownLibrary = markdownIt
    .use(mdIterator, "url_new_win", "link_open", function (tokens, idx) {
      const [attrName, href] = tokens[idx].attrs.find(
        (attr) => attr[0] === "href"
      );

      if (href && !href.startsWith("/") && !href.startsWith("#")) {
        tokens[idx].attrPush(["target", "_blank"]);
        tokens[idx].attrPush(["rel", "noopener noreferrer"]);
      }
    })
    .use(markdownItAnchor, mdAnchorOpts)
    .use(customContainer, "note", {
      validate: function (params) {
        return params.trim() === "note";
      },
      // @note this goes word by word and parses them.  So, when it sees
      // ::: note blah ::: this bit of code will see that there is a ::: note
      // and lay down the opening HTML structure, put everything inside of the
      // html, in this case `blah`, into the html structure and then close it off
      // when it sees :::
      render: function (tokens, idx) {
        if (tokens[idx].nesting === 1) {
          // opening tag
          return '<aside class="blog-content__note">';
        } else {
          // closing tag
          return "</aside>";
        }
      },
    })
    .use(customContainer, "footnotes", {
      validate: function (params) {
        return params.trim() === "footnotes";
      },
      // @note ::: footnotes :::
      render: function (tokens, idx) {
        if (tokens[idx].nesting === 1) {
          // opening tag
          return "<aside class='footnote-container'><h3>Footnotes</h3><ol>";
        } else {
          // closing tag
          return "</ol></aside>";
        }
      },
    })
    .use(customContainer, "footnote", {
      marker: "->",
      validate: function (params) {
        return params.trim().split("#")[0] === "footnote";
      },
      // @note ::: footnotes ::: or ::: footnotes#id-arg :::
      render: function (tokens, idx) {
        if (tokens[idx].nesting === 1) {
          // opening tag
          currentTag = tokens[idx].info.trim().split("#");
          let openTag = isEmpty(currentTag[1])
            ? "<li>"
            : `<li id=${currentTag[1]}>`;
          return openTag;
        } else {
          // closing tag
          return `<a href='#${currentTag[1]}-ref' aria-label='Back to content'>Back</a></li>`;
        }
      },
    });

  eleventyConfig.setLibrary("md", markdownLibrary);

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
