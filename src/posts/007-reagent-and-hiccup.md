---
author: "Thomas Mattacchione"
createdDate: '31 December 2019'
updatedDate: '06 March 2024'
date: Last Modified
layout: post
tags:
  - post
title: "Reagent & Hiccup"
permalink: blog/{{ title | slug }}/index.html
canonical: true
summary: "Hiccup is the Ryan Atwood to JSX's Seth Cohen."
---


I'm writing this post because `hiccup` in the context of Reagent
confused me and I wanted to work through some of the confusion.

Things that confused me: I apparently don't need to import a library,
modify my build tools or do anything and I just get to write `hiccup` for free?
How is this possible? Also, what is `hiccup` and is it the same everywhere?

In React (JavaScript) you primarily write your HTML markup with [JSX].  In
Reagent (a ClojureScript wrapper around React) we write our HTML markup with
something called `hiccup`.

Here is a React [hello world] written in JS uxing `jsx`:

```js
ReactDOM.render(
  <h1 className="welcome">Hello, world!</h1>, // <-- JSX
  document.getElementById('root')
);
```

Here is the same React hello world written in Reagent using hiccup:

```clojure
(reagent.dom/render
  [:h1 {:class "welcome"} "Hello, world!"] ; <-- Hiccup
  (.. js/document (getElementById  "root")))
```

Let's pull the `JSX` and `hiccup` out so we can see them clearly:

```js
// JSX
<h1 className="welcome">Hello, world!</h1>


// hiccup
[:h1 {:class "welcome"} "Hello, world!"]
```

::: note
`reagent.dom/render` is Reagent's wrapper around `ReactDOM.render`.  This was
introduced in version `0.10.0` of `Reagent`.  I also want to note that there
are many implementations of `hiccup`.  Some run on the server and some run in
the browser and some can be run in both places.  Hiccup is actually very simple
to implement.  The result is you have several implementations which were built
for different purposes.  I will cover these at the end of this post.  The majority
of this post is covering `reagent hiccup`.
:::

For fun, here is some more hiccup:

```clojure
[:ul {:class "list"}
  [:li {:class "list-item"} "Item 1"]
  [:li {:class "list-item"} "Item 2"]
  [:li {:class "list-item"} "Item 3"]]
```

The rest of this post is going to dig into the questions asked in the
introductory paragraph.

::: note
This post is geared toward beginner and intermediate ClojureScript developers
who want to understand a little more about how `Reagent Hiccup` works.  As a
result, we won't cover how to write Hiccup, but if that's your goal, please see
this [Guide to Writing Hiccup].
:::

## Reagent Hiccup

Let's return to the original reagent code snippet we started with:

```clojure
(reagent.dom/render
  [:h1 {:class "welcome"} "Hello, world!"] ; <-- hiccup
  (.. js/document (getElementById  "root")))
```

On **line 2** we have a Clojure vector.  Don't overthink it.  It's just a
vector.  However, because of the order and type of the arguments, it becomes
`hiccup`.

To be considered valid `Reagent Hiccup`, the vector you pass to Reagent needs
to take on one of the following shapes:

```clojure
[tag]

; => [:h1]

[tag attributes]

; => [:h1 {:class "welcome"}]

[tag children]

; => [:h1 "Hello world!"]

[tag attributes children]

; => [:h1 {:class "welcome"} "Hello world!"]
```

Here is another way to break it down:

* **tag**
  * A keyword (`:h1`) or symbol (`hi`)
* **attributes**
  * A map `{:class "welcome"}`
* **children**
  * A string (`"Hello world!"`), vector (`[:p "hi"]`) or symbol (`hi`)

:::note
The above are the main flavours, but there are more ways to do things.
:::

How does Reagent know what do with `hiccup`?  The `reagent.dom/render` accepts
either `Reagent Hiccup` or a `React Element` as the first argument.  So by
providing a `vector`, Reagent automatically treats it like `Reagent Hiccup`.

Thus, if we were to pass something that's not actually `Reagent Hiccup`,
Reagent is kind enough to throw a JavaScript assertion error in the browser
console letting us know what went wrong.

Okay, so Reagent can just accept `hiccup`.  How does Reagent understand Hiccup
and know what to do with it?  We didn't import a library or add a plugin to
our build tools?

The answer is that Reagent comes with a Hiccup compiler built-in which converts
Reagent's `hiccup` to `React Elements`.

### Reagent Hiccup to React Element

The process begins by Reagent passing the `component` given to `reagent.dom/render`
to a function called `create-class`.

`create-class` has [other jobs] aside from handling Hiccup, but
one of it's jobs is to compile `Reagent Hiccup` to `React.createElement` calls.
This step is handled by the [as-element] function.

`as-element` accepts `Reagent Hiccup` like this:

```clojure
[:h1 {:class "welcome"} "Hello, world!"]
```

Compiles it to `React.createElement` function calls like this:

```javascript
React.createElement(
  "h1",
  {className: 'welcome'},
  "Hello, world!"
);
```

The above is given to React which actually runs the `React.createElement` calls
turning them into `React Elements` like this:

```javascript
{
  type: "h1",
  props: {
    className: 'greeting',
    children: "Hello, world!"
  }
};
```

which ultimatley gets turned into HTML

