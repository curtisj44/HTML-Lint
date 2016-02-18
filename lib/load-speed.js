/* jslint node: true */
/* globals phantom */
'use strict';

// usage: `phantomjs lib/load-speed.js http://s.codepen.io/curtisj44/debug/xbQXbV`

var
	url,
	page = require('webpage').create(),
	system = require('system'),
	t,
	url = system.args[1];

if (system.args.length === 1) {
	console.log('Error: loadspeed.js <some URL>');
	phantom.exit();
}

t = Date.now();

page.open(url, function (status) {
	if (status === 'success') {
		t = Date.now() - t;
		console.log('Loading ' + system.args[1]);
		console.log('Loading time ' + t + ' ms');
	} else {
		console.log('Error: unable to load page.');
	}

	phantom.exit();
});
