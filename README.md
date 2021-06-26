# Between Two Parens

[![Netlify Status](https://api.netlify.com/api/v1/badges/c8e124ff-8904-4c9b-a8b4-97fefd4a13e4/deploy-status)](https://app.netlify.com/sites/epic-goldwasser-028edc/deploys)

- [Housekeeping]
- [Quickstart]
- [Project Commands]
- [Upgrade Dependencies]
- [Blog Features]
- [Data Usage]
- [Blog Post Guidelines]
  - [Frontmatter]
  - [Images]
  - [Article Notes]
  - [Updating Blog Posts]
  - [Updating Blog Checklist]
- [Before Dev]
- [Before Deploy]
- [Special Thanks]
  - [Design]
  - [Illustrations]
  - [Content]


## Housekeeping

Be sure to have the following tools installed

- [Node]
- [Yarn]

## Quickstart

- Create a project directory
  ```command
  mkdir your-project-name
  ```
  > `your-project-name` is whatever you choose to name your project
- Move into your project directory
  ```command
  cd your-project-name
  ```
- Clone this repo into your project directory
  ```command
  git clone https://github.com/athomasoriginal/eee-o-eleven.git .
  ```
  > The `.` at the end of the above command clones the projects root dirs/files
- Move into the project directory
  ```command
  cd your-project-name
  ```
  > You may want to even rename this directory while your at it
- Install project dependencies
  ```command
  yarn install
  ```
  > Wait for everything to install before running the next step
- Start the project
  ```command
  yarn run dev
  ```

## Project Commands

- Run development environment
  ```command
  yarn run dev
  ```
- Run development environment in debug mode
  ```command
  yarn run dev:debug
  ```
- Build for production
  ```command
  yarn run build
  ```

## Upgrade Dependencies

> **Quick note**: `package.json` dependencies are exact versions to prevent accidental bumps.  Yes, JS land is error prone.

- Find outdated packages
  ```bash
  yarn outdated
  ```
- Upgrade a specific package in package.json
  ```bash
  yarn upgrade --latest <package-name>
  ```
  > Above is fine if you want to upgrade to latest and to have the package.json also updated.
- Upgrade all packages matching a pattern in package.json
  ```bash
  yarn upgrade --latest --pattern "@11ty-"
  ```
  > Replace "gatsby-" with the common pattern.


## Blog Features

This section outlines the features our blog supports.  This is valuable because if you ever have to move to a different platform you have a catalogue of the required feature sets.

- [HTML5 Boilerplate]
- [Modern CSS Reset]
- Date Formatting
  - `dateFilter`
  - `w3DateFilter`
- Blog Posts
  - Heading Anchors
  - TOC
  - Created Date
  - Modified Date
  - Note
    - Custom markdown fence - `::: note`
    - See `eleventy.js`
  - Code Blocks
    - Custom Syntax Highlighting
  - Footnotes
- Links open in new tab
- Global data
  - footer
  - header
- RSS feed
- Trailing slashes
- Open Graph Meta Tags
- Twitter Cards
- 404
- Sort blog posts
- Signup form
- Redirects
- [Generate a mailto link]
  Simple tool to generate a `mailto` link so you don't have to worry about formatting.

## How things work

- SVGs are inlined for performance and maximum control via css
  - move the `svgs` into the `svg` directory
  - reference in templates: `{{ '/src/svg/logo.svg' | svgContents | safe }}`
- Write dates in format: `20 May 2019` for `created` in `posts`
  - There is an off by one error when writing dates as `2019-05-19`
- [Custom Signup Form]
  - Behaviour: when incomplete user is directed to the hosted form screen where they can try again
- Self Referencing Canonical Links
  - Built from `site.url.home.link` and the `permalink` and must set `canonical: true` in your blog template.
- Images
  - All images live in the `images` dir and we use passthrough.
  - SVGs are separate

## Configuration

### Add New Syntax Languages

- See prismjs + eleventy.js file

### Images

- See eleventy.js where we rock `passthrough`

### Article Notes

These are the large yellow blocks of text in our blog-posts. We use this to bring attention to a particular detail. For example, clarifying an assumption, or giving the reader additional directions to make the article clearer.

Theare are marked up as follows:

```markdown
::: note
Anything you like `in` here it _all_ works.
:::
```

This capability is setup in `eleventy.js`

### Updating Blog Posts

When we write blog posts a key factor in choosing topic to write about and structuring the content is ensuring I can keep the content [evergreen].  This choice was made after seeing so many tech blogs which are outdated months after being written.  Another goal is to make it easy for readers to see what changed so when we update blog posts I like to follow some guidelines:

- The commit title should follow this pattern: `Update Blog Post - Blog Post ID - Quick Summary`
  ```markdown
  Update Blog Post - 005 - Bump Deps
  ```
- Keep changes isolated and small so the diffs are easy to grok

### Updating Blog Checklist

- Keeping blog posts updated is important because it ensures that the work stays relevant and therefore useful to future readers.  With CLJ(s) this is easier because of the stability of the ecosystem.  Either way though, here is an outline of artifacts that need to be updated:

#### ClojureScript Versions

- post - 000 - deploy cljs github
- demo - https://github.com/athomasoriginal/demo-clojurescript-gh-pages
- post - 001 - cljs app from scratch
- post - 003 - cljs tests
- video - 016 - figwheel

#### Figwheel Versions

- post - 001 - cljs app from scratch
- post - 003 - cljs tests

#### Clojure Survey

- post - 001 - cljs app from scratch
- post - 006 - clj text editors

#### Create Reagent App Versions

- post - 003 - cljs tests
- post - 005 - deploy cljs nginx

#### Atom Editor

- post - 006 - chlorine (e.g. no longer depends on Ink)
- video - https://www.youtube.com/watch?v=mEcOwtRt0f4


## Data Usage

There is a priority order for how Data is consumed by Eleventy.  Familarize yourself with that.  The `_data/site.json` is meant to contain reusable, site related global variables.  Example of what this is not for:  post front matter data.

## Blog Post Guidelines

### Frontmatter

[Blog Frontmatter] is the stuff at the beginning of our `blog-post` markfown files.


```yaml
author: "Thomas Mattacchione"
createdDate: '29 July 2019'
date: Last Modified
layout: post
tags:
  - post
title: What the Reagent Component?!
permalink: blog/{{ title | slug }}/index.html
canonical: true
summary: "It's time to uncover the truth about Reagent components."
```

- `createdDate`: the original publication date
- `date`: the date the post was last updated
- `summary`: max 140 characters tagline
- `permalink`: dynamically generate based on the title.
  - Some titles have special characters which don't format well or you may want the url to be different than the `title`.  In this case you can manually write thw `permalink`
  - Lisp case for title is prefered because I find it more readable

### Images

- Images that appear in a blog post should go in: `src/images`.
- Images should be prefixed with the same 3 digit code as your blog-post.
  - For example, if your blog is `001-...` your image should be titled `001-image-name-0f-your-choosing`.
- Example of referencing an image in a blog post
  ```markdown
  ![screenshot of example hello clojurescript site](/001-image-hello-cljs-dev-example.png)
  ```

### Links

Prefer reference links because they are reusable, allow for cleaner reading/editing of the post and when you need to update links they are all in one place.  Seriously.  This is a maintenance win.

## Before Dev

- [x] Update `_data/site.json`

## Before Deploy

- [x] Add custom favicon
- [ ] Publish sitemap
- [ ] Add analytics tracking
- [ ] Update social media cards - OG, Twitter etc
- [ ] Add Apple Touch Icon
- [ ] Populate web.manifest
- [ ] Performance
  - [ ] Run through this [top 10 guide] - anything to improve?
  - [ ] [Make images smaller]
- [ ] Netlify configs
  - [ ] set yarn env variable
  - [ ] update build settings


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
- [ludbek](https://github.com/ludbek)
- [oakmac](https://github.com/oakmac)


[Housekeeping]: #housekeeping
[Quickstart]: #quickstart
[Project Commands]: #project-commands
[Upgrade Dependencies]: #upgrade-dependencies
[Blog Features]: #blog-features
[Data Usage]: #data-usage
[Blog Post Guidelines]: #blog-post-guidelines
[Frontmatter]: #frontmatter
[Images]: #images
[Article Notes]: #article-notes
[Updating Blog Posts]: #updating-blog-posts
[Updating Blog Checklist]: #updating-blog-checklist
[Before Dev]: #before-dev
[Before Deploy]: #before-deploy
[Special Thanks]: #special-thanks
[Design]: #design
[Illustrations]: #illustrations
[Content]: #content



[Eleventy]: https://www.11ty.dev/
[Node]: https://nodejs.org/en/
[Yarn]: https://classic.yarnpkg.com/en/docs/install/
[HTML5 Boilerplate]: https://html5boilerplate.com/
[Modern CSS Reset]: https://github.com/andy-piccalilli/modern-css-reset
[Generate a mailto link]: https://mailtolink.me/
[blog ux for mailto]: https://css-tricks.com/offering-options-for-mailto-and-tel-links/
[Custom Signup Form]: https://mailchimp.com/help/host-your-own-signup-forms/
[Self-Referencing Canonical Link]: https://www.searchenginejournal.com/google-self-referencing-canonicals-are-not-critical/312619/#close
[top 10 guide]: https://www.youtube.com/watch?v=Lh9q3h2khlc
[Make images smaller]: https://squoosh.app/
[Blog Frontmatter]: https://www.scribendi.com/academy/articles/front_matter.en.html
[evergreen]: https://ahrefs.com/blog/evergreen-content/#:~:text=Evergreen%20content%20is%20content%20that,That%20makes%20sense.
