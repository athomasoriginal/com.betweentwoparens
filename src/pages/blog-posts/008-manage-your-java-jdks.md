---
title: 'Manage your Java JDKs'
datePublished: '2020-01-31'
dateModified: '2020-03-24'
slug: jenv
summary: Live like Jay
author: 'Thomas Mattacchione'
---

Pro tip for anyone working with _any_ programming language: seek out a language version management tool.

All it takes is a [CI] environment running a different version of your programming language and the world goes Pete Tong.

It's for this reason that I always manage my programming languages with a language version manager.  If you're using JavaScript, [nvm] is a great option, Ruby has [rvm] and for Clojure developers we have [tools.deps] for managing versions of Clojure and [jEnv] for managings our JDKs.

## Why Version Management Tools

With every line of code we write, we're making assumptions. We assume that our code will run in specific environment(s) and work in a particular way.  The longer we play the game, the clearer we see that these assumptions are traps.

A possible solution is to agree on standards.  We say that our software _will_ work on specific versions of a language and in specific environments.  Then we work to back this guarantee.  There is also another side to this coin. Something unexpected happens and our standards are betrayed and we have to figure out why.

It's for these reasons that we have language version management tools.  They allow us to quickly and easily manage (add, switch, remove et al.) the versions of our programming languages.  This enables us to better debug and fortify our code.  Example scenarios where I've  had to switch language versions:

- Debugging CI environments
- Resolving "works on my machine" events
- Regression testing an app or library
- Switching between multiple projects with different language version requirements

As you can imagine, this is a common software development problem and for every language it's handled in a different, but similar way.  In the case of Clojure, there two things we have to manage:  versions of Clojure and versions of the JDK.  This post is going to focus on managing versions of the JDK with the help of `jEnv`.

`jEnv` is a tool that allows you to manage your Java JDK installations.  It's focus is on allowing you to easily switch between versions of the JDK.  One thing to note is that this tool does not allow you to install a JDK.  You have to do this separatley.  Further, while the process to setup `jEnv` is straightforward, there are some gotchas which is why i'm writing this guide.

## Installing jEnv

<aside class="blog-content__note">Please note that at the time of this writing I have two versions of the JDK installed right now: <strong>AdoptOpenJDK 11</strong> and <strong>AdoptOpenJDK 13</strong>.  I'm also running MacOS 10.15.2.  If you are using a different OS please head over to <a class="blog-content__link" target="_blank" rel="noopener noreferrer" href="https://www.jenv.be/">The official jEnv guide</a> to see how to install <code class="gatsby-code-text">jEnv</code> on linux.</aside>

The first thing we have to do is install `jEnv`.

```bash
brew install jenv
```

<aside class="blog-content__note">The above is actually the only step that is different for linux.  So macos and linux users can follow everything that comes next together</aside>

and now let's do a sanity check to see if it's installed correctly.  Run:

```bash
jenv doctor
```

and if the above worked you should see something like this:

```shell{numberLines: true}
[ERROR]	Java binary in path is not in the jenv shims.
[ERROR]	Please check your path, or try using /path/to/java/home # ...
[ERROR]	Jenv is not loaded in your zsh
[ERROR]	To fix : cat eval "$(jenv init -)" >> /Users/# ...
```

<aside class="blog-content__note">Note that the above output is truncated because I am choosing to focus on what I consider the important details.  Further, the pieces I truncated may be specific to my machine.  For example, i'm using <code class="gatsby-code-text">zsh</code>.  If you're using <code class="gatsby-code-text">bash</code>, then your output on line 3 will read <code class="gatsby-code-text">bash</code>.  Everything truncated is identified with <code class="gatsby-code-text"># ...</code></aside>

Assuming the above worked, we can move onto actually configuring `jEnv`.  This means that the next step is to add `jEnv` to our `PATH`.

To do this, we have to add some code to our shell configuration file.  Now, if you'r not sure which shell you're running, that's fine, I will assume we don't know.  This means that our next step is to find out which shell we are using is run the following command:

