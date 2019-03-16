---
title: 'What type of React Component is a Reagent Component?'
date: '2019-03-16'
slug: what-type-of-react-component-is-a-reagent-component
summary: What becomes of a Reagent component?
---

- [The Process](#the-process)
- [Inheriting Component](#inheriting-component)
- [A Reagent Class Component](#a-reagent-class-component)

In React, there are two ways to define a component. You can define it as as a `function component`

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}
```

or a `class component`

```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
```

In Reagent there are three ways to define a component. A `form-1` component

```clojure
(defn welcome [props]
  [:h1 (:name props)])
```

a `form-2` component

```clojure
(defn welcome []
  (fn [] [:h1 (:name props)]))
```

and finally, a `form-3` component

```clojure
(defn welcome
  (reagent/create-class
    {:reagent-render (fn [] [:h1 (:name props)])}))
```

> please note that I have simplified the above examples.

Of the three Reagent Components above, which is the equivalent of a `function component`? Would it surprise you to find out that none of the above would ever become a `function component` in Reagent?

As it turns out, that is exactly what happens. All of the Reagent component definitions above will be passed to React by Reagent as `class components`.

This article will explore how a Reagent Component will become a React class component and we will also highlight some interesting differences between a Reagent and a React `class component`.

> Please note that understanding Reagent at this level is not a requirement. You can still be productive and not know these things.

## The Process

The process of Reagent Components becoming Class Components can be seen through this minimal Reagent App:

```clojure
(defn Welcome []
  [:h1 "Hello, friend"])

(reagent/render [welcome] (.getElementById js/document "root")))
```

The process begins with `reagent/render`:

```clojure
(reagent/render [welcome] (.getElementById js/document "root")))
```

The first argument passed to `reagent/render` is a Reagent Component or, in our example, hiccup.

```clojure
[welcome]
```

During the `reagent/render` lifecycle, Reagent will pass the hiccup you provided to its hiccup compiler. The hiccup compiler is responsible for orchestrating the transformation of our Reagent Component to React `class components`. What this means is that Reagent is going to see the symbol in the first position of the hiccup form, `welcome`, and ultimatley pass it, and any other Reagent Components, to `create-class`.

## Inheriting Component

`create-class` as its name suggests, it what is going to turn our Reagent Component into a React Class Component. It is responsible for inheriting from and extending `React.Component`.

Here is a slimmed down version of what `create-class` does in Reagent:

```clojure
(defn cmp [props context updater])
    (this-as this
      (.call react/Component this props context updater)
      (when construct
        (construct this))
      this))]

(gobj/extend (.-prototype cmp) (.-prototype react/Component) class-methods))

(gobj/extend cmp react/Component static-methods)

(set! (.. cmp -prototype -constructor) cmp)
```

> modified for easier reading. see [original source here](https://github.com/reagent-project/reagent/blob/master/src/reagent/impl/component.cljs#L289)

I have to admit that the above example was a little confusing when I first saw it. Lets look at it again except this time in Javascript:

```javascript
function cmp(props, context, updater) {
  React.Component.call(this, props, context, updater)

  return this
}

goog.extend(cmp.prototype, React.Component.prototype, classMethods)

goog.extend(cmp, React.Component, staticMethods)

cmp.prototype.constructor = cmp
```

Makes sense now, right? It might if you experienced a JavaScript world before class syntax. Even so, the above might still be confusing because it deviates from the instantiation pattern it is modelled after: the pseudoclassical instantiation pattern.

For the uninitiated, the pseudoclassical instantiation pattern was designed to mimic class mechanisms in Javascript: `instantiation`, `inheritance` and `polymorphism`. This was and is a common pattern used by many of the "first generation" front end frameworks like Backbone and Google Closure Library. Understanding this, what is the point of it?

Javascript does not have classes. Classes are a common pattern used to structure ones code. The result was that a [series of instantiation](http://nick.balestra.ch/2015/classes-and-instantiation-patterns-in-javascript/) patterns were created to help developers structure their code using OOP patterns. This approach became pervasive enough, along with other reasons, that JavaScript would eventually introduce its own class syntax with the goal being to make it easier to write when compared to the pseudoclassical approach. That new syntax, in the context of React, looks like this:

```javascript
import { Component } from 'React'

