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

In this post we'll walk through my approach to setting up a <a href="#clojurescript-spelling" aria-describedby="footnote-label" id="clojurescript-spelling-ref">Clojure(Script)</a> app from scratch.
My ultimate goal is to help alleviate the nagging perectionist feelings we get
when starting new projects.

::: note
If you happen to get stuck along the way, I have a [demo project] which you can
reference.  Furthmore, while we aren't writing much ClojureScript in this post,
feel free to reference this [15 minute primer to the syntax of Clojure]. And
finally, if you're more of a visual learner I have a Youtube playlist called
[Getting Started with Clojure(Script)] which goes over all the topics in this
post and more!
:::

If you plan on following along with this post, please be sure to have Clojure
installed and working.  Not sure?  Want to know how?  I recommend taking a look
at my free [Getting Started with Clojure(Script)] Youtube series which will
take you through the whole process or checkout the official written
[ClojureScript Quickstart Guide].


## Setup Project Structure

This section covers the file & folder structure of our application: What goes
where and why.

To start a new project we need a name.  In Clojure/Script the
convention is to combine your "company" and "project" name.  For example, if we
worked for _Nike_ and we're building an app called _Fit Queens_ then our app
structure would look like `src/nike/fit_queens.cljs`.

For the demo code in this post, we'll pretend our company name is `tallex` and
the app is called `time dive`.

With this in mind, let's get to step 1: create your projects files and folders!

### Step 1 - Add the Files and Folders

Start by creating each file and folder exactly as seen below<a href="#project-structure" aria-describedby="footnote-label" id="project-structure-ref">:</a>

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
Notice how the files and folders in the `src` and `tests` dirs have underscores
in their names?  This is a naming convention called [snake case]. In Clojure and
ClojureScript you're required to follow this convention when naming files and
folders because Clojure/Script is a JVM hosted language which means we have to
follow [Java conventions].
:::

### Step 2 - Add HTML

Add some HTML so when the page renders we see something.  All web apps start
with an HTML file. Think of `HTML` as the  "bones" of your web app.

Open your `index.html` file and add the following<a href="#resources-dir" aria-describedby="footnote-label" id="resources-dir-ref">:</a>

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

:::note
The above will connect our `css`, `js` and render our app name _Time Dive_.
:::

### Step 3 - Add CSS

Now we can write some `CSS`. Open the `style.css` file and add these
styles<a href="#sanity-check-css" aria-describedby="footnote-label" id="sanity-check-css-ref">:</a>

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

:::note
The above is our `css`.  It will make our app name _Time Dive_ look pretty when
it renders on the screen.  All of this is optional, but a valuable sanity check
to make sure that our CSS is working as we expect.
:::

### Step 4 - Add ClojureScript

Now let's write some ClojureScript. Open `time_dive.cljs` and type the following
code<a href="#sanity-check-cljs" aria-describedby="footnote-label" id="sanity-check-cljs-ref">:</a>

```clojure
(ns tallex.time-dive)

(js/console.log "Hello, Time Dive!")
```

The above tells Clojure/Script you're creating a `namespace` called
`tallex.time-dive`. This `namespace` is going to be the `entry point` of our app<a href="#entry-point-conventions" aria-describedby="footnote-label" id="entry-point-conventions-ref">.</a>

::: note
There are a few implicit details which I want to highlight when it comes to namespaces.
**Firstly**, namespaces follow the folder path.  **Secondly**, if
a folder or file in your namespace has multiple words in it, like `time_dive`, when
we're write our Clojure/Script namespace you must use dashes and not underscores
to separate them.  For example, you have a file labelled `time_dive` and when we
write it in Clojure/Script we would write `time-dive`. **Lastly**, best practice
is to multi-segment our namespace name.  A multi-segmented
name is when we have multipe words/phrases separated by dots.  For example,
`tallex.time-dive` is multi-segmented.  The first segment is `tallex` and the
second is `time-dive`.  Best practice is to have two or more segments. If we
only have one segment it can lead to name conflicts. Having said this, it's not
the end of the world if you only have a single-segment namespace.
:::

