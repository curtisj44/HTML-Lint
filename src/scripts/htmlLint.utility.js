(function (htmlLint) {
	'use strict';

	htmlLint.utility = {
		css: 'https://curtisj44.github.io/HTML-Lint/dist/html-lint.min.css',

		error: function (message) {
			return '<span class="html-lint-error">' + (message || 'missing tag') + '</span>';
		},

		jQueryAdded: false,

		jQuery: ['1.12.4', '3.0.0'],
		jQueryUI: '1.12.0',
		Modernizr: '3.3.1',
		MooTools: '1.6.0',
		RequireJS: '2.2.0'
	};

	// TODO - organize this better
	htmlLint.preInit();

}(window.htmlLint = window.htmlLint || {}));
