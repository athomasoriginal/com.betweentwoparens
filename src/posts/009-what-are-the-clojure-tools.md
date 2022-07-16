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

This post is an overview of the `Clojure Tools`. When I started my Clojure
journey I had questions like:

- How do I **install** Clojure?
- How do I **run** a Clojure program?
- How do I **manage** Clojure packages (dependencies)?
- How do I **configure** a Clojure project?
- How do I **build** Clojure for production?

The short answer to all the above is: use the `Clojure Tools`
<a href="#cli-tool-v-dev-tools" aria-describedby="footnote-label" id="cli-tool-v-dev-tools-ref">.</a>

:::note
Please note there are other popular solutions like [lein] and [boot]. So why do
I just skip over those? Don't worry, we'll chat about that later in
this post.
:::

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

The `Clojure CLI` is a CLI program. Here is what it looks like to use the
`Clojure CLI` and some of the things it can do:

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

Like all `Clojure` programs, the `Clojure CLI` is built on a few libraries:

- [clj/clojure] - a bash script
- [tools.deps.alpha] a clojure library (commonly referred to as `deps`)
- [deps.edn] - an [edn] file with a specific structure

The next few sections will review each one in turn.

### clj/clojure

As we see above, the `Clojure CLI` is invoked by calling one of the two
shell commands:

- `clj`
- `clojure`

When you read through the [Official Deps and CLI Guide] you will see that you
can use either `clj` or `clojure`.  What's the difference between these two
commands?  Functionally nothing.  They both do the exact same thing. The
difference is that `clj` wraps the `clojure` command with a tool called
[rlwrap]. `rlwrap` improves the developer experience by making it
easier to type in the terminal while you're running your Clojure REPL.

`rlwrap` is great if you're a human typing in the terminal, but if your a
program running `clj` you're not gonna have a good time.  This is because
`rlwrap` _can_ make it harder to compose the `clj` command with other tools
depending on the tools you  use.  As a result, it's a common practice to use `clojure` in production/ci environments
<a href="#when-to-use-clojure-script" aria-describedby="footnote-label" id="when-to-use-clojure-script-ref">.</a>
Additionally, not all environments have access to `rlwrap` so it's another
dependency you have to install.

Okay, so they do the same thing.  What do they do?  `clj/clojure` has one job:
run Clojure programs against a classpath.  If you dig into the `clj/clojure`
bash script you see that it ultimatley calls a command like this:

```bash
java [java-opt*] -cp classpath clojure.main [init-opt*] [main-opt] [arg*]
```

Thus, `Clojure CLI` bash script is a convenience making it easier to run
Clojure programs.  You don't have to type out a gnarly `Java` command and make
it work on different environments (windows, linux, mac etc).  However, it
orchestrates the building of the classpath by calling out to `tools.deps.alpha`.

### tools.deps.alpha

`tools.deps.alpha` is a Clojure libary responsible for managing your dependencies.
It does the following things:

- reads in dependencies from a `deps.edn` file
- resolves the dependencies and their transitive dependencies
- builds a classpath

What's interesting about this program is that it's just a Clojure library.
This means that you can use it outside of the `Clojure CLI`.

::: note
It's a good time to note that **NEITHER** `clj/clojure` or `tools.deps.alpha` are
"building" Clojure artifacts.  More on this later.
:::

The other thing that makes `tools.deps.alpha` great is that it's a small and
focused library.  Why this is great is that if something goes wrong it's easy
to read and learn the library in a short period of time.

Now, if you're of the
opinion that you shouldn't have to know implementation details of the tools you
use, well, welcome to professional software development.  It doesn't matter what
language or tool you use, you will run across outdated docs, bugs or undefined
behaviour.  You could choose to wait for someone to save you, or solve the
problem yourself.  This is where small, well designed and focused libraries
win out over battery included solutions.  To learn more about the history,
development and goals of the tool from the Clojure team I recommend listening
to this episode of [Clojure Weekly Podcast] which features Alex Miller,
the author of `tools.deps.alpha`.

Tangents aside, in order for the classpath to be built we need to tell
`tools.deps.alpha` what we need on the classpath.  This is the job of `deps.edn`.

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

The best way that I can _currently_ explain the `-T` switch is by saying that
it's meant to be another level of convenience provided by the `Clojure CLI`.

Regarding usage, it helps to first breakdown the main types of Clojure
programs one might build into 3 sub categories:

- A `tool`
- A `library`
- An `app`

You would use `-T` for Clojure programs that you want to run as a "tool".  For
example, [deps-new] is a Clojure library which creates new Clojure projects
based on a template you provide.  This is a great example of a Clojure project
which is built to be a "tool".

