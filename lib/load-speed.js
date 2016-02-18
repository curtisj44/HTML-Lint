/* jslint node: true */
/* globals phantom */
'use strict';

// usage: `phantomjs lib/load-speed.js http://s.codepen.io/curtisj44/debug/xbQXbV`

var
	url,
	page = require('webpage').create(),
	system = require('system'),
	timestamp,
	url = system.args[1];

if (system.args.length === 1) {
	console.log('Error: loadspeed.js <some URL>');
	phantom.exit();
}

timestamp = Date.now();
console.log('Loading ' + url);

page.open(url, function (status) {
	if (status === 'success') {
		timestamp = Date.now() - timestamp;
		console.log('Loading time: ' + timestamp + ' ms');
	} else {
		console.log('Error: unable to load page.');
	}

	phantom.exit();
});
