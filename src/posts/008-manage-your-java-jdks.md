---
author: "Thomas Mattacchione"
createdDate: '01 January 2020'
updatedDate: '24 April 2024'
date: Last Modified
layout: post
tags:
  - post
title: "Manage your Java JDKs"
permalink: blog/jenv/index.html
canonical: true
summary: "Live like Jay."
---

Pro tip for anyone working with _any_ programming language: Find a clean and easy
way to switch versions of your programming language of choice.

All it takes is a [CI] environment running a different version of your
programming language and the world goes Pete Tong.

My approach is to use a language version manager.  If you're using JavaScript,
[nvm] is a great option, Ruby has [rvm] and for Clojure developers we have
[tools.deps] for managing versions of Clojure and [jEnv] for managing our JDKs.

:::note
Some languages, Clojure included, don't need a tool for this.
:::

## Why Version Management Tools

Version management tools allow us to quickly and easily manage (add, switch,
remove et al.) the version of our programming languages. This enables us to
easily test our code against different languages.  Example scenarios where I've
had to switch language versions:

- Debugging CI environments
- Resolving "works on my machine" issues
- Regression testing an app or library against an older version of a language
- Switching between multiple projects with different language version requirements

The need to do this exists with all programming languages.  Some languages
are easier to do this with than others.  For example, with Clojure you don't
need a tool, you just use [tools.deps] to specify the version of the language
you want to use.  With Java, it's more complicated so I use a tool called `jEnv`.

`jEnv` is a tool that allows you to manage your Java JDK installations.  It
you switch between versions of the JDK.  One thing to note is that this tool
does not allow you to install a JDK.  You have to do this separatley.  Further,
while it's straightforward to setup `jEnv`, there are some gotchas
which is why i'm writing this guide.

## Install jEnv

::: note
Please note that at the time of this writing I have two versions of the JDK
installed right now: **AdoptOpenJDK 11** and **AdoptOpenJDK 13**.  I'm also
running MacOS 10.15.2.  If you are using a different OS please head over to
[The official jEnv guide] to see how to install `jEnv` on linux.
:::

The first thing we have to do is install `jEnv`.

```bash
brew install jenv
```

::: note
The above is actually the only step that is different for linux.  So macos and
linux users can follow everything that comes next together
:::

and now let's do a sanity check to see if it's installed correctly.  Run:

```bash
jenv doctor
```

and if the above worked you should see something like this:

```shell
[ERROR]	Java binary in path is not in the jenv shims.
[ERROR]	Please check your path, or try using /path/to/java/home # ...
[ERROR]	Jenv is not loaded in your zsh
[ERROR]	To fix : cat eval "$(jenv init -)" >> /Users/# ...
```

::: note
Note that the above output is truncated because I'm choosing to focus on what
I consider the important details.  Further, the pieces I truncated may be
specific to my machine.  For example, i'm using `zsh`.  If you're using `bash`,
then your output on line 3 will read `bash`.  Everything truncated is
identified with `# ...`.
:::


## Configure jEnv

Assuming the above worked, we can now configure `jEnv`.  The next step is to
add `jEnv` to our `PATH` by updating our configuration file.

To do this, you need to know which `shell` you're running.  Type the following
into your terminal to figure out the `shell` you're running:


```shell
echo $0
```

If you are using `bash`, the above will print out `-bash` and if you're using
`zsh` the above will print out `-zsh`.  Once you discover which `shell` you are
using, please choose the associated code block below and run the code inside of
it line by line:

::: note
You only have to run the code from **one** of the following blocks
:::

**zsh shell**

```shell
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(jenv init -)"' >> ~/.zshrc
```

**bash shell**

```bash
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(jenv init -)"' >> ~/.bashrc
```

Now we can once again run a sanity check:

```shell
jenv doctor
```

Which will return something like this:

```shell
[OK]	No JAVA_HOME set
[ERROR]	Java binary in path is not in the jenv shims.
[ERROR]	Please check your path, or try using /path/to/java/home #...
[OK]	Jenv is correctly loaded
```

As you can see, we now have two less errors.  We're making progress!  From here, we want to run the following:

```bash
jenv enable-plugin export
exec $SHELL -l
```

and now running `jenv doctor` returns this:

```bash
[OK]	JAVA_HOME variable probably set by jenv PROMPT
[ERROR]	Java binary in path is not in the jenv shims.
[ERROR]	Please check your path, or try using /path/to/java/home #...
[OK]	Jenv is correctly loaded
```