```html
<h1 class="welcome">Hello, world!</h1>
```

Understanding that everything is turned into `React.createElement` calls you might be asking, _"Could we just use React.createElement and not use Reagent Hiccup?"_.  The answer? Yup!

## Reagent Without Hiccup

Similar to React and JSX, you can use plain old `React.createElement` to create `Reagent Components`.  For example, where we wrote the original example as:

```clojure
(reagent.dom/render
  [:h1 {:class "welcome"} "Hello, world!"]
  (.. js/document (getElementById  "root")))
```

we could also use `reagent.core/create-element` to write a `Reagent component` like this:

```clojure
(reagent.dom/render
  (reagent.core/create-element
    "h1"
    #js{:className "welcome"}
    "Hello, world!")
  (.. js/document (getElementById  "root")))
```

Thus, the following are equivalent

```clojure
; hiccup
[:h1 {:class "welcome"} "Hello, world!"]

; reagent function
(reagent.core/create-element
  "h1"
  #js{:className "welcome"}
  "Hello, world!")
```

::: note
`reagent.core/create-element` is a Reagent helper function which wraps `React.createElement`.  It's the equivalent of calling `React.createElement`, but `reagent.core/create-element` provides a "natural" way to write `React.createElement` in Clojure and also provides a few conveniences.
:::

Understanding this, are there any reasons to use `reagent.core/create-element`
over `Reagent Hiccup`?

### Why Reagent Hiccup?

From a technical perspective, you can argue that there is less work being done
if you don't use hiccup because you don't have to convert `hiccup` to `createElement`
calls.  However, i'm not sure this optimization would be worth it. Especially
because you could just change the implementation of hiccup to be run at compile
time and see the performance improvements and still have the advantage of
writing your components in `hiccup`.

From a developer experience perspective, you might suggest that using
`reagent.core/create-element` over `hiccup` initially feels easier to teach
new developers how to create components in React/Reagent.  However, this is
subjective and I could argue that `hiccup` is far friendlier and because of its
uniquity is a better tool to rely on.

Some more reasons we use Hiccup in Reagent is similar to the reasons for using
JSX in React.

- Separation of concerns: Separate by component vs. technology
- Accessibility: easier to read and write than `React.createElement`
- Expressivity: it's a Clojure data structure, so we have the full power of Clojure

::: note
The above is a summary of the design goals of the React team when they introduced JSX.  What I have done is adapted the rationale for Clojure.  For more information, I encourage you to watch [React: Rethinking Best Practices].  Note that this talk is for React, but the design principles are still valid and applicable to Clojure
:::

The second point, _Accessibility_, is particularly interesting.  One of the things I mean by this is that because Hiccup is a popular DSL in Clojure land, and not specific to `Reagent`, it can be quickly be adopted by developers already familiar with Hiccup.

## Hiccup and Clojure

As I mentioned at the top, there are many flavours of `hiccup`. `hiccup` is
not a Reagent thing, but a DSL which was adapted from a server-side tool called
[Hiccup].

`hiccup` was introduced by [James Reeves] and has become a standard DSL for
Clojure developers looking to represent HTML in Clojure.  This means that there
are many 3rd party libraries which allow you to write Hiccup in your app even
if you aren't using Reagent.  For example, the following are all examples of
popular Hiccup libraries.

- [Hiccup]
- [Soblano]
- [Hicada]
- [enlive]

And I think this is the beginning of some of the confusion when it comes to
`hiccup` and Reagent.

When one starts to learn ClojureScript, they often start with Clojure.  The
Clojure guides, references and libraries are generally oriented towards Clojure.
While this is understanable, it can create a challenge when trying to figure
out how to write HTML in Clojure.

My story was that I started with Clojure building a little MPA with `hiccup`.
I found my library of choice and made stuff appear on the screen by calling
the `hiccup` library I chose.  Then I tried to make the same thing
happen in Reagent and noticed that I didn't need a library or to call to anything
and it all just worked.  I eventually learned what was happening, hence this
post, but it was irritating at first to not get what was really going on.

## Conclusion

The overarching point is that `hiccup` is a common way of writing HTML is
Clojure.  Unlike JSX, which for a long while was a React only thing, Hiccup is
not specific to Reagent/React.  So, this point is meant to provide the context.

Want to learn more about `hiccup`? Tonsky's [article on hiccup] is pretty great.


[Guide to Writing Hiccup]: https://purelyfunctional.tv/guide/reagent/#hiccup
[React: Rethinking Best Practices]: https://www.youtube.com/watch?v=x7cQ3mrcKaY
[JSX]: https://react.dev/learn/writing-markup-with-jsx
[hello world]: https://reactjs.org/docs/hello-world.html
[other jobs]:https://betweentwoparens.com/blog/what-the-reagent-component
[as-element]: https://github.com/reagent-project/reagent/blob/88e9833be9c3135548d760286ffd84d88a0a0489/src/reagent/impl/template.cljs#L382
[Hiccup]: https://github.com/weavejester/hiccup
[Soblano]: https://github.com/r0man/sablono
[Hicada]: https://github.com/rauhs/hicada
[enlive]: https://github.com/cgrand/enlive
[James Reeves]: https://github.com/weavejester
[article on hiccup]: https://tonsky.me/blog/hiccup/
