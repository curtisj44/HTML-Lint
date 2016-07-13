# HTML-Lint

HTML-Lint is a tool designed to supplement HTML validation by identify coding practices that pass validation, but are less than ideal.

## How to Use:

### Option 1: Bookmarklet

1. Copy the code below:

  ```js
  javascript: (function(){'use strict';var script = document.createElement('script');script.src = 'https://curtisj44.github.io/HTML-Lint/dist/htmlLint.min.js';script.id = 'html-lint-js';document.body.appendChild(script);}());
  ```

1. Create a new bookmark.
1. Set the name to “HTML-Lint” and paste the above as the URL.

### Option 2: CLI

![Sample verbose output](cli-output-verbose.jpg)

Available on NPM: [npmjs.com/package/html-lint](https://www.npmjs.com/package/html-lint): `npm install html-lint -g`.

#### Usage

```
html-lint <url> <filename>
```

#### Options

```
--verbose    Enable verbose output
```

#### Examples

```
html-lint http://www.google.com
html-lint http://www.google.com --verbose
html-lint http://www.google.com foo
```

---

## Development

### Getting Started

1. Have the following requirements installed: [Node](http://nodejs.org/), [NPM](https://www.npmjs.org/), and [PhantomJS](http://phantomjs.org/)
1. Clone the repo: `git clone https://github.com/curtisj44/HTML-Lint.git`
1. Run `npm install`
1. Run `gulp`

### Tasks

- `gulp` → compiles Sass to CSS, concatenates JS, minifies CSS and JS, and watches
- `gulp watch` → runs default `gulp` task and then watches for changes

<!--
### Publishing

Poorly hidden notes to myself:

1. Run `npm version <update_type>` to bump the version and tag the release
1. Merge `master` into `gh-pages` to update the bookmarklet
1. Run `npm publish` to push the latest to NPM
-->
