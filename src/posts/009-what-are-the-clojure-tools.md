---
author: "Thomas Mattacchione"
createdDate: '31 March 2020'
date: Last Modified
layout: post
tags:
  - post
title: "What are the Clojure Tools?"
permalink: blog/what-are-the-clojure-tools/index.html
canonical: true
summary: "It's not a build tool, it's clj."
---

::: note
Exciting news!  Cognitect has released a new Clojure Tool called [tools.build].
You can read the [official tools.build announcement] for more information.
When it's no longer in **pre-release** I will update this post to include it.
:::

This post is about helping Clojure devs understand the [Clojure CLI Tools], the
problem(s) it's solving and how it compares to other tools like `lein` and `boot`.

When I start with a new language I _usually_ begin by finding answers to these
questions:

- How do I **install** [insert language here]?
- How do I **run** a [insert language here] program?
- How do I **manage** [insert language here] packages (dependencies)?
- How do I **configure** a [insert language here] project?
- How do I **build** [insert language here] for production?

With Clojure, the answer to the above questions is to use one of three tools
(listed in order of their release):

- use [lein]
- use [boot]
- use [Clojure CLI Tool]<a href="#cli-tool-v-dev-tools" aria-describedby="footnote-label" id="cli-tool-v-dev-tools-ref">.</a>

The rest of this post will review the context around `Clojure CLI Tool` and
why it's my preferred tool for working with Clojure

::: note
If you're interested in using the `Clojure CLI Tools` you can visit the
[Official Getting Started Guide] or watch [Installing Clojure on Mac].  Sorry
Linux and Windows, friends.  I will get to those videos in time!
:::

## Clojure CLI Tools

The `Clojure CLI Tools` are a suite of programs which are wrapped in a bash
script called `clojure` or `clj` (I will explain the difference in a moment).
They are built and maintained by Cognitect (the maintainers of the Clojure
language).

To use the `Clojure CLI Tools` you have to [Install the Clojure CLI Tools] and
then you can access them by calling `clojure` or `clj` from your terminal.
Here are _some_ examples of what you can do with the `Clojure CLI Tools`.

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

Now, you will remember that I referred to the `Clojure CLI Tools` as a
"suite of tools".  The reason I chose these words is because under the
hood `clj` is made up of 4 separate tools:

- [clojure] - a bash script (CLI command)
- [deps.edn] - an edn file (Think: package.json)
- [tools.deps.alpha] -  a clojure library
- [tools.build] - a clojure library

The next sections will review each of the above tools in the "suite".

