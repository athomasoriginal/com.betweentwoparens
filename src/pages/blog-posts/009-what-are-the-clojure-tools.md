---
title: 'What are the Clojure Tools?'
date: '2020-03-31'
slug: what-are-the-clojure-tools
summary: It's not a build tool, it's clj
author: 'Thomas Mattacchione'
keywords: ['clojure tutorial', 'clojurescript beginner guide', 'clojure tools', 'clj']
---

When I come to a new programming language I want to learn how to "get started" with said language.  The idea of "getting started" can mean anything from learning the language itself, to learning the tools _of_ the language.  For me, once I have a handle on a language's tools I can confidently work away at learning the language itself.

For example, when I came to Clojure my questions went something like:

- How do I **install** Clojure?
- How do I **run** my Clojure programs?
- How do I **manage** Clojure packages?
- How do I **configure** a Clojure project?
- How do I **build** Clojure for production?

Several years ago, when I started with Clojure, the answers to these questions, and more, were [lein] or [boot].  A little while later, the [clojure CLI tool], `clj/clojure`, entered the ring.  Needless to say, I found it tricky to contextualize this new tool.

So, in this post I want to share some of my knowledge of what the `clj/clojure` tool is, the problem it solves and how it compares to `lein` and `boot`.

## Clojure CLI Tool

Before we begin, let's review what the Clojure CLI tool is.  If you installed clojure using the [official guide] you will be using the clojure CLI tool.  This is the fancy name for the `clj` or `clojure` commands.

This tool was officially released as part of Clojure 1.9.  A few interesting notes about it.  Firstly, `clj` and `clojure` are just bash scripts.  Secondly, both `clj` and `clojure` actually do the same thing under the hood<a href="#clj-calls-clojure-note" aria-describedby="footnote-label" id="clj-calls-clojure--ref">.</a>  This second point was confusing for me, so I will explain it a little.

Calling the `clj` command will call the `clojure` command.  The difference is that when you call `clj` it wraps the `clojure` command with a tool called [rlwrap].  Effectively, this adds [readline] support to the `clojure` command.  Translation:  It makes it nicer to type in the Clojure REPL via the terminal.  For this reason, you will be encouraged to use `clj` during development, but in production scripts you will see `clojure` used.

<aside class="blog-content__note">For the rest of this post I am going to refer to the <code class="gatsby-code-text">clj/clojure</code> tool as just <code class="gatsby-code-text">clj</code></aside>

Now that were friendly with the `clj` tool, let's dive into what it can do:

**Run** a clojure repl and programs respectively

```bash
clj
```

```bash
clj -m your-clojure-program
```

**build** a java classpath + resolve dependencies

```bash
clj -Sdeps '{:deps {bidi {:mvn/version "2.1.6"}}}'
```

This brings us to the third factoid about the `clj` tool.  While it appears `clj` is running clojure programs - building classpaths and resolving dependencies - it actually only cares about running clojure programs.

It's this part - what `clj` does and what it does not do - that can throw people off. On the surface, it looks like `clj` does "all of the things", however `clj` is getting help from two other tools:

- [deps.edn]
- [tools.deps.alpha]

And this brings us to the fourth point.  It can be difficult to research `clj`, or follow along with slack conversations on Clojurians because it can seem that `clj`, `deps.edn` and `tools.deps.alpha` are used interchangeably.  In truth, they are all separate things that are wrapped in the `clj` tool.

Hopefully the next few sections will help further this knowledge by discussing: `clj` (the bash script), `deps.edn` (a clojure map) and `tools.deps.alpha` (a clojure program) and how they all come together.

## clj/clojure

`clj` runs clojure programs.  When you run `clj` or `clojure` they end up running something like the following:

```bash
java [java-opt*] -cp classpath clojure.main [init-opt*] [main-opt] [arg*]
```

So the only thing that this tool really does is:

- run clojure programs
- Provides a standard way to interact with clojure programs
- Improves the "Getting Started" story

Having said this, this tool is also going to call out to `tools.deps.alpha`.

## tools.deps.alpha

`tools.deps.alpha` builds a classpath and resolve dependencies.  The longer way of explaining what it does is:

- reads in dependencies from a `deps.edn` file
- resolves the dependencies and their transitive dependencies
- builds a classpath

<aside class="blog-content__note">Note that <strong>NEITHER</strong> <code class="gatsby-code-text">clj</code> or <code class="gatsby-code-text">tools.deps.alpha</code> are "building" clojure artifacts.</aside>

Aside from the above, the best thing you can do to learn more is listen to Alex Miller, the author of `tools.deps.alpha`, speak about it on [Clojure Weekly Podcast].

Finally, as I mentioned `tools.deps.alpha` knows which dependencies to resolve because it reads in the `deps.edn` file.