class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
```

If you are a React developer or have embraced ES6, the above should be a welcome return to what we are used to in React as that is the most common way of writing a React `class component .

The thing is, the above is syntactic sugar. We could also write the above like this:

```javascript
import { Component } from 'React'

var Welcome = function(props, context, updater) {
  Component.call(this, props, context, updater)
}

Welcome.prototype = Object.create(Component.prototype)

Object.defineProperty(Welcome.prototype, 'constructor', {
  enumerable: false,
  writable: true,
  configurable: true,
  value: Welcome,
})

Welcome.prototype.render = function render() {
  return <p>Hello World</p>
}
```

Really? Before we move on lets prove this. We can use introspection to figure out the structure and behaviours available to our class instances. This means we can verify that an object is linked to another object (READ: that there is a "parent" and "child" relationship) and they have access to the same things.

```javascript
class Welcome extends Component {
  render() {
    console.log('ES Inheritance')
  }
}

// Introspection

var welcome = new Welcome()

Welcome.prototype instanceof React.Component // true
Object.getPrototypeOf(Welcome.prototype) === React.Component.prototype // true

welcome instanceof React.Component // is React.Component somewhere in the linkage?
welcome instanceof Welcome // is Welcome somewhere in the linkage?
Object.getPrototypeOf(welcome) === Welcome.prototype // prototype points to
React.Component.prototype.isPrototypeOf(welcome) // is Component is the ancestory?
Welcome.prototype.isPrototypeOf(welcome) // is Welcome is the ancestory?
```

```javascript
function Welcome(props, context, updater) {
  React.Component.call(this, props, context, updater)

  return this
}

Welcome.prototype = Object.create(React.Component.prototype)

Welcome.prototype.render = function() {
  return <h1>Hello</h1>
}

// Introspection

var welcome = new Welcome()

Welcome.prototype instanceof React.Component // true
Object.getPrototypeOf(Welcome.prototype) === React.Component.prototype // true

welcome instanceof React.Component // is React.Component somewhere in the linkage?
welcome instanceof Welcome // is Welcome somewhere in the linkage?
Object.getPrototypeOf(welcome) === Welcome.prototype // prototype points to
React.Component.prototype.isPrototypeOf(welcome) // is Component is the ancestory?
Welcome.prototype.isPrototypeOf(welcome) // is Welcome is the ancestory?
```

Now that we can be confident both of the above are _generally_ equivalent and you could safely pass either one as a component to React, we can see that the second code example above is familiar as that is what the `create-class` version is doing:

```javascript
import { Component } from 'React'

var cmp = function(props, context, updater) {
  React.Component.call(this, props, context, updater)

  return this
}

goog.extend(cmp.prototype, React.Component.prototype, classMethods)

goog.extend(cmp, React.Component, staticMethods)

cmp.prototype.constructor = cmp
```

Thus, the `create-class` is turning our components into `class components`. All components will go through this process which means that all Reagent Components will becomes `class components`.

There is a little more to this though. Yes, we are using the PseudoClassical instantiation pattern, but why does the Reagent version look a little off? Why the goog extend?

## A Reagent Class Component

To go back to the pseudoclassical pattern, there are three things you have to do to simulate inheritance. You start by creating the class constructor which inherits from the Parent class:

```javascript
var Welcome = function(props, context, updater) {
  Component.call(this, props, context, updater)
}
```

You then have to link your class to the object its based off of so our child class can inherit the behaviours (methods) of the parent class

```javascript
Welcome.prototype = Object.create(Component.prototype)
```

Finally, we rebuild the constructor

```javascript
Object.defineProperty(Welcome.prototype, 'constructor', {
  enumerable: false,
  writable: true,
  configurable: true,
  value: Welcome,
})
```

> Rebuilding the constructor is not required, but it allows us to use JavaScript introspection mechanisms: But in truth, its probably not going to be safe to rely on this mechanism in production javascript because it can be overwritten whether accidentally or on purpose.

The above is simlar to what Reagent was doing, but Reagent is still a little different. Instead of using `Object.create(Welcome)` which links the `Welcome` prototype to the `Component` prototype, the Reagent version uses `goog.extend`:

```javascript
goog.extend(cmp.prototype, React.Component.prototype, classMethods)
```