At this point, `jEnv` is setup and the last item on our list is to install a
Java JDK.  If you don't have one installed checkout [Adoptium]

## Add a JDK to jEnv

Not sure if you have a Java JDK installed?  No worries, we'll find out
together!

Run the following command in your terminal to see which Java JDKs we have installed.

```bash
/usr/libexec/java_home -V
```

::: note
Note that the `V` above is uppercase.
:::

and that will print something like this:

```bash
Matching Java Virtual Machines (2):
    21.0.3 (arm64) "Eclipse Adoptium" - "OpenJDK 21.0.3" /Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
    17.0.11 (arm64) "Eclipse Adoptium" - "OpenJDK 17.0.11" /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
```

If you see something like the above, it means you have at least one Java JDK
installed and you can continue on with this section.

::: note
Also note that the above is specific to me.  So while you may have JDk's installed, they may be different distributions and versions compared to mine.
:::

Now we can go ahead and add JDK's to `jEnv` so it can manage them for us.  Run the following command

```bash
jenv add /Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
```

::: note
Again, the path you use might be different.  The trick to finding the path you need to provide `jenv add` is to use the path after each JDK name.  e.g. `"AdoptOpenJDK 13"` is followed by a path.  Copy that and provide it to the `jenv add` command.
:::


When you run the above, you will see something like this returned:

```bash
temurin64-21.0.3 added
21.0.3 added
21.0 added
21 added
```

As a sanity check, we can run `jenv versions` to see if `jEnv` knows about our JDK:

```bash
* system (set by /Users/username/.jenv/version)
  21
  21.0
  21.0.3
  temurin64-21.0.3
```

Great, but remember how I have two JDK's installed?  The above indicates that
only one of them is being managed by `jEnv`.  This means I have to run through
the above step again to have `jEnv` know about the other version of the JDK I
have installed.  So, let's repeat those steps:

```bash
jenv add /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
```

again we get our success output

```bash
temurin64-17.0.11 added
17.0.11 added
17.0 added
17 added
```

and when we check versions available now by running `jenv versions` we have both 11 and 13 available to us:

```shell
* system (set by /Users/username/.jenv/version)
  17
  17.0
  17.0.11
  21
  21.0
  21.0.3
  temurin64-17.0.11
  temurin64-21.0.3
```

:::note
`username` in the `system` path is my actual username, but I changed it here
to avoid confusion
:::

## Set a JDK version via jEnv

As a final step, we want to actualy set a JDK to be the one we use.  You have two options for this: `jenv local` and `jenv global`.

`jenv local` is going to set your JDK of choice for your current terminal session.  `jenv global` is going to set your chosen JDK as the default for all terminal sessions.  For now, let's set a global version.  In my case, i'm going to set my `jenv global` to `AdoptOpenJDK 11` like this:

```shell
jenv global 21.0.3
```

Now, in order for the above to take effect, we have to open a new terminal window.  Once you open a new terminal window run the following command to be sure our specified version of Java was set:

```shell
java -version
```

and you should see something like this:

```shell
openjdk 21.0.3 2024-04-16 LTS
OpenJDK Runtime Environment Temurin-21.0.3+9 (build 21.0.3+9-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.3+9 (build 21.0.3+9-LTS, mixed mode)
```

That's  everything involved in setting a `global` version of JDK through `jEnv`.

## Uninstalling Jenv

If for any reason you feel like something went wrong while installing `jenv`, or maybe you just don't like `jEnv` and you want to cleanup your environment the following steps will help you remove it.

```bash
brew uninstall jenv
```

Remove the `.jenv` directory

```bash
rm -rf ~/.jenv
```

remove the `PATH` and init script we added to our shell (either `bash` or `zsh`)

That's everything involved in setting up and working with Jenv.  I hoped this helped.


[CI]: https://www.thoughtworks.com/continuous-integration
[nvm]: https://github.com/nvm-sh/nvm
[rvm]: https://rvm.io/
[tools.deps]: https://github.com/clojure/tools.deps.alpha
[jEnv]: https://www.jenv.be/
[Why Version Management Tools]: #why-version-management-tools
[Installing jEnv]: #installing-jenv
[Add a JDK to jEnv]: #add-a-jdk-to-jenv
[Set a JDK version via jEnv]: #set-a-jdk-version-via-jenv
[Uninstalling jEnv]: #uninstalling-jenv
[Adoptium]: https://adoptium.net
[The official jEnv guide]: https://www.jenv.be/
