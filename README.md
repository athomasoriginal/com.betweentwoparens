- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Article Formatting Guidelines](#article-formatting-guidelines)
  - [Date](#date)
  - [Summary](#summary)
  - [Slug](#slug)
  - [Footnotes](#footnotes)
  - [Article Notes](#article-notes)
  - [Images](#images)

## Quick start

1. **Clone blog**

   ```sh
   git clone git@github.com:tkjone/blog.git
   ```

1. **Install blog dependencies**

   ```sh
   yarn install
   ```

   > run this command from the root of blog

1. **Start blog**

   ```sh
   npx gatsby develop
   ```

   > Using `npx` means you do not have to install gatsby globally

Your site is now running at `http://localhost:8000`!

> You'll also see a second link: `http://localhost:8000/___graphql`. This is a tool you can use to experiment with querying your data.

## Configuration

- environment variables are required for google analytics. To set these, create an `.env.development` and `.env.production` and set each to look like:

  ```bash
  # Envvironment Variables

  GATSBY_GA_TRACKING_ID=to-come-later
  ```

## Article Formatting Guidelines

### Date

- Date Formatting

  ```bash
  # bad
  February 09, 2018

  # bad
  2019, 09 February

  # good
  09 February 2019
  ```

> For a blog post to have properly formatted dates you must include the date in the blog posts markdown frontmatter

### Summary

`gatsby-transformer-remark` will provide you with what they call an `excerpt` of the content in your markdown file. The `excerpt` is the first 140 characters of your markdown file. While you can set it to be whatever you like, I prefer custom excerpts. Thus, to add a custom excerpt you must add a `summary` field to your `frontmatter`. Please limit to 140 characters.

### Slug

By default Gatsby will use the file path provided and filename to provide your slugs with names. For example, if you have a markdown file structure like:

```bash
├── articles
│   └── 001-initial-post.md
```

You will end up with a `slug` like `www.my-site.com/articles/001-initial-post/`. For any number of reasons you might want your `slug` to have a different name compared to your directory/filename structure. For example, in the above case you may have used the prefix `001` as a way to organize your blog posts, but you don't actually want to use `001` in the slug as it's for internal use only. To fix this, you can add a `slug` field to your markdown file like this:

```markdown
---
title: 'The first post'
date: '2019-02-10'
slug: my-custom-slug <--- this
---
```

with the above, your slug will now look like `www.my-site.com/articles/my-custom-slug/`. Please also keep in mind rules for naming slugs:

- Custom Slugs

  ```bash
  # bad
  my_custom_slug

  # bad
  myCustomSlug

  # good
  my-custom-slug
  ```

  > perfer lisp case as I feel it is more readable

> @note The `articles` segment of the URL example is hardcoded in `gatsby-node.js`. Feel free to change it if needed.

### Footnotes

Footnotes are great when you have additional clarifying comments or want to credit someone else work etc. For this reason, I provide a quick way of adding footnotes to your blog posts.

```html
<a href="#footnotes" aria-describedby="footnote-label" id="footnotes-ref">methods</a


<aside>
  <h2>Footnotes</h2>
  <ol>
    <li id="footnotes">This is the footnote about methods <a href="#footnotes-ref" aria-label="Back to content">↩</a></li>
  </ol>
</aside>
```

We provide aria-labels for everything and we also add an `aside` at the bottom which is where we put the footers.

Note that you do not need to manually add numbers to the footnotes. This is because we have setup the CSS to dynamically count your footnotes. Having said this, you do need to put them in the correct order in the aside section at the bottom.

### Article Notes

These are marked up as `<asides/>` and used in blog posts to make a clarification inline. When should a clarification be made inline vs. in a footnote? Just ask yourself how important is it to have the additional information highlighting inline. Its subjective.

Also keep in mind that if you use `<aside/>` the text inside will not be parsed correctly so things like backticks or links will not be formatted. To regain formatting, please use

```html
<code class="gatsby-code-text">...</code>

/* or */

<a class="article__link" href="https://pages.github.com/" target=" _blank"
  >...</a
>
```

### Images

- All blog images should live in `pages/blog/images`.
- Please prefix each image with the same 3 digit code as your blog post. For example, if your blog is `001-...` your image name should also begin with `001-image-name-0f-your-choosing`.
- Example of how to reference your images in a blog post

  ```markdown
  ![screenshot of example hello clojurescript site](/001-image-hello-cljs-dev-example.png)
  ```
