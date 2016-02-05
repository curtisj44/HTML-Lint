/*jslint node: true */
'use strict';

// usage: `node html-lint http://s.codepen.io/curtisj44/debug/xbQXbV`

var
	// node
	exec = require('child_process').exec,
	fs = require('fs'),

	// dependencies
	chalk = require('chalk'),
	cheerio = require('cheerio'),

	// variables
	$,
	errors = 0,
	output = '',
	url = process.argv[2],
	saveTo = process.argv[3] || 'test',
	savedHtml = saveTo + '.html',
	saveCommand = 'phantomjs lib/save-html.js ' + url + ' ' + saveTo,

	// methods
	tests = {
		'fieldset:not(:has(legend))': {
			'label': '`fieldset` missing `legend`'
		},
		'fieldset > *:not(legend):first-child': {
			'label': '`fieldset` first child is not `legend`'
		},
		'img:not([alt])': {
			'label': '`img` missing `alt` attribute'
		}
	},

	init = function () {
		$ = cheerio.load(fs.readFileSync('temp/' + savedHtml));

		if ($('html').length !== 1) {
			console.log(chalk.yellow('Error: Something went wrong. Check the URL.'));
			return;
		}

		runTests();
		summarize();
	},

	addSelectorToOutput = function (index, value) {
		output += '   ' + chalk.dim($(value)) + '\n';
	},

 	// TODO - this needs a better name
	runTests = function () {
		console.log(chalk.cyan('Running tests...\n'));

		var currentErrors;

		// console.log(tests);

		for (var test in tests) {
			// console.log(chalk.dim('test: ' + test));
			// console.log(chalk.dim('label: ' + tests[test].label));

			currentErrors = $(test).length;

			if (currentErrors > 0) {
				errors += currentErrors;
				output += ' ' + chalk.bold.red(currentErrors) + ' ' + tests[test].label + '\n';
				$(test).each(addSelectorToOutput);
			}
		}
	},

	summarize = function () {
		console.log(output);
		console.log(chalk[errors === 0 ? 'bgGreen' : 'bgRed']('HTML-Lint found' + chalk.bold(' ' + errors + ' errors') + ' on ' + url));
		console.log('\n');
	};

if (!url) {
	console.log(chalk.yellow('Error: No URL provided'));
} else {
	exec(saveCommand, function (err, stdout, stderr) {
		if (err) console.log(chalk.yellow('Error: Child process failed with [' + err.code + ']'));
		// console.log(stdout);
		// console.log(stderr);
		console.log(chalk.cyan('Saved HTML from ' + chalk.bold(url) + ' to ' + chalk.bold('temp/' + savedHtml)));
		init();
	});
}