### Step 5 - Add ClojureScript Tests

Good tests are the Alfred to a software engineers Batman. Open up that
`time_dive_tests.cljs` file and add the following<a href="#sanity-check-cljs-test" aria-describedby="footnote-label" id="sanity-check-cljs-test-ref">:</a>

```clojure
(ns tallex.time-dive-tests)

(js/console.log "Hello, Time Dive Tests!")
```

This concludes setting up the project structure and boilerplate code. The next
thing to do is setup some tooling to run our Clojure(Script) app.

## Running and Developing ClojureScript

To run our Clojure/Script project we'll use [clj] tool<a href="#clj-tools" aria-describedby="footnote-label" id="clj-tools-ref">:</a>
which will allow us to:

* run clojure programs
* resolve transitive dependencies
* build classpaths

Why do we need this?  Because while we're developing our app we want to be
able to use tools like ClojureScript, Figwheel etc to make our development
experience pleasant.  To do this, we start by adding these tools (deps) to our
project.

### Step 6 - Add deps file

Start by creating a `deps.edn` file in the root of our project and then make
it look like this<a href="#build-tools-deps" aria-describedby="footnote-label" id="build-tools-deps-ref">:</a>

```clojure
{:paths
 ["src" "tests" "resources"]

 :deps
 {org.clojure/clojurescript {:mvn/version {{ site.posts.dep.clojurescript.version }} }}

 :aliases
 {:dev {:main-opts ["-m"  "cljs.main"
                    "-ro" "{:static-dir,[\".\",\"out\",\"resources\"]}"
                    "-w"  "src"
                    "-c"  "tallex.time-dive"
                    "-r"]}}}
```

::: note
Unlike other files in our Clojure project, we must name our `.edn` what
`cljs` want: `deps.edn`.  This is because the `clj` tool is going to look for a file
called `deps.edn`. Furthermore, you will notice that the extension of this file
is `.edn`. You can think of this as the Clojure(Script) equivalent of `json`.
:::

Before we continue, let's review what our `deps.edn` file is doing:

- [:paths] tells `clj` where to look for clojure code. Also known as a `classpath`
- [:deps] tells `clj` which dependencies our app needs. Right now our only dependency is ClojureScript.
- [:aliases] are like shortcuts.  We can store long commands, or alternate dependencies in these.

Right now, we only have one alias called `dev`, but we will eventually have
others like `prod` and `test`.  The aliases allow us to run our app in different
ways.  Right now, our `dev` alias says: run ClojureScript.  Specifically:

- ["-m"] run `cljs.main` (run clojurescript).
- ["-ro"] teach the CLJS repl where to find `static files` e.g. html, css etc.
- ["-w"] watch all files in `src` dir and recompile when they are changed.
- ["-c"] compile our app entry point: `tallex.time-dive`.
- ["-r"] run a REPL and connect it to the browser.

Now that we have a rough idea of what is going on we're ready to take our app
for a test drive.

Open a terminal, move into the root of the app and run the following command:

```bash
clj -M:dev
```

wait a bit for the above to run. If it worked, you should see that a browser
tab/window automatically opens and you'll see the HTML and CSS we coded above:

![screenshot of time dive app](/images/001-time-dive-app.png)

::: note
Note that when you run the above you will see that two new directories are
auto generated for you in the root of your project: `.cpcache/` and `out/`. I bring
this up so you know that it's expected and so that you know it's Okay
to not include these folders in your projects version control.  If you are
wondering how to version control them see this [extra step]
:::

Before we jump over to the next section I want to draw your attention to the
fact that we have zero dependencies. Think about this: our files are being
watched, code is recompiled on save, we are greeted with a browser repl and
all of this with zero dependencies. Yes, we are still missing a few niceties,
but we are not done yet.

::: note
If you were testing the watch feature and can't see the code changes take
affect be sure to try refreshing the browser.
:::

## Setup a ClojureScript Toolchain

