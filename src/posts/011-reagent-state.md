---
author: "Thomas Mattacchione"
createdDate: '31 October 2020'
date: Last Modified
layout: post
tags:
  - post
title: "Reagent State"
permalink: blog/{{ title | slug }}/index.html
canonical: true
summary: "You know what time it is."
---


[Reagent] comes with its own State Management library.  It's small and it looks like this:

```clojure
(ns sample.app
  (:require
    [reagent.core  :as core]
    [reagent.ratom :as ratom]))


(core/atom value options)

(core/cursor atom-or-f ks)

(core/track f & args)

(core/track! f & args)

(ratom/make-wrapper value f args)

(ratom/make-reaction f options)
```

<aside class="blog-content__note">Note the arg names align to <a class="blog-content__link" href="https://github.com/bbatsov/clojure-style-guide#idiomatic-names" target="_blank" rel="noopener noreferrer">community style guide</a>.  Example, <code class="gatsby-code-text">ks</code> means a sequence of keys.  Example: <code class="gatsby-code-text">[:user :name]</code> or <code class="gatsby-code-text">[:users 1 :name]</code>.</aside>

But have you ever wondered what these things do?  Why we call things Reactive?  How things work under the hood?  Me too.  So I spent some mapping it out.  Thus, this post is going to explore the topic through a simple Reagent component which uses state.

<aside class="blog-content__note">This post is geared towards intermediate and advanced Clojure(Script) and React Developers.  Having said this, I want people of all skill levels to benefit from this, so I will do my best to provide resources to enable this to be as approachable as possible</aside>

## The Example App

In order to create a stateful app we need one or more of our components to be stateful.  This means that we need to do a few things:

1. use a `form-2` or `form-3` component
2. use a `RAtom`
3. `deref` said `RAtom` in our component's `render function`

Here is a simple example of what that looks like.

```clojure
(ns stateful.app
  (:require
    [reagent.core :as r.core]
    [reagent.dom  :as r.dom]))

(defn app [] ; form-2 component
  (let [state (r.core/atom 0)] ; RAtom
    (fn []                                  ; -- render function
      [:div                                 ;   |
        [:h1 "Love Taps"]                   ;   |
        [:p @state]                         ;   |deref RAtom
        [:button                            ;   |
          {:on-click #(swap! state inc)}    ;   |
          "Heart SVG"]])))                  ; --

(r.dom/render [app] (js/document.getElementById "root")))
```

<aside class="blog-content__note">The <code class="gatsby-code-text">RAtom</code> can also live outside of the component.  I just kept it in because that I feel the example might be easier to grok.</aside>

and the app might look like this in the browser

![Click Counter App](/images/011-01-state-management-app.png)

From here, all we have to do is click on the `heart button` and our counter will increment by `1` for each click.  So, why does this happen?  How does it actually work?

## How Reagent Works

At a high level, when you run `r.dom/render` the following things happen:

- Pass `[app]` to [core/as-element]
- Compile Hiccup to React `class` or `function` components
- Then we run the `components` in a function called `ratom/run-in-reaction`
  - The above is passed `#(wrap-render .. ..)`
  - `wrap-render`
- `ratom/run-in-reaction` is going to
  - Create a `temp-reaction` - runs `(make-reaction nil)`
  - `make-reaction (fn [] [:div ...] :auto-run #(queue-render component))`
  - on the component we set a key of `cljsRatom` and set the value to the `Reaction` we created in this step.
    - This is probably why un-mounting of a component removes the reactions which are watching the atoms
    - `run-in-reaction` actually returns the element
- TODO!  go back and see what `deref-capture` is doing because that stuff is what tells who to track and watch what!

So whenever the `atom` changes state, it tells the `reaction` to re-run it's render method.  Then, because we set auto-run to `batch/queue-render` that piece is now going to run (but when?) which is responsible for ultimatley calling a `RenderQueue` types `queue-render`


What Reagent does is provide an Out of the Box approach for state management.  The rationale for this is derived from the fact that Clojure(Script) has [immutable data-structures] so we can make decisions about state in a way that `React` cannot make as easily because JavaScript does not have these features<a href="#react-immutable" aria-describedby="footnote-label" id="react-immutable-ref">.</a>

As with `React`, a component updates when either `props` or `state` changes.  Let's give an example of what a stateful component looks like in Reagent.  I like to translate examples from React because I think the comparison is helpful.  So, let's say we have this component

```clojure
(defn clock
  []
  (let [state (r/atom {:date (js/Date.)})]
    (fn []
      [:div
        [:h1 "Hello, world!"]
        [:h2 (str "It is " (:date @time))]])))
```

So what we have is this.  Anytime you `dereference` (`@`) a `reagent.ratom/atom` inside of your components `render function` Reagent is going to start watching that `atom` we called `name` and whenever it changes (someone uses `swap!` or `reset!` on it), Reagent is going to re-render the `render function`.  All of this is mentioned in the Reagent docs article called [when do components update].

Now we can dig a bit deeper and look to the reagent article [Managing State].  This section of their docs notes that Reagent's approach is pretty smart and ultimately, "allows components to track application state and update only when needed".  It's this section that I want to dig into.  Namely: "Reagent provides a set of tracking primitives called reactions and a set of utility functions to build more customized state management."

## Deep Inside that State

The Reagent state management library provides the following functions for managing state:

- `Reaction`
- `RAtom`
- `Cursor`
- `Track`

