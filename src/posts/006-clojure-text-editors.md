---
author: "Thomas Mattacchione"
createdDate: '30 November 2019'
updatedDate: '09 February 2024'
date: Last Modified
layout: post
tags:
  - post
title: "Clojure Text Editors"
permalink: blog/{{ title | slug }}/index.html
canonical: true
summary: "Focus on learning and writing Clojure!"
---

One of the most common beginner Clojure/Script questions I see is, "which text
editor should I use?". I can relate to this question because it's the same one
I had when I started.  Most of the answers I found led me to using [emacs]. So, I started to
learn Clojure and emacs at the same time.  This was a bad decision becuase it
was simply too many things to learn at once.

What I should have done is stuck with the editor that I knew best and focused on
learning Clojure.

My goal with this post to provide an outline of the popular editors and some
insight into which editor I feel will suit developers at different levels of
experience.

:::note
Text Editors are a source of furious debate amongst programmers.  So, if the
opinions expressed herein enrage, please know that is not my intention.
I love you.  Also note that my recommendations are for both Clojure and
ClojureScript.
:::

## Clojure Text Editors

Let's start by introducing the top Text Editors for Clojure(Script) development based on the [{{ site.posts.resource.clojure_survey.title }}].

1. [Emacs](https://www.gnu.org/software/emacs/)
1. [IntelliJ](https://www.jetbrains.com/idea/)
1. [VS code](https://code.visualstudio.com/)
1. [Vim](https://www.vim.org/)
1. [Sublime](https://www.sublimetext.com/)

For those who've been in the programming game for a little while, the above list
is probably unsurprising.  For those new to programming, the above list can feel
overwhelming.

The best thing to know about the above list: they are all good choices and it's
going to be your personal preferences which determines which one is going to be
the best for your workflow.  Additionally,  You **DO NOT** need to use Emacs or
IntelliJ to learn or become excellent/get the most out of Clojure.

## Which Text Editor to Use

In general, there are two groups of developers:

- **A**. "Experienced" developers (hobbyist/professionals)
- **B**. New developers

If you're **A**, stick with the editor your currently using.  If you're **B**,
try `Sublime` or `VS Code`.

A Text Editor is a developer's primary tool.  We spend most of our work life
inside of them.  Given time, you're going to develop an opinion about what you
like and don't like about your text editor of choice.  For example, I want
to know that I'm productive in whichever Text Editor I'm using so I want to
know that it's fast and that I can customize it when I need to so I can adapt it
to my changing development requirements.  So, I want it to start fast, I want
to be able to quickly and easily setup my editor on other machines, I don't
want to see lag when I'm typing, searching large codebases or opening files. When
I want to customize something with the editor, I want to be in control where
it makes sense.

All of this is to say that these are my preferences that I have built through
years of experimentation and self-analysis.  If you have been developing for a
while, you will have likely gone through a similar process.  But let's go back
to the original question of "which text editor to choose?".

As I said earlier, if you're an experienced developer, go with the editor you know.
If you are a new programmer and don't have deep ties to any particular editor,
choose `Sublime` or `VS Code`.  The reason for this recommendation is because
these editors are easy to use, work on all operating systems, have active and
easy to access communities and support all the modern Clojure tooling one could
ever want.

Im comparison, if you choose an editor like Emacs, Vim, or Intellij you are going
to spend more time learning and configuring the editors than learning Clojure.
You can always try these editors when you feel more accomplished with Clojure
and want to optimize your workflow.  But at least when you get to this point
you will have a frame of reference.

Knowing this, lets move onto how I setup Atom for my development workflow.

## My Text Editor Setup

I use `nvim` as my daily text editor for all development because it's fast,
customizable and I can control how much or little I want `nvim` to do.  The
problem with Vim is that it's not friendly to people new to software
development.  For those interested in my `nvim` setup you can see my [Dotfiles].

## Conclusion

Programming communities always form around text editors. No matter which programming
language you choose there are always going to be a large number of decisions to make.
The important thing to remember is that in the beginning it's often easier if
you focus on learning one thing at a time.   When it comes to programming, learn
the language first and choose tools which allow you to focus on learning your
language of choice.  Learning new things is hard enough, so be good to
yourself in your learning journey and try not to obsess over all the details or
aligning to anyone's perception of the _ideal programmer_.


[Atom Setup Guide Video Series]: https://www.youtube.com/playlist?list=PLaGDS2KB3-AqeOryQptgApJ6M7mfoFXIp.
[Setup Atom for Clojure Development]: https://www.youtube.com/playlist?list=PLaGDS2KB3-AqeOryQptgApJ6M7mfoFXIp
[Checkout this guide]: https://flight-manual.atom.io/using-atom/sections/atom-packages/
[{{ site.posts.resource.clojure_survey.title }}]: {{ site.posts.resource.clojure_survey.url }}
[think]: https://www.youtube.com/watch?v=f84n5oFoZBc
[emacs]: https://www.gnu.org/software/emacs/
[Dotfiles]: https://github.com/athomasoriginal/dotfiles