The above is going to copy every method and property of the `React.Component.prototype` object to the `welcome.prototype` object. Note that we said **copy** and not **link**. Is this a problem? we do spend sometime up front copying, but this is not an expensive task and at the end of the day we are copying to the prototype which means that all `welcome` Reagent Components will not be taking up extra memory.

Is there anything else that is different from the above? without linking the objects, if React were to test whether or not `Reagent` class component is an instance of `Component` using its built in introspection keywords, Reagent classes would never be identified as extending React.Component and thus React would not be able to identify it as a class component internally. This is exactly why an app would not be able to confidently rely on the `constructor` or things like that to verify if something is a class or not. But lets see what we mean:

```javascript
function Welcome(props, context, updater) {
  React.Component.call(this, props, context, updater)

  return this
}

var classMethods = {
  render: function() {
    return <h1>Hello</h1>
  },
}

extend(Welcome.prototype, React.Component.prototype, classMethods)

extend(Welcome, React.Component)
```

> The above is a rough approximation of what what Reagent is doing. Please visit google closure to see [implementation details for goog.extend](https://github.com/google/closure-library/blob/master/closure/goog/object/object.js#L607).

You can feed the above to React and it will work. Weve defined a `render` function and `Welcome` has all the properties and methods from `Component`. The thing is, let's go through our battery of introspection tests.

```javascript
// 1
// false - not a child of component
console.log(Welcome.prototype instanceof React.Component)
// false - Welccome contstructor is not connected to React.Component
console.log(
  Object.getPrototypeOf(Welcome.prototype) === React.Component.prototype
)

// 2
// false - not an instance of Component
console.log(welcome instanceof React.Component)
// true - okay, welcome is in the relationship chain
console.log(welcome instanceof Welcome)
// true - prototype point to Welcome
console.log(Object.getPrototypeOf(welcome) === Welcome.prototype) // prototype points to
// React.Component not in the ancestory
console.log(React.Component.prototype.isPrototypeOf(welcome)) // is Component is the ancestory?
// Welcome is in the ancestory
console.log(Welcome.prototype.isPrototypeOf(welcome)) // is Welcome is the ancestory?
```

What does the above mean? In Javascript, if you used introspection, one would come away thinking that `welcome` is not inheriting from Component. It will never show up in its ancestry.

The end result is that all Reagent Components are class components and even so, they are are a little different from React class components. Where this becomes interesting is React recently introduced Hooks. Hooks are a way to use state in your applications without using React `Class Components`.

This is important for Reagent users because Hooks can only be used with React `Function Components`. This point has resulted in core React team member diving into the question of detailing how React [differentiates `function` and `class` components](https://overreacted.io/how-does-react-tell-a-class-from-a-function/) and also [a difference in class and function component capabilities](https://overreacted.io/how-are-function-components-different-from-classes/).

# Footnotes

<aside>
  <h2>Footnotes</h2>
  <ol>
  <li id="footnote-react-wrapper">
    For those curious about the actual react functions wrapped by Reagent at the time of this article are
    <a href="https://github.com/reagent-project/reagent/blob/88e9833be9c3135548d7028ffd84d88a0a0489/src/reagent/impl/component.cljs#L5" target="__blank">children.toArray</a>,
    <a href="https://github.com/reagent-project/reagent/blob/88e9833be9c3135548d7028ffd84d88a0a0489/src/reagent/core.cljs#L45" target="__blank">createElement</a>,
    <a href="https://github.com/reagent-project/reagent/blob/88e9833be9c3135548d7028ffd84d88a0a0489/src/reagent/impl/component.cljs#L308" target="__blank">component</a>,
    <a href="https://github.com/reagent-project/reagent/blob/88e9833be9c3135548d7028ffd84d88a0a0489/src/reagent/impl/template.cljs#L30" target="__blank">fragment</a>
    <a href="#footnote-react-wrapper-ref" aria-label="Back to content">↩</a>
  </li>

  <li id="footnotes">
    At the time of writing Hooks are still new.  They also did not inform the writing of Reagent so if the goal is to understand Reagent a little better lets focus on a world without hooks.
    <a href="#footnotes-ref" aria-label="Back to content">↩</a>
  </li>

  </ol>
</aside>

> How can you go about verifying these assertions? Download React. Follow the contributor guidelines and use the `dev.html` in the `packaging/babel-standalone` package for a minimal test environment.
