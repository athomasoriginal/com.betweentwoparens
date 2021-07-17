---
author: "Thomas Mattacchione"
createdDate: '29 July 2019'
date: Last Modified
layout: post
tags:
  - post
title: What the Reagent Component?!
permalink: blog/{{ title | slug }}/index.html
canonical: true
summary: "It's time to uncover the truth about Reagent components."
---

Did you know that when you write a [form-1], [form-2] or [form-3] Reagent component they all default<a href="#reagent-default-class" aria-describedby="footnote-label" id="reagent-default-class-ref"></a> to becoming React `class components`<a href="#reagent-components" aria-describedby="footnote-label" id="reagent-components-ref">?</a>

For example, if you were to write this `form-1` Reagent component:

```clojure
(defn welcome []
  [:h1 "Hello, friend"])
```

By the time Reagent passes it to React it would be the equivalent of you writing this:

```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, friend</h1>
  }
}
```

::: note
To be clear, Reagent components do not turn into [ES6 class syntax].  This is just an illustrative tool because ES6 classes are rapidly becoming more common than the alternative forms of writing classes that we shall see later in this post.
:::

Okay, so, Reagent components become React `Class Components`. Why do we care? This depth of understanding is valuable because it means we can better understand:

- JavaScript, ES6 classes and the idea behind "syntax sugar"
- React's strategy for [distinguishing class and function components]
- How ClojureScript interacts with JavaScript

The result of all of this "fundamental" learning is we can more effectively harness JavaScript from within ClojureScript.

::: note
I assume readers have a level of familiarity with ClojureScript, JavaScript and React. Please also note that understanding Reagent at this level is not required to be productive in Reagent.  Finally, as of [Reagent 1.0.0] Reagent is capable of allowing developers to choose whether they want their components to be `class` or `function` components.  When this post was originally written, this was not possible and for many in the community it was an assumption that might have gone unnoticed.  None the less, the learnings here are still important!  So, the rest of this post is assuming that you have NOT enabled Reagent components to render as `function` components.
:::

## A Pseudoclassical Pattern

The reason all of your Reagent components become `class components` is because all of the code you pass to Reagent is run through an internal Reagent function called [create-class].  The interesting part of this is _how_ `create-class` uses JavaScript mechanics to transform the Reagent component you wrote into something that is recognized as a React class component.  Before we look into what `create-class` is doing, it's helpful to review how "classes" work in JavaScript.

Prior to ES6, JavaScript did not have classes<a href="#javascript-es6-classes" aria-describedby="footnote-label" id="javascript-es6-classes-ref">.</a>  and this made _some_ JS developers sad because classes are a common pattern used to structure ones code and provide mechanisms for:

- instantiation
- inheritance
- polymorphism

But as I said, prior to ES6, JavaScript did not have a formal syntax for "classes".  This led the JavaScript community to develop a [series of instantiation patterns] to help _simulate_ classes.

Of all of these patterns, the `pseudoclassical instantiation pattern` became one of the most popular ways to simulate a class in JavaScript.  This is evidenced by the fact that many of the "first generation" JavaScript libraries and frameworks, like [google closure library] and [backbone], are written in this style.

The reason we are going over this history is because the thing about a programming language is there are "patterns" and "syntax".  The challenge with "patterns" is:

- They are disseminated culturally
- They are _often_ not easy to search
- They _often_ require a deeper understanding of the language and problem being solved to understand why the pattern became accepted.

The last point is relevant to our conversation because patterns ultimatley make assumptions. Assumptions like our understanding of the problem being solved and where and when a pattern should itself be used.  The end result is that a pattern can just become a "thing" we do all while forgetting why we started to do it in the first place or what the world could look like without it.

For example, the most common way of writing a React class component is to use ES6 class syntax.  But did you know that ES6 class syntax is little more than syntactic sugar around the `pseudoclassical instantiation pattern`?

For example, you can write a valid React class component using the `pseudoclassical instantiation pattern` like this:

```javascript
// 1. define a function (component) called `Welcome`
function Welcome(props, context, updater) {
  React.Component.call(this, props, context, updater)

  return this
}

// 2. connect `Welcome` to the `React.Component` prototype
Welcome.prototype = Object.create(React.Component.prototype)

// 3. re-define the `constructor`
Object.defineProperty(Welcome.prototype, 'constructor', {
  enumerable: false,
  writable: true,
  configurable: true,
  value: Welcome,
})

// 4. define your React components `render` method
Welcome.prototype.render = function render() {
  return <h2>Hello, Reagent</h2>
}
```

