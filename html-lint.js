// https://github.com/allmarkedup/snoopy/blob/master/src/lib/sniffer.js

(function (HtmlLint) {
	'use strict';

	var self = HtmlLint;

	self.addPanel = function (name, output, errors) {
		var $htmlLint = $('#html-lint'),
			nameRevised = name.replace(' ', '').toLowerCase(),
			$panel = $htmlLint.find('[data-panel="' + nameRevised + '"]');

		if ($panel.length > 0) {
			$panel.remove();
		}

		$htmlLint.append('<div class="html-lint-tab-panel" data-panel="' + nameRevised + '" style="display:none">' + output + '</div>');

		// tab button
		$htmlLint.find('.html-lint-tab-list').append('<li><a class="html-lint-button" href="#' + nameRevised + '">' + name + '</a></li>');

		// errors
		if (errors) {
			$htmlLint.find('[href="#' + nameRevised + '"]').append('<b class="html-lint-error html-lint-error-count">' + errors + '</b>');
		}
	};

	self.close = function () {
		var $closeButton = $('.html-lint-close');

		$closeButton.bind('click', function () {
			self.closeAction($closeButton);
			return false;
		});

		$(document).bind('keyup', function (event) {
			if (event.keyCode === 27) {
				self.closeAction($closeButton);
			}
		});
	};

	self.closeAction = function ($closeButton) {
		$closeButton.parent().fadeOut(250, function () {
			$(this).remove();
			$('#html-lint-css, #html-lint-jquery, #html-lint-js').remove();
		});
	};

	self.editFlash = function () {
		var $flashObjects = $('object, embed');

		if ($flashObjects.length > 0 && $flashObjects.find('param[name="wmode"]').attr('value') !== 'opaque') {
			$('<param />', {
				name: 'wmode',
				value: 'opaque'
			}).appendTo($flashObjects);

			$flashObjects.attr('wmode', 'opaque').hide().show();
		}
	};

	self.handleErrors = function (tests) {
		var errors = 0,
			currentErrors,
			output = '';

		$.each(tests, function (index, test) {
			currentErrors = $(test.selector).length;

			if (currentErrors > 0) {
				errors += currentErrors;
				output += '<p><i>' + self.utility.error(currentErrors) + '</i>' + test.label + '</p>';
				//$(test.selector).addClass('html-lint-error-highlight').attr('data-html-lint', test.label);
			}
		});

		return [output, errors];
	};

	self.panel = {};

	self.panel.metaData = function () {
		var errors = 0,
			$head = $('head'),
			$metaTags = $head.find('meta'),
			$title = $head.find('title').html(),
			$charset = $metaTags.filter('meta[charset], meta[http-equiv="content-type"], meta[http-equiv="Content-Type"]'),
			$description = $metaTags.filter('meta[name="description"], meta[name="Description"]'),
			$keywords = $metaTags.filter('meta[name="keywords"], meta[name="Keywords"]'),
			checkTag = function (tag) {
				if (!tag) {
					tag = self.utility.Error();
					errors += 1;
				}
				return tag;
			},
			output = '<dl>';

		// title
		output += '<dt>&lt;title&gt;</dt><dd>' + checkTag($title) + '</dd>';

		// charset
		if ($charset.length < 1) {
			output += '<dt>charset</dt><dd>' + self.utility.error() + '</dd>';
			errors += 1;
		} else if ($charset[0] !== $head.children()[0]) {
			output += '<dt>Character Encoding</dt><dd>' + self.utility.error('not first child of <code>&lt;head&gt;</code>') + '</dd>';
			errors += 1;
		}

		// description
		if ($description.length < 1) {
			output += '<dt>description</dt><dd>' + self.utility.error() + '</dd>';
			errors += 1;
		}

		// keywords
		if ($keywords.length < 1) {
			output += '<dt>keywords</dt><dd>' + self.utility.error() + '</dd>';
			errors += 1;
		}

		$metaTags.not('meta[property^="og:"], meta[property^="fb:"]').each(function (index, value) {
			var $value = $(value);

			if ($value.attr('name')) {
				output += '<dt>' + $value.attr('name') + '</dt>';
			} else if ($value.attr('property')) {
				output += '<dt>' + $value.attr('property') + '</dt>';
			} else if ($value.attr('charset')) {
				output += '<dt>charset</dt>';
			} else if ($value.attr('http-equiv')) {
				output += '<dt>' + $value.attr('http-equiv') + '</dt>';
			}

			output += '<dd>';

			if ($value.attr('content')) {
				if ($value.attr('content').indexOf('http') === 0) {
					output += '<a href="' + $value.attr('content') + '">' + $value.attr('content') + '</a>';
				} else {
					output += $value.attr('content');
				}
			} else if ($value.attr('charset')) {
				output += $value.attr('charset');
			} else {
				output += self.utility.error('missing value');
			}

			output += '</dd>';
		});

		output += '</dl>';

		self.addPanel('Meta Data', output, errors);
	};

	self.panel.openGraph = function () {
		var errors = 0,
			$head = $('head'),
			$metaOG = $head.find('meta[property^="og:"]'),
			$metaFB = $head.find('meta[property^="fb:"]'),
			output = '<dl>';

		if ($metaOG.length !== 0 || $metaFB.length !== 0) {
			// OG
			if ($metaOG.length !== 0) {
				$metaOG.each(function () {
					var $property = $(this).attr('property'),
						$content = $(this).attr('content');

					output += '<dt>' + $property + '</dt>';

					if ($content) {
						if ($property === 'og:image') {
							if ($content.indexOf('.gif') !== -1 || $content.indexOf('.jpg') !== -1 || $content.indexOf('.png') !== -1) {
								output += '<dd><img src="' + $content + '" alt="' + $content + '" /></dd>';
							} else {
								output += '<dd>' + self.utility.error() + ' = ' + $content + '</dd>';
							}
						} else if ($property === 'og:url') {
							output += '<dd><a href="' + $content + '">' + $content + '</a></dd>';
						} else {
							output += '<dd>' + $content + '</dd>';
						}
					} else {
						output += '<dd>' + self.utility.error() + '</dd>';
					}
				});
			}

			// FB
			if ($metaFB.length !== 0) {
				$metaFB.each(function () {
					var $property = $(this).attr('property'),
						$content = $(this).attr('content'),
						adminIds,
						adminLinks = '';

					output += '<dt>' + $property + '</dt>';

					if ($content) {
						if ($property === 'fb:app_id') {
							output += '<dd><a href="http://www.facebook.com/apps/application.php?id=' + $content + '">' + $content + '</a></dd>';
						} else if ($property === 'fb:admins') {
							adminIds = $content.split(',');

							$.each(adminIds, function (index, value) {
								adminLinks += '<a href="http://www.facebook.com/profile.php?id=' + value + '">' + value + '</a> ';
							});

							output += '<dd>' + adminLinks + '</dd>';
						} else {
							output += '<dd>' + $content + '</dd>';
						}
					} else {
						output += '<dd>' + self.utility.error() + '</dd>';
					}
				});
			}
		} else {
			output += '<dt>Open Graph</dt><dd>' + self.utility.error('missing tags') + '</dd>';
			errors += 1;
		}

		output += '</dl>';

		self.addPanel('Open Graph', output, errors);
	};

	self.panel.overview = function () {
		var errors = 0,
			$appleTouchIcon = $('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]'),
			$shortcutIcon = $('link[rel="shortcut icon"], link[rel="icon"]'),
			output = '<dl>';

		// shortcut icon
		if ($shortcutIcon.length > 0) {
			output += '<dt>' + $shortcutIcon.attr('rel') + '</dt>' +
				'<dd>' +
				'<img src="' + $shortcutIcon.attr('href') + '" alt="' + $shortcutIcon.attr('rel') + '" />' +
				'</dd>';
		} else {
			output += '<dt>shortcut icon</dt><dd>' + self.utility.error() + '</dd>';
			errors += 1;
		}

		// apple-touch-icons
		if ($appleTouchIcon.length > 0) {
			$appleTouchIcon.each(function (index, value) {
				var $value = $(value);
				output += '<dt>';
				output += $value.attr('rel');
				output += ($value.attr('sizes')) ? ' (' + $value.attr('sizes') + ')' : '';
				output += '</dt>';
				output += '<dd>';
				output += '<img src="' + $value.attr('href') + '" alt="' + $value.attr('rel') + '" />';
				output += '</dd>';
			});
		} else {
			output += '<dt>apple-touch-icon</dt><dd>' + self.utility.error() + '</dd>';
			errors += 1;
		}

		output += '</dl>';

		self.addPanel('Overview', output, errors);
	};

	self.panel.technology = function () {
		var errors = 0,
			output = '<dl>';

		// jQuery
		output += '<dt>jQuery</dt><dd>' + $.fn.jquery;

		if ($.fn.jquery !== self.utility.jQueryVersion) {
			output += ' ' + self.utility.error('not the latest version');
			errors += 1;
		}

		output += '</dd>';

		self.addPanel('Technology', output, errors);
	};

	self.panel.tests = function () {
		self.addPanel('Tests', self.handleErrors(self.test)[0], self.handleErrors(self.test)[1]);
	};

	self.tabSetup = function () {
		var errors = 0,
			$htmlLint = $('#html-lint'),
			$tabList = $htmlLint.find('.html-lint-tab-list'),
			$tabPanels = $htmlLint.find('.html-lint-tab-panel');

		// tab button
		$tabList.find('a').bind('click', function () {
			self.tabAction($(this).attr('href'), $tabList, $tabPanels);
			return false;
		});

		// open first panel
		$tabList.find('li:first-child a').trigger('click');

		// total error count
		$.each($tabList.find('.html-lint-error-count'), function (index, value) {
			errors += parseInt($(value).html(), 10);
		});

		$htmlLint.find('h1').prepend(self.utility.error(errors));
	};

	self.tabAction = function ($href, $tabList, $tabPanels) {
		var $panelName = $href.replace('#', ''),
			$tabListCurrent = $tabList.find('a[href="' + $href + '"]'),
			$tabPanelsVisible = $tabPanels.filter(':visible'),
			$tabPanelCurrent = $tabPanels.filter('[data-panel="' + $panelName + '"]');

		if (!$tabListCurrent.hasClass('selected')) {
			// tab button
			$tabList.find('a').removeClass('selected');
			$tabListCurrent.addClass('selected');

			// panel
			if ($tabPanelsVisible.length > 0) {
				$tabPanelsVisible.fadeOut(150, function () {
					$tabPanelCurrent.fadeIn(150);
				});
			} else {
				$tabPanelCurrent.fadeIn(150);
			}
		}
	};

	self.test = {
		// ---- Tags ----
		'empty tag': {
			'selector': 'a:empty, b:empty, abbr:empty, acronym:empty, button:empty, dd:empty, div:empty, dl:empty, dt:empty, h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty, form:empty, fieldset:empty, label:empty, li:empty, ol:empty, p:empty, span:empty, strong:empty, ul:empty',
			'label': 'empty tag'
		},
		'applet': {
			'selector': 'applet',
			'label': '<code>&lt;applet&gt;</code>'
		},
		'center': {
			'selector': 'center',
			'label': '<code>&lt;center&gt;</code>'
		},
		'font': {
			'selector': 'font',
			'label': '<code>&lt;font&gt;</code>'
		},
		'iframe': {
			'selector': 'iframe',
			'label': '<code>&lt;iframe&gt;</code>'
		},
		'noscript': {
			'selector': 'noscript',
			'label': '<code>&lt;noscript&gt;</code>'
		},
		's': {
			'selector': 's',
			'label': '<code>&lt;s&gt;</code>'
		},
		'strike': {
			'selector': 'strike',
			'label': '<code>&lt;strike&gt;</code>'
		},
		'u': {
			'selector': 'u',
			'label': '<code>&lt;u&gt;</code>'
		},
		'br + br': {
			'selector': 'br + br',
			'label': 'Multiple <code>&lt;br&gt;</code>&rsquo;s (* not quite accurate)'
		},

		// ---- Attributes ----
		':contains("=NOTFOUND!")': {
			'selector': ':contains("=NOTFOUND!")',
			'label': 'Missing SiteCore resource'
		},

		'abbr:not([title])': {
			'selector': 'abbr:not([title])',
			'label': '<code>&lt;abbr&gt;</code> missing <code>title</code>'
		},
		'acronym:not([title])': {
			'selector': 'acronym:not([title])',
			'label': '<code>&lt;acronym&gt;</code> missing <code>title</code>'
		},
		'a:contains("click here")': {
			'selector': 'a:contains("Click here"), a:contains("click here")',
			'label': '&ldquo;Click here&rdquo; used as link text'
		},
		'a:contains("read more")': {
			'selector': 'a:contains("Read more"), a:contains("Read more")',
			'label': '&ldquo;Read more&rdquo; used as link text'
		},
		'a:not([href])': {
			'selector': 'a:not([href])',
			'label': '<code>&lt;a&gt;</code> missing <code>href</code>'
		},
		'a[href=""]': {
			'selector': 'a[href=""]',
			'label': '<code>a[href=""]</code>'
		},
		'a[href="#"]': {
			'selector': 'a[href="#"]',
			'label': '<code>a[href="#"]</code>'
		},
		'a[href*="javascript:"]': {
			'selector': 'a[href*="javascript:"]',
			'label': '<code>a[href*="javascript:"]</code>'
		},
		'a[href*="<"]': {
			'selector': 'a[href*="<"]',
			'label': '<code>a[href*="<"]</code>'
		},
		'a[href*=">"]': {
			'selector': 'a[href*=">"]',
			'label': '<code>a[href*=">"]</code>'
		},
		'a[target]': {
			'selector': 'a[target]',
			'label': '<code>a[target]</code>'
		},
		//'script in the head': {
		//	'selector': 'head script:not([src*="hasJS.js"], [src*="swfobject.js"], [src*="google-analytics.com"])',
		//	'label': '<code>&lt;script&gt;</code> in the <code>&lt;head&gt;</code>'
		//},
		'fieldset missing legend': {
			'selector': 'fieldset:not(:has(legend))',
			'label': '<code>&lt;fieldset&gt;</code> missing <code>&lt;legend&gt;</code>'
		},
		'form[action=""]': {
			'selector': 'form[action=""]',
			'label': '<code>form[action=""]</code>'
		},
		'form[action="#"]': {
			'selector': 'form[action="#"]',
			'label': '<code>form[action="#"]</code>'
		},
		'form missing fieldset': {
			'selector': 'form:not(:has(fieldset))',
			'label': '<code>&lt;form&gt;</code> missing <code>&lt;fieldset&gt;</code>'
		},
		'img:not([alt])': {
			'selector': 'img:not([alt])',
			'label': '<code>&lt;img&gt;</code> missing <code>alt</code>'
		},
		'img:not(".tracking")[alt=""]': {
			'selector': 'img:not(".tracking")[alt=""]',
			'label': '<code>img[alt=""]</code>'
		},
		'img[src=""]': {
			'selector': 'img[src=""]',
			'label': '<code>img[src=""]</code>'
		},
		'label:not([for])': {
			'selector': 'label:not([for])',
			'label': '<code>&lt;label&gt;</code> missing for'
		},
		'link not in <head>': {
			'selector': 'body link:not("#html-lint-css")',
			'label': '<code>&lt;link&gt;</code> not in <code>&lt;head&gt;</code>'
		},
		'link:not([rel])': {
			'selector': 'link:not([rel])',
			'label': '<code>&lt;link&gt;</code> missing rel'
		},
		'link[rel="shortcut icon"][type="image/ico"]': {
			'selector': 'link[rel="shortcut icon"][type="image/ico"]',
			'label': '<code>type="images/ico"</code> is not needed on <code>&lt;link&gt;</code>'
		},
		'link[rel="stylesheet"][media="all"]': {
			'selector': 'link[media="all"]',
			'label': '<code>media="all"</code> is not needed on <code>&lt;link&gt;</code>'
		},
		'link[rel="stylesheet"][type="text/css"]': {
			'selector': 'link[rel="stylesheet"][type="text/css"]',
			'label': '<code>type="text/css"</code> is not needed on <code>&lt;link&gt;</code>'
		},
		'script[charset]': {
			'selector': 'script[charset]',
			'label': '<code>script[charset]</code>'
		},
		'script[language]': {
			'selector': 'script[language]',
			'label': '<code>language</code> attribute is not valid on <code>&lt;script&gt;</code>'
		},
		'script[type="text/javascript"]': {
			'selector': 'script[type="text/javascript"]',
			'label': '<code>type="text/javascript"</code> is not needed on <code>&lt;script&gt;</code>'
		},
		'table:not([summary])': {
			'selector': 'table:not([summary])',
			'label': '<code>&lt;table&gt;</code> missing <code>summary</code>'
		},

		//'table:not(:has(caption))': {
		//	'selector': 'table:not(:has(caption))',
		//	'label': '<code>&lt;table&gt;</code> missing <code>&lt;caption&gt;</code>'
		//},

		'table:not(:has(th))': {
			'selector': 'table:not(:has(th))',
			'label': '<code>&lt;table&gt;</code> missing <code>&lt;th&gt;</code>'
		},
		'table table': {
			'selector': 'table table',
			'label': '<code>&lt;table&gt;</code> inside <code>&lt;table&gt;</code>'
		},
		'th:not([scope])': {
			'selector': 'th:not([scope])',
			'label': '<code>&lt;th&gt;</code> missing scope'
		},
		'th[scope=""]': {
			'selector': 'th[scope=""]',
			'label': '<code>th[scope=""]</code>'
		},
		':not("canvas, img, object")[width]': {
			'selector': ':not("canvas, img, object")[width]',
			'label': 'Invalid attribute: <code>width</code>'
		},

		'[align]': {
			'selector': '[align]',
			'label': 'Invalid attribute: <code>align</code>'
		},
		'[alink]': {
			'selector': '[alink]',
			'label': 'Bad attribute: <code>alink</code>'
		},
		'[background]': {
			'selector': '[background]',
			'label': 'Invalid attribute: <code>background</code>'
		},
		'[bgcolor]': {
			'selector': '[bgcolor]',
			'label': 'Invalid attribute: <code>bgcolor</code>'
		},
		'[border]': {
			'selector': '[border]',
			'label': 'Bad attribute: <code>border</code>'
		},
		'[cellpadding]': {
			'selector': '[cellpadding]',
			'label': 'Bad attribute: <code>cellpadding</code>'
		},
		'[cellspacing]': {
			'selector': '[cellspacing]',
			'label': 'Bad attribute: <code>cellspacing</code>'
		},
		'[class=""]': {
			'selector': '[class=""]',
			'label': '<code>class=""</code>'
		},
		'[halign]': {
			'selector': '[halign]',
			'label': 'Invalid attribute: <code>halign</code>'
		},
		'[id=""]': {
			'selector': '[id=""]',
			'label': '<code>id=""</code>'
		},
		'[link]': {
			'selector': '[link]',
			'label': 'Bad attribute: <code>link</code>'
		},
		'[name=""]': {
			'selector': '[name=""]',
			'label': '<code>name=""</code>'
		},
		'[shape]': {
			'selector': '[shape]',
			'label': 'Bad attribute: <code>shape</code>'
		},
		'[size]': {
			'selector': '[size]',
			'label': 'Bad attribute: <code>size</code>'
		},
		'[style*="background"]': {
			'selector': '[style*="background"]',
			'label': 'Inline style: <code>background</code>'
		},
		'[style*="border"]': {
			'selector': '[style*="border"]',
			'label': 'Inline style: <code>border</code>'
		},
		'[style*="font"]': {
			'selector': '[style*="font"]',
			'label': 'Inline style: <code>font</code>'
		},
		'[style*="letter-spacing"]': {
			'selector': '[style*="letter-spacing"]',
			'label': 'Inline style: <code>letter-spacing</code>'
		},
		'[style*="line-height"]': {
			'selector': '[style*="line-height"]',
			'label': 'Inline style: <code>line-height</code>'
		},
		'[style*="list-style"]': {
			'selector': '[style*="list-style"]',
			'label': 'Inline style: <code>list-style</code>'
		},
		'[style*="outline"]': {
			'selector': '[style*="outline"]',
			'label': 'Inline style: <code>outline</code>'
		},
		'[style*="resize"]': {
			'selector': '[style*="resize"]',
			'label': 'Inline style: <code>resize</code>'
		},
		'[style*="text"]': {
			'selector': '[style*="text"]',
			'label': 'Inline style: <code>text</code>'
		},
		'[style*="vertical"]': {
			'selector': '[style*="vertical"]',
			'label': 'Inline style: <code>vertical</code>'
		},
		'[style*="word"]': {
			'selector': '[style*="word"]',
			'label': 'Inline style: <code>word</code>'
		},
		'[tabindex]': {
			'selector': '[tabindex]',
			'label': 'Bad attribute: <code>tabindex</code>'
		},
		'[title=""]': {
			'selector': '[title=""]',
			'label': '<code>title=""</code>'
		},
		'[valign]': {
			'selector': '[valign]',
			'label': 'Invalid attribute: <code>valign</code>'
		},
		'[vlink]': {
			'selector': '[vlink]',
			'label': 'Bad attribute: <code>vlink</code>'
		},

		// Event Handlers
		'[onAbort]': {
			'selector': '[onAbort]',
			'label': 'Bad attribute: <code>onAbort</code>'
		},
		'[onBlur]': {
			'selector': '[onBlur]',
			'label': 'Bad attribute: <code>onBlur</code>'
		},
		'[onChange]': {
			'selector': '[onChange]',
			'label': 'Bad attribute: <code>onChange</code>'
		},
		'[onClick]': {
			'selector': '[onClick]',
			'label': 'Bad attribute: <code>onClick</code>'
		},
		'[onDblClick]': {
			'selector': '[onDblClick]',
			'label': 'Bad attribute: <code>onDblClick</code>'
		},
		'[onDragDrop]': {
			'selector': '[onDragDrop]',
			'label': 'Bad attribute: <code>onDragDrop</code>'
		},
		'[onError]': {
			'selector': '[onError]',
			'label': 'Bad attribute: <code>onError</code>'
		},
		'[onFocus]': {
			'selector': '[onFocus]',
			'label': 'Bad attribute: <code>onFocus</code>'
		},
		'[onKeyDown]': {
			'selector': '[onKeyDown]',
			'label': 'Bad attribute: <code>onKeyDown</code>'
		},
		'[onKeyPress]': {
			'selector': '[onKeyPress]',
			'label': 'Bad attribute: <code>onKeyPress</code>'
		},
		'[onKeyUp]': {
			'selector': '[onKeyUp]',
			'label': 'Bad attribute: <code>onKeyUp</code>'
		},
		'[onLoad]': {
			'selector': '[onLoad]',
			'label': 'Bad attribute: <code>onLoad</code>'
		},
		'[onMouseDown]': {
			'selector': '[onMouseDown]',
			'label': 'Bad attribute: <code>onMouseDown</code>'
		},
		'[onMouseMove]': {
			'selector': '[onMouseMove]',
			'label': 'Bad attribute: <code>onMouseMove</code>'
		},
		'[onMouseOut]': {
			'selector': '[onMouseOut]',
			'label': 'Bad attribute: <code>onMouseOut</code>'
		},
		'[onMouseOver]': {
			'selector': '[onMouseOver]',
			'label': 'Bad attribute: <code>onMouseOver</code>'
		},
		'[onMouseUp]': {
			'selector': '[onMouseUp]',
			'label': 'Bad attribute: <code>onMouseUp</code>'
		},
		'[onMove]': {
			'selector': '[onMove]',
			'label': 'Bad attribute: <code>onMove</code>'
		},
		'[onReset]': {
			'selector': '[onReset]',
			'label': 'Bad attribute: <code>onReset</code>'
		},
		'[onResize]': {
			'selector': '[onResize]',
			'label': 'Bad attribute: <code>onResize</code>'
		},
		'[onSelect]': {
			'selector': '[onSelect]',
			'label': 'Bad attribute: <code>onSelect</code>'
		},
		'[onSubmit]': {
			'selector': '[onSubmit]',
			'label': 'Bad attribute: <code>onSubmit</code>'
		},
		'[onUnload]': {
			'selector': '[onUnload]',
			'label': 'Bad attribute: <code>onUnload</code>'
		},

		// Ids & Classes
		'#ContentWrapper': {
			'selector': '#ContentWrapper',
			'label': 'Bad Id: <code>ContentWrapper</code>'
		},
		'.MsoNormal': {
			'selector': '.MsoNormal',
			'label': 'Bad Class: <code>MsoNormal</code>'
		}
	};

	self.utility = {};

	self.utility.css = 'http://dl.dropbox.com/u/8864275/html-lint/html-lint.css';

	self.utility.error = function (message) {
		return '<span class="html-lint-error">' + (message || 'missing tag') + '</span>';
	};

	self.utility.jQueryVersion = '1.7.1';

	self.preInit = function () {
		var link,
			script;

		// Add CSS
		if (document.getElementById('html-lint-css') === null) {
			link = document.createElement('link');
			link.href = self.utility.css;
			link.id = 'html-lint-css';
			link.rel = 'stylesheet';
			document.body.appendChild(link);
		}

		// Add jQuery
		if (typeof jQuery !== 'undefined' && parseInt($.fn.jquery.replace(/\./g, '')) > 164) {
			self.init();
		} else {
			script = document.createElement('script');
			script.onload = self.init;
			script.id = 'html-lint-jquery';
			script.src = '//ajax.googleapis.com/ajax/libs/jquery/' + self.utility.jQueryVersion + '/jquery.min.js';
			document.body.appendChild(script);
		}
	};

	self.init = function () {
		if (typeof $ === 'undefined') {
			$ = jQuery;
		}

		self.editFlash();

		var output = '<div id="html-lint" style="display:none">' +
				'<h1>HTML-Lint</h1>' +
				'<button class="html-lint-button html-lint-close">&times;</button>' +
				'<ol class="html-lint-tab-list"></ol>' +
				'</div>';

		if ($('#html-lint').length > 0) {
			$('#html-lint').fadeOut(250, function () {
				// TODO - make DRYer
				$('body').append(output);
			});
		} else {
			// TODO - make DRYer
			$('body').append(output);
		}

		$.each(self.panel, function (index, value) {
			self.panel[index]();
		});

		self.close();
		self.tabSetup();

		$('#html-lint').fadeIn(250, function () {
			$(this).removeAttr('style');
		});
	};

	self.preInit();
}(window.HtmlLint = window.HtmlLint || {}));