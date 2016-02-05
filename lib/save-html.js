/* jslint node: true */
/* globals document, phantom, window */
'use strict';

// TODO: add note in README.md that this makes PhantomJS a required global dependency
// run: `phantomjs lib/save-html.js http://s.codepen.io/curtisj44/debug/xbQXbV`
// run: `phantomjs lib/save-html.js http://s.codepen.io/curtisj44/debug/xbQXbV test`

var
	fs = require('fs'),
	page = require('webpage').create(),
	system = require('system'),

	url = system.args[1],
	saveTo = system.args[2];

page.onLoadStarted = function () {
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

		// console.log('-----------------------------------------------------');
		// // console.log(window.location.origin);
		// // console.log(JSON.stringify(js));
		// // console.log(JSON.stringify(js.all[0].origin));
		// console.log(origin);
		// console.log('-----------------------------------------------------');

		if (saveTo) {
			fs.write('temp/' + saveTo + '.html', html, 'w');
		} else {
			console.log(html);
		}

		console.log('Page loaded.');
	}

	phantom.exit();
});
