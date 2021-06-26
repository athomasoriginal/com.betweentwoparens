---
author: "Thomas Mattacchione"
createdDate: '24 June 2019'
date: Last Modified
layout: post
tags:
  - post
title: Start a ClojureScript App from Scratch
permalink: blog/{{ title | slug }}/index.html
canonical: true
summary: "A guide to setting up a ClojureScript app from scratch without fear or worry."
---

Welcome to my step by step guide to setting up a ClojureScript app. We'll work to assuage your fears & stresses and alleviate those nagging thoughts about doing things the "right" or "wrong" way.

In this post we will walk through a battle tested approach to setting up a <a href="#clojurescript-spelling" aria-describedby="footnote-label" id="clojurescript-spelling-ref">Clojure(Script)</a> app and describe the rationale for each decision we make.

::: note
Never worked with Clojure or ClojureScript?  Checkout [Getting Started with Clojure(Script)].  In addition, if you're following along and get stuck at any point, I have a [demo project] which you can reference as you work through this post.  We won't write too much ClojureScript code in this post, but if at any point you want to quickly familiarize yourself with the syntax of  ClojureScript I recommend this [15 minute primer to the syntax of Clojure].
:::

## Setup Project Structure

This section is about the folder structure of our application.  Whenever I name a Clojure(Script) project I will use the `company` name and then the `app` name to inform the naming of our app's folders.

For example, we can pretend that our `company` is called `tallex` and we are building an app called `time dive`.

### Step 1 - Add the Files and Folders

With this in mind, go ahead and create each file and folder exactly as seen below<a href="#project-structure" aria-describedby="footnote-label" id="project-structure-ref">:</a>

```bash
.
├── README.md
├── resources
│   ├── index.html
│   └── style.css
├── src
│   └── tallex
│       └── time_dive.cljs
└── tests
    └── tallex
        └── time_dive_tests.cljs
```


::: note
Notice how the files and folders in the `src` and `tests` dirs have underscores in their names?  This is a general name formatting convention called [snake case] and and we do this when naming files and folders in a Clojure project because it's a [java convention].  Yes, even if you are writing a ClojureScript project we ollow this convention.
:::

### Step 2 - Add HTML

Time for some code.  We are building a web app and like all web apps we need `HTML`.  `HTML` is the  "bones" of your web app. Open your `index.html` file and add the following<a href="#resources-dir" aria-describedby="footnote-label" id="resources-dir-ref">:</a>

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Time Dive</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
  </head>
  <body>
    <h1 class="site__title">
      <span class="site__title-text">Time Dive</span>
    </h1>
    <script src="/out/main.js"></script>
  </body>
</html>
```

### Step 3 - Add CSS

Next up, we give our app some "clothes": `CSS`. Open the `style.css` file and slam down these styles<a href="#sanity-check-css" aria-describedby="footnote-label" id="sanity-check-css-ref">:</a>

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

### Step 4 - Add ClojureScript

Now we finally get to write some ClojureScript. Open `time_dive.cljs` and sprinkle down these codes<a href="#sanity-check-cljs" aria-describedby="footnote-label" id="sanity-check-cljs-ref">:</a>

```clojure
(ns tallex.time-dive)

(js/console.log "Hello, Time Dive!")
```

The above defines a `namespace` called `tallex.time-dive`. This `namespace` is going to be the `entry point` of our app<a href="#entry-point-conventions" aria-describedby="footnote-label" id="entry-point-conventions-ref">.</a>

::: note
The `namespace` is the `tallex.time-dive` part.  There are a few implicit details which I want to highlight.  **Firstly**, namespaces follow the folder path structure.  **Secondly**, if your namespace has multiple words like `time-dive` we use dashes not underscores to separate them.  **Lastly**, best practice is to multi-segment our namespace name.  A multi-segmented name is when we have multipe words/phrases separated by dots.  For example, `tallex.time-dive` is multi-segmented.  The first segment is `tallex` and the second is
`time-dive`.  Best practice is to have two or more segments. If we only have one segment it can lead to name conflicts.  Having said this, it's not the end of the world if you only have a single-segment namespace. For example, there are respected developers who use `single-segmented namespaces`.
:::

### Step 5 - Add ClojureScript Tests

Good tests are the Alfred to a software engineers Batman. Open up that `time_dive_tests.cljs` file and add the following<a href="#sanity-check-cljs-test" aria-describedby="footnote-label" id="sanity-check-cljs-test-ref">:</a>

```clojure
(ns tallex.time-dive-tests)

