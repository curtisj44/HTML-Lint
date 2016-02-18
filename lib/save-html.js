/* jslint node: true */
/* globals document, phantom, window */
'use strict';

// TODO: add note in README.md that this makes PhantomJS a required global dependency

// usage: `phantomjs lib/save-html.js http://s.codepen.io/curtisj44/debug/xbQXbV`
// usage: `phantomjs lib/save-html.js http://s.codepen.io/curtisj44/debug/xbQXbV test`

var
	// node
	fs = require('fs'),
	page = require('webpage').create(),
	system = require('system'),

	// variables
	saveTo = system.args[2],
	url = system.args[1],
	timestamp;

// Default:               `Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/538.1 (KHTML, like Gecko) PhantomJS/2.1.1 Safari/538.1`
page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:43.0) Gecko/20100101 Firefox/43.0';

page.onLoadStarted = function () {
	console.log('Loading page...');
	timestamp = Date.now();
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

	page.viewportSize = { width: 1200, height: 900 };
	page.render('temp/' + saveTo + '.png');

	if (status === 'success') {
		html = js.all[0].outerHTML

			// Resolve domain-agnostic paths
			.replace(/\="\/\//g, '="https://')
			.replace(/\='\/\//g, '=\'https://')

			// Resolve relative paths
			.replace(/\="\//g, '="' + origin + '/')
			.replace(/\='\//g, '=\'' + origin + '/');

		timestamp = Date.now() - timestamp;
		console.log('Page loaded in ' + timestamp + ' ms');
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
