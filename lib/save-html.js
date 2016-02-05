/* jslint node: true */
/* globals document, phantom, window */
'use strict';

// TODO: add note in README.md that this makes PhantomJS a required global dependency

// usage: `phantomjs lib/save-html.js http://s.codepen.io/curtisj44/debug/xbQXbV`
// usage: `phantomjs lib/save-html.js http://s.codepen.io/curtisj44/debug/xbQXbV test`

var
	fs = require('fs'),
	page = require('webpage').create(),
	system = require('system'),

	url = system.args[1],
	saveTo = system.args[2];

page.onLoadStarted = function () {
	// TODO: get this to output in time in `node html-lint`
	console.log('Loading page...');
};

page.open(url, function (status) {
	var
		html,
		js = page.evaluate(function () {
			return document;
		}),
		origin = page.evaluate(function () {
			return window.location.origin;
		});

	page.viewportSize = { width: 1024, height: 768 };
	page.render('temp/' + saveTo + '.png');

	if (status === 'success') {
		html = js.all[0].outerHTML

			// Resolve domain-agnostic paths
			.replace(/\="\/\//g, '="https://')
			.replace(/\='\/\//g, '=\'https://')

			// Resolve relative paths
			.replace(/\="\//g, '="' + origin + '/')
			.replace(/\='\//g, '=\'' + origin + '/');

		// TODO: get this to output in time in `node html-lint`
		console.log('Page loaded.');
	} else {
		console.log('Error: unable to load page.');
	}

	if (saveTo) {
		fs.write('temp/' + saveTo + '.html', html, 'w');
	} else {
		console.log(html);
	}

	phantom.exit();
});