(js/console.log "Hello, Time Dive Tests!")
```

This concludes setting up the project structure and boilerplate code. The next step is about setting ourselves up with tools we need to run our Clojure(Script) app.

## Running and Developing ClojureScript

To develop and run our app the most popular tools in Clojure land are `lein`, `boot` and `clj`. The good news is you only need to choose one of these.  Before I reveal which we are going to use, let me provide a quick overview of each of them.

[lein] is the grandfather and most popular Clojure(Script) build tool. If I had to compare it to something it would be as if `npm` and `webpack` made a Clojure baby. You will see lein used in most all projects created prior to mid-2018. Yet, it has started to show its age. So members of the Clojure(Script) community went off to build a better lein and they called it `boot`.

[boot] is a definite improvement over lein. It learned from many of lein's shortcomings and managed to gather the attention of a strong minority of Clojure(Script) developers.

[clj], also known as the clojure cli tool, is magicked down to us by the maintainers of Clojure. It was initially met with confusion, but over the past year has come to be seen by many, including myself, as _the_ tool to run and develop our clojure(script) programs. Where `lein` and `boot` are complex and often reach in their scope, the `clj` tool is about 3 things:

 - run clojure programs
 - resolve transitive dependencies
 - build classpaths

 Ultimatley, `clj` is simple, oriented towards beginners and yet powerful enough to support advanced users.  If you're interested in learning more, checkout out the [clojure tools] post.  Also feel free to checkout the [2019 State of Clojure Community Report] to see which tools the Clojure community uses most.

### Step 6 - Add deps file

::: note
If this is your first time working with Clojure(Script) you will need to be sure you have `clojure` installed on your local machine before going further.  Not sure?  Want to know how?  I recommend taking a look at my free [Getting Started with Clojure(Script)] Youtube series which will take you through the whole process or checkout the official written [ClojureScript Quickstart Guide].
:::

To run our Clojure(Script) project with `clj` we first need to setup our `deps.edn` file. Start by creating a `deps.edn` file in the root of our project and then make it look like this<a href="#build-tools-deps" aria-describedby="footnote-label" id="build-tools-deps-ref">:</a>

```clojure
{:paths
 ["src" "tests" "resources"]

 :deps
 {org.clojure/clojurescript {:mvn/version "1.10.844"}}

 :aliases
 {:dev {:main-opts ["-m"  "cljs.main"
                    "-ro" "{:static-dir,[\".\",\"out\",\"resources\"]}"
                    "-w"  "src"
                    "-c"  "tallex.time-dive"
                    "-r"]}}}
