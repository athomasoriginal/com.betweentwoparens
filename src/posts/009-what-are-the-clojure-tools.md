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

This post is about "getting" the `Clojure Tools`.  The reason?  They stumped me
in the beginning and I felt like if I can make someone's journey just a _bit_
easier that might be a good thing.

My Clojure learning journey started by asking questions like:

- How do I **install** Clojure?
- How do I **run** a Clojure program?
- How do I **manage** Clojure packages (dependencies)?
- How do I **configure** a Clojure project?
- How do I **build** Clojure for production?

Now, when I started working with Clojure the answer to these questions was:
choose either [lein] or [boot].  Then Rich Hickey and his ride or die homeboys
rolled by and provided their own answer: The `Clojure Tools`
<a href="#cli-tool-v-dev-tools" aria-describedby="footnote-label" id="cli-tool-v-dev-tools-ref">.</a>

Their vision, like the vision of Clojure itself, is a bit offbeat.  So, this post
is about reviewing the `Clojure Tools` and figuring out a mental model for them.

At a high level, the `Clojure Tools` currently consist of:

- `Clojure CLI`
- `tools.build`

The first is a CLI tool and the second is a Clojure library which provides
some helper functions to make it easier to build Clojure artifacts.  The rest of
this post will dig into each of these tools.

::: note
Want to install the `Clojure CLI`? Visit the [Official Getting Started Guide] or
watch [Installing Clojure on Mac].  Sorry Linux and Windows, friends.  I will
get to those videos in time!
:::

## Clojure CLI

The `Clojure CLI` is made up of the following subprograms:

- [clj/clojure] - a bash script
- [tools.deps.alpha] a clojure library (commonly referred to as `deps`)
- [deps.edn] - an [edn] file with a specific structure

And here is what it looks like to use the `Clojure CLI` and some of the things
it can do:

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

The above is just the tip of the `CLojure CLI` iceburg.  I have omitted more
interesting examples so we can focus on the `Clojure CLI` at a higher level. In
honor of said "high level" overview, the following sections will cover each
of the`Clojure CLI's` subprograms.


### clj/clojure

As we see above, the `Clojure CLI` is invoked by calling one of the two
shell commands:

- `clj`
- `clojure`

When you read through the [Official Deps and CLI Guide] you will see that you
can use either `clj` or `clojure`.  `clj` is the recommended version, but
both are used.  Furthermore, when you start to look at open source code, you
will see that both are used.

What's the difference between these two commands? `clj` is _mainly_ used during
development.  `clojure` is _mainly_ used in
a production or CI environment.  The reason for
this is because `clj` is a light wrapper around the `clojure` command.

The `clj` command wraps the `clojure` command in another
tool called [rlwrap]. `rlwrap` improves the developer experience by making it
easier to type in the terminal while you're running your Clojure REPL.

The tradeoff for the convenience provided by `clj` is that `clj` introduces
dependencies. This is a tradeoff because you may not have access to `rlwrap`
in production. In addition, a tool like `rlwrap` _can_ make it harder to
compose the `clj` command with other tools.  As a result, it's a common
practice to use `clojure` in production/ci environments
<a href="#when-to-use-clojure-script" aria-describedby="footnote-label" id="when-to-use-clojure-script-ref">.</a>

Now that we see they both more or less the same command, what do they do?
`clj/clojure` has one job:  run Clojure programs against a classpath.  If you
dig into the `clj/clojure` bash script you see that it ultimatley calls a
command like this:

```bash
java [java-opt*] -cp classpath clojure.main [init-opt*] [main-opt] [arg*]
```

The above might look like a simple command, but the value of having
`clj/clojure` is that you as a new Clojure developer don't have to manually
build the classpath, figure out the exact right Java command to run or
work to make this execute on different environments (windows, linux, mac etc).

In summary, `clj/clojure` is about running Clojure programs in a classpath and
orchestrates other tools.  For example, in order to run against a classpath, there
has to be a classpath.  `clj/clojure` is not responsible for figuring out the
`classpath` though.  That's a job for `tools.deps.alpha`

### tools.deps.alpha

`tools.deps.alpha` is a Clojure libary responsible for managing your dependencies.
What it does is:

- reads in dependencies from a `deps.edn` file
- resolves the dependencies and their transitive dependencies
- builds a classpath

Note that I said it's a Clojure library.  You don't have to be using the
`Clojure CLI` in order to use this tool.  You can just use it by itself if you
wanted to.

::: note
It's a good time to note that **NEITHER** `clj/clojure` or `tools.deps.alpha` are
"building" Clojure artifacts.  More on this later.
:::

What makes `tools.deps.alpha` so great is that it's a small and focused library.
There isn't much more to say about this other than if you want to learn more
about the history, development and goals of the tool from the Clojure team
I recommend listening to this episode of [Clojure Weekly Podcast]
which features Alex Miller, the author of `tools.deps.alpha`.

As noted above, the first thing `tools.deps.alpha` is going to do is read in
your project configuration and deps.  This information is stored in `deps.edn`.

### deps.edn

The `deps.edn` file is a Clojure map with a specific structure.  Thus, when
you run `clj/clojure` one of the first things it does is find a `deps.edn` file
and reads it in.

`deps.edn` is where you configure your project and specify project dependencies.
At it's heart, `deps.edn` is just an [edn] file.  You can think of it like
Clojure's version of `package.json`.

Here is an example of what a `deps.edn` file looks like:

```clojure
{:deps    {...}
 :paths   [...]
 :aliases {...}}
```

As you can see, we use the keywords `:deps`, `:paths` and `:aliases` and more
to start to describe your project and the dependencies it requires.


## Tools.Build

This is the newest Clojure Tool.  It's been in the works for a while and might
be the simplest to understand conceptually:  It's a Clojure library with
functions that do things like build a `jar`, `uberjar` etc.

One distinction that's important to note is that `tools.build` is not the same
as the `Clojure CLI` tool's `-T` switch.  I am calling this out now because
when `tools.build` was released the `Clojure CLI` was also enhanced to provide
the `-T` switch.  As one can imagine, this could be seen as confusing because
of the similarity of their names.

### Installer

Honestly, i'm not even sure that this is part of the `Clojure CLI Tools` suite,
but let's include it anyways.  The "Clojure CLI Tools Installer" is a fancy way
of referring to the `brew tap` used to install Clojure on mac and linux machines.
As of February 2020, Clojure started maintaining their own [brew tap].  Thus, if
you installed the `Clojure CLI Tools` via

```bash
brew install clojure
```

you will likely want to uninstall `clojure` and install the following:

```bash
brew install clojure/tools/clojure
```

In all likelihood, you would probably be fine with `brew install clojure` as it
will recieve updates.  However, while `brew install clojure` will still see some
love, it won't be as active as the `clojure/tools/clojure` tap.

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
