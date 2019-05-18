---
title: 'Deploy ClojureScript to Github Pages'
date: '2019-05-20'
slug: deoploy-clojurescript-to-github-pages
summary: How to build a static site in ClojureScript in probably 2.5 minutes
---

This blog will outline how to build a minimal static website using just HTML, CSS and ClojureScript. The cherry will be us deploying this to Github Pages. My goal is to illustrate how straightforward this process can be and hopefully inspire some interest in ClojureScript. Before we begin lets review ClojureScript and Github Pages.

### What is ClojureScript?

ClojureScript, like [Elm](https://elm-lang.org) or [Reason](https://reasonml.github.io/), is a compile to js programming language. It's different from JavaScript because its data structures are immutable, its paradigm is functional and it's part of a family of programming languages called [lisp](<https://en.wikipedia.org/wiki/Lisp_(programming_language)>). The tangible benefits are that you can experience a world of web dev where classes of problems influenced by state and questionable language design are eliminated. If nothing else, ClojureScript is guarenteed to make you think different.

### Github Pages and Static Sites?

Github Pages is a service provided by Github which allows you to freely host your static website. For the uninitiated, a static website is when you write your website in plain old html, css and ~~javascript~~ ClojureScript. You don't need servers, databases or additonal server side code. The benefits include increased performance, a quick development workflow and enhanced website security. The downsides are that static websites will not be able to acheive all the cool features of a beefy web app.

With this in mind, let's start coding.

<aside class="blog-post__note">The rest of this article assumes that you have a Github account. If you don't, no worries. Take a moment and <a class="blog-post__link" href="https://help.github.com/en/articles/signing-up-for-a-new-github-account" target=" _blank" rel="noopener noreferrer">create one for free</a> or just sit back and enjoy the read. For those who do want to adventure with me, go through Github's official <a class="blog-post__link" href="https://pages.github.com/" target=" _blank" rel="noopener noreferrer">Github Pages Quickstart</a> for projects and follow it exactly.  You can always reference my live <a class="blog-post__link" href="https://github.com/tkjone/demo-clojurescript-gh-pages" target="_blank" rel="noopener noreferrer">demo project</a> which has each step broken down by
<a class="blog-post__link" href="https://github.com/tkjone/demo-clojurescript-gh-pages/commits/master" target="_blank" rel="noopener noreferrer">commit</a> </aside>

Let's start by getting Clojure setup on your local machine. To do this, visit the [ClojureScript Quickstart](https://clojurescript.org/guides/quick-start) and follow the instructions there.

Not sure if you have everything setup properly? we can run a quick sanity check in your terminal by executing the following command:

```bash
clj -Stree
```

you should see a response like this:

```bash
org.clojure/clojure 1.10.0
  org.clojure/spec.alpha 0.2.176
  org.clojure/core.specs.alpha 0.2.44
```

<aside class="article__note">Don't worry if your versions are different from mine.</aside>

### Setting up your HTML

For those that went through the Github Pages quickstart, you should have a repo with a sad little `index.html` inside of it. Open your `index.html` and add some life to it by making it look like this:

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

<aside class="blog-post__note">You will notice that we have added a reference to a js and css file in our HTML. We will add those later. Please also note that where it says "demo-clojurescript-gh-pages" in the script tag above, it should be the name of your Github project repo.</aside>

### Setting up your CSS

The next thing we want to do is add a `style.css` file at the same level as our `index.html` file so we can make our hello world look gorg'

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

To do _anything_ with ClojureScript, we need to configure our project to use it. This begins by adding ClojureScript as a dependency. The way we do this in Clojure land is by creating a file called `deps.edn` at the same level as our `index.html`. Once you have created your `deps.edn`, open it and add the following code:

```clojure
{:deps {org.clojure/clojurescript {:mvn/version "1.10.516"}}}
```

<aside class="article__note">If you are coming from JavaScript it can be helpful to think of the <code class="gatsby-code-text">deps.edn</code> file as similar to a <code class="gatsby-code-text">package.json</code> file. The purpose of this file is to tell <code class="gatsby-code-text">clojure</code> which version of <code class="gatsby-code-text">ClojureScript</code> we want to use.</aside>

Let's recap a bit. At this point, your directory structure should look like this:

```bash
.
├── deps.edn
├── style.css
└── index.html
```

If yes, we are good to move onto the next step: writing ClojureScript!

Like most code projects our code is going to live in a `src` directory. Go ahead and create a `src/demo` <a href="#fn-src-dir" aria-describedby="footnote-label" id="fn-src-dir-ref">directory</a>. Once created, move into `demo` and create our first ClojureScript file called `static_website.cljs`. Now our repo should look like this:

```bash

├── src
│   └──  demo
│       └── static_site.cljs
├── style.css
├── deps.edn
└── index.html
```

Once completed, open `static_site.cljs` and type this in:

```clojure
(ns demo.static-website)

(js/console.log "Hello, Github Pages!")
```

### Build development bundle

We have built a minimal site using HTML, CSS and ClojureScript so the last step is to make sure everything is working by running the following command:

```bash
clj -m cljs.main -d "demo-clojurescript-gh-pages/out"  -c demo.static-website -r
```

The above command will take a moment to run. When completed, a browser tab will automatically open and serve your html, css and ClojureScript. If everything worked you should see a site that looks like this:

![screenshot of example hello clojurescript site](./images/000-image-hello-cljs-dev-example.png)

Further, if you open your browser console you should see "Hello, Github Pages!"

<aside class="blog-post__note">If you are not seeing your ClojureScript in the browser console, please veryify that your <code class="gatsby-code-text">index.html</code> file is using your Github project name and the string following the <code class="gatsby-code-text">-d</code> in the above command, "demo-clojurescript-gh-pages", is also using your Github project <a href="#fn-project-name" aria-describedby="footnote-label" id="fn-project-name-ref">name</a>.</aside>

### Build production bundle

At this point we have shown ourselves that our code works locally, now it's time to show the world by deploying our site. Before we deploy, we need to build a production version by executing the following command:

```bash
clj -m cljs.main -O advanced -c "demo.static-website"
```

Once the above is done, rock a `git push` to your Github project repo and you should see your ClojureScript app live<a href="#fn-versioned-dependencies" aria-describedby="footnote-label" id="fn-versioned-dependencies-ref">!</a>

### Conclusion

As I noted in the beginning, this is a minimal example without 3rd build tools, frameworks, libraries or conveniences and this the point. When learning something new, I like to reduce the need for all kinds of additional "stuff" so I can feel confident in my understanding of the foundation. This foundation is part of what is going to inform us regarding whether or not something is "simple".

<aside>
  <h2>Footnotes</h2>
  <ol>
    <li id="fn-src-dir">
      The reason we are creating a  <code class="gatsby-code-text">demo</code> dir nested in a  <code class="gatsby-code-text">src</code> dir is because in Clojure(script) it's preferred to multi-segment our namespaces. This is both for <a class="blog-post__link" href="https://github.com/bbatsov/clojure-style-guide#no-single-segment-namespaces" target=" _blank" rel="noopener noreferrer">stylistic</a>  and <a class="blog-post__link" href="https://stackoverflow.com/questions/13567078/whats-wrong-with-single-segment-namespaces" target=" _blank" rel="noopener noreferrer">technical</a> reasons.
      <a href="#fn-src-dir-ref" aria-label="Back to content">↩</a>
    </li>
    <li id="fn-project-name">
      We are referencing  <code class="gatsby-code-text">demo-clojurescript-gh-pages</code> in our <code class="gatsby-code-text">index.html</code> and as the output directory for our development bundle.  The is because when our code is served from Github Pages it's going to be served from <code class="gatsby-code-text">https://username.github.io/project-name/</code> where <code class="gatsby-code-text">project-name</code> is the name of <a class="blog-post__link" href="https://tkjone.github.io/demo-clojurescript-gh-pages/" target=" _blank" rel="noopener noreferrer">our Github repo</a>.  This means that in order to serve our site in development and production, without having two script tags in our <code class="gatsby-code-text">index.html</code> we sync with what its called in production so we only have to set it once.  There are other ways to achieve this, but with a goal of minimalism in mind, I feel this will do.</a>
      <a href="#fn-project-name-ref" aria-label="Back to content">↩</a>
    </li>
    <li id="fn-versioned-dependencies">
      When you run the development or production build commands they will generate a bunch of code we do not need to version control.  For example, a <code class="gatsby-code-text">.cpcache</code>, <code class="gatsby-code-text">demo-clojurescript-gh-pages/out</code> and <code class="gatsby-code-text">out</code> dirs.  The only files you need to version control are the ones I have <a class="blog-post__link" href="https://github.com/tkjone/demo-clojurescript-gh-pages/tree/master" target="_blank" rel="noopener noreferrer">here</a>.  The other ones can be ignored.  If you're curious what that that looks like I have created a <a class="blog-post__link"  target="_blank" href="https://github.com/tkjone/demo-clojurescript-gh-pages/tree/level-2-what-to-version-control" rel="noopener noreferrer">level 2</a> branch to show you.
      <a href="#fn-versioned-dependencies-ref" aria-label="Back to content">↩</a>
    </li>

  </ol>
</aside>
