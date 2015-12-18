(function (htmlLint) {
	'use strict';

	htmlLint.utility = {
		css: 'https://curtisj44.github.io/HTML-Lint/dist/html-lint.min.css',

		error: function (message) {
			return '<span class="html-lint-error">' + (message || 'missing tag') + '</span>';
		},

		jQueryAdded: false,

		jQuery: ['1.11.3', '2.1.4'],
		jQueryUI: '1.11.2',
		Modernizr: '3.2.0',
		MooTools: '1.5.1',
		RequireJS: '2.1.22'
	};

	// TODO - organize this better
	htmlLint.preInit();

}(window.htmlLint = window.htmlLint || {}));