As I noted, we have zero dependencies and already have a powerful toolchain.
However, the developer experience can be better.  This section will take our
toolchain to the next level by introducing [figwheel].

`figwheel` is a popular ClojureScript tool and a must have for my workflow<a href="#toolchain-tools" aria-describedby="footnote-label" id="toolchain-tools-ref">.</a>
Figwheel has [many features], but we are only going to focus on the main ones.
These include:

- live ClojureScript and CSS Reloading
- Informative error messages
- Build configurations for prod, dev, test et al.

Now that we know _what_ figwheel does, let's see _how_ to make it do the things.

### Step 7 - Add Figwheel

It starts by adding figwheel as a dependency. We do this by opening the
`deps.edn` file and add the line you see highlighted below<a href="#sanity-check-toolchain" aria-describedby="footnote-label" id="sanity-check-toolchain-ref">:</a>

```clojure
; highlight-range{7}
{:paths
 ["src" "tests" "resources"]

 :deps
 {org.clojure/clojurescript {:mvn/version {{ site.posts.dep.clojurescript.version }}}

  com.bhauman/figwheel-main {:mvn/version {{ site.posts.dep.figwheel.version }}}}

 ; ...
 }
```

::: note
Clojure libraries are generally found in [Clojars] which is a popular Clojure package repository.  This is where you can go to find packages and examples of how to use the packages in our projects<a href="#package-repos" aria-describedby="footnote-label" id="package-repos-ref">.</a>  Also note that when you add new dependencies to your project you will also have to stop and restart your app.
:::

### Step 8 - Add build configuration

A `build configuration` is we configure both [figwheel] and the [ClojureScript compiler] <a href="#build-config-options" aria-describedby="footnote-label" id="build-config-options-ref">.</a>
In this section, we'll show you what a `development` build configuration looks like<a href="#sanity-check-build-config" aria-describedby="footnote-label" id="sanity-check-build-config-ref">.</a>

Create a new file in the root of our ClojureScript app called `dev.cljs.edn`
and add the following code to it:

```clojure
^{:watch-dirs ["src"]
  :css-dirs   ["resources"]}
{:main tallex.time-dive}
```

What does all of the above mean?

1. [:watch-dirs] - when any `cljs` files change in `src` directory figwheel recompiles and re-loads the browser.
2. [:css-dirs] - when `css` files change in the `resources` directory figwheel recompiles and re-loads them in the browser
3. [:main] - This is an option that figwheel passes to the `ClojureScript compiler` which tells the compiler which file is our apps `entry point`.

If the above sounds like it overlaps with how we configured our project in
Step 6, you're right.  Now that we're using `Fighwheel` we don't need the
`-w`, `-r` and `-c` flags we originally added to our `dev` alias.  We'll update
this in the next step.

:::note
A few additional notes about the above:

**1.**  You can name your build configuration anything you like but it needs to
include the `.cljs.edn` part.  We called ours `dev` because it's configuring
our code for the development environment.

**2.** You can and will have multiple `build configurations`.  This is not a
bad thing.

**3.**  when you look at the above it can seem like there is very little
configuration, especially when compared to a `webpack` config file. The
reason for this is because Figwheel makes a lot of sane default choices out
of the box.
:::

### Step 9 - Update :dev Alias

We need to update our `dev` alias to call `figwheel` instead of calling
`ClojureScript`.

Open `deps.edn` and make it look like this:

```clojure
{:paths
 ["src" "tests" "resources"]

 :deps
 {org.clojure/clojurescript {:mvn/version {{ site.posts.dep.clojurescript.version }}}

  com.bhauman/figwheel-main {:mvn/version {{ site.posts.dep.figwheel.version }}}}

 :aliases
 {:dev {:main-opts ["-m"  "figwheel.main" "--build" "dev" "--repl"]}}}
```

Time for sanity check to make sure everything is still working. Run the following command:

```bash
clj -M:dev
```

Your app should run, but you will notice that you get the following screen:

![screenshot of figwheel landing page](/images/001-time-dive-figwheel-landing-page.png)

