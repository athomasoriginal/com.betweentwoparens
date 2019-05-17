- [Quick Start](#quick-start)
- [Article Formatting Guidelines](#article-formatting-guidelines)
  - [Date](#date)
  - [Summary](#summary)
  - [Slug](#slug)
  - [Footnotes](#footnotes)

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

We provide aria-labels for everything and we also add an `aside` at the bottom which is where we put the footers. You do not need to manually add numbers to the footnotes inside the blog post because our CSS is adding them dynamically, but you do still need to put them in the correct order in the aside section at the bottom.
