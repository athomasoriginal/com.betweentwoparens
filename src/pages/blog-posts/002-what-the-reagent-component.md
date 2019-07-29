---
title: 'What the Reagent Component?!'
date: '2019-07-29'
slug: what-the-reagent-component
summary: It's time to uncover the truth about Reagent components
author: 'Thomas Mattacchione'
---

Did you know that when you write a [form-1](https://github.com/reagent-project/reagent/blob/master/doc/CreatingReagentComponents.md#form-1-a-simple-function), [form-2](https://github.com/reagent-project/reagent/blob/master/doc/CreatingReagentComponents.md#form-2--a-function-returning-a-function) or [form-3](https://github.com/reagent-project/reagent/blob/master/doc/CreatingReagentComponents.md#form-3-a-class-with-life-cycle-methods) Reagent component they all become React `class components`<a href="#reagent-components" aria-describedby="footnote-label" id="reagent-components-ref">?</a>

For example, if you were to write this `form-1` Reagent component:

```clojure
(defn welcome []
  [:h1 "Hello, friend"])
```

By the time Reagent passes it to to React it would be the equivalent of you writing this:

```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, friend</h1>
  }
}
```

<aside class="blog-post__note">To be clear, Reagent components do not turn into <a class="blog-post__link" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes" rel="noopener noreferrer">ES6 class syntax</a>.  This is my way of illustrating that Reagent components are identified by React as class components.</aside>

While the fact that all Reagent components becoming class components is an interesting piece of trivia, the part that blew my mind was  _how_ they actually become `class components`<a href="#reagent-components-are-cray" aria-describedby="footnote-label" id="reagent-components-are-cray-ref">.</a>

As I see it, the benefit of having this fundamental understanding of Reagent components means that seemingly ellusive topics will become more inuitive.  For example, topics like:

- why we [can't just use hooks with Reagent components](https://github.com/reagent-project/reagent/blob/master/doc/ReactFeatures.md#hooks)
- React's strategy for [distinguishing class and function components](https://overreacted.io/how-does-react-tell-a-class-from-a-function/).
- JavaScript "classes"

The rest of this post will focus on digging into where and how this transformation happens by breaking it all down into 3 sections:

1. [A Pseudoclassical Pattern](#a-pseudoclassical-pattern)
1. [The Reagent Pattern](#the-reagent-pattern)
1. [Conclusion](#conclusion)


<aside class="blog-post__note">I assume readers have a level of familiarity with ClojureScript, JavaScript and React. Please also note that understanding Reagent at this level is not required to be productive in Reagent.  This kind of knowledge can become valuable when seeking to understand fundamental concepts of why and how Reagent does what it does.</aside>

## A Pseudoclassical Pattern

The reason all of your Reagent components become `class components` is because at some point, they are all going to pass through a Reagent function called [create-class](https://github.com/reagent-project/reagent/blob/88e9833be9c3135548d760286ffd84d88a0a0489/src/reagent/impl/component.cljs#L289).  But again, this is not really all that interesting.  What becomes interesting is _how_ Reagent's `create-class` transforms your Reagent component into a React class component.

There are two ways we could expore the _how_ of it all.  The first is by looking into the implementation details of `create-class` and breaking it into it's essential pieces.

The second is to not look at the implementation details of `create-class` just yet and take a moment to dig into JavaScript "classes".  I am going to opt for the second approach because it was only when I dug deep into JavaScript classes that the `create-class` code started to make sense.  Knowing this, lets dig into JS classes beginning with a little history.

Prior to ES6, JavaScript did not have classes<a href="#javascript-es6-classes" aria-describedby="footnote-label" id="javascript-es6-classes-ref">.</a>  and this made _some_ JS developers sad because classes are a common pattern used to structure ones code and provide mechanisms for:

- instantiation
- inheritance
- polymorphism

But as I said, JavaScript did not have formal classes.  This led the JavaScript community to develop a [series of instantiation patterns](http://nick.balestra.ch/2015/classes-and-instantiation-patterns-in-javascript/) to help simulate classes.

Of all of these patterns, the `pseudoclassical instantiation pattern` became one of the most popular ways to simulate a class in JavaScript.  This is evidenced by the fact that many of the "first generation" JavaScript libraries and frameworks, like [google closure library](https://developers.google.com/closure/library/) and [backbone](https://backbonejs.org/), are written in this style.

The reason this history is important is because what these "instantiation patterns" are is just that: patterns.  They are not a formal syntax in the language wich you can just look up.  Further, when modifications to these patterns are applied, its increasingly difficult to understand the intent behind them.

By extension, this means that unless you were around in the early days of React, the only way you know how to write React class components is using ES6 syntax.  But the fact remains that ES6 syntax is just syntactic sugar over the more manual `pseudoclassical instantiation pattern`.

For example, did you know that you can write a valid React class component using the `pseudoclassical instantiation pattern`:

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

As I noted, the above is a valid React class component.  However, it has tradeoffs like its verbose and error prone.  For this and other reasons, JavaScript introduce classes to the language:

```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, Reagent</h1>
  }
}
```

<aside class="blog-post__note">Yup, ES6 class syntax is a sexier pseudoclassical instantiation pattern.  And also, the two approaches are not 100% equivalent, but for most developers the differences are academic.  <strong>Fun time bonus:</strong> I encourage you checkout <a  class="blog-post__link" href="https://codesandbox.io/s/pseudoclassical-instantiation-pattern-sc0fk" target="_blank" rel="noopener noreferrer">this code sandbox</a> where I have setup live examples of both.</aside>

If the live code sandbox was not enough, we can use JavaScript's built-in introspection tools to compare the `pseudoclassical instantiation pattern` to the `ES6 class` syntax.

Starting with the pseudoclassical instantiation pattern:

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

and then perform the same tests against the ES6 class

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

The TL;DR for the above is that as far as JavaScript is concerned, both definions of the `Welcome` component are children of `React.Component` and therefore are valid React components.

With this knowledge, we should now be ready to return to Reagent's `create-class` function and explore it's implementation details.

## The Reagent Pattern

The above overview was required because Reagent's `create-class` function is implementing a modified version of the `pseudoclassical instantiation pattern`.  The following code snippet is a simplified version of some of the essential bits of `create-class`:

```javascript
function cmp(props, context, updater) {
  React.Component.call(this, props, context, updater)

  return this
}

goog.extend(cmp.prototype, React.Component.prototype, classMethods)

goog.extend(cmp, React.Component, staticMethods)

cmp.prototype.constructor = cmp
```

<aside class="blog-post__note">We are writing in JavaScript because I feel its easier to understand than the Reagent ClojureScript code as what we are discussing is JavaScript patterns translated into ClojureScript.</aside>

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

What the above shows is that `Welcome` is not a child of `React.component` even though it has all the properties and methods that `React.Component` has.  This is why were lucky that React is smart about detecting [class vs. function components](https://overreacted.io/how-does-react-tell-a-class-from-a-function/).

Second, by `copying` rather than `linking` prototypes we could inccur a performance cost but again, in our case this cost is negligible.

## Conclusion

As you can see we took a journey into the weeds.  At a highlevel, the takeaway for me was that I was able to better understand some of the decision making processes that go into writing Reagent and React.

I felt that while this information is specific, it can be beneficial to both JavaScript and ClojureScript developers.

For the JavaScript developers, I imagine it is comforting to know that when you come to Reagent from React there are differences, but things are more familiar than it initially seems.

To the ClojureScript first developers, it is encouraging to know that everything is, generally speaking, React under the hood.  This is a comfort because when we are stuck we should know that we can lean on the JavaScript community to better understand how we can write and optimize our Reagent code.

As a final point, this again illustrates one of Clojures super powers:  It's hosted.  We have the advantage of being able to learn on the host languages, use their libraries and enhance when needed.

<aside>
  <h3>Footnotes</h3>
  <ol>
    <li id="reagent-components">
      This is <a class="blog-post__link" href="https://github.com/reagent-project/reagent/blob/master/doc/CreatingReagentComponents.md#final-note" target="_blank" rel="noopener noreferrer">briefly touched on</a> in Reagents component guide but they do not explicitly use the words <code class="gatsby-code-text">React class component</code> which means that it is easy to miss the implication of this point. Hence this blog post.
      <a href="#reagent-components-ref" aria-label="Back to content">↩</a>
    </li>
    <li id="reagent-components-are-cray">
      The part that blew my hair back was the process of understanding exactly what was happening to transform a Reagent component to a class component and then applying context to why they were doing it in the way they were.
      <a href="#reagent-components-are-cray-ref" aria-label="Back to content">↩</a>
    </li>
    <li id="javascript-es6-classes">
      It is important to note that even with ES6 class syntax JavaScript still does not have classes in the traditional sense.
      <a href="#javascript-es6-classes-ref" aria-label="Back to content">↩</a>
    </li>
  </ol>
</aside>
