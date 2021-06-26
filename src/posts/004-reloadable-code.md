---
author: "Thomas Mattacchione"
createdDate: '29 September 2019'
date: Last Modified
layout: post
tags:
  - post
title: "Students of the Game: Reloadable Code"
permalink: blog/{{ title | slug }}/index.html
canonical: true
summary: "This is for the students of the game, the ones who want to reloadable code.."
---

About two years ago I built a small ClojureScript app that looks like this:

![calendar app](/images/004-01-calendar-app-intro.png)

::: note
The source code can be found [here].
:::

This app was meant to be a bite sized learning project to level up my ClojureScript interop skills.

Aside from being gorgeoous, it had only two things to do:

- User presses the `Add` button and `1` new `Calendar Event` is created
- User can see a `List` of `Calendar Events`

I started the app [as I always do](http://betweentwoparens.com/start-a-clojurescript-app-from-scratch) which includes running `figwheel` and `Hot Module Reloading` (HMR).  As I'm jamming away on the code I started to notice some interesting behaviour.

When I pressed the `Add` button, instead of `1` new `Calendar Event` being added, `5` were added!  I paused for a moment before hard refreshing the browser.  Then I clicked the `Add` button again.  Unlike the first time, everything worked as expected; only `1` new `Calendar Event` was added.  I smiled to myself and marvelled at my incredible detective skills: obviously the problem was `HMR`.

Since I _obviously_ identified the source of the problem I decided to resolve the issue by ignoring it.  So any time I made a change which triggered an `HMR` reload I would hard refresh the browser like a savage<a href="#full-savage" aria-describedby="footnote-label" id="full-savage-ref">.</a>

Some time later I realized that, no, the problem was not `HMR`...it was _my_ code.  As it turns out, `HMR` isn't free.  It requires the code author to design and build the code to be [reloadable code](https://figwheel.org/docs/reloadable_code.html).

So in the intrepid spirit of craftsmanship, I have resurected my Calendar App and refactored it to be `reloadable code`.

## Intro to Hot Module Reloading

`HMR` is when we have a special program running outside of our app.  The job of this program is to watch for changes to our `.cljs` files.  When our special program detects changes it will tell the browser that there are changes in our code, send those changes to the browser, and trigger a "reload" which means our running app is automatically updated with the new code and the app state is exactly where we left it<a href="#what-hmr" aria-describedby="footnote-label" id="what-hmr-ref">.</a>

The reason we do this is because:

- We don't like manually refreshing our browsers.
- We don't like losing our applications state
- We despise suffering through slow development feedback loops

But `HMR` is not a feature that comes with a language.  This is why we use "special programs" as I mentioned above.  Examples of these "special programs" are [figwheel](https://github.com/bhauman/figwheel-main), [shadow-cljs](https://github.com/thheller/shadow-cljs) or [webpack](https://webpack.js.org/)<a href="#build-tools" aria-describedby="footnote-label" id="build-tools-ref">.</a>

::: note
Each of the above tools does far more than just `HMR`, but `HMR` is one of their standout features.
:::

As I mentioned earlier, just because you use `figwheel` or `shadow-cljs` and the HMR mechanism they provide, does not mean you can take advantage of all the powers of HMR.  You first have to architect your code in a particular way.  Specifically, you have to control your side effects.  In other words, you have to write `reloadale code`.

::: note
The exception to the above paragraph is if you are using `React`.  If you use `React`, then HMR will pretty much work for free.  This article is for developers who want use HMR with their vanilla CLJS or JavaScript code.  Yet, even if you are writing `React` this article is still a good overview and will hopefully provide a deeper appreciation for the architectural decisions of React.
:::

Okay, now that we have reviewed what HMR is doing, lets dive into the code and transform it into `reloadable code`.

::: note
Again the [source code] is available and if you are following along, all you have to do to trigger a `reload` is save a `.cljs` file in the `src` dir.
:::

## "Submit" Event Listeners

If you save `calendar.cljs` 5 times and then press the `Add` button in the Calendar App you will see it creates 5 `Calendar Events`.

If we inspect the console we can see that there are actually 5 event listeners attached to the `submit` event.  So it seems that when we click `Add` 5 event handlers are fired one after the other<a href="#debugging-event-listeners" aria-describedby="footnote-label" id="debugging-event-listeners-ref">.</a>

Why is this happening?  As it turns out, if you look to the [code here](https://github.com/athomasoriginal/demo-reloadable-code/commit/b26c1aac8e9c9d6e2d5c7407cc1806dac9b92724#diff-9f16cf6f6db4d58c84ae2d61fd54ec7fR168):

```clojure
(events/listen
  (.. js/document (querySelector ".calendar-form"))
  "submit"
  handle-add-event!)
```

The code above is invoked in our `ns` meaning that it runs everytime a `reload` is triggered.  In other words, if you trigger 5 `reloads` it would be as if you wrote this:

```clojure
(events/listen element "submit" handle-add-event!)
(events/listen element "submit" handle-add-event!)
(events/listen element "submit" handle-add-event!)
(events/listen element "submit" handle-add-event!)
(events/listen element "submit" handle-add-event!)
```

Wait.  Didn't we say that each `reload` triggers a browser refresh?  Not exactly.  What we mean is that the ClojureScript in your app is sent to the DOM and re-run.  The effect makes it appear like the browser is refreshing.  Thus, triggering a `reload` updates your ClojureScript and re-runs your ClojureScript, but unlike your ClojureScript, whatever you did the DOM previously prior to a `reload` stays done.

This is why when we write reloadable code we have to control what we do to the DOM so we don't cause unexpected behaviours like 5 `Calendar Events` added at a time.

So how do we control what we do to the DOM to avoid these unpredictable side effects?  We write `reloadable code` and to do this we have to know two things:

1. when is our code going to reload?
2. when is our code going to finish reloading?

`figwheel`, as well as other programs, provides us with a mechanism so we can answer the above 2 questions and that mechanism looks like this:

```clojure
(defn ^:before-load teardown []
  ; ...do stuff
  )


(defn ^:after-load setup []
  ; ...do stuff
  )
```

Before we go further, lets breakdown what the above is doing.  `teardown` and `setup` are nothing more than clojure functions.  The only part we have to care about from the above are the `^:before-load` and `^:after-load` words that come before `teardown` and `setup`.

`^:before-load` and `^:after-load` are called [metadata](https://clojure.org/reference/metadata) in Clojure(Script).  What makes them `metadata`is the `^` that comes before the `:` (colon).

When figwheel sees these particular pieces of metdata infront of a function it knows that it has to run our functions before and after the CLJS reloads.

::: note
Please note that like any function you can rename `teardown` and  `setup` to whatever you like.
:::

Now that we know we can write code that runs before and after load we just have to figure out what we should put in these functions to make our code `reloadable code`.

Going back to the "submit" `event listener` scenario, the problem is that everytime our code reloads, a new `event listener` is attached to the "submit" event.  But what we want is to only have 1 `event listener`, the newest `event listener`, attached to our submit.  So what we need to make our code do:

- before reload: remove old "submit" event listener
- after reload: add new "submit" event listener

The following is what the above looks like in our code:

```clojure
; before reload: remove old "submit" event listener
(defn ^:before-load teardown []
  (events/removeAll
   (.querySelector js/document ".calendar-form")))

; after reload: add new "submit" event listener
(defn ^:after-load setup []
  (events/listen
    (.. js/document (querySelector ".calendar-form"))
    "submit"
    handle-add-event!))


(defonce initial-load (setup))
```

::: note
See the [code].
:::

What we did:

- `before-load` - figwheel is going to call our `teardown` function which deletes event listeners from `submit`
- `after-load` - figwheel is going to call our `setup` function which adds event listeners to `submit`

You might have also noticed that I snuck in a little something extra: `initial-load`.  Remember how we said that `before-load` happens before a reload and `after-load` happens after a reload?  This means those are _only_ triggered when a reload is triggered.  If we left it like that, our code would not work when we first visit the app.  So we add a `defonce` so that the code which runs on the  _first_, and only the first time, your app loads in the browser.

::: note
If you're following allong with the code, I encourage you to comment out `initial-load` and see what happens.  Also note that you do not need to call `setup` in `initial-load`, you could write a totally separate function.  I just did the above to keep the example cleaner
:::

With the above in place go ahead and try to trigger some reloads.  If everything worked, no matter how many time you trigger a reload only 1 `Calendar Event` should ever be created.

If you are lost at this point for any reason take comfort in the fact that writing `reloadable code` is not always straighforward and does require you to think deeply about what your code is doing.  This is a skill that can take some time to learn.


## "Change" Event Listeners

Here is the second opportunity for making our code `reloadable code`.  Similar to the "submit" example above, we are invoking another `event listener` in our file for the `change` event:

```clojure
(events/listen
  (.. js/document (querySelector "#event_start"))
  "change"
  update-event-end-dropdown!)
```

::: note
If you have the code infront stop for a moment.  Read the src code for `update-event-end-dropdown!` and try to see what the bug is.
:::

If you read the code, or even ran the code, you will see that this code is not a problem.  Yes, if we `reload` our app 5 times it would do this:

```clojure
(events/listen element "change" update-event-end-dropdown!)
(events/listen element "change" update-event-end-dropdown!)
(events/listen element "change" update-event-end-dropdown!)
(events/listen element "change" update-event-end-dropdown!)
(events/listen element "change" update-event-end-dropdown!)
```

But it's still not causing any bugs.  The reason is because the code inside of `update-event-end-dropdown!` is destructive and not performing an additive effect like "submit".  The worst that happens is that if we `reload` 5 times the `option` will get set 5 times because of `(.-innerHTML start-time-dropdown)`.

So if this is not a bug, then why talk about it?  Because even if the code is not causing problems now, it is stacking `event listeners` and if we change `update-event-end-dropdown!` to accidentally do something different, we are going to set ourselves up nicely for an interesting bug.

If neither of these arguments persuade you, that is fine and highlights the interesting part about writing `reloadable code`:  many elements of designing your code in this way are going to be subjective and based on how _you_ want your code to run.

Having said this, for this scenario I am going to play it safe and show you how we could fix the code:

```clojure
(defn ^:after-load setup []
  (events/listen
    (.. js/document (querySelector ".calendar-form"))
    "submit"
    handle-add-event!)

  (events/listen
    (.. js/document (querySelector "#event_start"))
    "change"
    update-event-end-dropdown!))
```

You can see the above change [here](https://github.com/athomasoriginal/demo-reloadable-code/commit/c87c9b13562856191c3374ffe521c5d97875f281).  In the next section we are going to explore more subjective goodness.


## Populating Dropdown Options

Reading [along with the code](https://github.com/athomasoriginal/demo-reloadable-code/blob/c87c9b13562856191c3374ffe521c5d97875f281/src/demo_reloadable_code/calendar.cljs#L188) in Calendar App, we have another invokation when the `ns` loads.

```clojure
(set! (.. start-time-dropdown -innerHTML) (time-option-list (time-range)))

(set! (.. end-time-dropdown -innerHTML) (time-option-list (time-range 9.25)))
```

All these do is populate the time options in our forms time dropdowns.  So the question is, if we run this multiple times in a row what happens?  Similar to the "change" event listeners, the above is performing a destructive action.  each time they are run they will delete the content of the `select` boxes and replace them with the same options.  Also, unlike `event listeners` these do not stack.  Will there be a bug?  What are the problems with this?

Each time we run this code, it clears out our dropdowns and re-adds options.  What if we put this in `initial-load`?  It would only run once meaning that if we made changes to `time-option-list` we would not see the effect take place.  But what if we know we are 100% done with `time-option-list`?  Perhaps we don't believe their will be more changes?  Maybe this justifies only putting it into the `initial-load`.

However, if you are in the camp that believe we should re-run this action just to be safe, then we can put it into the `initial-load` and `after-load`.  But if we do this there is something that could happen.  Imagine this is what I did:

- select a `start` and `end` time
- realize I need to make a change to the code
- change the code + trigger a `reload`

If we move the `time-option-list` inside the `after-load` everytime a `reload` is triggered we are going to lose our `start` and `end` time we selected.  We are losing app state.  If this is concerning to _you_, then it is not enough to add our `time-option-list` to the `after-load` we also have to add additional code to our app to potentially save the state of the application so we don't lose it.  I won't walk through what that looks like, as I wanted to bring it up as a lead to what makes `HMR` feel like magic:  app state.

## Managing App State

App State is a memory of what you did in the app.  When we trigger a reload we can make it so our add does not reset its app state.  For example, let's pretend I am working on my add, I add a few `Calendar Events` and trigger a reload.  Those `Calendar Events` I just added will be lost.  We go back to 0.  This does not have to be the case though.  We could tell our add to not reset the state.

To make this happen all you have to do, based on how I wrote Calendar App, is this:

```clojure
; update this line
(def app-state (atom []))

; to look like this
(defonce app-state (atom []))
```

That's it.  Now, whenever your app `reloads`, your state is never forgotten.  The way this works is explained nicely in [Hot Reload in ClojureScript](https://code.thheller.com/blog/shadow-cljs/2019/08/25/hot-reload-in-clojurescript.html).  The short answer: `defonce` means that `app-state` will not reset to `(atom [])` when the app `reloads`.

This is a simple example, but it should provide some ideas for what needs to be done to make our `reloadable code` capable of managing state.

## Conclusion

Writing `reloadable code` can seem tricky at first, but hopefully we can see that with ClojureScript it is an achievable and worthwhile goal.  For me the benefits of writing your code like this and even thinking about these things is the understanding you gain about how your code works.

The other gain is the power that ClojureScript gives you out of the box.  It take very little to setup HMR and start writing reloadable code with the tools provided by Clojure(Script) core library.  You don't need additional dependencies.

Hopefully this provides a decent example set with which to start your reloadable code journey.

<aside>
  <h3>Footnotes</h3>
  <ol>
    <li id="full-savage">
      In my head I was a heroic.  Crushing out code.  Delivering... I was a Titan in that moment.  The truth is this is savagery at its finest.
      <a href="#full-savage-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="what-hmr">
      Two points here: <strong>First,</strong> <code class="gatsby-code-text">HMR</code> is not specific to ClojureScript.  It can be done in JavaScript, C++ etc.  I am only referencing ClojureScript because that is the focus of this article.  These techiques can be shared 1:1 with JavaScript, but I have not tried yet.  <strong>Second,</strong> When I said that app state is exactly where we left it, this is <i>only</i> true when you setup your reloadable code to work this way. I write about this in the <a class="blog-content__link" href="#managing-app-state">Managing App State</a> section of this post.
      <a href="#what-hmr-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="build-tools">
      You do not use all of these tools, you only need to choose one.
      <a href="#build-tools-ref" aria-label="Back to content">Back</a>
    </li>
    <li id="debugging-event-listeners">
      If you like to debug using <code class="gatsby-code-text">console.log</code> statements you are going to run into a bug while debugging like this.  If you run the app, add a <code class="gatsby-code-text">console.log</code> to <code class="gatsby-code-text">handle-add-event!</code> and save you will trigger a reload.  Then, if you click the <code class="gatsby-code-text">add</code> button you will notice that even though you have 2 event listeners attached, only 1  <code class="gatsby-code-text">console.log</code> will fire.  This is because the first event listener has the old <code class="gatsby-code-text">handle-add-event!</code> function without the <code class="gatsby-code-text">console.log</code>.  So it will seem like your only 1 event listeners is firing.  You can verify this again by saving the file, without making changes, and now you should see 2 logs fire.
      <a href="#debugging-event-listeners-ref" aria-label="Back to content">Back</a>
    </li>
  </ol>
</aside>

[here]: https://github.com/athomasoriginal/demo-reloadable-code
[source code]: https://github.com/athomasoriginal/demo-reloadable-code
[code]: https://github.com/athomasoriginal/demo-reloadable-code/commit/ceb1ae2b907eb8c04befcb30c21e9bab81706000
