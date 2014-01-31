(function (self) {
	'use strict';

	self.addPanel = function (name, output, errors) {
		var $htmlLint = $('#html-lint'),
			nameRevised = name.replace(' ', '').toLowerCase(),
			$panel = $htmlLint.find('[data-panel="' + nameRevised + '"]');

		if ($panel.length > 0) {
			$panel.remove();
		}

		if (output.length > 0) {
			$htmlLint.append('<div class="html-lint-tab-panel" data-panel="' + nameRevised + '">' + output + '</div>');

			// tab button
			$htmlLint.find('.html-lint-tab-list').append('<li><a class="html-lint-button" href="#' + nameRevised + '">' + name + '</a></li>');

			// errors
			if (errors) {
				$htmlLint.find('[href="#' + nameRevised + '"]').append('<b class="html-lint-error html-lint-error-count">' + errors + '</b>');
			}
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
			currentErrors = $(index).length;

			if (currentErrors > 0) {
				errors += currentErrors;
				output += '<p><i>' + self.utility.error(currentErrors) + '</i>' + test.label + '</p>';
				//$(index).addClass('html-lint-error-highlight').attr('data-html-lint', test.label);

				console.warn(index, $(index));
			}
		});

		self.addPanel('Tests', output, errors);
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
					tag = self.utility.error();
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
			} else if ($value.attr('itemprop')) {
				output += '<dt>itemprop="' + $value.attr('itemprop') + '"</dt>';
			}

			output += '<dd>';

			if ($value.attr('content')) {
				if ($value.attr('name') === 'msapplication-TileImage') {
					output += '<img src="' + $value.attr('content') + '" style="background-color:' + $metaTags.filter($('meta[name="msapplication-TileColor"]')).attr('content') + '">';
				} else if ($value.attr('content').indexOf('http') === 0 || $value.attr('content').indexOf('.txt') > 0) {
					output += '<a href="' + $value.attr('content') + '">' + $value.attr('content') + '</a>';
				} else {
					output += $value.attr('content');
				}
			} else if ($value.attr('charset')) {
				output += $value.attr('charset');
			} else {
				output += self.utility.error('missing value');
				errors += 1;
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
						output += '<dd>' + self.utility.error('missing value') + '</dd>';
						errors += 1;
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
						output += '<dd>' + self.utility.error('missing value') + '</dd>';
						errors += 1;
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
				output += '<dt>' +
					$value.attr('rel') +
					$value.attr('sizes') ? ' (' + $value.attr('sizes') + ')' : '' +
					'</dt>' +
					'<dd>' +
					'<img src="' + $value.attr('href') + '" alt="' + $value.attr('rel') + '" />' +
					'</dd>';
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
			output = '';

		// TODO - write this all better

		/* ---- Chartbeat ---- */
		if (window._sf_async_config) {
			output += '<dt>Chartbeat</dt><dd>-</dd>';
		}

		/* ---- Cufon ---- */
		if (window.Cufon) {
			output += '<dt>Cufon</dt>';
			output += '<dd>' + self.utility.error('obsolete') + '</dd>';
			errors += 1;
		}

		/* ---- Disqus ---- */
		if (window.disqus_domain) {
			output += '<dt>Disqus</dt><dd>-</dd>';
		}

		/* ---- Google Analytics ---- */
		if (window._gaq || window._gat) {
			output += '<dt>Google Analytics</dt><dd>-</dd>';
		}

		/* ---- jQuery ---- */
		if (!(self.utility.jQueryAdded)) {
			output += '<dt>jQuery</dt><dd>' + $.fn.jquery;

			if ($.fn.jquery !== self.utility.jQuery[0] && $.fn.jquery !== self.utility.jQuery[1]) {
				output += ' ' + self.utility.error('update to ' + self.utility.jQuery[0] + ' or ' + self.utility.jQuery[1]);
				errors += 1;
			}

			output += '</dd>';
		}

		/* ---- jQuery UI ---- */
		if ($.ui) {
			output += '<dt>jQuery UI</dt><dd>' + $.ui.version;

			if ($.ui.version !== self.utility.jQueryUI) {
				output += ' ' + self.utility.error('update to ' + self.utility.jQueryUI);
				errors += 1;
			}

			output += '</dd>';
		}

		/* ---- KISS Insights ---- */
		if (window.$KI) {
			output += '<dt>KISS Insights</dt><dd>-</dd>';
		}

		/* ---- Mint ---- */
		if (window.Mint) {
			output += '<dt>Mint</dt><dd>-</dd>';
		}

		/* ---- Modernizr ---- */
		if (window.Modernizr) {
			output += '<dt>Modernizr</dt><dd>' + Modernizr._version;

			if (Modernizr._version !== self.utility.Modernizr) {
				output += ' ' + self.utility.error('update to ' + self.utility.Modernizr);
				errors += 1;
			}

			output += '</dd>';
		}

		/* ---- MooTools ---- */
		if (window.MooTools) {
			output += '<dt>MooTools</dt><dd>' + MooTools.version;

			if (MooTools.version !== self.utility.MooTools) {
				output += ' ' + self.utility.error('update to ' + self.utility.MooTools);
				errors += 1;
			}

			output += '</dd>';
		}

		/* ---- Prototype ---- */
		if (window.Prototype) {
			output += '<dt>Prototype</dt>';
			output += '<dd>' + window.Prototype.Version + ' ' + self.utility.error('who uses Prototype anymore?') + '</dd>';
			errors += 1;
		}

		/* ---- RequireJS ---- */
		if (window.require) {
			output += '<dt>RequireJS</dt><dd>' + require.version;

			if (require.version !== self.utility.RequireJS) {
				output += ' ' + self.utility.error('update to ' + self.utility.RequireJS);
				errors += 1;
			}

			output += '</dd>';
		}

		/* ---- Respond.js ---- */
		if (window.respond && window.respond.mediaQueriesSupported) {
			output += '<dt>Respond.js</dt><dd>-</dd>';
		}

		/* ---- SWFObject ---- */
		if (window.swfobject || window.SWFObject) {
			output += '<dt>SWFObject</dt><dd>-</dd>';
		}

		/* ---- Typekit ---- */
		if (window.Typekit) {
			output += '<dt>Typekit</dt>';
			output += '<dd>' + $('html').attr('class') + '</dd>';
		}

		/* ---- WebFontConfig ---- */
		if (window.WebFontConfig) {
			if (window.WebFontConfig.google) {
				output += '<dt>Google Webfonts</dt>';
				output += '<dd>' + WebFontConfig.google.families + '</dt>';
			} else if (window.WebFontConfig.fontdeck) {
				output += '<dt>Fontdeck</dt>';
				output += '<dd>-</dt>';
			} else if (window.WebFontConfig.custom) {
				output += '<dt>WebFonts (Fontdeck?)</dt>';
				output += '<dd>' + WebFontConfig.custom.families.join('<br />') + '</dt>';
			}
		}

		/* ---- Wufoo ---- */
		if (window.__wufooForms) {
			output += '<dt>Wufoo Forms</dt><dd>-</dd>';
		}

		/* ---- YUI ---- */
		if (window.YUI) {
			output += '<dt>YUI</dt><dd>' + window.YUI.version;

			if (window.YUI.version !== self.utility.YUI) {
				output += ' ' + self.utility.error('update to ' + self.utility.YUI);
				errors += 1;
			}

			output += '</dd>';
		}

		/* ---- YepNope ---- */
		if (window.window.yepnope) {
			output += '<dt>yepnope</dt><dd>-</dd>';
		}

		if (output.length > 0) {
			output += '<dl>' + output + '</dl>';
		}

		self.addPanel('Technology', output, errors);
	};

	self.panel.tests = function () {
		self.handleErrors(self.test);
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

		$htmlLint.find('h2').append(self.utility.error(errors));
	};

	self.tabAction = function ($href, $tabList, $tabPanels) {
		var $panelName = $href.replace('#', ''),
			$tabListCurrent = $tabList.find('a[href="' + $href + '"]'),
			$tabPanelCurrent = $tabPanels.filter('[data-panel="' + $panelName + '"]');

		if (!$tabListCurrent.hasClass('selected')) {
			// tab button
			$tabList.find('a').removeClass('selected');
			$tabListCurrent.addClass('selected');

			// panel
			$tabPanels.removeClass('selected');
			$tabPanelCurrent.addClass('selected');
		}
	};

	self.test = {
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

		// ---- Attributes ----
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
		'a[target]': {
			'label': '<code>a[target]</code>'
		},
		//'head script:not([src*="hasJS.js"], [src*="swfobject.js"], [src*="google-analytics.com"])': {
		//	'label': '<code>&lt;script&gt;</code> in the <code>&lt;head&gt;</code>'
		//},
		'fieldset:not(:has(legend))': {
			'label': '<code>&lt;fieldset&gt;</code> missing <code>&lt;legend&gt;</code>'
		},
		'fieldset *:not(legend):first-child': {
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
			'label': '<code>&lt;img&gt;</code> missing <code>alt</code>'
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
		'th:not([scope])': {
			'label': '<code>&lt;th&gt;</code> missing <code>scope</code>'
		},
		'th[scope=""]': {
			'label': '<code>th[scope=""]</code>'
		},
		':not("canvas, img, object")[width]': {
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

		// Event Handlers
		'[onAbort]': {
			'label': 'Bad attribute: <code>onAbort</code>'
		},
		'[onBlur]': {
			'label': 'Bad attribute: <code>onBlur</code>'
		},
		'[onChange]': {
			'label': 'Bad attribute: <code>onChange</code>'
		},
		'[onClick]': {
			'label': 'Bad attribute: <code>onClick</code>'
		},
		'[onDblClick]': {
			'label': 'Bad attribute: <code>onDblClick</code>'
		},
		'[onDragDrop]': {
			'label': 'Bad attribute: <code>onDragDrop</code>'
		},
		'[onError]': {
			'label': 'Bad attribute: <code>onError</code>'
		},
		'[onFocus]': {
			'label': 'Bad attribute: <code>onFocus</code>'
		},
		'[onKeyDown]': {
			'label': 'Bad attribute: <code>onKeyDown</code>'
		},
		'[onKeyPress]': {
			'label': 'Bad attribute: <code>onKeyPress</code>'
		},
		'[onKeyUp]': {
			'label': 'Bad attribute: <code>onKeyUp</code>'
		},
		'[onLoad]': {
			'label': 'Bad attribute: <code>onLoad</code>'
		},
		'[onMouseDown]': {
			'label': 'Bad attribute: <code>onMouseDown</code>'
		},
		'[onMouseMove]': {
			'label': 'Bad attribute: <code>onMouseMove</code>'
		},
		'[onMouseOut]': {
			'label': 'Bad attribute: <code>onMouseOut</code>'
		},
		'[onMouseOver]': {
			'label': 'Bad attribute: <code>onMouseOver</code>'
		},
		'[onMouseUp]': {
			'label': 'Bad attribute: <code>onMouseUp</code>'
		},
		'[onMove]': {
			'label': 'Bad attribute: <code>onMove</code>'
		},
		'[onReset]': {
			'label': 'Bad attribute: <code>onReset</code>'
		},
		'[onResize]': {
			'label': 'Bad attribute: <code>onResize</code>'
		},
		'[onSelect]': {
			'label': 'Bad attribute: <code>onSelect</code>'
		},
		'[onSubmit]': {
			'label': 'Bad attribute: <code>onSubmit</code>'
		},
		'[onUnload]': {
			'label': 'Bad attribute: <code>onUnload</code>'
		},

		// Ids & Classes
		'#ContentWrapper': {
			'label': 'Bad Id: <code>ContentWrapper</code>'
		},
		'.MsoNormal': {
			'label': 'Bad Class: <code>MsoNormal</code>'
		}
	};

	self.utility = {
		css: 'http://' + ((document.getElementById('html-lint-js').getAttribute('src').indexOf('?dev') > 0) ? 'dl.dropbox.com/u/8864275' : 'curtisj44.github.com') + '/HTML-Lint/html-lint.css',

		error: function (message) {
			return '<span class="html-lint-error">' + (message || 'missing tag') + '</span>';
		},

		jQueryAdded: false,

		jQuery: ['1.11.0', '2.1.0'],
		jQueryUI: '1.10.4',
		Modernizr: '2.7.1',
		MooTools: '1.4.5',
		RequireJS: '2.1.10',
		YUI: '3.14.1'
	};

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
		if (typeof jQuery !== 'undefined' && !!jQuery.fn && parseInt(jQuery.fn.jquery.replace(/\./g, ''), 10) > 164) {
			self.init();
		} else {
			self.utility.jQueryAdded = true;
			script = document.createElement('script');
			script.onload = self.init;
			script.id = 'html-lint-jquery';
			script.src = '//ajax.googleapis.com/ajax/libs/jquery/' + self.utility.jQuery[0] + '/jquery.min.js';
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
				'<h2>Total Errors</h2>' +
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