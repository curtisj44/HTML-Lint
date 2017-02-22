#! /usr/bin/env node
/* jslint node: true */
'use strict';

// usage: `node html-lint http://s.codepen.io/curtisj44/debug/xbQXbV`
// usage: `node html-lint http://s.codepen.io/curtisj44/debug/xbQXbV --verbose`

var
	// node
	fs = require('fs'),
	spawn = require('child_process').spawn,

	// dependencies
	chalk = require('chalk'),
	cheerio = require('cheerio'),

	// variables
	$,
	currentErrors,
	errors = 0,
	passing = 0,

	ERROR_LINTING_FAILURE = 1,
	ERROR_HTML_FILE_NOT_FOUND = 127,

	isStrict = false,
	isVerbose = false,
	strictFlag = '--strict',
	verboseFlag = '--verbose',

	output = '',
	tests = require('./lib/tests'),
	url = process.argv[2],

	saveTo = (process.argv[3] && process.argv[3] !== verboseFlag) ? process.argv[3] : 'saved',
	savedPath = 'temp/' + saveTo,
	saveHtml = spawn('phantomjs', [__dirname + '/lib/save-html.js', url, saveTo]),

	// methods
	init = function () {
		$ = cheerio.load(fs.readFileSync(savedPath + '.html'));
		detectFlags();

		if ($('html').length !== 1) {
			console.log(chalk.yellow('Error: Something went wrong. Check the URL.'));
			if (isStrict) process.exit(ERROR_HTML_FILE_NOT_FOUND);
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
		// console.log(tests.collection);

		for (var test in tests.collection) {
			// console.log(chalk.dim('test: ' + test));
			// console.log(chalk.dim('label: ' + tests.collection[test].label));
			currentErrors = $(test).length;

			if (currentErrors > 0) {
				errors += currentErrors;
				output += ' ' + chalk.bold.red(currentErrors) + ' ' + tests.collection[test].label + '\n';
				if (isVerbose) $(test).each(addSelectorToOutput);
			} else {
				passing++;
			}
		}
	},

	detectFlags = function () {
		process.argv.forEach(function (value, index, array) {
			if (!isStrict) {
				isStrict = value === strictFlag;
			}

			if (!isVerbose) {
				isVerbose = value === verboseFlag;
			}
		});
	},

	summarize = function () {
		console.log(output);
		console.log(chalk.dim(' ' + passing + ' tests passing \n'));
		console.log(chalk[errors === 0 ? 'bgGreen' : 'bgRed'](' HTML-Lint found' + chalk.bold(' ' + errors + ' errors') + ' on ' + url + ' '));
		console.log('\n');

		// Exit immediately with a non-zero return code
		if (isStrict && errors > 0) process.exit(ERROR_LINTING_FAILURE);
	};

if (!url) {
	console.log(chalk.yellow('Error: No URL provided'));
} else {
	saveHtml.stdout.on('data', function (data) {
		console.log(chalk.yellow(data.toString().replace(/[\n\r]/g, '')));
	});

	saveHtml.stderr.on('data', function (data) {
		console.log(chalk.red('stderr: ' + data));
	});

	saveHtml.on('exit', function (code) {
		// console.log('child process exited with code ' + code);
		// if (err) console.log(chalk.yellow('Error: Child process failed with [' + err.code + ']'));
		console.log(chalk.yellow('Saved HTML' + ' to: ' + chalk.bold(__dirname + '/' + savedPath + '.html')));
		console.log(chalk.yellow('Saved PNG' + ' to:  ' + chalk.bold(__dirname + '/' + savedPath + '.png')));
		init();
	});
}
