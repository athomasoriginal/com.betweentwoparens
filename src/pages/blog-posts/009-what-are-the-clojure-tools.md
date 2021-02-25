---
title: 'What are the Clojure Tools?'
datePublished: '2020-03-31'
dateModified: '2021-02-25'
slug: what-are-the-clojure-tools
summary: It's not a build tool, it's clj
author: 'Thomas Mattacchione'
---

I like to begin learning new languages by understanding the tooling ecosystem.  For me, understanding the tools enables me to confidently focus on learning the language itself<a href="#my-way" aria-describedby="footnote-label" id="my-way-ref">.</a>  Thus, when I approach a new language, e.g. Clojure, I often start by asking questions like this:

- How do I **install** Clojure?
- How do I **run** a Clojure program?
- How do I **manage** Clojure packages (dependencies)?
- How do I **configure** a Clojure project?
- How do I **build** Clojure for production?

Now, when I first came to clojure, the answer to the above questions were, _"use [lein] or [boot]"_. Then, around the end of 2017, a third option came along: the [Clojure CLI Tools]<a href="#cli-tool-v-dev-tools" aria-describedby="footnote-label" id="cli-tool-v-dev-tools-ref">.</a>. Admittedly, it took me some time to understand how the `Clojure CLI Tools` fit into the bigger picture.<a href="#clojure-tools-simple" aria-describedby="footnote-label" id="clojure-tools-simple-ref">.</a>

This is where I hope this post will help by providing an overview of what the [Clojure CLI Tools] are, the problem they solve and how they compare to other tools like `lein` and `boot`.

<aside class="blog-content__note">If you're interested in using the <code class="gatsby-code-text">Clojure CLI Tools</code> you can visit the <a class="blog-content__link" href="https://clojure.org/guides/getting_started" target="_blank" rel="noopener noreferrer">Official Getting Started Guide</a> or even <a class="blog-content__link" href="https://www.youtube.com/watch?v=5_q5pLoz9b0" target="_blank" rel="noopener noreferrer">watch this video</a> if you're using mac</aside>

## Clojure CLI Tools

To begin, what are the `Clojure CLI Tools`?  They are a CLI tool accessed using the `clj` or `clojure` command.  Furthermore, they are built/maintained by Cognitect, the official maintainers of the Clojure language.

Here are some **simple** examples of how and what you can do with the `Clojure CLI Tools`.

**Run** a Clojure repl

```bash
clj
```

**Run** a Clojure program

```bash
clj -M -m your-clojure-program
```

**manage** Clojure dependencies

```bash
clj -Sdeps '{:deps {bidi/bidi {:mvn/version "2.1.6"}}}'
```

Thus, we can see that `clj` is a very useful tool.  Now, `clj`  itself is just a bash script which itself wraps other tools.  At the time of this writing, it wraps 3 main tools:

- [clojure] - another bash script program
- [deps.edn] - an edn file (just data)
- [tools.deps.alpha] -  a clojure program

The reason why I believe it's important to understand this early is because, no matter what part of the learning journey you're on, it will help.

If you're brand new to Clojure, this is going to help you better understand conversations amongst other Clojurians and help guide questions you may have.  For example, if you're ever on [Clojurians Slack] you will notice that there isn't a Clojure CLI Tools channel, but there is a [#tools-deps] channel.  If you ever have questions about the CLI Tools, that's the place to be.

If you're beyond the early learner phase, understanding the nuance is going to help you level up and gather greater context which can act as a stepping stone as you guide your own learning journey.

In summary, the `Clojure CLI Tools` is more of an umbrella term made up of `deps.edn`, `clj`, `clojure` or `tools.deps.alpha`.

The next few sections will discuss each of the above tools in more detail and how they all come together.

## clojure



When you read the `CLI Tools` [official getting started] you will notice that they use `clj` and `clojure` and both accept the same arguments.  Are they the same thing or different?  When do you use one over the other?

First, how are they the same or different?  When you use `clj` it actually calls `clojure` under the hood and `clojure` itself calls something like this:

```bash
java [java-opt*] -cp classpath clojure.main [init-opt*] [main-opt] [arg*]
```

Yet, you will see that `clj` is more commonly used in development.  The reason for this is because `clj` wraps the `clojure` command with a another tool called [rlwrap].  What `rlwrap` does is add [readline] support to the `clojure` command.  In other words, `clj` makes it easier to type in the Clojure REPL in the terminal.  It's for this reason that you will be encouraged to use `clj` during development, where as `clojure` is more commonly used in a CI or production setting<a href="#when-to-use-clojure-script" aria-describedby="footnote-label" id="when-to-use-clojure-script-ref">.</a>

Okay, so now that we know that `clj` is a convenience wrapper around `clojure`, what does this command do?  Well, it's just a bash script and it orchestrates the other tools.  Thus, `clj` is responsible for:

- running Clojure programs
- Providing a standard way to interact with Clojure programs
- Improves the "Getting Started" story

As I said, it's a convenience wrapper.  The meat and potatoes of the `clj` tool is `tools.deps.alpha`.

## tools.deps.alpha

`tools.deps.alpha` is responsible for understanding which dependencies your project needs and specifying how to get them.  A more detailed way of explaining what it does is:

- reads in dependencies from a `deps.edn` file
- resolves the dependencies and their transitive dependencies
- builds a classpath

<aside class="blog-content__note">Note that <strong>NEITHER</strong> <code class="gatsby-code-text">clj</code> or <code class="gatsby-code-text">tools.deps.alpha</code> are "building" clojure artifacts.</aside>

