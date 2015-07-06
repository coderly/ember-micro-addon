# What is this library useful for?

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

### Extracting a component, library or helper out of an application into a separate addon

Let's say we have our app in `~/git/my-app` and we're currently in that folder.

We type in `ember-micro:extract component my-component`. In about a second, there's a new folder `~/git/my-component` and it has a fully working ember addon containing our component. We can also do the same with a library or a helper.

### Using a simplified, flat file structure

Additionally, the structure of the addon folder is simplified:
* For components, we have `package.json`, `index.js`, `component.js`, `style.css` and `template.hbs` all in the root of the addon folder.
* For libraries, we just have `package.json`, `index.js` and `library.json`
* For helpers, we just have `package.json`, `index.js` and `helper.json`

The structure is not conventional but it _just works_ out of the box.

### Publishing the micro-addon as a git repository on GitHub

What if we want to quickly make our addon availabe online somewhere?

We position ourselves to `~/git/` and run `ember-micro:publish my-component`. We will get prompted for our GitHub credentials and within seconds, our addon will become a proper local git repository and then get pushed to a remote repository of the same name on our GitHub account. It is now available for everyone to use.

### Convert the flat file structure into a fully-fledged ember addon structure

If we ever want to convert our addon to a proper ember-addon structure, we can still do it. We simply move to `~/git` where our addon folder currently is and we run `ember-micro:build my-component`. A new folder will be created, `~git/my-component/dist` containing our addon in the conventional ember addon format, with all files in their proper place. 
