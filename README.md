# Ember-micro-addon

The concept of ember-micro-addons is to quickly define a small ember-addon in a flat file structure.

Specifically, for **components**, this would mean that a component addon would consist of

* package.json
* index.js
* component.js
* template.hbs
* style.css

For **libraries**, the addon would consist of

* package.json
* index.js
* library.js

Lastly, for **helpers**, the addon consists of

* package.json
* index.js
* helper.js

Thanks to the contents of `index.js` this addon can be installed and used from an ember app. To follow convention, it is also possible to "build" the addon so it gets a proper, conventional ember-addon file structure by running a single command.

# What is ember-micro-addon useful for?

Let's say I'm writing an Ember-CLI application.

I made a component and it turned out pretty ok. It also turned out to be something other people might want to use. It's not completely done yet, but I can see the potential.

## How do I turn that component into an Ember addon?

Usually, we would do a couple of things.

First, we create a new ember addon in some folder somewhere, using the `ember addon` command provided by Ember-CLI.

Then, we copy the existing component code into a proper addon structure.
* `my-app/app/components/my-component.js` goes to `my-component/addon/components/my-component.js`
* `my-component/app/components/my-component.js` needs to be created and needs to import-export the component from the addon folder
* `my-app/app/templates/components/my-component.hbs` needs to go to `my-component/app/templates/components/my-component.js
* We need to link the addon with the addon to the app to continue using it
  *We can use `npm link` to link it symbolically
  *We can publish the addon and link it from a repo
  *We can install the addon from a local folder

Couple of possible issues with all of this
* It's complicated and takes a while
* The structure we need to create, while being the convention, seems a bit complex for just a tiny component

## What `ember-micro-addon` allows us to do

### Extract a component, library or helper out of an application into a separate addon

Let's say we have our app in `~/git/my-app` and we're currently in that folder.

We type in `ember-micro:extract component my-component`. In about a second, there's a new folder `~/git/my-component` and it has a fully working ember addon containing our component. We can also do the same with a library or a helper.

### Use a simplified, flat file structure

Additionally, the structure of the addon folder is simplified:
* For components, we have `package.json`, `index.js`, `component.js`, `style.css` and `template.hbs` all in the root of the addon folder.
* For libraries, we just have `package.json`, `index.js` and `library.json`
* For helpers, we just have `package.json`, `index.js` and `helper.json`

The structure is not conventional but it _just works_ out of the box.

### Publish the micro-addon as a git repository on GitHub

What if we want to quickly make our addon available online somewhere?

We position ourselves to `~/git/` and run `ember-micro:publish my-component`. We will get prompted for our GitHub credentials and within seconds, our addon will become a proper local git repository and then get pushed to a remote repository of the same name on our GitHub account. It is now available for everyone to use.

### Convert the flat file structure into a fully-fledged ember addon structure

If we ever want to convert our addon to a proper ember-addon structure, we can still do it. We simply move to `~/git` where our addon folder currently is and we run `ember-micro:build my-component`. A new folder will be created, `~git/my-component/dist` containing our addon in the conventional ember addon format, with all files in their proper place.

# Example: Extracting a component from an Ember-CLI application

Let's assume we have an ember app located at `~git/my-ember-app`. Within that app, there is a small custom button component called `my-button`. We want to **quickly extract it into a micro addon**.

From the app folder, we execute `ember-micro:extract component my-button` and that's it.

There is now a new folder, `~/git/my-button` containing the component structured as a micro addon.

It contains
* `index.js` - the addon's entry file. Works the same way as it does with a regular ember addon, except it contains some special hooks which make it work in an app with the custom, flat file structure.
* `component.js`
* `template.hbs`
* `style.css`


We can now include that micro-addon in our app as a dependency, and it will work. We can do this by either 
* linking the folder using [`npm link`](https://docs.npmjs.com/cli/link), 
* installing the addon from a local folder using `npm install ~/git/my-button`

We can also go a step further and **publish the addon to GitHub**.

For that, we move to the parent folder, `~/git/` and execute `ember-micro:publish my-button`. We will be prompted for our GitHub username and password and a few seconds later, the addon will be published under our username to GitHub.

# General instructions

Install the npm package in a working folder, or, globally, which is preferred:

* `npm install -g ember-micro-addon`

Once the package is installed globally, the `ember-micro:x` command set is available **from any location**.

The available commands are:

* `ember-micro:extract <component|library|helper> addonName` - extract a component, helper or library from an existing Ember app into a stand-alone micro-addon
* `ember-micro:component addon-name` creates a component micro-addon folder containing files listed in the previous section
* `ember-micro:library addon-name` creates a library micro-addon
* `ember-micro:helper addon-name` creates a helper micro-addon
* `ember-micro:build addon-name` copies files from the `addon-name` folder into the folder `addon-name/dist`. Files are copied in a way that complies with the default ember-addon file structure:
  * `index.js` and `package.json` go to the root,
  * `component.js` goes to `app/components`,
  * `template.hbs` goes to `app/templates/components`,
  * `style.css` goes to `addon/styles` so it gets merged into `vendor.css`
  * `helper.js` goes to `app/helpers
  * `library.js` goes to `app/lib`
