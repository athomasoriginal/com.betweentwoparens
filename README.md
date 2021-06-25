# Between Two Parens

[![Netlify Status](https://api.netlify.com/api/v1/badges/c8e124ff-8904-4c9b-a8b4-97fefd4a13e4/deploy-status)](https://app.netlify.com/sites/epic-goldwasser-028edc/deploys)

- [Housekeeping]
- [Quickstart]
- [Feature Choices]
- [Upgrade Dependencies]
- [Resources]
- [Data Usage]
- [Blog Post Guidelines]
  - [Frontmatter]
- [Before Dev]
- [Before Deploy]


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

## Feature Choices

This section includes tooling and pattern choices made for this template.

- [HTML5 Boilerplate]
- [Modern CSS Reset]
- A few useful filters:
  - `dateFilter` & `w3DateFilter`
- Example Blog Post
- RSS feed
- Trailing slashes
- Open Graph Meta Tags
- Twitter Cards
- Mailto Links
- Blog
  - Heading Anchors
  - TOC
  - Date - Last Modified
  - Date - Last Updated
  - Links open in new tab
  - Custom Markdown
    - Code Fence + custom code HTML attributes - see `eleventy.js`

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

## Configuration

### Add New Syntax Languages

- See prismjs + eleventy.js file

### Images

- See eleventy.js where we rock `passthrough`

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



## Resources

- [Generate a mailto link]
  Simple tool to generate a `mailto` link so you don't have to worry about formatting.

## Before Dev

- [ ] Update `_data/site.json`

## Before Deploy

- [ ] Add custom favicon
- [ ] Publish sitemap
- [ ] Add analytics tracking
- [ ] Update social media cards - OG, Twitter etc
- [ ] Add Apple Touch Icon
- [ ] Populate web.manifest
- [ ] Performance
  - [ ] Run through this [top 10 guide] - anything to improve?
  - [ ] [Make images smaller]


## Decisions

- Navigation as it's own data structure
  - we could derive from the top level pages, but contact and youtube are not top level
  - in this scenario, I would rather not have to think about things being autogenerated
  - counter:  what if there are a lot of pages to consider?  At the top level?  should there really be that many?  Example argument is a banking site?  My counter is that most banking sites are terrible and confusing so not, stop encouraging this.  But to my point, solve for the problem in front of you.
- Problems with gatsby
  - Gets slow
  - Beguiles the fact that often a simple site has no business being in React
  - simple things like data progogation your using graphql which is just wildly complicated
  - gatysby is everything is a plugin and it all goes through their system
  - React forces componetization which is good and bad.  In a simple HTML/CSS site the component itself is generally just styles.  Having said this, it's valuable to not have to rock any configuration and just used the component.  Easy enough with templates
- [blog ux for mailto]
  Simple script to add polish to the contact user experience.  See the link for a description and other links about the movement towards this approach.  Simple to add, so why not.

[Housekeeping]: #housekeeping
[Quickstart]: #quickstart
[Feature Choices]: #feature-choices
[Upgrade Dependencies]: #upgrade-dependencies
[Resources]: #resources
[Data Usage]: #data-usage
[Blog Post Guidelines]: #blog-post-guidelines
[Frontmatter]: #frontmatter
[Before Dev]: #before-dev
[Before Deploy]: #before-deploy



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