This appears because figwheel is looking for our `index.html` in
`resources/public`. Up until now we put our `index.html` file directly under
the `resources` dir. So, our next step is to move our `index.html` file.

### Step 10 - Restructure resources dir

Go ahead and add a `public` directory to the `resources` dir and move your
`index.html` and `style.css` into it.

Your folder structure should look like this<a href="#sanity-check-resources-restruct" aria-describedby="footnote-label" id="sanity-check-resources-restruct-ref">:</a>

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
You will once again also see auto-generated folders like `target`, `out` and
`.cpcache`. They are not see in the above topology because I wanted to focus
on the important folders. If you see them, this is good.
:::

We also need to update the `script` tag in our `index.html` file.

```html
<script src="/cljs-out/dev-main.js"></script>
```

The reason we update the script tag because `figwheel` is going to build your
ClojureScript in a different folder than `clj` did.

time to run the app again:

```bash
clj -M:dev
```

The toolchain is now in place, but we are still missing the great and powerful
Hot Module Reloading.

## Hot Module Reloading

Hot Module Reloading (HMR) is the "killer feature" of React development. So
much so that HMR and React are often spoken in the same breath as if the two
are linked in some way.  The two are separate things entirely though. Truth is,
as long as you write [reloadable code], you can achieve HMR.

This is the catch though: writing reloadable code can be [tricky and time consuming].
Writing reloadable code is made much easier when you write your code using React.
This is likely part of the reason the two are seen as linked.

`figwheel` offers a framework / library agnostic mechanism to support your
ability to write HMR. Specifically, figwheel gives us `hooks` which we specify
in the namespace  where we want to take advantage of HMR.

The way it works is when we write HMR we have to tell our app how to tear
itself down and setup again when files are re-compiled. We have to write these
functions ourselves. What figwheel helps with is providing `hooks` like
`:after-load` and `:before-load` which will call our setup and teardown
functions.

::: note
The hooks I am referring to are figwheel hooks and have nothing to do with React Hooks.
:::

### Step 11 - Refactor for Figwheel

This section will illustrate how to use `figwheel hooks`.

Open `time_dive.cljs`. Currently, our `time-dive` namespace is logging
"Hello, Time Dive" on each reload. We could however only have it log on
re-compile by adding a hook like this<a href="#sanity-check-reagent" aria-describedby="footnote-label" id="sanity-check-reagent-ref">:</a>

```clojure
(ns ^:figwheel-hooks tallex.time-dive)

(defn ^:after-load re-render []
  (js/console.log "Hello, Time Dive!"))
```

Now when you try to run the app you will notice that the `console.log` will only
log when there has been a reload.
not log the first time but only after each save. Things to take note of:

- **^:figwheel-hooks** - `meta data` telling figwheel we want to use hooks in our namespace
- **^:after-load** - `meta data` telling figwheel that we want it to run the function, `re-render`, after each compile

::: note
The `^:` is Clojure syntax for [metadata].  It's additional information we
can add to our to our vars, functions etc.  In this case, when `figwheel` read
the metadata, it knows it has to do something.
:::

`reloadable code` is a rich topic and my hope is to show you how it works
with CLJS and `figwheel` and that it's a way you write your code just as much
as a helper tool.

## Add Reagent

You could use a bunch of JS frameworks in ClojureScript, but the ClojureScript
community loves React and the community has made wrappers to make React
easier to use in ClojureScript.

While there are many wrappers the most popular React wrapper is currently
[Reagent] so we will show you how to use that.

### Step 12 - Refactor for Reagent

In addition to adding Reagent we are going to update our `deps.edn`, `html`,
`css` and `cljs`.

Open the `deps.edn` file and making it look like this<a href="#sanity-check-reagent-two" aria-describedby="footnote-label" id="sanity-check-reagent-two-ref">:</a>

