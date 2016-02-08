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
		// ---- Tags ----
		'a:empty, b:empty, abbr:empty, acronym:empty, button:empty, dd:empty, div:empty, dl:empty, dt:empty, h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty, form:empty, fieldset:empty, label:empty, li:empty, ol:empty, p:empty, span:empty, strong:empty, ul:empty': {
			'label': 'empty tag'
		},
		'applet': {
			'label': '<code>&lt;applet&gt;</code>'
		},
		'center': {
			'label': '<code>&lt;center&gt;</code>'
		},
		'font': {
			'label': '<code>&lt;font&gt;</code>'
		},
		'iframe': {
			'label': '<code>&lt;iframe&gt;</code>'
		},
		'noscript': {
			'label': '<code>&lt;noscript&gt;</code>'
		},
		's': {
			'label': '<code>&lt;s&gt;</code>'
		},
		'strike': {
			'label': '<code>&lt;strike&gt;</code>'
		},
		'u': {
			'label': '<code>&lt;u&gt;</code>'
		},
		'br + br': {
			'label': 'Multiple <code>&lt;br&gt;</code>&rsquo;s (* not quite accurate)'
		},

		// // ---- Attributes ----
		':contains("=NOTFOUND!")': {
			'label': 'Missing SiteCore resource'
		},

		'abbr:not([title])': {
			'label': '<code>&lt;abbr&gt;</code> missing <code>title</code>'
		},
		'acronym:not([title])': {
			'label': '<code>&lt;acronym&gt;</code> missing <code>title</code>'
		},
		'a:contains("Click here"), a:contains("click here")': {
			'label': '&ldquo;Click here&rdquo; used as link text'
		},
		'a:contains("Read more"), a:contains("Read more")': {
			'label': '&ldquo;Read more&rdquo; used as link text'
		},
		'a:not([href])': {
			'label': '<code>&lt;a&gt;</code> missing <code>href</code>'
		},
		'a[href=""]': {
			'label': '<code>a[href=""]</code>'
		},
		'a[href="#"]': {
			'label': '<code>a[href="#"]</code>'
		},
		'a[href*="javascript:"]': {
			'label': '<code>a[href*="javascript:"]</code>'
		},
		'a[href*="<"]': {
			'label': '<code>a[href*="<"]</code>'
		},
		'a[href*=">"]': {
			'label': '<code>a[href*=">"]</code>'
		},
		'a[href*="{"]': {
			'label': '<code>a[href*="{"]</code>'
		},
		'a[href*="}"]': {
			'label': '<code>a[href*="}"]</code>'
		},
		'a[target]': {
			'label': '<code>a[target]</code>'
		},
		//'head script:not([src*="hasJS.js"], [src*="swfobject.js"], [src*="google-analytics.com"])': {
		//	'label': '<code>&lt;script&gt;</code> in the <code>&lt;head&gt;</code>'
		//},
		'fieldset:not(:has(legend))': {
			'label': '<code>&lt;fieldset&gt;</code> missing <code>&lt;legend&gt;</code>'
		},
		'fieldset > *:not(legend):first-child': {
			'label': '<code>&lt;fieldset&gt;</code>&rsquo;s first child is not <code>&lt;legend&gt;</code>'
		},
		'form[action=""]': {
			'label': '<code>form[action=""]</code>'
		},
		'form[action="#"]': {
			'label': '<code>form[action="#"]</code>'
		},
		'form:not(:has(fieldset))': {
			'label': '<code>&lt;form&gt;</code> missing <code>&lt;fieldset&gt;</code>'
		},
		'input[type="text"]': {
			'label': '<code>type="text"</code> is not needed on <code>&lt;input&gt;</code>'
		},
		'img:not([alt])': {
			'label': '<code>&lt;img&gt;</code> missing <code>alt</code> attribute'
		},
		'img:not(".tracking")[alt=""]': {
			'label': '<code>img[alt=""]</code>'
		},
		'img[src=""]': {
			'label': '<code>img[src=""]</code>'
		},
		'img[width="1"][height="1"]': {
			'label': 'Tracking pixel <code>img</code>'
		},
		'label:not([for])': {
			'label': '<code>&lt;label&gt;</code> missing <code>for</code>'
		},
		'body link:not("#html-lint-css")': {
			'label': '<code>&lt;link&gt;</code> not in <code>&lt;head&gt;</code>'
		},
		'link:not([rel])': {
			'label': '<code>&lt;link&gt;</code> missing <code>rel</code>'
		},
		'link[charset]': {
			'label': '<code>link[charset]</code>'
		},
		'link[rel="shortcut icon"][type="image/ico"]': {
			'label': '<code>type="images/ico"</code> is not needed on <code>&lt;link&gt;</code>'
		},
		'link[rel="stylesheet"][media="all"]': {
			'label': '<code>media="all"</code> is not needed on <code>&lt;link&gt;</code>'
		},
		'link[rel="stylesheet"][type="text/css"]': {
			'label': '<code>type="text/css"</code> is not needed on <code>&lt;link&gt;</code>'
		},
		'nav:not([role])': {
			'label': '<code>&lt;nav&gt;</code> missing <code>role</code>'
		},
		'script[charset]': {
			'label': '<code>script[charset]</code>'
		},
		'script[language]': {
			'label': '<code>language</code> attribute is not valid on <code>&lt;script&gt;</code>'
		},
		'script[type="text/javascript"]': {
			'label': '<code>type="text/javascript"</code> is not needed on <code>&lt;script&gt;</code>'
		},
		'style[media="all"]': {
			'label': '<code>media="all"</code> is not needed on <code>&lt;style&gt;</code>'
		},
		'style[type="text/css"]': {
			'label': '<code>type="text/css"</code> is not needed on <code>&lt;style&gt;</code>'
		},
		'table:not([summary])': {
			'label': '<code>&lt;table&gt;</code> missing <code>summary</code>'
		},
		//'table:not(:has(caption))': {
		//	'label': '<code>&lt;table&gt;</code> missing <code>&lt;caption&gt;</code>'
		//},
		'table:not(:has(th))': {
			'label': '<code>&lt;table&gt;</code> missing <code>&lt;th&gt;</code>'
		},
		'table table': {
			'label': '<code>&lt;table&gt;</code> inside <code>&lt;table&gt;</code>'
		},

		// TODO: Currently causes this error: `TypeError: Cannot read property 'type' of undefined`
		// 'th:not([scope])': {
		// 	'label': '<code>&lt;th&gt;</code> missing <code>scope</code>'
		// },

		'th[scope=""]': {
			'label': '<code>th[scope=""]</code>'
		},

		':not("canvas, img, object, svg")[height]': {
			'label': 'Invalid attribute: <code>height</code>'
		},
		':not("canvas, img, object, svg")[width]': {
			'label': 'Invalid attribute: <code>width</code>'
		},

		'[align]': {
			'label': 'Invalid attribute: <code>align</code>'
		},
		'[alink]': {
			'label': 'Bad attribute: <code>alink</code>'
		},
		'[background]': {
			'label': 'Invalid attribute: <code>background</code>'
		},
		'[bgcolor]': {
			'label': 'Invalid attribute: <code>bgcolor</code>'
		},
		'[border]': {
			'label': 'Bad attribute: <code>border</code>'
		},
		'[cellpadding]': {
			'label': 'Bad attribute: <code>cellpadding</code>'
		},
		'[cellspacing]': {
			'label': 'Bad attribute: <code>cellspacing</code>'
		},
		'[class=""]': {
			'label': '<code>class=""</code>'
		},
		'[frameborder]': {
			'label': 'Bad attribute: <code>frameborder</code>'
		},
		'[halign]': {
			'label': 'Invalid attribute: <code>halign</code>'
		},
		'[id=""]': {
			'label': '<code>id=""</code>'
		},
		'[link]': {
			'label': 'Bad attribute: <code>link</code>'
		},
		'[marginheight]': {
			'label': 'Bad attribute: <code>marginheight</code>'
		},
		'[marginwidth]': {
			'label': 'Bad attribute: <code>marginwidth</code>'
		},
		'[name=""]': {
			'label': '<code>name=""</code>'
		},
		'[shape]': {
			'label': 'Bad attribute: <code>shape</code>'
		},
		'[size]': {
			'label': 'Bad attribute: <code>size</code>'
		},
		'[src*="javascript:"]': {
			'label': '<code>[src*="javascript:"]</code>'
		},
		'[style*="background"]': {
			'label': 'Inline style: <code>background</code>'
		},
		'[style*="border"]': {
			'label': 'Inline style: <code>border</code>'
		},
		'[style*="font"]': {
			'label': 'Inline style: <code>font</code>'
		},
		'[style*="letter-spacing"]': {
			'label': 'Inline style: <code>letter-spacing</code>'
		},
		'[style*="line-height"]': {
			'label': 'Inline style: <code>line-height</code>'
		},
		'[style*="list-style"]': {
			'label': 'Inline style: <code>list-style</code>'
		},
		'[style*="outline"]': {
			'label': 'Inline style: <code>outline</code>'
		},
		'[style*="resize"]': {
			'label': 'Inline style: <code>resize</code>'
		},
		'[style*="text"]': {
			'label': 'Inline style: <code>text</code>'
		},
		'[style*="vertical"]': {
			'label': 'Inline style: <code>vertical</code>'
		},
		'[style*="word"]': {
			'label': 'Inline style: <code>word</code>'
		},
		'[tabindex]': {
			'label': 'Bad attribute: <code>tabindex</code>'
		},
		'[title=""]': {
			'label': '<code>title</code> attribute is empty'
		},
		'[valign]': {
			'label': 'Invalid attribute: <code>valign</code>'
		},
		'[vlink]': {
			'label': 'Bad attribute: <code>vlink</code>'
		},

		// --- Inline event handlers ----

		'[onabort]': {
			'label': 'Inline event handler: <code>onabort</code>'
		},
		'[onautocomplete]': {
			'label': 'Inline event handler: <code>onautocomplete</code>'
		},
		'[onautocompleteerror]': {
			'label': 'Inline event handler: <code>onautocompleteerror</code>'
		},
		'[onafterprint]': {
			'label': 'Inline event handler: <code>onafterprint</code>'
		},
		'[onbeforeprint]': {
			'label': 'Inline event handler: <code>onbeforeprint</code>'
		},
		'[onbeforeunload]': {
			'label': 'Inline event handler: <code>onbeforeunload</code>'
		},
		'[onblur]': {
			'label': 'Inline event handler: <code>onblur</code>'
		},
		'[oncancel]': {
			'label': 'Inline event handler: <code>oncancel</code>'
		},
		'[oncanplay]': {
			'label': 'Inline event handler: <code>oncanplay</code>'
		},
		'[oncanplaythrough]': {
			'label': 'Inline event handler: <code>oncanplaythrough</code>'
		},
		'[onchange]': {
			'label': 'Inline event handler: <code>onchange</code>'
		},
		'[onclick]': {
			'label': 'Inline event handler: <code>onclick</code>'
		},
		'[onclose]': {
			'label': 'Inline event handler: <code>onclose</code>'
		},
		'[oncontextmenu]': {
			'label': 'Inline event handler: <code>oncontextmenu</code>'
		},
		'[oncuechange]': {
			'label': 'Inline event handler: <code>oncuechange</code>'
		},
		'[ondblclick]': {
			'label': 'Inline event handler: <code>ondblclick</code>'
		},
		'[ondrag]': {
			'label': 'Inline event handler: <code>ondrag</code>'
		},
		'[ondragdrop]': {
			'label': 'Inline event handler: <code>ondragdrop</code>'
		},
		'[ondragend]': {
			'label': 'Inline event handler: <code>ondragend</code>'
		},
		'[ondragenter]': {
			'label': 'Inline event handler: <code>ondragenter</code>'
		},
		'[ondragexit]': {
			'label': 'Inline event handler: <code>ondragexit</code>'
		},
		'[ondragleave]': {
			'label': 'Inline event handler: <code>ondragleave</code>'
		},
		'[ondragover]': {
			'label': 'Inline event handler: <code>ondragover</code>'
		},
		'[ondragstart]': {
			'label': 'Inline event handler: <code>ondragstart</code>'
		},
		'[ondrop]': {
			'label': 'Inline event handler: <code>ondrop</code>'
		},
		'[ondurationchange]': {
			'label': 'Inline event handler: <code>ondurationchange</code>'
		},
		'[onemptied]': {
			'label': 'Inline event handler: <code>onemptied</code>'
		},
		'[onended]': {
			'label': 'Inline event handler: <code>onended</code>'
		},
		'[onerror]': {
			'label': 'Inline event handler: <code>onerror</code>'
		},
		'[onfocus]': {
			'label': 'Inline event handler: <code>onfocus</code>'
		},
		'[onhashchange]': {
			'label': 'Inline event handler: <code>onhashchange</code>'
		},
		'[oninput]': {
			'label': 'Inline event handler: <code>oninput</code>'
		},
		'[oninvalid]': {
			'label': 'Inline event handler: <code>oninvalid</code>'
		},
		'[onkeydown]': {
			'label': 'Inline event handler: <code>onkeydown</code>'
		},
		'[onkeypress]': {
			'label': 'Inline event handler: <code>onkeypress</code>'
		},
		'[onkeyup]': {
			'label': 'Inline event handler: <code>onkeyup</code>'
		},
		'[onlanguagechange]': {
			'label': 'Inline event handler: <code>onlanguagechange</code>'
		},
		'[onload]': {
			'label': 'Inline event handler: <code>onload</code>'
		},
		'[onloadeddata]': {
			'label': 'Inline event handler: <code>onloadeddata</code>'
		},
		'[onloadedmetadata]': {
			'label': 'Inline event handler: <code>onloadedmetadata</code>'
		},
		'[onloadstart]': {
			'label': 'Inline event handler: <code>onloadstart</code>'
		},
		'[onmessage]': {
			'label': 'Inline event handler: <code>onmessage</code>'
		},
		'[onmousedown]': {
			'label': 'Inline event handler: <code>onmousedown</code>'
		},
		'[onmouseenter]': {
			'label': 'Inline event handler: <code>onmouseenter</code>'
		},
		'[onmouseleave]': {
			'label': 'Inline event handler: <code>onmouseleave</code>'
		},
		'[onmousemove]': {
			'label': 'Inline event handler: <code>onmousemove</code>'
		},
		'[onmouseout]': {
			'label': 'Inline event handler: <code>onmouseout</code>'
		},
		'[onmouseover]': {
			'label': 'Inline event handler: <code>onmouseover</code>'
		},
		'[onmouseup]': {
			'label': 'Inline event handler: <code>onmouseup</code>'
		},
		'[onmousewheel]': {
			'label': 'Inline event handler: <code>onmousewheel</code>'
		},
		'[onmove]': {
			'label': 'Inline event handler: <code>onmove</code>'
		},
		'[onoffline]': {
			'label': 'Inline event handler: <code>onoffline</code>'
		},
		'[ononline]': {
			'label': 'Inline event handler: <code>ononline</code>'
		},
		'[onpagehide]': {
			'label': 'Inline event handler: <code>onpagehide</code>'
		},
		'[onpageshow]': {
			'label': 'Inline event handler: <code>onpageshow</code>'
		},
		'[onpause]': {
			'label': 'Inline event handler: <code>onpause</code>'
		},
		'[onplay]': {
			'label': 'Inline event handler: <code>onplay</code>'
		},
		'[onplaying]': {
			'label': 'Inline event handler: <code>onplaying</code>'
		},
		'[onpopstate]': {
			'label': 'Inline event handler: <code>onpopstate</code>'
		},
		'[onprogress]': {
			'label': 'Inline event handler: <code>onprogress</code>'
		},
		'[onreset]': {
			'label': 'Inline event handler: <code>onreset</code>'
		},
		'[onresize]': {
			'label': 'Inline event handler: <code>onresize</code>'
		},
		'[onscroll]': {
			'label': 'Inline event handler: <code>onscroll</code>'
		},
		'[onseeked]': {
			'label': 'Inline event handler: <code>onseeked</code>'
		},
		'[onseeking]': {
			'label': 'Inline event handler: <code>onseeking</code>'
		},
		'[onselect]': {
			'label': 'Inline event handler: <code>onselect</code>'
		},
		'[onshow]': {
			'label': 'Inline event handler: <code>onshow</code>'
		},
		'[onsort]': {
			'label': 'Inline event handler: <code>onsort</code>'
		},
		'[onstalled]': {
			'label': 'Inline event handler: <code>onstalled</code>'
		},
		'[onstorage]': {
			'label': 'Inline event handler: <code>onstorage</code>'
		},
		'[onsubmit]': {
			'label': 'Inline event handler: <code>onsubmit</code>'
		},
		'[onsuspend]': {
			'label': 'Inline event handler: <code>onsuspend</code>'
		},
		'[ontimeupdate]': {
			'label': 'Inline event handler: <code>ontimeupdate</code>'
		},
		'[ontoggle]': {
			'label': 'Inline event handler: <code>ontoggle</code>'
		},
		'[onunload]': {
			'label': 'Inline event handler: <code>onunload</code>'
		},
		'[onvolumechange]': {
			'label': 'Inline event handler: <code>onvolumechange</code>'
		},
		'[onwaiting]': {
			'label': 'Inline event handler: <code>onwaiting</code>'
		},

		// Ids & Classes
		'#ContentWrapper': {
			'label': 'Bad Id: <code>ContentWrapper</code>'
		},
		'.MsoNormal': {
			'label': 'Bad Class: <code>MsoNormal</code>'
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