::: note
If it seems odd that we are looking at what may seem like "implementation details"
let's address that now.  The value in understanding this is you will begin to
think about the tools in the way that I imagine the Clojure team thinks about
them.  Through this you will be able to use them more effectively, solve
problems with them as intended and understand where and how to go about asking
questions and solving problems you may run into.  For example, if you were to
go into the [Clojurians Slack] right now you wouldn't find a channel about the `clj`
or `clojure` tool.  Instead, you would visit [#tools-deps] or [#tools-build]
:::


### clj/clojure

When you read the `Clojure CLI Tools` [official getting started] you will notice
that you can use two commands: `clj` or `clojure`.  They seem to do the same
thing, but are used at different times.  When do you use one over
the other?

`clj` is _mainly_ used during development.  `clojure` is _mainly_ used in
a production or CI environment.  The reason for
this is because `clj` is a light wrapper around the `clojure` command.

The `clj` command wraps the `clojure` command in another
tool called [rlwrap]. `rlwrap` improves the developer experience by making it
easier to type in the terminal while you're running your Clojure REPL.

The tradeoff for the convenience provided by `clj` is that `clj` introduces
dependencies. This is a tradeoff because you may not have access to `rlwrap`
in production and tools like `rlwrap` _can_ make it harder to
compose the `clj` command with other tools.  As a result of this, it's a common
practice to use `clojure` in production/ci environments.
<a href="#when-to-use-clojure-script" aria-describedby="footnote-label" id="when-to-use-clojure-script-ref">.</a>

Okay, so they do the same thing, but what is the purpose of `clj/clojure`?

If `clj/clojure` didn't exist you would have to manually do what it does under
the hood which is run a command like this to run Clojure:

```bash
java [java-opt*] -cp classpath clojure.main [init-opt*] [main-opt] [arg*]
```

If you're new to a language the above isn't the greatest "getting started" story.
That's why a tool like `clj/clojure` exists:  To run the above command so you
don't have to.  As a result, it makes it easier to use Clojure across different
environments (Mac, Windows, Linux) and help you configure your
Clojure program.  The alternative would be quite error prone, tedious and require
a lot of upfront knowledge from each developer.

To be honest though, this is exactly what all the other tools provide as well.
Where it starts to become different is in how `clj/clojure` orchestrates the
tools it uses and how it allows you to extend it's functionality.  Let's take a
look at `tools.deps.alpha`.

### tools.deps.alpha

`tools.deps.alpha` is a Clojure libary responsible for managing your dependencies,
or more specifically:

- reads in dependencies from a `deps.edn` file
- resolves the dependencies and their transitive dependencies
- builds a classpath

Note that I said it's a Clojure library.  You don't have to be using `clj/clojure`
in order to use this tool.  You can just use it by itself if you wanted to.

::: note
Note that **NEITHER** `clj` or `tools.deps.alpha` are "building" clojure artifacts.
:::

That is pretty much "all" it does.  The library is small and focused and this
is excellent because it means you can read and understand the entire thing in
an afternoon if you wanted.

If you're interested in learning more I highly recommend listening to the
[Clojure Weekly Podcast] featuring Alex Miller, the author of `tools.deps.alpha`,
speak about the `Clojure CLI Tools`.

Continuing on, in order for `tools.deps.alpha` to know which dependencies you
need you have to write them out.  We do this, and more, in a file called
`deps.edn`.

### deps.edn

`deps.edn` allows you to specify project dependencies and configurations.  At
it's heart, `deps.edn` is just an [edn] file.  You can think of it like
Clojure's version of `json`.

::: note
If you're from the JavaScript community, it can be helpful to think of this file
like a `package.json` file
:::

`deps.edn` is just a [map] which accepts specific keywords.  Here is an example
of _some_ of the common keywords:

```clojure
{:deps    {...}
 :paths   [...]
 :aliases {...}}
```

With this file we describe the dependencies our project needs, where our project
should look to find our source/tests and shortcuts for running our project's code.

Now, given this is just an `edn` file it can be odd to think of it as a separate
"tool".  The reason I believe this is done is because the shape of the `edn` map
is well defined.  Which could be seen as acting like a contract.

What this means is that this file is an extensible tool.  In other words, you
could write your own `tools.deps.alpha` which knows how to consume this file
and be compliant with projects which use the `deps.edn` file.

## Clojure CLI Tools Installer

"Clojure CLI Tools Installer" is a fancy way of referring to the `brew tap`
used to install Clojure on mac and linux machines.  As of February 2020, Clojure
started maintaining their own [brew tap].  Thus, if you installed the
`Clojure CLI Tools` via

```bash
brew install clojure
```

you will likely want to uninstall `clojure` and install the following:

```bash
brew install clojure/tools/clojure
```

In all likelihood, you would probably be fine with `brew install clojure`.
The thing is that while `brew install clojure` will still see some love, it
won't be as consistent as `clojure/tools/clojure` tap.

## clj v lein v boot

Let's end this conversation with a quick contextualization of `clj`, `lein`
and `boot`.

::: note
I won't dive into the history, for this I recommend the blog post [All the Paths]
by Sean Corfield.
:::

The first point is that you will choose between _one_ of the three tools
(`clj`, `lein`, or `boot`) for your project.  You don't use more than one.
Just like you wouldn't use both `boot` and `lein`, you won't use both `clj`
and `boot` or `clj` and `lein`.  Furthermore, none of these tools should
conflict with one another.

::: note
Now, when I said that you don't actually combine more than one of these tools,
this is not 100% true. Take for example the fact that the "build" story for
`clj` is not as "easy" as `lein` which has led to examples of [clj calling to lein]
just for the production builds of ones apps.  As of the latest update though,
I have not found a need to do this for any of my Clojure or ClojureScript apps.
:::

If you're curious which to choose, I think it's obvious that I would suggest
`clj`.  The reason I like `clj` is because the tool is simple _and_ easy to use.
You can read through `clj` and `tools.deps.alpha` in an afternoon and understand
what they are doing if you had to.  The same (subjectively of course) cannot be
said for `lein` or `boot`.

Secondly, and most importantly, the Clojure community is really leaning into
building tools for `clj`.  For example, where `lein` used to have significantly
more functionality, the community has built a ton of [incredible tools] that
will cover many of your essential requirements.  There is also the fact that
`deps.edn` is easier to configure because there are less configuration options
and less need to understand what lein is doing as you want to perform more
advanced configurations.

Finally, when it comes to managing your project configurations and building out
maintainable organizational structures (monorepo) it doesn't get easier than
`clj`<a href="#monorepo-comment" aria-describedby="footnote-label" id="monorepo-comment-ref">.</a>

So yes, `clj` for the win.

::: footnotes

->->-> footnote#cli-tool-v-dev-tools
In earlier versions of this blog post I referred to the `Clojure CLI Tools` as
`Clojure Tools`.  The reason I now refer to them as the "Clojure CLI Tools" is
because on August 21, 2020 it was announced in Clojurians (The official Clojure Slack Org)
that cognitect released a free set of tools called [Cognitect Dev Tools].
Thus, I made the change to be very clear that there is a difference.
->->->

->->-> footnote#clj-calls-clojure-note
You can see this [brew install script]
->->->

->->-> footnote#when-to-use-clojure-script
Of course, production scripts are not the only times you would want to use the
`clojure` command.  Other times include when you are combining it with other tools
e.g. emacs.  In general, if you are finding the `clj` command is causing some
headaches when composing tools, give `clojure` a try.  Thanks, sogaiu for the tip!
->->->

->->-> footnote#monorepo-comment
To clarify the "monorepo" comment: Choosing a sane structure for your monorepo
is important to making this work.  I have a personal project which has 4 or 5
sub-projects and I have not run into any issues as of yet.  I would eventually
love to write about my approach, but until then checkout Sean Corfield's Blog
Post about [Clojure Monorepo using Clojure CLI Tools].
->->->

:::

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
[Official Getting Started Guide]: https://clojure.org/guides/getting_started
[watch this video]: https://www.youtube.com/watch?v=5_q5pLoz9b0
[clj calling to lein]: https://github.com/oakes/full-stack-clj-example
[official tools.build announcement]: https://clojure.org/news/2021/07/09/source-libs-builds
[tools.build]: https://github.com/clojure/tools.build
[Cognitect Dev Tools]: https://cognitect.com/dev-tools/index.html
[brew install script]: https://github.com/clojure/brew-install/blob/1.10.1/src/main/resources/clj#L4
[Clojure Monorepo using Clojure CLI Tools]: https://corfield.org/blog/2021/02/23/deps-edn-monorepo/
