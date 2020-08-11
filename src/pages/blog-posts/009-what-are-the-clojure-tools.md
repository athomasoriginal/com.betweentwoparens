---
title: 'What are the Clojure Tools?'
date: '2020-03-31'
slug: what-are-the-clojure-tools
summary: It's not a build tool, it's clj
author: 'Thomas Mattacchione'
keywords: ['clojure tutorial', 'clojurescript beginner guide', 'clojure tools', 'clj']
---

When I start learning a new language I like to begin by understanding the tooling ecosystem.  For me, having a handle on the tools enables me to confidently focus on learning the language itself<a href="#my-way" aria-describedby="footnote-label" id="my-way-ref">.</a>  For example, when I came to Clojure my questions went something like this:

- How do I **install** Clojure?
- How do I **run** a Clojure program?
- How do I **manage** Clojure packages (dependencies)?
- How do I **configure** a Clojure project?
- How do I **build** Clojure for production?

Now, when I first came to clojure, the answer to the above questions were, _"use [lein] or [boot]"_. Then, around the end of 2017, a third option came along: the [Clojure Tools]. Admitedly, it took me a while to understand their purpose and how to use them.  Now, I feel this was true for me because their role in the Clojure ecosystem tooling setup is deceptively simple.

So, in this post my goal is to share my knowledge around the [Clojure Tools] by outlining the problem they solve and how they compare to other tools like `lein` and `boot`.

## Clojure CLI Tool

If you installed Clojure using the [official guide] you already have the `Clojure CLI tool`.  Now, the `Clojure CLI tool` is a mouthful so the community often just refers to it as `clj`.  Thus, For the rest of this post I'm going to say `clj`.

Now that we're friendly with the `clj` tool, let's see how you might perform some common tasks:

**Run** a clojure repl and programs respectively

```bash
clj
```

```bash
clj -m your-clojure-program
```

**manage** Clojure dependencies

```bash
clj -Sdeps '{:deps {bidi {:mvn/version "2.1.6"}}}'
```

If we were to just look at the above commands, it appears that `clj` is doing many things.  Now, it's okay to think about it like this, but I think it's also important to understand that `clj` itself is a suite of tools which includes:

- [clj/clojure] - two _separate_ bash script commands
- [deps.edn] - an edn file
- [tools.deps.alpha] -  a clojure program

Once I understood the above, it became easier to follow along with Clojurians slack conversations and research the tool in general.  The reason for this is because when the community discusses the `clj` tool it can seem that `clj`, `deps.edn` and `tools.deps.alpha` are used interchangeably.  In truth, they are all separate things that are wrapped by the `clj` tool.

The next few sections will discuss each of the above tools in more detail and how they all come together.

## clj/clojure

`clj` is the interface to the suite of tools mentioned in the previous section.  As mentioned, when you install the `Clojure CLI tools` you will have access to two commands: `clj` and `clojure`.  They are just bash scripts and both commands, while separate, actually do the same thing under the hood<a href="#clj-calls-clojure-note" aria-describedby="footnote-label" id="clj-calls-clojure-note-ref">:</a>

```bash
java [java-opt*] -cp classpath clojure.main [init-opt*] [main-opt] [arg*]
```

But wait, if both `clj` and `clojure` do the same thing, why have two commands?  Let's dig into this.

Calling the `clj` command will call the `clojure` command.  The difference between the two is that when you call `clj` it wraps the `clojure` command with a tool called [rlwrap] and then calls `clojure`.

So why do this?  They do this because `rlwrap` adds [readline] support to the `clojure` command.  Translation:  It makes it nicer to type in the Clojure REPL in the terminal.  It's for this reason that you will be encouraged to use `clj` during development, where as `clojure` is more commonly used in a CI or production setting<a href="#when-to-use-clojure-script" aria-describedby="footnote-label" id="when-to-use-clojure-script-ref">.</a>

So to recap, the only thing that the `clj` tool does is:

- run clojure programs
- Provides a standard way to interact with clojure programs
- Improves the "Getting Started" story

But as we mentioned, it will call out to `tools.deps.alpha` to help resolve dependencies.

## tools.deps.alpha

`tools.deps.alpha` builds a classpath and resolves dependencies.  The longer way of explaining what it does is:

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

This is the file where you define the libraries your project needs, shortcuts and where to find your projects code.  Ultimately, it's just a map with some keys.  Now, it might seem odd that I think of this as a separate "tool".  The reason I do this is because this is just an edn map with well defined k/v pairs.

So what this means is that, in theory, you don't need to use `tools.deps.alpha`.  Instead, you could build your own version of `tools.deps.alpha` which consumes the `deps.edn` file and has it's own way of resolving dependencies.  I'm not encouraging this, i'm just explaining why I see it as standing on it's own.

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

