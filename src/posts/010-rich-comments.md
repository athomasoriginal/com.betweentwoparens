---
author: "Thomas Mattacchione"
createdDate: '02 July 2020'
date: Last Modified
layout: post
tags:
  - post
title: "Rich Comment Blocks"
permalink: blog//{{ title | slug }}/index.html
canonical: true
summary: "Your coding life doesn't have to be a Rogue Like."
---

The three main types of comments in Clojure are

- [comment]
- [discard comment]
- [comment macro] (`Rich Comment`)

The last one, the `Rich Comment`, is a pretty cool feature of Clojure.

## Comment

The first type of comment is a literal [comment]

```clojure
; I'm a comment
```

Anything that follows the `;` is ignored by Clojure until the end of the line.  A common use for the `comment` is to help future humans understand our code better<a href="#comments" aria-describedby="footnote-label" id="comments-ref">.</a>

## Discard Comment

The second type of comment is a [discard comment]

```clojure
(-> 5 inc inc inc)     ; 8

(-> 5 inc #_ inc inc)  ; 7
```

In the above code, the `#_` makes it as if the second `inc` doesn't exist<a href="#wonderful-life" aria-describedby="footnote-label" id="wonderful-life-ref">.</a>  This is great for debugging because the `discard` comment doesn't return a value.  In addition to this, there are two additional usage notes about the `discard comment`.

The first is that they nest:

```clojure
(-> 5 #_ inc #_ inc inc) ; you could discard each form in turn
(-> 5 #_ #_ inc inc inc) ; or you could stack them
```

Here are some examples of where you might find the `discard comment` useful:

```clojure
(or #_ (int? 2) (nil? "Thomas"))

(let [my-number 5
      #_ #_ another-number 13]
  ;...
  )

{#_ #_ :name "Between Two Parens" :host "Thomas"}
```

The second take away is that you don't have to add spaces after the `discard comment`:

```clojure
;; these all produce the same result
(-> 5 #_ inc #_ inc inc) ; space
(-> 5 #_inc #_inc inc)   ; no space

(-> 5 #_ #_ inc inc inc) ; space
(-> 5 #_#_inc inc inc)   ; no space
```