```

::: note
Unlike other files in our Clojure project we don't get to choose what we call the `deps.edn` file.  `deps.edn` is the name that `clj` looks for.  Furthermore, you will notice that the extension of this file is `.edn`. You can think of this as the Clojure(Script) equivalent of `json`.
:::

Before we continue we should be familiar with what we're doing in our `deps.edn` file:

- [:paths] tells `clj` where to look for clojure code. Also known as a `classpath`
- [:deps] tells `clj` which dependencies our app needs. Right now our only dependency is ClojureScript.
- [:aliases] are like shortcuts.  We can store long commands, or alternate dependencies in these.

When we run our app for `prod`, `dev` or `test` we may need to run the app differently. That is why we use aliases. In our case, we specified a `:dev` alias and configured it to:

- ["-m"] run `cljs.main` (run clojurescript).
- ["-ro"] teach the repl where to find `static files` e.g. html, css etc.
- ["-w"] watch all files in `src` dir and recompile when they are changed.
- ["-c"] compile our app: `tallex.time-dive`.
- ["-r"] run a REPL and connect it to the browser.

Now that we have a rough idea of what is going on we are ready to take our app for a test drive. Open a terminal, move into the root of the app and run the following command:

```bash
clj -M:dev
```

wait a bit and `:dev` will compile our code, automatically open a browser tab and present you with what we have so far:

![screenshot of time dive app](./images/001-time-dive-app.png)

::: note
I also want to draw your attention towards two new directories that were auto generated for you when you ran `.cpcache/` and `out/`. I bring this up because it's a good practice to avoid version controlling these folders.  If you are wondering how to version control them see this [extra step]
:::

Before we jump over to the next section I want to draw your attention to the fact that we have zero dependencies. Think about this: our files are being watched, code is recompiled on save, we are greeted with a browser repl and all of this with zero dependencies. Yes, we are still missing a few niceties, but we are not done yet. We will get you to hero toolchain status soon.

::: note
If you were testing the watch feature and can't see the code changes take affect be sure to try refreshing the browser.
:::

## Setup a ClojureScript Toolchain

As I said earlier, we have zero dependencies and already have a powerful toolchain. This section will take our toolchain to another level so we can achieve parity to JavaScript <a href="#what-is-dev-toolchain" aria-describedby="footnote-label" id="what-is-dev-toolchain-ref">standards</a> by introducing just one tool: `Figwheel`.

[figwheel] is a popular ClojureScript tool and a must have for my workflow<a href="#toolchain-tools" aria-describedby="footnote-label" id="toolchain-tools-ref">.</a> Figwheel has [many features], but we are only going to focus on the ones that allow us to sync with what JavaScript land is used to. These include:

- live ClojureScript and CSS Reloading
- Informative error messages
- Build configurations for prod, dev, test et al.

Now that we know _what_ figwheel does, let's see _how_ to make it do the things.

### Step 7 - Add Figwheel

It starts by adding figwheel as a dependency. We do this by opening the `deps.edn` file and add the line you see highlighted below<a href="#sanity-check-toolchain" aria-describedby="footnote-label" id="sanity-check-toolchain-ref">:</a>

```clojure
; highlight-range{7}
{:paths
 ["src" "tests" "resources"]

 :deps
 {org.clojure/clojurescript {:mvn/version "1.10.844"}

  com.bhauman/figwheel-main {:mvn/version "0.2.13"}}

 ; ...
 }
```

::: note
Clojure libraries are generally found in [Clojars] which is a popular Clojure package repository.  This is where you can go to find packages and examples of how to use the packages in our projects<a href="#package-repos" aria-describedby="footnote-label" id="package-repos-ref">.</a>  Also note that when you add new dependencies to your project you will also have to stop and restart your app.
:::

### Step 8 - Add build configuration

A `build configuration` is where we specify [figwheel] and [ClojureScript compiler] <a href="#build-config-options" aria-describedby="footnote-label" id="build-config-options-ref">options.</a> For this guide we will create a `development` build configuration<a href="#sanity-check-build-config" aria-describedby="footnote-label" id="sanity-check-build-config-ref">.</a>

Create a new file in the root of our ClojureScript app called `dev.cljs.edn` and add the following code to it:

```clojure
^{:watch-dirs ["src"]
  :css-dirs   ["resources"]}
{:main tallex.time-dive}
```

::: note
Some details into the above: **1.**  You can name your build configuration anything you like but it needs to include the `.cljs.edn` part.  We called ours `dev` because it's configuring our code for the development environment.  **2.** You can and will have multiple `build configurations`.  This is not a bad thing.  **3.**  when you look at the above it can seem like there is very little configuration, especially when compared to a `webpack` config file. The reason for this is because Figwheel makes a lot of sane default choices out of the box.
:::

Okay. We have specified build configuration options. What does all of it mean?

1. [:watch-dirs] - when any `cljs` files change in `src` directory figwheel recompiles and re-loads the browser.
2. [:css-dirs] - when `css` files change in the `resources` directory figwheel recompiles and re-loads them in the browser
3. [:main] - This is an option that figwheel passes to the `ClojureScript compiler` which tells the compiler which file is our apps `entry point`.

As you may have guessed, `Fighwheel` is going to replace the need for us to use `-w`, `-r` and `-c` above.  It is a separate program that provides richer versions of those built-in commands.  With our `dev build configuration` in place, we have one last step.

### Step 9 - Update :dev Alias

The command we were using to run our app, `clj -M:dev`, is still not using figwheel yet. Open `deps.edn` and make it look like this:

```clojure
{:paths
 ["src" "tests" "resources"]

 :deps
 {org.clojure/clojurescript {:mvn/version "1.10.844"}

  com.bhauman/figwheel-main {:mvn/version "0.2.13"}}

 :aliases
 {:dev {:main-opts ["-m"  "figwheel.main" "--build" "dev" "--repl"]}}}
