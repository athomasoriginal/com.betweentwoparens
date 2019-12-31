---
title: 'Reagent and Hiccup'
date: '2019-12-31'
slug: reagent-and-hiccup
summary: Hiccup is the Ryan Atwood to JSX's Seth Cohen
author: 'Thomas Mattacchione'
keywords: ['Reagent Hiccup', 'ClojureScript', 'Hiccup Guide']
---

Let's start this post by looking at React's [hello world](https://reactjs.org/docs/hello-world.html) example:

```javascript
ReactDOM.render(
  <h1 className="welcome">Hello, world!</h1>, // <-- JSX
  document.getElementById('root')
);
```

and now let's rewrite it in Reagent (a popular ClojureScript React wrapper)

```clojure{numberLines: true}
(reagent.core/render-component
  [:h1 {:class "welcome"} "Hello, world!"] ; <-- Hiccup
  (.. js/document (getElementById  "root")))
```


<aside class="blog-post__note"><code class="gatsby-code-text">render-component</code> is Reagent's version of <code class="gatsby-code-text">ReactDOM.render</code></aside>

If the above is the first time you're reading ClojureScript or Reagent, it may look foreign, but you might also notice that the overall shape of the code (lines, structure, functions) is more or less the same.  To me, the biggest difference is what happens on **line 2**

```clojure
[:h1 {:class "welcome"} "Hello, world!"]
```

The above, my friends, is `Reagent Hiccup` and it's a common way to _represent_ HTML in Clojure.  In this way, it's Reagent's version of [JSX](https://reactjs.org/docs/introducing-jsx.html).  Just to provide more context, here is another example of `Reagent Hiccup`:

```clojure
[:ul {:class "list"}
  [:li {:class "list-item"} "Item 1"]
  [:li {:class "list-item"} "Item 2"]
  [:li {:class "list-item"} "Item 3"]]
```

If you're like me when I first started writing ClojureScript, `Hiccup` can seem a little confusing.  How is it possible to use `Hiccup` without importing a library or adding a plugin to our build tools?  How does React know what to do with `Reagent Hiccup`?  These, and more, are questions I hope to answer in this post.  Here is a full post overview:

- [Reagent Hiccup](#reagent-hiccup)
- [Reagent without Hiccup](#reagent-without-hiccup)
- [Hiccup and Clojure](#hiccup-and-clojure)

<aside class="blog-post__note">This post is geared toward beginner and intermediate ClojureScript developers who want to understand a little more about how <code class="gatsby-code-text">Reagent Hiccup</code> works.  As a result, we won't cover how to write Hiccup, but if that's your goal, please see this <a class="blog-post__link" target="_blank" rel="noopener noreferrer" href="https://purelyfunctional.tv/guide/reagent/#hiccup">Guide to Writing Hiccup</a>.</aside>

## Reagent Hiccup

Let's return to the code snippet we started this post with:

```clojure
(reagent.core/render-component
  [:h1 {:class "welcome"} "Hello, world!"] ; <-- hiccup
  (.. js/document (getElementById  "root")))
```

On **line 2** we have an unassuming Clojure vector, or is it?  In truth, that's exactly what it is.  It's just a vector, but it's also known as `Reagent Hiccup`.  This might lead one to ask, _"If it's just a vector, how is it also `Reagent Hiccup`?"_.

The reason is because `reagent.core/render-component`, the entry point for a Reagent app, accepts either `Reagent Hiccup` or a `React Element` as the first argument.  So by providing a `vector`, Reagent automatically treats it like `Reagent Hiccup`.  This means that Reagent also expects it to be written in a specific way.

To be considered valid `Reagent Hiccup`, the vector you pass to Reagent needs to take one of the following three shapes:

```clojure
[tag]

; => [:h1]

[tag attributes]

; => [:h1 {:class "welcome"}]

[tag attributes children]

; => [:h1 {:class "welcome"} "Hello world!"]
```

Here is another way to break it down:

- **tag** - `:h1`
- **attributes** - `{:class "welcome"}`
- **children** - `"Hello world!"`

Thus, if we were to pass something that's not actually `Reagent Hiccup`, Reagent is kind enough to throw a JavaScript assertion error in the browser console letting us know what went wrong.  For example, an empty vector would result in a console assertion error being thrown.

What allows Reagent to understand Hiccup without us needing to import a library or add a plugin to our build tools?  It's because Reagent comes with a Hiccup compiler built-in.  This will be covered in more detail in the next section.

### Reagent Hiccup to React Element

As we mentioned, all components are passed into `reagent.core/render-component` and it's this function that's responsible for turning Hiccup into something that React understands.

The process begins by Reagent passing the `component` given to `reagent.core/render-component` to a function called `create-class`.

`create-class` has [other jobs](https://betweentwoparens.com/what-the-reagent-component) aside from handling Hiccup, but nonetheless one of it's jobs is to compile `Reagent Hiccup` to `React.createElement` calls.  This step is handled by the [as-element](https://github.com/reagent-project/reagent/blob/88e9833be9c3135548d760286ffd84d88a0a0489/src/reagent/impl/template.cljs#L382) function.

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

The above is given to React which actually runs the `React.createElement` calls turning them into `React Elements` like this:

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
(reagent.core/render-component
  [:h1 {:class "welcome"} "Hello, world!"]
  (.. js/document (getElementById  "root")))
```

we could also use `reagent.core/create-element` to write a `Reagent component` like this:

```clojure
(reagent.core/render-component
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

<aside class="blog-post__note"><code class="gatsby-code-text">reagent.core/create-element</code> is a Reagent helper function which wraps <code class="gatsby-code-text">React.createElement</code>.  It's the equivalent of calling <code class="gatsby-code-text">React.createElement</code>, but <code class="gatsby-code-text">reagent.core/create-element</code> provides a "natural" way to write <code class="gatsby-code-text">React.createElement</code> in Clojure and also provides a few conveniences.</aside>

Understanding this, are there any reasons to use `reagent.core/create-element` over `Reagent Hiccup`?

From a technical perspective, there aren't any noticeable benefits.  The advantages would be felt at an individual developer level based on their preferences.

For example, one might suggest that using `reagent.core/create-element` over `hiccup` initially feels easier to teach new developers how to create components in React/Reagent.

At this point, I feel it's a good time to go into why we use `Reagent Hiccup` at all.

### Why Reagent Hiccup?

As we can see, `Reagent Hiccup` is the Clojure(Script) equivalent of [JSX](https://reactjs.org/docs/introducing-jsx.html).  While they look different, they are both Domain Specific Languages (DSLs) which allow us to _represent_ HTML in Clojure and JavaScript respectively.

The reason we use Hiccup in Reagent is similar to the reasons for using JSX in React.

- Separation of concerns: Separate by component vs. technology
- Accessibility: easier to read and write than `React.createElement`
- Expressivity: it's a Clojure data structure, so we have the full power of Clojure

<aside class="blog-post__note">The above is a summary of the design goals of the React team when they introduced JSX.  What I have done is adapted the rationale for Clojure.  For more information, I encourage you to watch <a class="blog-post__link" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=x7cQ3mrcKaY">React: Rethinking Best Practices</a>.  Note that this talk is for React, but the design principles are still valid and applicable to Clojure</aside>

The second point, _Accessibility_, is particularly interesting.  One of the things I mean by this is that because Hiccup is a popular DSL in Clojure land, and not specific to `Reagent`, it can be quickly be adopted by developers already familiar with Hiccup.

## Hiccup and Clojure

You may have noticed that I've been writing `Reagent Hiccup` instead of just Hiccup.  The reason for this is because, as mentioned above, Hiccup is not specific to `Reagent`.

Hiccup was introduced by [James Reeves](https://github.com/weavejester/hiccup) and has become a standard DSL for Clojure developers looking to represent HTML in Clojure.  This means that there are many 3rd party libraries which allow you to write Hiccup in your app even if you aren't using Reagent.  For example, the following are all examples of popular Hiccup libraries.

- [Hiccup](https://github.com/weavejester/hiccup)
- [Soblano](https://github.com/r0man/sablono)
- [Hicada](https://github.com/rauhs/hicada)
- [enlive](https://github.com/cgrand/enlive)

And I think this is the beginning of some of the confusion when it comes to Hiccup and Reagent.

When one begins to learn ClojureScript, they often start with Clojure.  The reading material for Clojure, in the form of guides, references and libraries, is larger and oriented toward Clojure.  This makes sense for a number of reasons, but it also creates a challenge when trying to figure out how to use HTML in Clojure.

So, you start going through community resources and see that the answer is Hiccup.  You pick up one of the above libraries, create a demo app and things are great.  Now that you made something happen, you start to experiment with Reagent and notice that you are some how just able to write Hiccup without importing a library and this can seem like "magic".

Eventually you figure it out, but it can be a bumpy road.  This is why I decided to write a little about this because I always find it easier to conceptualize what I am doing when I understand how the pieces fit together.

## Conclusion

The overarching point is that Hiccup is a common way of writing HTML is Clojure.  Unlike JSX, which for a long while was a React only thing, Hiccup is not specific to Reagent/React and as a result, it can be confusing to understand where it all connects.

That's all for this post, but if you are interested in learning more about Hiccup, please take a read through his [article on hiccup](https://tonsky.me/blog/hiccup/). For everyone else, thanks for reading along and I hope this has helped demystify some of the inner workings of Reagent without gettting us too lost in the weeds.