::: note
You may have noticed that I used `;;` and `;` in the above code block.  This is a common idiom when writing Clojure and is often used to denote a hierarchy.  You can find more information about this convention in [bbatsov's community clojure style guide]
:::

The difference between adding the space or removing the space is which one _you_ find more readable<a href="#discard-comment-credit" aria-describedby="footnote-label" id="discard-comment-credit-ref">.</a>

## Rich Comment

Finally, we have the `comment macro` which is more affectionatley known as a `Rich Comment Block`:

```clojure
(comment
  ; everything in here is ignored...returns nil
  )
```

The first time I heard of a `Rich Comment` was in Stuart Halloway's excellent talk [Running With Scissors] where he notes:

::: note
"These comments are rich because they provide rich detail about the development process and because they were written by a person named Rich."
:::

Yet, even after watching `Running With Scissors` the use of the `Rich Comment` hadn't started to click yet.  Two more things would need to happen:  The first, I would witness REPL Driven Development used in person by [David Nolen].  The second, I would start to use REPL Driven Development in my own workflow.  When I did these things, I was able to better see the benefits of the `comment macro` as

- documentation
- a save point
- code setup
- improved code exploration
- preservation of syntax highlighting

With that, let's review a few examples of the `Rich Comment` from real life Clojure codebases<a href="#example-comments" aria-describedby="footnote-label" id="example-comments-ref">.</a>

The first example illusrates the `documentation` and `save point` ideas.

```clojure
(comment

(println (sh "ls" "-l"))
(println (sh "ls" "-l" "/no-such-thing"))
(println (sh "sed" "s/[aeiou]/oo/g" :in "hello there\n"))
(println (sh "sed" "s/[aeiou]/oo/g" :in (java.io.StringReader. "hello there\n")))
; ...
)
```

The above comes from the [clojure codebase] itself and is a code example of how to use [sh].  For me, the value is that we have an example of how to use `sh` (`documentation`) and we have some code ready for us to run through our REPL (`a save point`). This idea of having a `save point` becomes more powerful in the next example:

```clojure
(comment
  (do
   (require '[my.app.db :as app.db])
   (require '[my.app.cart :as cart])
   (def db (app.db/connection!)))

  (cart/add db {:item-name "iPhone"})
  ; ...more stuffs
  )
```

The above builds on the idea of having a `save point` and layers on some `code setup` helpers.  What the above does is add in a few lines of code which, when run, will provide us with a `db connection`. Through this, I can quickly begin interacting with my app's database code and building out features.

Of course, there are other types of setup code that you may want.  For example, you might be working on a pure function which is just going to transform some data.  In this case, we might setup a `comment` like this:

```clojure
(comment
(refer 'set)
(def xs #{{:a 11 :b 1 :c 1 :d 4}
         {:a 2 :b 12 :c 2 :d 6}
         {:a 3 :b 3 :c 3 :d 8 :f 42}})

(def ys #{{:a 11 :b 11 :c 11 :e 5}
         {:a 12 :b 11 :c 12 :e 3}
         {:a 3 :b 3 :c 3 :e 7 }})

(join xs ys)
; ...
)
```

The above is the [example Stuart provided] in his talk which provides us with some sample data allowing us to immediately begin using our functions to transform said data.

## Conclusion

These are just a few examples of how to use a `Rich Comment Block`.  The most interesting part of the `Rich Comment Block` for me is that it's a tangible example of the pragmatism of Clojure.  In this case, the `comment macro` provides an additional mechanism for speeding up my workflow and making our code more maintainable overall because of the improved documentation and context we get from these comments.

<aside>
  <h3>Footnotes</h3>
  <ol>
    <li id="comments">
      Of course, there are arguments on both sides about how much to use comments.  As I see it, don't shy away from them in the pursuit of "self documenting code" and also don't lean on them too heavily.
      <a href="#comments-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="wonderful-life">
      #itsAWonderfulLife
      <a href="#wonderful-life-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="discard-comment-credit">
      Much love to <a class="blog-content__link" href="https://twitter.com/seancorfield" target="_blank" rel="noopener noreferrer">Sean Corfield</a> for pointing out nesting and the spacing points for the discard comment.  Very cool!
      <a href="#discard-comment-credit-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="example-comments">
      Each example I provided in this post are really just my interpretations of how they may be used.  The author may have had a different intent.
      <a href="#example-comments-ref" aria-label="Back to content">Back</a>
    </li>
  </ol>
</aside>

[REPL]: https://clojure.org/guides/repl/introduction
[immutable data structures]: https://clojure.org/about/functional_programming#_immutable_data_structures
[comment]: https://clojure.org/guides/weird_characters#_comment
[discard comment]: https://clojure.org/guides/weird_characters#_discard
[Running With Scissors]: https://youtu.be/Qx0-pViyIDU?t=1229
[comment macro]: https://clojuredocs.org/clojure.core/comment
[clojure codebase]: https://github.com/clojure/clojure/blob/4ef4b1ed7a2e8bb0aaaacfb0942729252c2c3091/src/clj/clojure/java/shell.clj
[David Nolen]: https://github.com/sponsors/swannodette
[example Stuart provided]: https://github.com/clojure/clojure/blob/4ef4b1ed7a2e8bb0aaaacfb0942729252c2c3091/src/clj/clojure/set.clj#L158
[sh]: https://clojuredocs.org/clojure.java.shell/sh



[Good, Bad and Ugly Code]: freecodecamp.org/news/code-comments-the-good-the-bad-and-the-ugly-be9cc65fbf83/
[Right Kind of Comment]: https://purelyfunctional.tv/issues/purelyfunctional-tv-newsletter-352-tip-use-the-right-kind-of-comment-for-the-job/
[JS Community Member]: https://twitter.com/getify/status/1142428718670811136
[How to do REPL driven development]: https://clojureverse.org/t/details-on-how-to-do-repl-driven-development-from-the-editor-emacs-with-cider/4960
[Did you know about comments]: https://kotka.de/blog/2010/06/Did_you_know_V.html
[Video Mentioning Rich Comment Blocks]: https://www.youtube.com/watch?v=Qx0-pViyIDU
[Official Comment Doc]: https://cljs.github.io/api/cljs.core/comment
[cljs - Example 1]: https://github.com/clojure/clojurescript/blob/master/src/main/cljs/cljs/stacktrace.cljc#L146
[clj - Example 2]: https://github.com/clojure/clojure/blob/4ef4b1ed7a2e8bb0aaaacfb0942729252c2c3091/src/clj/clojure/set.clj#L158
[tools.deps.alpha - Example 3]: https://github.com/clojure/tools.deps.alpha/blob/f94815dd55bdf5eb30ac8fa075c39e757cbbcca5/src/main/clojure/clojure/tools/deps/alpha/gen/pom.clj#L141
[clojure.jdbc Example 4]: https://github.com/clojure/java.jdbc/blob/47a87036376ffa69f64cfa18d1f91cbb7e301199/src/test/clojure/clojure/java/jdbc_test.clj#L1279
[bbatsov's community clojure style guide]: https://github.com/bbatsov/clojure-style-guide#comments