```

Time for sanity check to make sure everything is still working. Run the following command:

```bash
clj -M:dev
```

Your app should run, but you will notice that you get the following screen:

![screenshot of figwheel landing page](./images/001-time-dive-figwheel-landing-page.png)

This appears because figwheel is looking for our `index.html` in `resources/public`. Up until now we put our index.html file directly under the `resources` dir. This means we have to change our folder structure a little.

### Step 10 - Restructure resources dir

Go ahead and add a `public` directory to the `resources` dir and move your `index.html` and `style.css` into it. Your folder structure should look like this<a href="#sanity-check-resources-restruct" aria-describedby="footnote-label" id="sanity-check-resources-restruct-ref">:</a>

```bash
.
├── README.md
├── deps.edn
├── dev.cljs.edn
├── resources
│   └── public
│       ├── index.html
│       └── style.css
├── src
│   └── tallex
│       └── time_dive.cljs
└── tests
    └── tallex
        └── time_dive_tests.cljs
```

::: note
I have not included the `target`, `out`, or `.cpcache` directories in the above topology so don't feel like you've done something wrong if you see those folders.
:::

We also have to update the `script` tag in our `index.html` file.

```html
<script src="/cljs-out/dev-main.js"></script>
```

::: note
We updated the script tag because figwheel is going to build your ClojureScript in a different folder than `clj` did.
:::

time to run the app again:

```bash
clj -M:dev
```

The toolchain is now in place, but we are still missing the great and powerful Hot Module Reloading.

## Hot Module Reloading

Hot Module Reloading (HMR) is the holy grail of React development. So much so that it is often spoken in the same breath as if the two are co-dependent, yet the two are not joined in any way.

As long as you write [reloadable code] you can take advantage of HMR. This is the catch though: writing reloadable code can be [tricky and time consuming]. Writing reloadable code is made much easier when you write your code using React. This is likely part of the reason the two are seen as linked.

The point is that figwheel offers a framework / library agnostic mechanism to support your ability to write HMR in your toolchain.

Specifically, figwheel gives us `hooks` which we specify in the namespace where we want to take advantage of HMR. The way it works is when we write HMR we have to tell our app how to tear itself down and setup again when files are re-compiled. We have to write these functions ourselves. What figwheel helps with is providing `hooks` like `:after-load` and `:before-load` which will call our setup and teardown functions.

::: note
The hooks I am referring to are figwheel hooks and have nothing to do with React Hooks.
:::

### Step 11 - Refactor for Figwheel

We can demonstrate how to use figwheel hooks in the `time-dive` namespace. Our `time-dive` namespace is logging "Hello, Time Dive" on each reload. We could however only have it log on re-compile by adding a hook like this<a href="#sanity-check-reagent" aria-describedby="footnote-label" id="sanity-check-reagent-ref">:</a>

```clojure
(ns ^:figwheel-hooks tallex.time-dive)

(defn ^:after-load re-render []
  (js/console.log "Hello, Time Dive!"))
```

Now when you try to run the app you will notice that the `console.log` does not log the first time, but only after each save. Things to take note of:

- [^:figwheel-hooks] - `meta data` telling figwheel we want to use hooks in our namespace
- [^:after-load] - `meta data` telling figwheel that we want it to run the function, `re-render`, after each compile

::: note
ClojureScript provides this great mechanism called [metadata] to our vars, functions etc.
:::

This is a rich topic so my hope is that I was able to illustrate the fact that HMR and React are not linked, and provide a little insight into how you can use this feature outside of React.

## Add Reagent

You could use most any JS framework in ClojureScript, but the ClojureScript community loves React and the community has made wrappers to make React easier to use in ClojureScript. While there are many wrappers the most popular React wrapper is currently [Reagent] so we will show you how to use that.

### Step 12 - Refactor for Reagent

In addition to adding Reagent we are going to update our `deps.edn`, `html`, `css` and `cljs`. Start by opening the `deps.edn` file and making it look like this<a href="#sanity-check-reagent-two" aria-describedby="footnote-label" id="sanity-check-reagent-two-ref">:</a>

```clojure
; highlight-range{9}
{:paths
 ["src" "tests" "resources"]

 :deps
 {org.clojure/clojurescript {:mvn/version "1.10.844"}

  com.bhauman/figwheel-main  {:mvn/version "0.2.13"}

  reagent                   {:mvn/version "0.10.0"}}


 :aliases
 {:dev {:main-opts ["-m"  "figwheel.main" "--build" "dev" "--repl"]}}}
