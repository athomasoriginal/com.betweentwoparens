---
author: "Thomas Mattacchione"
createdDate: '30 November 2019'
date: Last Modified
layout: post
tags:
  - post
title: "Clojure Text Editors"
permalink: blog/{{ title | slug }}/index.html
canonical: true
summary: "Focus on learning and writing Clojure!"
---

::: note
Interested in jumping right to my editor setup? <a class="blog-content__link" href="#my-text-editor-setup">click here</a> or you can checkout my free [Atom Setup Guide Video Series].
:::

A question I and many people have when starting with Clojure is, "which text editor should I use?".

In my case, I have this thing with starting things "right".  I heard that Clojurists did things different and I wanted to [think](https://www.youtube.com/watch?v=f84n5oFoZBc) as a Clojurist and use the same tools as them. A little research showed me that this meant using [emacs](https://www.gnu.org/software/emacs/) because all my conversations up until this point with other Clojurists led me to the opinion that `emacs` was _the_ "Clojure Editor".

::: note
Take note of the line `conversations up until this point with other Clojurists`.  While "use emacs" is how I interpreted what they were saying, and some even used those words, it was not actually what they were saying.  By the end of this post I will hopefully transcribe the real message as I now understand it.
:::

Turns out that choosing emacs was not a great choice for me.  I should have stuck with the editor I knew best so that I could focus on being new at one thing at a time.  This article will outline some of my learnings when I was just starting with Clojure.

I will work to help new Clojurists by outlining the landscape of "Clojure Editors" which will hopefully help to inform your early journey into Clojure land. My hope is that by documenting my learnings and providing a few words of encouragement we can save some future Clojure developer some time.

<aside class="blog-content__note">Text Editors are a source of furious debate among programmers.  So if the opinions expressed herein enrage, please know that is not my intention.  I love you.  For those who just want to see how I setup my Text Editor for Clojure development, jump to the <a href="#my-text-editor-setup">third section</a> of this post.  Also note that my recommendations are for both Clojure and ClojureScript.</aside>

## Clojure Text Editors

Let's start by introducing the top Text Editors for Clojure(Script) development based on the [{{ site.posts.resource.clojure_survey.title }}].

1. [Emacs](https://www.gnu.org/software/emacs/)
1. [IntelliJ](https://www.jetbrains.com/idea/)
1. [VS code](https://code.visualstudio.com/)
1. [Vim](https://www.vim.org/)
1. [Sublime](https://www.sublimetext.com/)

For professional and hobby developers, the above list contains the editors you might expect to see.  The issue is that for newcomers and developers without a strong idea of language specific tooling the above list can feel prohibitive.

One reason for this feeling is that since the majority of the Clojure developers are using the first 3, those must be the ones to use in order to be productive with Clojure.

If you feel this way and don't read any further please take this with you:  You **DO NOT** need to use Emacs or IntelliJ to learn or become excellent at Clojure.

This leads to the next part:  which editor should you use?

## Which Text Editor to Use

To figure out which editor to use for Clojure development try to answer the following question.  Are you:

- **A**. Experience developer (serious hobbyist or professional)
- **B**. New(ish) to programming

If you chose **A.** stick with the editor your currently using.  If you chose **B.** try `Atom` or `VS Code`.  Continue reading to find out why!

A Text Editor is one of a developer's primary tools because we spend most of our work life inside of it.  Given the time we spend in our Text Editor there is something to be said for the satisfaction we derive from using it and its impact on our productivity.

Over time, this satisfaction grows and we begin to associate the qualities of the developer with the editor itself.  It becomes a [zero sum game](https://www.merriam-webster.com/dictionary/zero-sum%20game).

There are some problems with this mentality and it begins with the fact that tools are tools.  They either facilitate productivity, or they don't.  Further, the productivity one human gains from a tool, the satisfaction as we called it earlier, is likely going to be different from the next person.  You do you.

Knowing this, here's how I define productivity: low `startup cost` + the `utility` of the editor itself.  Here's what I mean by this:

`Startup cost` is about whether or not I can use the editor regardless of my operating system and how much configuration I need to get it going on a new development environment.

`Utlity` is performance and customizability of the Editor.  For performance, what I mean is that when I do things like search, open large files or use plugins that are supposed to make me more productive, but I have to literally stop what I am doing and wait for the editor sort itself out, this is no bueno.

Then there is customization.  This is a worthwhile optimization which, to me, means I can add features to the editor to improve my workflow.  It also helps when I can do this with languages and tool chains I already know.

All of this is to say that these are my preferences that I have built through years of experimentation.  If you have been developing for a while, you will have likely gone through a similar process.  But let's go back to the original question of "which text editor to choose?".

As I said earlier, if you're an experienced developer, go with the editor you know.  If you are a new programmer and don't have deep ties to any particular editor, choose `Atom` or `VS Code`.  The reason for this recommendation is because these editors are easy to use, work on all operating systems, have active and easy to access communities and support all the modern Clojure tooling one could ever want.

Im comparison, if you choose an editor like Emacs, Vim, or Intellij you are going to spend more time learning and configuring the editors than learning Clojure.  You can always try these editors when you feel more accomplished with Clojure and want to optimize your workflow.  But at least when you get to this point you will have a frame of reference.

Knowing this, lets move onto how I setup Atom for my development workflow.

## My Text Editor Setup

I use `nvim` as my daily text editor for all development because it's fast,
customizable and I can control how much or little I want `nvim` to do.  The
problem with Vim is that it's not friendly to people new to software
development.  For those interested in my `nvim` setup you can see my [Dotfiles].

## Conclusion

Remember that no matter what language you choose, there are going to be a ton of micro decisions to make.  The important thing in the beginning is to focus on the language and the learning process and not stress over the tooling.  Be good to yourself in your learning journey and try not to obsess over all the details or aligning to the _ideal programmer_ stereotype.


[Atom Setup Guide Video Series]: https://www.youtube.com/playlist?list=PLaGDS2KB3-AqeOryQptgApJ6M7mfoFXIp.
[Setup Atom for Clojure Development]: https://www.youtube.com/playlist?list=PLaGDS2KB3-AqeOryQptgApJ6M7mfoFXIp
[Checkout this guide]: https://flight-manual.atom.io/using-atom/sections/atom-packages/
[{{ site.posts.resource.clojure_survey.title }}]: {{ site.posts.resource.clojure_survey.url }}
[think]: https://www.youtube.com/watch?v=f84n5oFoZBc
[emacs]: https://www.gnu.org/software/emacs/
[Dotfiles]: https://github.com/athomasoriginal/dotfiles
