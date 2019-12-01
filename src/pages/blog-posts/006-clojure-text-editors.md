---
title: 'Clojure Text Editors'
date: '2019-11-30'
slug: clojure-text-editors
summary: Focus on learning and writing Clojure!
author: 'Thomas Mattacchione'
keywords: ['clojurescript tutorial', 'atom github clojurescript', 'atom clojure']
---

I'd been a professional software developer for a number of years before I came to Clojure.  So, it's fair to say that by the time I went all-in on Clojure I had, thankfully, seen some things and started to form opinions around what I felt was the "best" way to practice software development.

One of the tenets of my model?  I should always be capable of growth.  To me, this means accepting the opportunity to revisit and refine my _opinions_ and _beliefs_.  One great way to do this as a programmer is to be "new" at something again.  For example, learn a **different** programming language.  Clojure was that language.  I chose it because it would expose me to new ideas like [functional programming](https://www.geeksforgeeks.org/functional-programming-paradigm/), [lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) etc.

With the language chosen, I just needed to start coding Clojure.  At the time, my mindset was total assimilation: I would [think](https://www.youtube.com/watch?v=f84n5oFoZBc) as they do and use the same tools as them. This meant [emacs](https://www.gnu.org/software/emacs/) because all my research and conversations up until this point with other Clojurists led me to the opinion that `emacs` was _the_ tool for a Clojure developer.

<aside class="blog-post__note">Take note of the line <code class="gatsby-code-text">conversations up until this point with other Clojurists</code>.  While "use emacs" is how I interpreted what they were saying, and some even used those very words, it was not actually what they were saying.  By the end of this post I will hopefully transcribe the real message as I now understand it.</aside>

Turns out that for me, choosing [emacs](https://www.gnu.org/software/emacs/) was not a great choice (more on that later) and I should have stuck with the editor I knew best.  This would have allowed me to spend more time focusing on Clojure.

This is how it goes though.  These are the lessons.  It's with this in mind that I will hopefully help the next person interested in Clojure, aspiring or experienced, by walking through some of the Text Editors of Clojure.

The rest of this article will be [bikeshed](https://www.urbandictionary.com/define.php?term=bikeshed) city. The hope? By documenting the thoughts and providing a few words of encouragement we can save some future Clojure developer some time.  With that, this post will cover the following topics:

- [Clojure Text Editors](#clojure-text-editors)
- [Which Text Editor to Use](#which-text-editor-to-use)
- [My Text Editor Setup](#my-text-editor-setup)

<aside class="blog-post__note">Text Editors are a source of furious debate among programmers.  So if the opinions expressed herein enrage, please know that is not my intention.  I love you.  For those who just want to see how I setup my Text Editor for Clojure development, jump to the <a href="#my-text-editor-setup">third section</a> of this post.  Also note that my recommendations are for both Clojure and ClojureScript.</aside>

## Clojure Text Editors

Let's start by introducing the top Text Editors for Clojure(Script) development by usage<a href="#popular-editors" aria-describedby="footnote-label" id="popular-editors-ref">:</a>

1. [Emacs](https://www.gnu.org/software/emacs/)
2. [IntelliJ](https://www.jetbrains.com/idea/)
3. [Vim](https://www.vim.org/)
4. [VS code](https://code.visualstudio.com/)
5. [Atom](https://atom.io/)
6. [Sublime](https://www.sublimetext.com/)
7. [Eclipse](https://www.eclipse.org/downloads/)
8. [Light Table](http://lighttable.com/)

There is nothing special about the above list.  Yet, where it starts to feel prohibitive is the idea that you have to use one of the first 3 Text Editors in order to be productive in Clojure.  So, if you read no further, take this with you:  you **don't** need to use Emacs, IntelliJ or Vim to learn or be good at Clojure.

This leads to the next part:  which editor should you use?  To answer that, try to answer the following questions:

1. Are you an experienced developer through hobby or profession?
1. Are you new to the programming game?

If your answered yes to the **first** question, the choice is simple:  Stick with the editor you're comfortable with!

If you answered yes to the **second** question, my recommendation is to choose `Atom` or `VS Code`.  Read on to find out why!

## Which Text Editor to Use

A Text Editor is one of a developer's primary tools because we spend most of our work life inside of it.  Given the time we work with our Text Editors, there is something to be said for the satisfaction we derive from using it.

Over time, this satisfaction grows and we begin to associate the qualities of the developer with the editor itself.  It becomes a [zero sum game](https://www.merriam-webster.com/dictionary/zero-sum%20game).

There are some obvious problems with this mentality and it begins with the fact that tools are tools.  They either help us be productive, or they don't.  Further, the productivity one human gains from a tool, the satisfaction as we called it earlier, is likely going to be different from the next person.  You do you.

Knowing this, let's put the cards on the table and review the qualities that allow me to feel satisfied with the Text Editor I choose.  I alluded to this earlier, but for me it's mainly how productive I can be in my tool of choice.  How I define productivity is by the `startup cost` and `utility` of the editor itself.  What do each of these mean to me?

`Startup cost` is about whether or not I can use the editor regardless of my operating system and how much configuration I need to get it going on a new development environment.

`Utlity` is performance and customizability of the Editor.  For performance, I mean that when I do things like search, open large files or use plugins the editor does not eat all of my system resources and grind to a halt.  This would be intrusive to my workflow.  When it comes to customization, I like it when I can configure my editor easily with languages and tool chains I already know.

As you may have gathered, my definition of satisfaction has led me to prefer a spartan editor environment.  Yet, this is not always how I felt.  I only realized this was how I liked to work when I saw truly productive developers operate in environments devoid of frills.

All of this is to say that this is my preference.  This preference is one I have built through years of experimentation and questioning my workflow.  If you have been developing for a while, you will also go through this learning process.  This is a beautiful part of the journey because it really is about you, your likes and dislikes and how far you want to go.

And now we're back to the original question about which editor you should use.  I said earlier that if you're experience, go with the editor you already know.  If you are a new programmer and don't have deep roots with any particular editor, choose `Atom` or `VS Code`.

My rationale?  All of these editors are easy to use, work on all operating systems, have active and easy to access communities and support all the modern Clojure tooling one could ever want.  But there is also a more significant reason.  I have learned that when learning something you should focus on learning that one thing.

Choosing editors like Emacs, Vim, or Intellij mean you are going to spend more time learning and configuring the editors than programming.  It's going to get in the way of the learning journey.  So do yourself a favour and focus on learning Clojure.  You can always try the other editors when you develop some sensibilities around the workflow you want to pursue.  But that is more of an optimization strategy than a tactic which will enable you to improve the learning process.

Knowing this, lets move onto how I setup Atom for my development workflow.

## My Text Editor Setup

The beauty of editors like `Atom` or `VS Code` is you get most everything you need out-of-the-box.  Here are the plugins I use:

- [Chlorine](https://atom.io/packages/chlorine)

  Integrate your Clojure REPL into your editor.

- [Ink](https://atom.io/packages/ink)

  Chlorine depends on this.

- [Parinfer](https://atom.io/packages/parinfer)

  Automatically balance your parens

- [Chlorine Keybinding Setup](https://github.com/tkjone/dotfiles/blob/master/atom/keymap.cson#L34)

  Learn the hotkeys to quickly connect to a Clojure repl and evaluate Clojure expressions

That's everything that I use.

## Conclusion

In the end, I hope I have helped to illuminate the options available for Clojure Text Editors.  The big take away is to be good to yourself in your early learning journey and choose a tool that does not get in your way and just lets you focus on learning Clojure.


<aside>
  <h3>Footnotes</h3>
  <ol>
    <li id="popular-editors">
      This list is based on the <a class="blog-post__link" href="https://www.surveymonkey.com/results/SM-S9JVNXNQV/" target="_blank" rel="noopener noreferrer">2019 State of Clojure Survey</a> conducted earlier this year.
      <a href="#popular-editors-ref" aria-label="Back to content">↩</a>
    </li>
  </ol>
</aside>