```

Next we can open our `index.html` file and modify as follows:

```html
<!-- highlight-range{8,10} -->
<!DOCTYPE html>
<html>
  <head>
    <title>Time Dive</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
  </head>
  <body>
    <div id="root"></div>

    <script src="/cljs-out/dev-main.js"></script>
  </body>
</html>
```

Finally open our `time-dive` namespace and add a few things:

```clojure
(ns ^:figwheel-hooks tallex.time-dive
  (:require
    [reagent.dom :as r.dom]))


(defn app []
  [:h1.site__title
    [:span.site__title-text "Time Dive"]]])


(defn mount []
  (r.dom/render [app] (js/document.getElementById "root")))


(defn ^:after-load re-render []
  (mount))


(defonce start-up (do (mount) true))
```

A little about the above:

- `app` is our first example of a [Reagent component]
- `mount` a function. When called, it will display our `time-dive` app
- `re-render` a function with a hook. When called, it reloads our app. It supports the HMR part

::: note
Remember figwheel hooks from the previous section?  The above is us using them with Reagent to achieve HMR.
:::

Last step: open up `style.css` and change the `body` tag to `#root`

```css
/* replace ... */
body {
  /* ... */
}

/* with ... */
#root {
  /* ... */
}
```

::: note
The only reason we do this is because with Reagent we had to change our HTML structure a bit.  Likewise we change our css to reflect the HTML structure changes.
:::

Ready to see if it all worked? Run `clj -M:dev` and marvel at your ClojureScript SPA.

## Conclusion

At this point we have created a ClojureScript app from scratch and provided a solid foundation which should allow you to take this app in any direction you like. Of course, I did not go into details beyond the initial phase, but if you are interested in possible next steps or sources for inspiration, here are a few that I often recommend.

- [Example Reagent App]
- [Example Full Featured Clojure(Script) App]
- [ClojureScript 30]
- [Lambda Island - ClojureScript Tutorials]
- [Purely Functional TV - Clojure(Script) Tutorials]
- [Getting Clojure]
- [Elements of Clojure]

These resources are great next steps for learning to work with Clojure(Script).

