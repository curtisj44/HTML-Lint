HTML-Lint
=========

HTML-Lint is a code quality bookmarklet designed to supplement HTML validation by identify coding practices that pass validation, but are less than ideal.


How to Use:
-----------

###On desktop:

1.	Drag this link to your bookmarks toolbar or add it to your favorites:

	<a href="javascript:(function(){'use strict';var script=document.createElement('script');script.src='https://raw.github.com/curtisj44/HTML-Lint/master/html-lint.js';script.id='html-lint-js';document.body.appendChild(script);}());">HTML-Lint</a>


###On mobile:

1.	Copy the code below:

	```javascript
	javascript: (function(){'use strict';var script = document.createElement('script');script.src = 'https://raw.github.com/curtisj44/HTML-Lint/master/html-lint.js';script.id = 'html-lint-js';document.body.appendChild(script);}());
	```

2.	Bookmark any URL.

3.	Edit that new bookmark: Set the name to 'HTML-Lint' and paste the above as the URL.



<!--
What it tests:
--------------

Coming soon...

-->