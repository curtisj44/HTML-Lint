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
	currentErrors,
	errors = 0,
	output = '',
	url = process.argv[2],
	saveTo = process.argv[3] || 'test',
	savedHtml = saveTo + '.html',
	saveCommand = 'phantomjs lib/save-html.js ' + url + ' ' + saveTo,

	// methods

	// TODO: re-use the tests defined in `htmlLint.test.js`
	tests = {
		'a:not([href])': {
			'label': '`a` missing `href`'
		},
		'a[href=""]': {
			'label': '`a[href=""]`'
		},
		'a[href="#"]': {
			'label': '`a[href="#"]`'
		},
		'fieldset:not(:has(legend))': {
			'label': '`fieldset` missing `legend`'
		},
		'fieldset > *:not(legend):first-child': {
			'label': '`fieldset` first child is not `legend`'
		},
		'img:not([alt])': {
			'label': '`img` missing `alt` attribute'
		},
		'script[charset]': {
			'label': '`script[charset]`'
		},
		'script[language]': {
			'label': '`language` attribute is not valid on `script`'
		},
		'script[type="text/javascript"]': {
			'label': '`type="text/javascript"` is not needed on `script`'
		},
		'style[media="all"]': {
			'label': '`media="all"` is not needed on `style`'
		},
		'style[type="text/css"]': {
			'label': '`type="text/css"` is not needed on `style`'
		},

		'[align]': {
			'label': 'Invalid attribute: `align`'
		},
		'[alink]': {
			'label': 'Bad attribute: `alink`'
		},
		'[background]': {
			'label': 'Invalid attribute: `background`'
		},
		'[bgcolor]': {
			'label': 'Invalid attribute: `bgcolor`'
		},
		'[border]': {
			'label': 'Bad attribute: `border`'
		},
		'[cellpadding]': {
			'label': 'Bad attribute: `cellpadding`'
		},
		'[cellspacing]': {
			'label': 'Bad attribute: `cellspacing`'
		},
		'[class=""]': {
			'label': '`class=""`'
		},
		'[frameborder]': {
			'label': 'Bad attribute: `frameborder`'
		},
		'[halign]': {
			'label': 'Invalid attribute: `halign`'
		},
		'[id=""]': {
			'label': '`id=""`'
		},
		'[link]': {
			'label': 'Bad attribute: `link`'
		},
		'[marginheight]': {
			'label': 'Bad attribute: `marginheight`'
		},
		'[marginwidth]': {
			'label': 'Bad attribute: `marginwidth`'
		},
		'[name=""]': {
			'label': '`name=""`'
		},
		'[shape]': {
			'label': 'Bad attribute: `shape`'
		},
		'[size]': {
			'label': 'Bad attribute: `size`'
		},
		'[src*="javascript:"]': {
			'label': '`[src*="javascript:"]`'
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
		var
			postFormatting = '',
			preFormatting = chalk.cyan(' ├─ '),
			oneBasedIndex = index + 1;

		if (oneBasedIndex === currentErrors) {
			postFormatting = '\n';
			preFormatting = chalk.cyan(' └─ ');
		}

		output += chalk.dim(preFormatting + chalk.cyan(oneBasedIndex) + ' ' + $(value) + '\n' + postFormatting);
	},

 	// TODO - this needs a better name
	runTests = function () {
		console.log(chalk.cyan('Running tests...\n'));
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
