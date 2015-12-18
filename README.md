# HTML-Lint

HTML-Lint is a code quality bookmarklet designed to supplement HTML validation by identify coding practices that pass validation, but are less than ideal.

## How to Use:

1.	Copy the code below:

	```javascript
	javascript: (function(){'use strict';var script = document.createElement('script');script.src = 'https://curtisj44.github.io/HTML-Lint/dist/htmlLint.js';script.id = 'html-lint-js';document.body.appendChild(script);}());
	```

2.	Create a new bookmark.

3.	Set the name to “HTML-Lint” and paste the above as the URL.


## Development

### Getting Started

1. Have the following requirements installed: [Node](http://nodejs.org/) and [NPM](https://www.npmjs.org/)
1. Clone the repo: ```git clone https://github.com/curtisj44/HTML-Lint.git```
1. Run ```npm install```
1. Run ```gulp```

### Tasks

- ```gulp``` → compiles Sass to CSS and concatenates JS
