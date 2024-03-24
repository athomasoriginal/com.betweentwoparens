---
author: "Thomas Mattacchione"
createdDate: '20 May 2019'
updatedDate: '24 March 2024'
date: Last Modified
layout: post
tags:
  - post
title: Deploy ClojureScript to Github Pages
permalink: blog/{{ title | slug }}/index.html
canonical: true
summary: "How to build a static site in ClojureScript in probably 2.5 minutes"
---

Here's a small example of what it looks like to deploy a static website with
some ClojureScript to Github Pages. I'll start by introducing some key cocepts
and then move into how we actually do the thing.

### What is ClojureScript?

ClojureScript, like [Elm] or [Reason], is a compile to js programming language.
ClojureScript is different from JavaScript in a few ways.

* It's a functional language
* It's a [lisp] (AKA: Not C style syntax)
* It's development and design is intentional

Some of the more pragmatic differences

* The culture of the language avoids breaking changes
* Write your frontend and backend in one language
* Out-of-the-box tools to help you solve problems better

If nothing else, ClojureScript is guarenteed to make you think different.

### Github Pages and Static Sites?

`Github Pages` is a service provided by Github which allows you to freely host
your static website.

A static website is when you write your website in html, css and
javascript.  You don't need to setup servers, databases or additonal server
side code. The benefits:

* Performance
* A quick development workflow
* Easier website security
* Less expensive to build and host

The downsides are that static websites will not be able to acheive all the cool
features of a beefy web app.  Often times I will use a static website to prove
a concept for an app, host docs or build marketing websites.  They are cheap,
fast to build and let you prove out concepts.

With this in mind, let's start coding.

::: note
The rest of this article assumes that you have a Github account. If you don't, no worries. Take a moment and [create one for free] or just sit back and enjoy the read. For those who want to adventure with me, go through Github's official [Github Pages Quickstart] for projects and follow it exactly.  Note that throughout this post I will have footnotes referencing [my demo project] which has each step mirrored by its corresponding [commit]. Please lean on them if you feel lost at any point.
:::

Let's start by getting Clojure setup on your local machine. To do this, visit the [ClojureScript Quickstart] and follow the instructions there.

Not sure if you have everything setup properly? We can run a quick sanity check in your terminal by executing the following command:

```bash
clj -Stree
```

You should see a response like this:

```bash
org.clojure/clojure 1.11.1
  . org.clojure/spec.alpha 0.3.218
  . org.clojure/core.specs.alpha 0.2.62
```

::: note
Don't worry if your versions are different from mine.
:::

### Setting up your HTML

For those that went through the Github Pages quickstart, you should have a repo
with a sad, empty <a href="#fn-step-1-commit" aria-describedby="footnote-label"
id="fn-step-1-commit-ref">`index.html`</a>. Open your `index.html`
and type the following:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Github Pages + ClojureScript</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
  </head>
  <body>
    <h1 class="site__title">
      <span class="site__title-text">Hello ClojureScript</span>
    </h1>
    <script src="/demo-clojurescript-gh-pages/out/main.js"></script>
  </body>
</html>
```

:::note
You'll notice that we added a reference to a `main.js` and `style.css`
file in our HTML. These don't exist yet, but we will create them later.
Please also note that where it says `"demo-clojurescript-gh-pages"`.  This is
named after my Github project repo.  You should name yours after _your_ Github
project repo.
:::

### Setting up your CSS

The next thing we want to do is add a `style.css` file at the same level as our
`index.html`<a href="#fn-step-2-commit" aria-describedby="footnote-label"
id="fn-step-2-commit-ref">.</a>  Type the following into it

```css
:root {
  --color-purple: rgba(197, 18, 193, 1);
  --color-pink: rgba(241, 50, 50, 1);
}

body {
  margin: 0;
  height: 100vh;
  display: flex;
  font-family: Arial;
  align-items: center;
  justify-content: center;
}

.site__title {
  font-size: 100px;
  width: 50%;
  text-align: center;
}