<aside>
  <h3>Footnotes</h3>
  <ol>
    <li id="clojurescript-spelling">
      You will notice I spell ClojureScript in two ways: <code class="gatsby-code-text">ClojureScript</code> or <code class="gatsby-code-text">Clojure(Script)</code>.  The difference: The first is me saying "Just ClojureScript" and the second is me saying "this applies to both Clojure and ClojureScript".  The purpose is because Clojure and ClojureScript are 95% the same language, same build tools etc.  I have found it helpful to make this clear early on.
      <a href="#clojurescript-spelling-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="project-structure">
      Technically the <code class="gatsby-code-text">README</code>, <code class="gatsby-code-text">Resources</code> and <code class="gatsby-code-text">tests</code> files/dirs are not needed, but I always include them by default because to me, taking the time to setup things well in the beginning saves us time later.  Also keep in mind that you don't have to follow my structure.  There is no real science here other than this is a sane structure I have evolved and come to trust through use in production.  <strong>Sanity Check</strong>: your project should look like this: commit <a class="blog-content__link" href="https://github.com/athomasoriginal/demo-clojurescript-app/commit/96fafa51dfa8cb2e1ea208961c1ff2a3e4eb663a" target="_blank" rel="noopener noreferrer">96fafa5</a>
      <a href="#project-structure-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="resources-dir">
      You will notice HTML, CSS, Images etc will go in our <code class="gatsby-code-text">Resources</code> dir.  This is not a hard and fast rule, but it is a helpful convention.  Also, <strong>sanity Check</strong>:  <a class="blog-content__link" href="https://github.com/athomasoriginal/demo-clojurescript-app/commit/58975cc17d779a6f4c7947c9c21a468a6711671e" target="_blank" rel="noopener noreferrer">58975cc</a>
      <a href="#resources-dir-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="sanity-check-css">
      <strong>Sanity Check</strong>: commit <a class="blog-content__link" href="https://github.com/athomasoriginal/demo-clojurescript-app/commit/3aab28449076fb0d80e801d0a1f8cf0c5d8c5e42" target="_blank" rel="noopener noreferrer">3aab284</a>
      <a href="#sanity-check-css-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="sanity-check-cljs">
      <strong>Sanity Check</strong>: commit <a class="blog-content__link" href="https://github.com/athomasoriginal/demo-clojurescript-app/commit/863278997d8dd23e3c56dbb61cab7c5138aa423c" target="_blank" rel="noopener noreferrer">8632789</a>
      <a href="#sanity-check-cljs-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="entry-point-conventions">
       The dominant convention is to name your entry point <code class="gatsby-code-text">core.cljs</code>. This is something that comes from the build tool <code class="gatsby-code-text">lein</code> and it's a silly convention because it provides us with no semantics.  It's easy to want to do this though because other languages like  JavaScript do this with their <code class="gatsby-code-text">index.js</code> and python with <code class="gatsby-code-text">main.py</code> and so on.  Resist the urge and try to give your <code class="gatsby-code-text">entry point</code> a meaningful name.
      <a href="#entry-point-conventions-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="sanity-check-cljs-test">
      <strong>Sanity Check</strong>: commit <a class="blog-content__link" href="https://github.com/athomasoriginal/demo-clojurescript-app/commit/90a576f927947fcd620c6bcb340d3dc0427d2b06" target="_blank" rel="noopener noreferrer">90a576f</a>
      <a href="#sanity-check-cljs-test-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="build-tools-deps">
      <strong>Sanity Check</strong>: commit <a class="blog-content__link" href="https://github.com/athomasoriginal/demo-clojurescript-app/commit/ba182b9a2b7f5b753bb7b16bb5ff4bf8384ab0bd" target="_blank" rel="noopener noreferrer">288a24c</a>s
      <a href="#build-tools-deps-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="what-is-dev-toolchain">
       When I say "toolchain" I mean things like build the app for production and dev, HMR, live CSS reloading.  All the things needed to make development life easy and get your app from your local environment to a production ready state.
      <a href="#what-is-dev-toolchain-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="toolchain-tools">
       There is also <a class="blog-content__link" href="http://shadow-cljs.org/" target="_blank" rel="noopener noreferrer">shadow-cljs</a> which does some great stuff.  However, for me, Figwheel does what I need, provides <a class="blog-content__link" href="https://figwheel.org/" target="_blank" rel="noopener noreferrer">excellent documentation</a> and was recently rewritten to overcome some of it's age.  This is not to say that shadow-cljs is not amazing, it is.  This is just my preference.
      <a href="#toolchain-tools-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="sanity-check-toolchain">
      <strong>Sanity Check</strong>: commit <a class="blog-content__link" href="https://github.com/athomasoriginal/demo-clojurescript-app/commit/7d642c5416413da13c9cbebd31e33a563e917c90" target="_blank" rel="noopener noreferrer">27a54a3</a>
      <a href="#sanity-check-toolchain-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="package-repos">
      <code class="gatsby-code-text">Clojars</code> is not the only way to find versions, or even gain access to libraries.  Another place to look is on Github where the source code for your packages live.  In addition, you can even specify a specific hash to download the packages directly from github.  Feel read to read more about that <a class="blog-content__link" href="https://clojure.org/reference/deps_and_cli#_dependencies" target="_blank" rel="noopener noreferrer">here</a>.
      <a href="#package-repos-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="build-config-options">
      I believe the difference between ClojureScript and Figwheel options is a great source of confusion for new ClojureScript developers.  I feel this way because it requires an understanding of where one library ends and the other begins.  Just know that Figwheel is going to be running the <code class="gatsby-code-text">ClojureScript Compiler</code> for you which is why both options can all look like one thing.  If you are ever not sure, visit the links.
      <a href="#build-config-options-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="sanity-check-build-config">
      <strong>Sanity Check</strong>: commit <a class="blog-content__link" href="https://github.com/athomasoriginal/demo-clojurescript-app/commit/46e46990726d61638e9b80f6345e4b6683ac1e70" target="_blank" rel="noopener noreferrer">980f18f</a>
      <a href="#sanity-check-build-config-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="sanity-check-resources-restruct">
      <strong>Sanity Check</strong>: commit <a class="blog-content__link" href="https://github.com/athomasoriginal/demo-clojurescript-app/commit/4b6b656323ea5cda9edb9265e61e49de6d9f7cfc" target="_blank" rel="noopener noreferrer">da3dbb5</a>
      <a href="#sanity-check-resources-restruct-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="sanity-check-reagent">
      <strong>Sanity Check</strong>: commit <a class="blog-content__link" href="https://github.com/athomasoriginal/demo-clojurescript-app/commit/4c8cbd67dcc24d0365feb25bf511e03cba0fcf36" target="_blank" rel="noopener noreferrer">205c680</a>
      <a href="#sanity-check-reagent-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="sanity-check-reagent-two">
      <strong>Sanity Check</strong>: commit <a class="blog-content__link" href="https://github.com/athomasoriginal/demo-clojurescript-app/commit/e1cf66d7ed1973d4fa1ec1091c0cbe16e61cf4b4" target="_blank" rel="noopener noreferrer">f13ee9b</a>
      <a href="#sanity-check-reagent-two-ref" aria-label="Back to content">Back</a>
    </li>
  </ol>