```shell
echo $0
```

If you are using `bash`, the above will print out `-bash` and if you're using `zsh` the above will print out `-zsh`.  Once you discover which shell you are using, please choose the associated code block below and run the code inside of it line by line:

<aside class="blog-content__note">In other words, you only have to run the code from <strong>one</strong> of the following blocks</aside>

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

again, the output has changed indicating that we are moving along.  At this point, `jEnv` is setup and the last item on our list is to install a Java JDK.  If you don't have one installed checkout [AdoptOpenJDK]

## Add a JDK to jEnv

Not sure if you have a Java JDK installed?  No worries, we will find out together!  What we can do is run the following command which is going to tell us where our Java JDK's are installed. So, run this command:

```bash
/usr/libexec/java_home -V
```
<aside class="blog-content__note">Note that the <code class="gatsby-code-text">V</code> above is uppercase.</aside>

and that will print something like this:

```bash
Matching Java Virtual Machines (2):
    13.0.2, x86_64:	"AdoptOpenJDK 13"	/Library/Java/JavaVirtualMachines/adoptopenjdk-13.jdk/Contents/Home
    11.0.6, x86_64:	"AdoptOpenJDK 11"	/Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home
```

If you see something like the above, where your JDK's are listed out, it means you have one installed and can continue on with this section.

<aside class="blog-content__note">Also note that the above is specific to me.  So while you may have JDk's installed, they may be different distributions and versions compared to mine.</aside>

Now we can go ahead and add JDK's to `jEnv` so it can manage them for us.  Run the following command

```bash
jenv add /Library/Java/JavaVirtualMachines/adoptopenjdk-13.jdk/Contents/Home
```

<aside class="blog-content__note">Again, the path you use might be different.  The trick to finding the path you need to provide <code class="gatsby-code-text">jenv add</code>  is to use the path after each JDK name.  e.g. <code class="gatsby-code-text">"AdoptOpenJDK 13"</code> is followed by a path.  Copy that and provide it to the <code class="gatsby-code-text">jenv add</code> command</aside>


When you run the above, you will see something like this returned:

```bash
openjdk64-13.0.2 added
13.0.2 added
13.0 added
```

As a sanity check, we can run `jenv versions` to see if `jEnv` knows about our JDK:

```bash
* system (set by /Users/thomasmattacchione/.jenv/version)
  13.0
  13.0.2
  openjdk64-13.0.2
```

Great, but remember how I have two JDK's installed?  The above indicates that only one of them is being managed by `jEnv`.  This means I have to run through the above step again to have `jEnv` know about the other version of the JDK I have installed.  So, let's repeat those steps:

```bash
jenv add /Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home
```

again we get our success output

```bash
openjdk64-11.0.6 added
11.0.6 added
11.0 added
```

and when we check versions available now by running `jenv versions` we have both 11 and 13 available to us:

```shell
* system (set by /Users/thomasmattacchione/.jenv/version)
  11.0
  11.0.6
  13.0
  13.0.2
  openjdk64-11.0.6
  openjdk64-13.0.2
```

## Set a JDK version via jEnv

As a final step, we want to actualy set a JDK to be the one we use.  You have two options for this: `jenv local` and `jenv global`.

`jenv local` is going to set your JDK of choice for your current terminal session.  `jenv global` is going to set your chosen JDK as the default for all terminal sessions.  For now, let's set a global version.  In my case, i'm going to set my `jenv global` to `AdoptOpenJDK 11` like this:

```shell
jenv global 11.0.6
```

Now, in order for the above to take effect, we have to open a new terminal window.  Once you open a new terminal window run the following command to be sure our specified version of Java was set:

```shell
java -version
```

and you should see something like this:

```shell
openjdk version "11.0.6" 2020-01-14
OpenJDK Runtime Environment AdoptOpenJDK (build 11.0.6+10)
OpenJDK 64-Bit Server VM AdoptOpenJDK (build 11.0.6+10, mixed mode)
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
[AdoptOpenJDK]: https://adoptopenjdk.net/
