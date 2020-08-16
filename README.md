- [Quick Start](#quick-start)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Upgrading Dependencies](#upgrading-dependencies)
  - [Images](#images)
- [Blog Post Guidelines](#blog-post-formatting-guidelines)
  - [Frontmatter](#frontmatter)
    - [Date](#date)
    - [Summary](#summary)
    - [Slug](#slug)
  - [Footnotes](#footnotes)
  - [Article Notes](#article-notes)
  - [Images](#images)
  - [Edits](#edits)
  - [Header Links](#header-links)
  - [Code Blocks](#code-blocks)
- [Updating Blog Posts](#updating-blog-posts)
  - [ClojureScript Versions](#clojureScript-versions)
  - [Figwheel Versions](#figwheel-versions)
  - [Clojure Survey](#clojure-survey)
  - [Create Reagent App Versions](#create-reagent-app-versions)
- [Special Thanks](#special-thanks)

## Quick start

1. **Clone blog**

   ```sh-
   git clone git@github.com:athomasoriginal/blog.git
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

   > Using `npx` is a dev convience so you do not have to install gatsby globally

Your site is now running at `http://localhost:8000`!

> You'll also see a second link: `http://localhost:8000/___graphql`. This is a tool you can use to experiment with querying your data.

## Configuration

### Environment Variables

- environment variables are required for google analytics. To set these, create an `.env.development` and `.env.production` and set each to look like:

  ```bash
  # Envvironment Variables

  GATSBY_GA_TRACKING_ID=to-come-later
  ```

### Upgrading Dependencies

> You will notice that my dependencies in package.json are exact versions. The reason for this is because of how tools like yarn and npm work. For example, if you run yarn upgrade, yarn looks at your package.json dep versions and will update to the highest version they allow. The problem with this is that semantic versioning is not a respected or consistent metric in JavaScript so a minor change could be breaking. Should it be? No, of course not, but that does not mean it will not be. For safety, we lock down to exact versions.

- Find outdated packages

  ```bash
  yarn outdated
  ```

- Upgrade specific packages in package.json

  ```bash
  yarn upgrade <package-name> --latest
  ```

  > Above is fine if you want to upgrade to latest and to have the package.json also updated.

If you find there are a lot of outdated packages try using

```bash
yarn upgrade --latest --pattern "gatsby-"
```

> Replace "gatsby-" with the common pattern.

### Images

Images used directly in the blog are currently found in the `static` directory.  This strategy forgoes image optimization.  Normally this is not the best choice, but I went this route because for the time being I only have 1 image.  See [Official Gatsby Guide](https://www.gatsbyjs.org/docs/static-folder/) for more details.

## Blog Post Guidelines

### Frontmatter

[Frontmatter](https://www.scribendi.com/academy/articles/front_matter.en.html) is the stuff at the beginning of our `blog-post` markfown files.  The required keys are:

```markdown
---
title: 'Students of the Game: Reloadable Code'
datePublished: '2019-09-29'
dateModified: '2020-04-03'
slug: students-of-the-game-reloadable-code
summary: This is for the students of the game, the ones who want to reloadable code.
author: 'Thomas Mattacchione'
---
```

The rest of this section will dig into each of the items and any guidelines to consider.

#### Date

There are two keys for `dates` in the frontmatter:

- `datePublished` - the original publication date
- `dateModified` - the date the post was last updated

The reason for both is to help the reader assess the relevance of the content.  My goal is to have posts that will continue to be useful as the blog ages so I don't have to continue rewriting everything as I go.

Dates are programmatically formatted, but if there is a need to manually write them be sure that they are formatted as follows:

```bash
# good
09 February 2019

# no bueno
February 09, 2018

# no bueno
2019, 09 February
```

#### Summary

This is a short (140 char max), customm description of the blog post.  I added this because I do not like the `excerpt` provided by `gatsby-transformer-remark` as it's just the first 140 characters of the contents of the post. While you can set it to be whatever you like, I prefer custom excerpts.

Also used for the SEO description

#### Slug

By default, Gatsby uses the file path provided and filename to name your slugs. For example, if you have a markdown file structure like:

```bash
├── blog-posts
│   └── 001-initial-post.md
```

You will end up with a `slug` like `www.my-site.com/001-initial-post/`. For any number of reasons you might want your `slug` to have a different name compared to your directory/filename structure. For example, in the above case you may have used the prefix `001` as a way to organize your blog posts, but you don't actually want to use `001` in the slug as it's for internal use only. To fix this, you can add a `slug` field to your markdown file like this:

```markdown
---
title: 'The first post'
date: '2019-02-10'
slug: my-custom-slug <--- this
---
```

with the above, your slug will now look like `www.my-site.com/my-custom-slug/`. Please also keep in mind rules for naming slugs:

- Custom Slugs

  ```bash
  # good
  my-custom-slug

  # no bueno
  my_custom_slug

  # no bueno
  myCustomSlug
  ```

I perfer lisp case because I feel it's more readable.

> @note The URL segments of the URL can be set in `gatsby-node.js`.

Also used for the SEO `ogURL`

### Footnotes

Footnotes are great when you have additional comments to make which are valuable to reveal nuance, but not so valuable as to be front and center with the main content.

```html
<a href="#footnotes" aria-describedby="footnote-label" id="footnotes-ref"
  >methods</a
>

<aside>
  <h2>Footnotes</h2>
  <ol>
    <li id="footnotes">
      This is the footnote about methods
      <a href="#footnotes-ref" aria-label="Back to content">Back</a>
    </li>
  </ol>
</aside>
```

We provide aria-labels for everything and we also add an `aside` at the bottom which is where we put the footnotes.

**How do I number footnotes?**

You don't.  We do this programmatically with CSS.  Having said this, you do need to be sure everything is in the correct order.

### Article Notes

These are the large yellow blocks of text in our `blog-posts`.  We use this to bring attention to a particular detail.  For example, clarifying an assumption, or giving the reader additional directions to make the article clearer.

Theare are marked up as follows:

```html
<aside class="blog-content__note">immport text here</aside>
```

Also keep in mind that if you use `<aside/>` the text inside will not be parsed correctly so things like `backticks` or `links` will not be formatted. To regain formatting, please use

```html
<code class="gatsby-code-text">...</code>

/* or */

<a class="article__link" href="https://pages.github.com/" target=" _blank"
  >...</a
>
```

### Images

- Image that appear in a blog post should go in: `pages/blog/images`.
- Images should be prefixed with the same 3 digit code as your blog-post.
  For example, if your blog is `001-...` your image should be titled `001-image-name-0f-your-choosing`.
- Example of referencing an image in a blog post

  ```markdown
  ![screenshot of example hello clojurescript site](/001-image-hello-cljs-dev-example.png)
  ```

### Edits

It's fine to edit blog posts.  Please do so on a separate branch.  Title your branch with the following format:

```bash
# article format
update > Blog Post ID > purpose

# example
update-000-cleanup-links
```

And then each commit should follow a convention like

```bash
# commit format
Verb > Blog Post ID > Note about changes

# example
Update Post - 000 - add note about Gotchas
```

Once completed, make a PR.

### Header Links

A header link is when the headers each have their own hyperlink associated to them to make bookmmarking and quick navigation through the post possible.

We achieve this through an [additional plugin](https://www.gatsbyjs.org/packages/gatsby-remark-autolink-headers/) which automatically adds this functionality.

### Code Blocks

When writing code blocks you can do a few cool things to help improve their quality.  Here are some of the ones I have used below and see [gatsby-remark-prism](https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/) for a reference of what can be done.

- [Line Numbers](https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/#line-numbering)
  Useful when we want to reference line numbers.  I like to use this if I have to reference a specific line number in the text.

- [Line Highlighting](https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/#line-highlighting)
  Useful when we want to assist readers and draw their attention to a line.  This is different from the line numbers because we likely just want to focus on a change, but won't need to discuss the change in the text below the code block.

## Updating Blog Posts

Keeping blog posts updated is important because it ensures that the work stays relevant and therefore useful to future readers.  With CLJ(s) this is easier because of the stability of the ecosystem.  Either way though, here is an outline of artifacts that need to be updated:

### ClojureScript Versions

- post - 000 - deploy cljs github
- demo - https://github.com/athomasoriginal/demo-clojurescript-gh-pages
- post - 001 - cljs app from scratch
- post - 003 - cljs tests
- video - 016 - figwheel

### Figwheel Versions

- post - 001 - cljs app from scratch
- post - 003 - cljs tests

### Clojure Survey

- post - 001 - cljs app from scratch

### Create Reagent App Versions

- post - 003 - cljs tests
- post - 005 - deploy cljs nginx

### Atom Editor

- post - 006 - chlorine (e.g. no longer depends on Ink)
- video - https://www.youtube.com/watch?v=mEcOwtRt0f4

## Special Thanks

I appreciate everyone who has helped to improve this blog whenever possible. Shoutouts:

### Design

- [Chelsea Murray](https://www.linkedin.com/in/chelseamurraydesign/)

### Illustrations

- [syungb](https://github.com/syungb)

### Content

- [anantpaatra](https://github.com/anantpaatra/)
- [syungb](https://github.com/syungb)
- [lokeh](https://github.com/Lokeh)
- [skidding](https://github.com/skidding)
- [@henrikeneroth](https://twitter.com/henrikeneroth?lang=en)
- [holyjak](https://github.com/holyjak)
- [rogererens](https://github.com/rogererens)
