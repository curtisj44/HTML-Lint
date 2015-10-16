(function (htmlLint) {
	'use strict';

	htmlLint.preInit = function () {
		var link,
			script;

		// Add CSS
		if (document.getElementById('html-lint-css') === null) {
			link = document.createElement('link');
			link.href = htmlLint.utility.css;
			link.id = 'html-lint-css';
			link.rel = 'stylesheet';
			document.body.appendChild(link);
		}

		// Add jQuery
		if (typeof jQuery !== 'undefined' && !!jQuery.fn && parseInt(jQuery.fn.jquery.replace(/\./g, ''), 10) > 164) {
			htmlLint.init();
		} else {
			htmlLint.utility.jQueryAdded = true;
			script = document.createElement('script');
			script.onload = htmlLint.init;
			script.id = 'html-lint-jquery';
			script.src = '//ajax.googleapis.com/ajax/libs/jquery/' + htmlLint.utility.jQuery[0] + '/jquery.min.js';
			document.body.appendChild(script);
		}
	};

	htmlLint.preInit();
}(window.htmlLint = window.htmlLint || {}));