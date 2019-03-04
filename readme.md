# SharedCodeEditor

This is a web based code editor library that wraps around the [Monaco Editor](https://microsoft.github.io/monaco-editor/) to support OTs and multi-user cursors.

## Available Scripts

Before running any scripts, install [Node](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/) on your system. 

To install all dependencies, run:

```bash
$ yarn install
```

To serve the example web page for development, run:

```bash
$ yarn start
```

Check out http://localhost:4000 on your web browser for the example page. 


To build the library, run:

```bash
$ yarn build
```

## How to use

### Basic usage

> *Check out [example web page](https://git.elicer.io/elice/shared-code-editor/blob/master/index.html) for development environment to see how to use the library with an interactive example web page.*

The easiest way to use SharedCodeEditor is to simply load the bundle script under `./lib` in the distribution. For example:

```html
<script src="lib/shared-code-editor.bundle.js"></script>
```

Having this script tag, a shared code editor instance can be created like this:

```javascript
var editor = monaco.editor.create(document.getElementById('editor'), {});
var sceditor = new SharedCodeEditor(editor);
```

If you want to use SharedCodeEditor in CommonJS environment, you can require the SharedCodeEditor class from `./lib/shared-code-editor.js`. For example:

```javascript
var SharedCodeEditor = require('shared-code-editor/lib/shared-code-editor.js').default;
```

or with `import` syntax, 

```javascript
import Elixercise from 'shared-code-editor/lib/shared-code-editor.js';
```

For a working example, run `$ yarn start` script and check out the example web page. This shows the `./index.html` file rendered on the browser with all dependencies ready.