The first point is that you will choose between _one_ of the three tools (`clj`, `lein`, or `boot`) for your project.  You don't use more than one.  Just like you wouldn't use both `boot` and `lein`, you won't use both `clj` and `boot` or `clj` and `lein`.  Further, none of these tools should conflict with the other.

<aside class="blog-content__note">Now, when I said that you don't actually combine more than one of these tools, this is not 100% true. Take for example the fact that the "build" story for <code class="gatsby-code-text">clj</code> is not as "easy" as <code class="gatsby-code-text">lein</code> which has led to examples of <a class="blog-content__link" href="https://github.com/oakes/full-stack-clj-example" rel="noopener noreferrer">clj calling to lein</a> just for the production builds of ones apps</aside>

If you're curious which to choose, I think it's obvious that I would suggest `clj`.  The reason I like `clj` is because the tool is simple and easy to use.  You can read through `clj` and `tools.deps.alpha` in an afternoon and understand what they are doing if you had to.  If the same occurs with `lein` or `boot`, you will not have any such luck.

Secondly, and most importantly, the Clojure community is really leaning into building tools for `clj`.  For example, where `lein` used to have significantly more functionality, the community has built a ton of [incredible tools] that will cover many of your essential requirements.

Finally, when it comes to managing your project configurations and building out maintainable organizational structures (monorepo) it doesn't get easier than `clj`<a href="#monorepo-comment" aria-describedby="footnote-label" id="monorepo-comment-ref">.</a>

So yes, `clj` for the win.

<aside>
  <h3>Footnotes</h3>
  <ol>
    <li id="my-way">
      This point is more nuanced than it appears and could also warrant a post of it's own.  Just note that this is my process.  I don't recommend it to everyone.
      <a href="#my-way-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="clj-calls-clojure-note">
      You can see this <a class="blog-content__link" href="https://github.com/clojure/brew-install/blob/1.10.1/src/main/resources/clj#L4" target="_blank" rel="noopener noreferrer">here</a>.
      <a href="#clj-calls-clojure-note-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="when-to-use-clojure-script">
      Of course, production scripts are not the only times you would want to use the <code class="gatsby-code-text">clojure</code> command.  Other times include when you are combining it with other tools e.g. emacs.  In general, if you are finding the <code class="gatsby-code-text">clj</code> command is causing some headaches when composing tools, give <code class="gatsby-code-text">clojure</code> a try.  Thanks, sogaiu for the tip!
      <a href="#when-to-use-clojure-script-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="monorepo-comment">
      Just some clarification aroud the "monorepo" point. Choosing a sane structure for your monorepo is important to mmaking this work.  Having said this, I have a personal project which has 4 or 5 sub-projects and I have not run into any issues as of yet.  I also know that others in the community have done similar things.  So in this case, it would be important to further look into my structure...but that can be fore another post.
      <a href="#monorepo-comment-ref" aria-label="Back to content">Back</a>
    </li>
  </ol>
</aside>

[lein]: https://leiningen.org/
[boot]: https://boot-clj.com/
[official guide]: https://clojurescript.org/guides/quick-start
[Clojure]: https://clojure.org/guides/getting_started
[ClojureScript]: https://clojurescript.org/guides/quick-start
[Clojure Tools]: https://clojure.org/guides/deps_and_cli
[Clojure cli tool]: https://clojure.org/guides/deps_and_cli
[Clojure cli tools]: https://clojure.org/guides/deps_and_cli
[clj/clojure]: https://github.com/clojure/brew-install
[rlwrap]: https://linux.die.net/man/1/rlwraps
[readline]: https://en.wikipedia.org/wiki/GNU_Readline
[deps.edn]: https://www.clojure.org/guides/deps_and_cli
[deps.edn - an edn config file]: https://www.clojure.org/guides/deps_and_cli
[tools.deps.alpha - a clojure program]: https://github.com/clojure/tools.deps.alpha
[tools.deps.alpha]: https://github.com/clojure/tools.deps.alpha
[edn]: https://github.com/edn-format/edn
[map]: https://clojure.org/reference/data_structures#Maps
[Clojure Weekly Podcast]: https://soundcloud.com/user-959992602
[installing the Clojure CLI tools]: https://clojure.org/guides/getting_started
[Getting Started with Clojure]: https://www.youtube.com/playlist?list=PLaGDS2KB3-ArG0WqAytE9GsZgrM-USsZA
[brew tap]: https://clojure.org/news/2020/02/28/clojure-tap
[All The Paths]: https://corfield.org/blog/2018/04/18/all-the-paths/
[incredible tools]: https://github.com/clojure/tools.deps.alpha/wiki/Tools