There isn't too much else going on here and the library itself is small enough that you can read it in an afternoon.  If you're interested in learning more I highly recommend listening to the [Clojure Weekly Podcast] featuring Alex Miller, the author of `tools.deps.alpha`, speak about the `Clojure CLI Tools`.

Continuing on, in order for `tools.deps.alpha` to know which dependencies you need you have to write them out.  We do this, and more, in a file called `deps.edn`.

## deps.edn

`deps.edn` allows you to specify project dependencies and configurations.  At it's heart, `deps.edn` is just an [edn] file.  You can think of it like Clojure's version of `json`.

<aside class="blog-content__note">If you're from the JavaScript community, it can be helpful to think of this file like a <code class="gatsby-code-text">package.json</code> file</aside>

`deps.edn` is just a [map] which accepts specific keywords.  Here is an example of _some_ of the common keywords:

```clojure
{:deps    {...}
 :paths   [...]
 :aliases {...}}
```

With this file we describe the dependencies our project needs, where our project should look to find our source/tests and shortcuts for running our project's code.

Now, given this is just an `edn` file it can be odd to think of it as a separate "tool".  The reason I believe this is done is because the shape of the `edn` map is well defined.  Which could be seen as acting like a contract.

What this means is that this file is an extensible tool.  In other words, you could write your own `tools.deps.alpha` which knows how to consume this file and be compliant with projects which use it.

## Clojure CLI Tools Installer

"Clojure CLI Tools Installer" is a fancy way of referring to the `brew tap` used to install Clojure on mac and linux machines.  As of February 2020, Clojure started maintaining their own [brew tap].  Thus, if you installed the `Clojure CLI Tools` via

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

The first point is that you will choose between _one_ of the three tools (`clj`, `lein`, or `boot`) for your project.  You don't use more than one.  Just like you wouldn't use both `boot` and `lein`, you won't use both `clj` and `boot` or `clj` and `lein`.  Furthermore, none of these tools should conflict with one another.

<aside class="blog-content__note">Now, when I said that you don't actually combine more than one of these tools, this is not 100% true. Take for example the fact that the "build" story for <code class="gatsby-code-text">clj</code> is not as "easy" as <code class="gatsby-code-text">lein</code> which has led to examples of <a class="blog-content__link" href="https://github.com/oakes/full-stack-clj-example" rel="noopener noreferrer">clj calling to lein</a> just for the production builds of ones apps.  As of the latest update though, I have not found a need to do this for any of my Clojure or ClojureScript apps.</aside>

If you're curious which to choose, I think it's obvious that I would suggest `clj`.  The reason I like `clj` is because the tool is simple _and_ easy to use.  You can read through `clj` and `tools.deps.alpha` in an afternoon and understand what they are doing if you had to.  The same (subjectively of course) cannot be said for `lein` or `boot`.

Secondly, and most importantly, the Clojure community is really leaning into building tools for `clj`.  For example, where `lein` used to have significantly more functionality, the community has built a ton of [incredible tools] that will cover many of your essential requirements.  There is also the fact that `deps.edn` is easier to configure because there are less configuration options and less need to understand what lein is doing as you want to perform more advanced configurations.

Finally, when it comes to managing your project configurations and building out maintainable organizational structures (monorepo) it doesn't get easier than `clj`<a href="#monorepo-comment" aria-describedby="footnote-label" id="monorepo-comment-ref">.</a>

So yes, `clj` for the win.

<aside>
  <h3>Footnotes</h3>
  <ol>
    <li id="my-way">
      This point is more nuanced than it appears and could also warrant a post of it's own.  Just note that this is my process.  I don't recommend it to everyone.
      <a href="#my-way-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="cli-tool-v-dev-tools">
      In earlier versions of this blog post I referred to the <code class="gatsby-code-text">Clojure CLI Tools</code> as <code class="gatsby-code-text">Clojure Tools</code>.  The reason I now refer to them as the "Clojure CLI Tools" is because on August 21, 2020 it was announced in Clojurians (The official Clojure Slack Org) that cognitect released a free set of tools called <a class="blog-content__link" href="https://cognitect.com/dev-tools/index.html" target="_blank" rel="noopener noreferrer">Cognitect Dev Tools</a>.  Thus, I made the change to be very clear that there is a difference.
      <a href="#cli-tool-v-dev-tools-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="clojure-tools-simple">
      I feel this was true for me because their role in the Clojure ecosystem tooling setup is deceptively simple and focused.
      <a href="#clojure-tools-simple-ref" aria-label="Back to content">Back</a>
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
      To clarify the "monorepo" comment: Choosing a sane structure for your monorepo is important to making this work.  I have a personal project which has 4 or 5 sub-projects and I have not run into any issues as of yet.  I would eventually love to write about my approach, but until then checkout Sean Corfield's Blog Post about <a class="blog-content__link" href="https://corfield.org/blog/2021/02/23/deps-edn-monorepo/" target="_blank" rel="noopener noreferrer">Clojure Monorepo using Clojure CLI Tools</a>.
      <a href="#monorepo-comment-ref" aria-label="Back to content">Back</a>
    </li>
  </ol>
</aside>

[lein]: https://leiningen.org/
[boot]: https://boot-clj.com/
[official getting started]: https://clojure.org/guides/getting_started
[Clojure]: https://clojure.org/guides/getting_started
[ClojureScript]: https://clojurescript.org/guides/quick-start
[Clojure CLI Tools]: https://clojure.org/guides/deps_and_cli
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
[#tools-deps]: https://clojurians.slack.com/archives/C6QH853H8
[Clojurians Slack]: https://clojurians.slack.com/?redir=%2Fmessages%2F