While the above is a valid React `Class Component`, it's also verbose and error prone.  For these reasons JavaScript introduced ES6 classes to the language:

```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, Reagent</h1>
  }
}
```

::: note
Yup, ES6 class syntax is a sexier `pseudoclassical instantiation pattern` and also a good example of what developers mean when they say `syntactic sugar`.  I should also mention that there are _some_ differences between the two approaches listed above which means they are not 100% equivalent, but for most developers the differences are academic.  **Fun time bonus:** I encourage you checkout [this code sandbox] where I have setup live examples of both.
:::

For those looking for further evidence, we can support our claim that `ES6 Classes` result in same thing as what the `pseudoclassical instantiation pattern` produces by using JavaScript's built-in introspection tools to compare the `pseudoclassical instantiation pattern` to the `ES6 class` syntax.

**pseudoclassical instantiation pattern**:

```javascript
function Welcome(props, context, updater) {
  React.Component.call(this, props, context, updater)

  return this
}

// ...repeat steps 2 - 4 from above before completing the rest

var welcome = new Welcome()

Welcome.prototype instanceof React.Component
// => true

Object.getPrototypeOf(Welcome.prototype) === React.Component.prototype
// => true

welcome instanceof React.Component
// => true

welcome instanceof Welcome
// => true

Object.getPrototypeOf(welcome) === Welcome.prototype
// => true

React.Component.prototype.isPrototypeOf(welcome)
// => true

Welcome.prototype.isPrototypeOf(welcome)
// => true
```

**ES6 class**

```javascript
class Welcome extends React.Component {
  render() {
    console.log('ES6 Inheritance')
  }
}

var welcome = new Welcome()

Welcome.prototype instanceof React.Component
// => true

Object.getPrototypeOf(Welcome.prototype) === React.Component.prototype
// => true

welcome instanceof React.Component
// => true

welcome instanceof Welcome
// => true

Object.getPrototypeOf(welcome) === Welcome.prototype
// => true

React.Component.prototype.isPrototypeOf(welcome)
// => true

Welcome.prototype.isPrototypeOf(welcome)
// => true
```

What does all of this mean?  As far as JavaScript and React are concerned, both definions of the `Welcome` component are valid React `Class Components`.

With this in mind, lets look at Reagent's `create-class` function and see what it does.

## What Reagent Does

The history lesson from the above section is important because `create-class` uses a modified version of the `pseudoclassical instantiation pattern`.  Let's take a look at what we mean.

The following code sample is a simplified version of Reagent's `create-class` function:

```javascript
function cmp(props, context, updater) {
  React.Component.call(this, props, context, updater)

  return this
}

goog.extend(cmp.prototype, React.Component.prototype, classMethods)

goog.extend(cmp, React.Component, staticMethods)

cmp.prototype.constructor = cmp
```

::: note
Note that the above is written in JavaScript where as Reagent's is written in ClojureScript. The reason I have done this is that I feel it can reach a broader audience when written in JS, but most importantly, the reader doesn't have to transform the code in their header from CLJS to JS which allows us to examine the work with less mental overhead.
:::

What we have above is Reagents take on the `pseudoclassical instantiation pattern` with a few minor tweaks:

```javascript
// 1. we copy to properties + methods of React.Component
goog.extend(cmp.prototype, React.Component.prototype, classMethods)

goog.extend(cmp, React.Component, staticMethods)

// 2. the constructor is not as "thorough"
cmp.prototype.constructor = cmp
```

Exploring point 1 we see that Reagent has opted to copy the `properties` and `methods` of `React.Component` directly to the Reagent compnents we write.  That is what's happening here:

```javascript
goog.extend(cmp.prototype, React.Component.prototype, classMethods)
```

If we were using the the traditional `pseudoclassical` approach we would instead do this:

```javascript
cmp.prototype = Object.create(React.Component.prototype)
```

Thus, the difference is that Reagent's approach copies all the methods and properties from `React.Component` to the `cmp` prototype where as the second approach is going to `link` the `cmp` prototype to `React.component` prototype.  The benefit of linking is that each time you instantiate a `Welcome` component, the `Welcome` component does not need to re-create all of the `React.components` methods and properties.

Exploring the second point, Reagent is doing this:

```javascript
cmp.prototype.constructor = cmp
```

whereas with the traditional `pseudoclassical` approach we would instead do this:

```javascript
Object.defineProperty(Welcome.prototype, 'constructor', {
  enumerable: false,
  writable: true,
  configurable: true,
  value: Welcome,
})
```