## deps.edn

`deps.edn` allows you to specify project dependencies and configurations.

This is just an `edn` file where [edn] is like Clojure's version of `json`.

<aside class="blog-content__note">If you're from the JavaScript community it can be helpful to think of this file as the equivalent of a <code class="gatsby-code-text">package.json</code> file</aside>

`deps.edn` is just a [map] which accepts specific keywords.  Here is an example of _some_ of the common keywords:

```clojure
{:deps    {...}
 :paths   [...]
 :aliases {...}}
```

This is the file where you define the libraries your project needs, shortcuts and where to find your projects code.  Ultimately, it's just a map with some keys.

## Clojure Tools Installer

"Clojure Tools Installer" is a fancy way of referring to the `brew tap` used to install Clojure on mac and linux machines.  As of February 2020, Clojure started maintaining their own [brew tap].  Thus, if you installed the clojure command line tools via

```bash
brew install clojure
```

you will likely want to uninstall `clojure` and install the following:

```bash
brew install clojure/tools/clojure
```

In all likelihood, you would probably be fine with `brew install clojure`.  The thing is that while `brew install clojure` will still see some love, it won't be as consistent as `clojure/tools/clojure` tap.

## clj v lein v boot

Let's end this conversation with a quick contextualization of `clj`, `lein` and `boot`.

<aside class="blog-content__note">I won't dive into the history, for this I recommend the blog post <a class="blog-content__link" href="https://corfield.org/blog/2018/04/18/all-the-paths/" rel="noopener noreferrer">All the Paths</a> by Sean Corfield.</aside>

The first point is that you will choose one of the three tools (`clj`, `lein`, or `boot`) for your project.  You don't use more than one.  Just like you wouldn't use both `boot` and `lein`, you won't use both `clj` and `boot` or `clj` and `lein`.  Further, none of these tools should conflict with the other.

<aside class="blog-content__note">This is not 100% true because the "build" story for <code class="gatsby-code-text">clj</code> is not as "easy" as <code class="gatsby-code-text">lein</code> which has led to examples of <a class="blog-content__link" href="https://github.com/oakes/full-stack-clj-example" rel="noopener noreferrer">clj calling to lein</a> just for the production builds of their apps</aside>

If your curious which to choose, I think it's obvious that I would suggest `clj`.  The reason I like `clj` is because the tool is simple and easy to use.  You can read through `clj` and `tools.deps.alpha` in an afternoon and understand what they are doing if you had to.  If the same occurs with `lein` or `boot`, you will not have any such luck.

Secondly, and most importantly, the Clojure community is really leaning into building tools for `clj`.  For example, where `lein` used to have significantly more functionality, the community has built a ton of [incredible tools] that will cover all your requirements.

Finally, when it comes to managing your project configurations and building out maintainable organizational structures (monorepo) it doesn't get easier than `clj`.

So yes, `clj` for the win.

<aside>
  <h3>Footnotes</h3>
  <ol>
    <li id="clj-calls-clojure-note">
      You can see this <a class="blog-content__link" href="https://github.com/clojure/brew-install/blob/1.10.1/src/main/resources/clj#L4" target="_blank" rel="noopener noreferrer">here</a>.
      <a href="#clj-calls-clojure-note-ref" aria-label="Back to content">↩</a>
    </li>
  </ol>
</aside>

[lein]: https://leiningen.org/
[boot]: https://boot-clj.com/
[official guide]: https://clojurescript.org/guides/quick-start
[Clojure]: https://clojure.org/guides/getting_started
[ClojureScript]: https://clojurescript.org/guides/quick-start
[clojure cli tool]: https://clojure.org/guides/deps_and_cli
[clojure cli tools]: https://clojure.org/guides/deps_and_cli
[rlwrap]: https://linux.die.net/man/1/rlwraps
[readline]: https://en.wikipedia.org/wiki/GNU_Readline
[deps.edn]: https://www.clojure.org/guides/deps_and_cli
[tools.deps.alpha]: https://github.com/clojure/tools.deps.alpha
[edn]: https://github.com/edn-format/edn
[map]: https://clojure.org/reference/data_structures#Maps
[Clojure Weekly Podcast]: https://soundcloud.com/user-959992602
[installing the Clojure CLI tools]: https://clojure.org/guides/getting_started
[Getting Started with Clojure]: https://www.youtube.com/playlist?list=PLaGDS2KB3-ArG0WqAytE9GsZgrM-USsZA
[brew tap]: https://clojure.org/news/2020/02/28/clojure-tap
[All The Paths]: https://corfield.org/blog/2018/04/18/all-the-paths/
[incredible tools]: https://github.com/clojure/tools.deps.alpha/wiki/Tools