But all I want to discuss in this post is `Reaction` and `RAtom` because each of the above is a variant on an `Atom` and the difference is the amount of knobs that you can turn.

Let's start by saying that all of these `Types` are built on top of `atoms`.  So, they each extend the `Atom` protocol and then redefine some of the behaviours.  As a result, we have to consider those behaviours when we want to use them.

For all of these, because they all extend an `Atom`, the way you mutate them is with two functions:

- `swap!`
- `reset!`

and then when you want to get the value stored inside of them you will use:

- `deref`

<aside class="blog-content__note">When do you use one over the other?  A good rule of thumb is this:  do you need the previous value in order to generate the next value?  Use <code class="gatsby-code-text">swap!</code>.  For more information on the Atom and why it exists in Clojure please read <a class="blog-content__link" href="https://purelyfunctional.tv/mini-guide/atom-code-explanation/" target="_blank" rel="noopener noreferrer">Atom Code Explanation</a></aside>

Perhaps it's best to start by just explaining what happens behind the scenes when we start using `Reagent state`.

When we get to it, here are some example scenarios we should walk through.  Here is a component which will update when the `Atom` changes:

```clojure
(defn clock
  []
  (let [state (r/atom {:date (js/Date.)})]
    (fn []
      [:div
        [:h1 "Hello, world!"]
        [:h2 (str "It is " (:date @time))]])))
```

This one will not:

```clojure
(defn clock
  []
  (let [state (r/atom {:date (js/Date.)})]
        date  (:user @time)
    (fn []
      [:div
        [:h1 "Hello, world!"]
        [:h2 (str "It is " date)]])))
```

The reason the second will not is because we `dereferenced` the `time` atom outside of the `render function`.  This means that the component is not being tracked by Reagent.

Other scenarios we will run into:

- `dereferencing` the atom inside of a `callback`, `promise` etc.  However, a change to this `atom` will be detected by any of the `render functions` listening.
- `dereferencing` anywhere is a `form-1` component will always work.

## Conclusion

One day I wanted to understand how `RAtoms` actually worked and came across a line in the docs stating:

```clojure
;; Reactions are what give r/atom, r/cursor, and r/wrap their power.
```

This line might have been the bane of my existence when trying to understanding what was going on because for some reason I thought that the other functions were based on a `Reaction`, but this is not the case.  Each one is Atom like and will do different things when it's methods called and together, using all of them in a particular way, we can get the state management love.

Why did I write this?  Knowing this information is important to being able to truly use Reagent to it's fullest potential, but I also feel that what the ClojureScript community is doing is important for the web development community because it's tackling the same problems and bring a different approach to solving them.  Reagent is one of the most popular libraries for React development in ClojureScript and it would be amazing to see more experimentation, like [Helix], done in this area, but truly, to see the approach of `Reagent` furthered.  The only way we can do this is by teaching ourselves the underpinnings of the library so we have to knowledge to further it.


## Notes

Then you start to deep dive into how it works and that's where things become interesting.  Example questions:

```clojure
(def user (r/atom {:user {:logged-in? true
                          :first-name "Tony"
                          :last-name  "shalhoub"}}))

(def count (r/atom 0))
```
- Does this render once or twice?
  ```clojure
  (r/atom foo [])
  (r/atom bar [])

  (defn cool-component
      []
      [:button {:on-click (fn [_]
                            (swap! foo conj 1)
                            (swap! bar conj 2))}
        @foo
        @bar])
  ```
- How does a component know how to re-render?
- How does component batching work?

This post is going to dive deep into Reagent State and try to explain how it works.  Before we begin with that though, a big part of helping us understand state is going to be understand a bit more about what Reagent itself is and does.

<aside>
  <h3>Footnotes</h3>
  <ol>
    <li id="not-idiomatic">
      This example assumes you have included React using a CDN.  This example is also drawn directly from the <a class="blog-content__link" href="https://reactjs.org/tutorial/tutorial.html" target="_blank" rel="noopener noreferrer">official React documentation</a>.
      <a href="#not-idiomatic-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="react-immutable">
      Please note that you can make JavaScript data structures immutable with libraries like <a class="blog-content__link" href="https://immutable-js.github.io/immutable-js/" target="_blank" rel="noopener noreferrer">immutable-js</a>.
      <a href="#react-immutable-ref" aria-label="Back to content">Back</a>
    </li>
  </ol>
</aside>

[React]: https://reactjs.org/
[Reagent]: http://reagent-project.github.io/
[Atom Code Explanation]: https://purelyfunctional.tv/mini-guide/atom-code-explanation/
[Helix]: https://github.com/lilactown/helix
[Function based components]: /what-the-reagent-component
[Reagent and Hiccup]: /reagent-and-hiccup
[immutable data-structures]: https://swannodette.github.io/2013/12/17/the-future-of-javascript-mvcs/
[when do components update]: https://github.com/reagent-project/reagent/blob/master/doc/WhenDoComponentsUpdate.md#1-props
[Managing State]: https://github.com/reagent-project/reagent/blob/master/doc/ManagingState.md
[core/atom]: http://reagent-project.github.io/docs/master/reagent.core.html#var-atom
[ratom/make-reaction]: http://reagent-project.github.io/docs/master/reagent.ratom.html#var-make-reaction
[@ or deref]: https://clojure.org/guides/weird_characters#_deref
[core/as-element]: http://reagent-project.github.io/docs/master/reagent.core.html#var-as-element
