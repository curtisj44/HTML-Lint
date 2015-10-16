(function (htmlLint) {
	'use strict';

	htmlLint.utility = {
		css: '//' + ((document.getElementById('html-lint-js').getAttribute('src').indexOf('?dev') > 0) ? 'dl.dropbox.com/u/8864275' : 'curtisj44.github.io') + '/HTML-Lint/html-lint.css',

		error: function (message) {
			return '<span class="html-lint-error">' + (message || 'missing tag') + '</span>';
		},

		jQueryAdded: false,

		jQuery: ['1.11.3', '2.1.4'],
		jQueryUI: '1.11.2',
		Modernizr: '3.1.0',
		MooTools: '1.5.1',
		RequireJS: '2.1.15'
	};

	// TODO - organize this better
	htmlLint.preInit();

}(window.htmlLint = window.htmlLint || {}));