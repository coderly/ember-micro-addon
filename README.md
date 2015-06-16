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

# Usage

Currently, ember-micro-addon can be used as a locally installed ember-addon, or as a locally and/or globally installed plain npm package.

## Usage as ember addon

Install it in a working folder

* `mkdir working_folder`
* `cd working_folder`
* `npm install --save-dev ember-micro-addon

Once these 3 steps are done, the `ember micro:x` command set is available. There are several commands it supports:

* `ember micro:component addon-name` creates a component micro-addon folder containing files listed in the previous section
* `ember micro:library addon-name` creates a library micro-addon
* `ember micro:helper addon-name` creates a helper micro-addon
* `ember micro:build addon-name` copies files from the `addon-name` folder into the folder `addon-name/dist`. Files are copied in a way that complies with the default ember-addon filestructure:
  * `index.js` and `package.json` go to the root,
  * `component.js` goes to `app/components`,
  * `template.hbs` goes to `app/templates/components`,
  * `style.css` goes to `addon/styles` so it gets merged into `vendor.css`
  * `helper.js` goes to `app/helpers
  * `library.js` goes to `app/lib`

## Usage as a plain npm package (preferred)

Install it in a working folder, or, preferably, as a global npm package:

* `npm install -g ember-micro-addon`

Once the package is installed globally, the `ember-micro:x` command set is available **from any location**. Note the added dash compared to the case of using it as an `ember-addon`

The command set behaves in the same way as the `ember micro:x` command set. The available commands are:

* `ember-micro:component addon-name`
* `ember-micro:library addon-name`
* `ember-micro:helper addon-name`
* `ember-micro:build addon-name`