I don't want to go into more detail about `-T` now because that means we would
have to dive into other `Clojure CLI` switches like `-X` and `-M`.  That's for
another post. On to the Installer!

## Installer

The "Clojure CLI Installer" is a fancy way of referring to the `brew tap` used
to install Clojure on mac and linux machines. As of February 2020, Clojure
started maintaining their own [brew tap].  Thus, if you installed the
`Clojure CLI` via

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

This section will provide a quick comparison of `clj`, `lein` and `boot`.

::: note
I won't dive into the history, for this I recommend the blog post [All the Paths]
by Sean Corfield.
:::

Firstly, all of the above tools are more or less addressing the same problems
in their own way.  Your job is to choose the one you like best.

::: note
Understanding that you have to choose one should be a relief, but note that some
people have experimented
with combining these tools.  Specifically, combining `Clojure CLI` and `lein`.
Here is an example of [clj calling to lein].  This was desireable years ago
because the `Clojure CLI` didn't cover building CLJ artifacts.  Having
said this, there isn't a need to do this anymore because you have libraries like
[depstar] which handle the "build" story.  In addition, you have `tools.build`
which is Clojure's official answer to the build question.
:::

If you're curious which to choose, my answer is the `Clojure CLI`.
The reason I like the `Clojure CLI` is because the tool is simple.
You can read through `clj` and `tools.deps.alpha` in an afternoon and understand
what they are doing if you had to.  The same (subjectively of course) cannot be
said for `lein` or `boot`.  This is not just implementation, but also usage.
Yes, `lein` seems easier to start, but the moment you break away from the
beginner examples you are left deeps in the woods without a compass.

Secondly, the `Clojure Tools` promote libraries over frameworks.  This is
important when working with a language like Clojure because it really does
reward you for breaking down your thinking.

Finally, the Clojure community is really leaning into
building tools for `Clojure CLI`.  For example, where `lein` used to have significantly
more functionality, the community has built a ton of [incredible tools] that
will cover many of your essential requirements.

So yes, `Clojure Tools` for the win.

::: footnotes

->->-> footnote#cli-tool-v-dev-tools
In earlier versions of this blog post I referred to the `Clojure CLI` as
`Clojure Tools`.  The reason I now refer to them as the "Clojure CLI" is
because on August 21, 2020 it was announced in Clojurians (The official Clojure Slack Org)
that cognitect released a free set of tools called [Cognitect Dev Tools].
Thus, I made the change to be very clear that there is a difference.
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
[Clojure CLI]: https://clojure.org/guides/deps_and_cli
[clj/clojure]: https://github.com/clojure/brew-install
[rlwrap]: https://linux.die.net/man/1/rlwraps
[readline]: https://en.wikipedia.org/wiki/GNU_Readline
[deps.edn]: https://www.clojure.org/guides/deps_and_cli
[tools.deps.alpha]: https://github.com/clojure/tools.deps.alpha
[tools.build]: https://github.com/clojure/tools.build
[edn]: https://github.com/edn-format/edn
[map]: https://clojure.org/reference/data_structures#Maps
[Clojure Weekly Podcast]: https://soundcloud.com/user-959992602
[deps-new]: https://github.com/seancorfield/deps-new
[brew tap]: https://clojure.org/news/2020/02/28/clojure-tap
[All The Paths]: https://corfield.org/blog/2018/04/18/all-the-paths/
[incredible tools]: https://github.com/clojure/tools.deps.alpha/wiki/Tools
[#tools-deps]: https://clojurians.slack.com/archives/C6QH853H8
[#tools-build]: https://clojurians.slack.com/archives/C02B5GHQWP4
[Clojurians Slack]: https://clojurians.slack.com/?redir=%2Fmessages%2F
[Official Getting Started Guide]: https://clojure.org/guides/getting_started
[Installing Clojure on Mac]: https://www.youtube.com/watch?v=5_q5pLoz9b0
[clj calling to lein]: https://github.com/oakes/full-stack-clj-example
[Cognitect Dev Tools]: https://cognitect.com/dev-tools/index.html
[brew install script]: https://github.com/clojure/brew-install/blob/1.10.1/src/main/resources/clj#L4
[Clojure Monorepo using Clojure CLI Tools]: https://corfield.org/blog/2021/02/23/deps-edn-monorepo/
[depstar]: https://github.com/seancorfield/depstar
[Official Deps and CLI Guide]: https://clojure.org/guides/deps_and_cli
[tools.build release announcement]: https://clojurians-log.clojureverse.org/tools-deps/2021-07-09
[tools.build official announcement]: https://clojure.org/news/2021/07/09/source-libs-builds