</aside>

[Getting Started with Clojure(Script)]: https://youtube.com/playlist?list=PLaGDS2KB3-ArG0WqAytE9GsZgrM-USsZA
[demo project]: https://github.com/athomasoriginal/demo-clojurescript-app
[15 minute primer to the syntax of Clojure]: https://github.com/shaunlebron/ClojureScript-Syntax-in-15-minutes
[snake case]: https://en.wikipedia.org/wiki/Snake_case
[java convention]: https://docs.oracle.com/javase/tutorial/java/package/namingpkgs.html
[ClojureScript Quickstart Guide]: https://clojurescript.org/guides/quick-start
[extra step]: https://github.com/athomasoriginal/demo-clojurescript-app/commit/0cef20e6773ab5d2f93253926dafb4e05e0673f7
[Clojars]: https://clojars.org
[metadata]: https://clojure.org/reference/metadata
[lein]: https://leiningen.org/
[boot]: https://boot-clj.com/
[clj]: https://clojure.org/guides/deps_and_cli
[clojure tools]: https://betweentwoparens.com/blog/what-are-the-clojure-tools
[2019 State of Clojure Community Report]: https://www.surveymonkey.com/results/SM-S9JVNXNQV/
[:paths]: https://clojure.org/reference/deps_and_cli#_paths
[:deps]: https://clojure.org/reference/deps_and_cli#_dependencies
[:aliases]: https://clojure.org/reference/deps_and_cli#_aliases
["-m"]: https://clojure.org/reference/deps_and_cli#_usage
["-ro"]: https://clojurescript.org/reference/repl-options
["-w"]: https://clojurescript.org/reference/repl-and-main
["-c"]: https://clojurescript.org/reference/repl-and-main
["-r"]: https://clojurescript.org/reference/repl-and-main
[figwheel]: https://figwheel.org/
[many features]: https://figwheel.org/
[figwheel]: https://figwheel.org/config-options
[ClojureScript compiler]: https://clojurescript.org/reference/compiler-options
[:watch-dirs]: https://figwheel.org/config-options#watch-dirs
[:css-dirs]: https://figwheel.org/config-options#css-dirs
[:main]: https://clojurescript.org/reference/compiler-options#main
[reloadable code]: https://figwheel.org/docs/reloadable_code.html
[tricky and time consuming]: /students-of-the-game-reloadable-code
[Reagent]: https://reagent-project.github.io/
[Reagent component]: https://github.com/reagent-project/reagent/blob/master/doc/CreatingReagentComponents.md
[Example Reagent App]: https://github.com/robert-stuttaford/bridge
[Example Full Featured Clojure(Script) App]: https://github.com/juxt/edge
[ClojureScript 30]: https://github.com/athomasoriginal/clojurescript-30
[Lambda Island - ClojureScript Tutorials]: https://lambdaisland.com/
[Purely Functional TV - Clojure(Script) Tutorials]: https://purelyfunctional.tv/
[Getting Clojure]: https://pragprog.com/book/roclojure/getting-clojure
[Elements of Clojure]: https://leanpub.com/elementsofclojure