```clojure
; highlight-range{9}
{:paths
 ["src" "tests" "resources"]

 :deps
 {org.clojure/clojurescript {:mvn/version {{ site.posts.dep.clojurescript.version }}}

  com.bhauman/figwheel-main  {:mvn/version {{ site.posts.dep.figwheel.version }}}

  reagent                   {:mvn/version {{ site.posts.dep.reagent.version }}}}


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
- `defonce` is used to control side effects.

::: note
A little more about `defonce`:  When your app re-loads through figwheels HMR
the code in the file will re-run.  So, if instead of `start-up` we just called
`(mount)`, `mount` would rerun every time the file changes.  Instead, we
want to control this process.  We want to say:  when the file runs there are
things I want to do only the first time and things I want to happen every
other time.  This is called writing reloadable code.
See [Students of The Game: Reloadable Code].
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

::: footnotes

->->-> footnote#clojurescript-spelling
You will notice I spell ClojureScript in two ways: `ClojureScript` or `Clojure(Script)`.  The difference: The first is me saying "Just ClojureScript" and the second is me saying "this applies to both Clojure and ClojureScript".  The purpose is because Clojure and ClojureScript are 95% the same language, same build tools etc.  I have found it helpful to make this clear early on.
->->->

->->-> footnote#project-structure
Technically the `README`, `Resources` and `tests` files/dirs are not needed, but I always include them by default because to me, taking the time to setup things well in the beginning saves us time later.  Also keep in mind that you don't have to follow my structure.  There is no real science here other than this is a sane structure I have evolved and come to trust through use in production.  **Sanity Check**: your project should look like this: [commit 96fafa5].
->->->

->->-> footnote#resources-dir
You will notice HTML, CSS, Images etc will go in our `Resources` dir.  This is not a hard and fast rule, but it is a helpful convention.  Also, **sanity Check**:  [commit 58975c]
->->->

->->-> footnote#sanity-check-css
**Sanity Check**: [commit 3aab28]
->->->

->->-> footnote#sanity-check-cljs
**Sanity Check**: [commit 863278]
->->->

->->-> footnote#entry-point-conventions
The dominant convention is to name your entry point `core.cljs`. This is something that comes from the build tool `lein` and it's a silly convention because it provides us with no semantics.  It's easy to want to do this though because other languages like  JavaScript do this with their `index.js` and python with `main.py` and so on.  Resist the urge and try to give your `entry point` a meaningful name.
->->->

->->-> footnote#sanity-check-cljs-test
**Sanity Check**: [commit 90a576]
->->->

->->-> footnote#clj-tools
Other tools include `lein` and `boot`, however the `Clojure Tools` are currently
the most popular choice for new projects.  Feel free to learn more by reading
[What Are The Clojure Tools]:
->->->

->->-> footnote#build-tools-deps
**Sanity Check**: [commit ba182b]
->->->

->->-> footnote#what-is-dev-toolchain
When I say "toolchain" I mean things like build the app for production and dev, HMR, live CSS reloading.  All the things needed to make development life easy and get your app from your local environment to a production ready state.
->->->

->->-> footnote#toolchain-tools
There is also [shadow-cljs] which does some great stuff and is the more popular
tool.  Okay, why am I teaching Figwheel then? Figwheel does less and this is
important to me.  It adds testing facilities, a file-watcher and some
conveniences and no more.  Compare this to `shadow-cljs` which actually adds
to the CLJS language itself.  For example, it supports a non-standard form of
requiring files.  I find that the conveniences it provides often serves to
confuse users.
->->->

->->-> footnote#sanity-check-toolchain
**Sanity Check**: [commit 7d642c]
->->->

->->-> footnote#package-repos
`Clojars` is not the only way to find versions, or even gain access to libraries.  Another place to look is on Github where the source code for your packages live.  In addition, you can even specify a specific hash to download the packages directly from github.  Feel read to read more about that [CLI and Deps]
->->->

->->-> footnote#build-config-options
I believe the difference between ClojureScript and Figwheel options is a great source of confusion for new ClojureScript developers.  I feel this way because it requires an understanding of where one library ends and the other begins.  Just know that Figwheel is going to be running the `ClojureScript Compiler` for you which is why both options can all look like one thing.  If you are ever not sure, visit the links.
->->->

->->-> footnote#sanity-check-build-config
**Sanity Check**: [commit 46e469]
->->->

->->-> footnote#sanity-check-resources-restruct
**Sanity Check**: [commit 4b6b65]
->->->

->->-> footnote#sanity-check-resources-restruct
**Sanity Check**: [commit 4c8cbd]
->->->

->->-> footnote#sanity-check-reagent-two
**Sanity Check**: [commit e1cf66]
->->->

:::

[Getting Started with Clojure(Script)]: https://youtube.com/playlist?list=PLaGDS2KB3-ArG0WqAytE9GsZgrM-USsZA
[demo project]: https://github.com/athomasoriginal/demo-clojurescript-app
[15 minute primer to the syntax of Clojure]: https://github.com/shaunlebron/ClojureScript-Syntax-in-15-minutes
[snake case]: https://en.wikipedia.org/wiki/Snake_case
[Java conventions]: https://docs.oracle.com/javase/tutorial/java/package/namingpkgs.html
[ClojureScript Quickstart Guide]: https://clojurescript.org/guides/quick-start
[extra step]: https://github.com/athomasoriginal/demo-clojurescript-app/commit/0cef20e6773ab5d2f93253926dafb4e05e0673f7
[Clojars]: https://clojars.org
[metadata]: https://clojure.org/reference/metadata
[lein]: https://leiningen.org/
[boot]: https://boot-clj.com/
[clj]: https://clojure.org/guides/deps_and_cli
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
[Getting Clojure]: https://pragprog.com/titles/roclojure/getting-clojure/
[Elements of Clojure]: https://leanpub.com/elementsofclojure
[commit 96fafa5]: https://github.com/athomasoriginal/demo-clojurescript-app/commit/96fafa51dfa8cb2e1ea208961c1ff2a3e4eb663a
[commit 58975c]: https://github.com/athomasoriginal/demo-clojurescript-app/commit/58975cc17d779a6f4c7947c9c21a468a6711671e
[commit 3aab28]: https://github.com/athomasoriginal/demo-clojurescript-app/commit/3aab28449076fb0d80e801d0a1f8cf0c5d8c5e42
[commit 863278]: https://github.com/athomasoriginal/demo-clojurescript-app/commit/863278997d8dd23e3c56dbb61cab7c5138aa423c
[commit 90a576]: https://github.com/athomasoriginal/demo-clojurescript-app/commit/90a576f927947fcd620c6bcb340d3dc0427d2b06
[commit ba182b]: https://github.com/athomasoriginal/demo-clojurescript-app/commit/ba182b9a2b7f5b753bb7b16bb5ff4bf8384ab0bd
[shadow-cljs]: http://shadow-cljs.org/
[excellent documentation]: https://figwheel.org/
[commit 7d642c]: https://github.com/athomasoriginal/demo-clojurescript-app/commit/7d642c5416413da13c9cbebd31e33a563e917c90
[CLI and Deps]: https://clojure.org/reference/deps_and_cli#_dependencies
[commit 46e469]: https://github.com/athomasoriginal/demo-clojurescript-app/commit/46e46990726d61638e9b80f6345e4b6683ac1e70
[commit 4b6b65]: https://github.com/athomasoriginal/demo-clojurescript-app/commit/4b6b656323ea5cda9edb9265e61e49de6d9f7cfc
[commit 4c8cbd]: https://github.com/athomasoriginal/demo-clojurescript-app/commit/4c8cbd67dcc24d0365feb25bf511e03cba0fcf36
[commit e1cf66]: https://github.com/athomasoriginal/demo-clojurescript-app/commit/e1cf66d7ed1973d4fa1ec1091c0cbe16e61cf4b4
[Students of The Game: Reloadable Code]: https://betweentwoparens.com/blog/students-of-the-game:-reloadable-code/
[{{ site.posts.resource.clojure_survey.title }}]: {{ site.posts.resource.clojure_survey.url }}
[What Are The Clojure Tools]: https://betweentwoparens.com/blog/what-are-the-clojure-tools/