.site__title-text {
  background: -webkit-linear-gradient(
    34deg,
    var(--color-purple),
    var(--color-pink)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

Now that we have our HTML and CSS, we need to add ClojureScript.

### Setting up your ClojureScript

This section will now add the absolute minimum requirements to start working with
ClojureScript.

Create a file called `deps.edn` at the same level as our
<a href="#fn-deps" aria-describedby="footnote-label" id="fn-deps-ref"
class="gatsby-code-text">`index.html`</a> file.

Open the file you've created and type the following code into it.

```clojure
{:deps {org.clojure/clojurescript {:mvn/version {{ site.posts.dep.clojurescript.version }} }}}
```

::: note
If you're coming from JavaScript it can be helpful to think of the `deps.edn`
as similar to `package.json`. `deps.edn` tells `clojure` which version of
`ClojureScript` we want to use.
:::

Let's recap a bit. At this point, your directory structure should look like <a
href="#fn-step-3-commit" aria-describedby="footnote-label"
id="fn-step-3-commit-ref">this:</a>

```bash
.
├── deps.edn
├── style.css
└── index.html
```

If yes, we are good to move onto the next step: writing ClojureScript!

Create `src/demo` <a href="#fn-src-dir" aria-describedby="footnote-label"
id="fn-src-dir-ref">directory</a>. Once created, move into `src/demo` and create
a ClojureScript file called `static_website.cljs`. Now our repo should
look like <a href="#fn-step-4-commit" aria-describedby="footnote-label"
id="fn-step-4-commit-ref">this:</a>

```bash

├── src
│   └──  demo
│       └── static_website.cljs
├── style.css
├── deps.edn
└── index.html
```

Open `static_website.cljs` and type the following:

```clojure
(ns demo.static-website)

(js/console.log "Hello, Github Pages!")
```

Open your terminal and run the following command

```bash
clj -m cljs.main -d "demo-clojurescript-gh-pages/out"  -c demo.static-website -r
```

::: note
You want to run the above command from the same place as your `deps.edn`.
Further, if you're curious above the above command and what things like `-d` or
`-c` means you can check these out in your terminal by running  `clj -m
cljs.main --help`.
:::

The above command will compile your CLJS into JS. It can take a moment to run.
When completed, a browser tab will automatically open and serve your HTML, CSS
and ClojureScript. If everything worked you should see a site that looks like
this:

![screenshot of example hello clojurescript site](/images/000-image-hello-cljs-dev-example.png)

Further, if you open your browser console you should see "Hello, Github Pages!"

::: note
If you're not seeing your ClojureScript in the browser console, please verify
that your `index.html` file is using your Github project name and the string
following the `-d` in the above command, `demo-clojurescript-gh-pages`, is also
using your Github project <a href="#fn-project-name"
aria-describedby="footnote-label" id="fn-project-name-ref">name</a>.
:::

### Build production bundle

The above is an example of how we test our code locally. After we're happy with
our code, we can build it for production by runnin the following command:

```bash
clj -m cljs.main -O advanced -c "demo.static-website"
```

Once the above is done, commit your code with `git`, and push the code to your
Github project repo and you should see your ClojureScript app live<a
href="#fn-versioned-dependencies" aria-describedby="footnote-label"
id="fn-versioned-dependencies-ref">!</a>

### Conclusion

As I noted in the beginning, this is a very small example of a ClojureScript
project. From here, you can go in many different directions.  However, the idea
is the same: turn your CLJS code into JS code and ship the JS code.


::: note
Hopefully you did not run into any issues, but if you did please head over to
[my demo project] where I try to identify and help to resolve some gotchas.
Experience something new?  Please feel free to get in touch and I would be
happy to help work through the issue with you.
:::

:::footnotes

->->-> footnote#fn-step-1-commit
[commit 90156b]
->->->

->->-> footnote#fn-step-2-commit
[commit db9371]
->->->

->->-> footnote#fn-deps
`deps.edn` is a newer, more beginner friendly way of setting up a Clojure(script) project.  Other popular alternatives include using tools like [leiningen] and [boot] Having said this, I recommend using `deps.edn`.
->->->

->->-> footnote#fn-step-3-commit
[commit 575c63]
->->->

->->-> footnote#fn-src-dir
The reason we are creating a `demo` dir nested in a `src` dir is because in Clojure(script) it's preferred to multi-segment our namespaces.  This is both for [stylistic] and [technical] reasons.
->->->

->->-> footnote#fn-step-4-commit
[commit 347c55]
->->->

->->-> footnote#fn-project-name
We are referencing `demo-clojurescript-gh-pages` in our `index.html` and as the [-d or :output-dir flag] for our development bundle.  This is because when our code is served from Github Pages it's going to be served from `https://username.github.io/project-name/` where `project-name` is the name of our [gh pages clojurescript repo]. This means that in order to serve our site in development and production, without having two script tags in our `index.html` we sync with what its called in production so we only have to set it once.  There are other ways to achieve this, but with a goal of minimalism in mind, I feel this will do.
->->->

->->-> footnote#fn-versioned-dependencies
When you run the development or production build commands they will generate a bunch of code we do not need to version control.  For example, a `.cpcache`, `demo-clojurescript-gh-pages/out`, and `out` dirs.  The only files you need to version control are the ones I have in [gh pages clojurescript repo].  The other ones can be ignored.  If you're curious what that that looks like I have created a [level 2] branch to show you.
->->->

:::


[Elm]: https://elm-lang.org
[Reason]: https://reasonml.github.io/
[lisp]: <https://en.wikipedia.org/wiki/Lisp_(programming_language)>
[create one for free]: https://help.github.com/en/articles/signing-up-for-a-new-github-account
[Github Pages Quickstart]: https://pages.github.com/
[commit]: https://github.com/athomasoriginal/demo-clojurescript-gh-pages/commits/master
[my demo project]: https://github.com/athomasoriginal/demo-clojurescript-gh-pages
[commit 90156b]: https://github.com/athomasoriginal/demo-clojurescript-gh-pages/commit/90156bf57c1b80bd2e125909e8e7a584a53538c2
[commit db9371]: https://github.com/athomasoriginal/demo-clojurescript-gh-pages/commit/db9371431ab3288233cc5ec7ecd32f6c449c8d54
[commit 575c63]: https://github.com/athomasoriginal/demo-clojurescript-gh-pages/commit/575c634dc770da7000787e6feb0ed7757e505309
[leiningen]: https://leiningen.org/
[boot]: https://boot-clj.com/
[stylistic]: https://github.com/bbatsov/clojure-style-guide#no-single-segment-namespaces
[technical]: https://stackoverflow.com/questions/13567078/whats-wrong-with-single-segment-namespaces
[commit 347c55]: https://github.com/athomasoriginal/demo-clojurescript-gh-pages/commit/347c5580c55a80352179c39f2ce37d164bbc860c
[-d or :output-dir flag]: https://clojurescript.org/reference/compiler-options#output-dir
[gh pages clojurescript repo]: https://athomasoriginal.github.io/demo-clojurescript-gh-pages/
[level 2]: https://github.com/athomasoriginal/demo-clojurescript-gh-pages/tree/level-2-what-to-version-control
[ClojureScript Quickstart]: https://clojurescript.org/guides/quick-start