The difference in the above approaches is that if we just use `=` as we are doing in the Reagent version we create an `enumerable` constructor.  This can have an implication depending on who consumes our classes, but in our case we know that only React is going to be consuming our class components, so we can do this with relative confidence.

What is one of the more interesting results of the above two Reagent modifications?  First, if React depended on JavaScript introspection to tell whether or not a component is a child of `React.Component` we would not be happy campers:

```javascript
Welcome.prototype instanceof React.Component
// => false...Welcome is not a child of React.Component

Object.getPrototypeOf(Welcome.prototype) === React.Component.prototype
// => false...React.component is not part of Welcomes prototype chain

welcome instanceof React.Component
// => false...Welcome is not an instance of React.Component

welcome instanceof Welcome
// => true...welcome is a child of Welcome

Object.getPrototypeOf(welcome) === Welcome.prototype
// => true...welcome is linked to Welcome prototype

console.log(React.Component.prototype.isPrototypeOf(welcome))
// => false...React.Component not linked to the prototype of React.Component

console.log(Welcome.prototype.isPrototypeOf(welcome))
// is Welcome is the ancestory?
```

What the above shows is that `Welcome` is not a child of `React.component` even though it has all the properties and methods that `React.Component` has.  This is why were lucky that React is smart about detecting [class vs. function components].

Second, by `copying` rather than `linking` prototypes we could inccur a performance cost but again, in our case this cost is negligible.

::: note
For those who want to know why the Reagent team chose to modify the pseudoclassical instantiation pattern I do not really have an answer.  At the end of the day, they do more or less the same things without any significant downsides<a href="#why-modify" aria-describedby="footnote-label" id="why-modify-ref">?</a>
:::

## Conclusion

I think it's important to dive into the weeds.  In my experience, it's these detours and thorough questioning of topics which has led to considerable improvements in my programming skill and general comfort with increasingly challenging topics.

However, I think the biggest thing for me is something I referenced a few times in this post: "cultural knowledge".  I have come to see that that is the most powerful tools we have as a species.  It's unfortunate that this kind of information is not always available and my hope is that I could fill some of the gaps with this writing and maybe even open the door to works which can be built ontop of this.

Less philosophically though, I find it encouraging to know that everything is, generally speaking, JavaScript under the hood.  This is important because it allows us to take advantage of what has come before and really dig into interesting ways we can use and manipulate JS from within CLJS.

::: footnotes

->->-> footnote#reagent-default-class
I say "default" because prior to version xx of Reagent you did not have a choice between class or function components.
->->->

->->-> footnote#reagent-components
This is [briefly touched on] in Reagents component guide but they do not explicitly use the words `React class component` which means that it is easy to miss the implication of this point. Hence this blog post.
->->->

->->-> footnote#javascript-es6-classes
It is important to note that even with ES6 class syntax JavaScript still does not have classes in the traditional sense.
->->->

->->-> footnote#why-modify
If your curious as to why there is an [official response] from the current maintainer of the Reagent to this post from the current maintainer of the Reagent to this post.
->->->

:::

[form-1]: https://github.com/reagent-project/reagent/blob/master/doc/CreatingReagentComponents.md#form-1-a-simple-function
[form-2]: https://github.com/reagent-project/reagent/blob/master/doc/CreatingReagentComponents.md#form-2--a-function-returning-a-function
[form-3]: https://github.com/reagent-project/reagent/blob/master/doc/CreatingReagentComponents.md#form-3-a-class-with-life-cycle-methods
[distinguishing class and function components]: https://overreacted.io/how-does-react-tell-a-class-from-a-function/
[create-class]: https://github.com/reagent-project/reagent/blob/88e9833be9c3135548d760286ffd84d88a0a0489/src/reagent/impl/component.cljs#L289
[series of instantiation patterns]: http://nick.balestra.ch/2015/classes-and-instantiation-patterns-in-javascript/
[google closure library]: https://developers.google.com/closure/library/
[backbone]: https://backbonejs.org/
[class vs. function components]: https://overreacted.io/how-does-react-tell-a-class-from-a-function/
[ES6 class syntax]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[Reagent 1.0.0]: https://github.com/reagent-project/reagent/blob/master/CHANGELOG.md#100-alpha2-2020-05-13
[this code sandbox]: https://codesandbox.io/s/pseudoclassical-instantiation-pattern-sc0fk
[briefly touched on]: https://github.com/reagent-project/reagent/blob/master/doc/CreatingReagentComponents.md#final-note
[official response]: https://github.com/reagent-project/reagent/pull/437#issuecomment-520943315
