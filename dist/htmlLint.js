(function (htmlLint) {
	'use strict';

	htmlLint.addPanel = function (name, output, errors) {
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
}(window.htmlLint = window.htmlLint || {}));
(function (htmlLint) {
	'use strict';

	htmlLint.close = function () {
		var $closeButton = $('.html-lint-close');

		$closeButton.bind('click', function () {
			htmlLint.closeAction($closeButton);
			return false;
		});

		$(document).bind('keyup', function (e) {
			if (e.keyCode === 27) {
				htmlLint.closeAction($closeButton);
			}
		});
	};
}(window.htmlLint = window.htmlLint || {}));
(function (htmlLint) {
	'use strict';

	htmlLint.closeAction = function ($closeButton) {
		$closeButton.parent().fadeOut(250, function () {
			$(this).remove();
			$('#html-lint-css, #html-lint-jquery, #html-lint-js').remove();
		});
	};
}(window.htmlLint = window.htmlLint || {}));
(function (htmlLint) {
	'use strict';

	htmlLint.editFlash = function () {
		var $flashObjects = $('object, embed');

		if (
			$flashObjects.length > 0 &&
			$flashObjects.find('param[name="wmode"]').attr('value') !== 'opaque'
		) {
			$('<param />', {
				name: 'wmode',
				value: 'opaque'
			}).appendTo($flashObjects);

			$flashObjects.attr('wmode', 'opaque').hide().show();
		}
	};
}(window.htmlLint = window.htmlLint || {}));
(function (htmlLint) {
	'use strict';

	htmlLint.handleErrors = function (tests) {
		var errors = 0,
			currentErrors,
			output = '';

		$.each(tests, function (index, test) {
			currentErrors = $(index).length;

			if (currentErrors > 0) {
				errors += currentErrors;
				output += '<p><i>' + htmlLint.utility.error(currentErrors) + '</i>' + test.label + '</p>';
				//$(index).addClass('html-lint-error-highlight').attr('data-html-lint', test.label);

				console.warn(index, $(index));
			}
		});

		htmlLint.addPanel('Tests', output, errors);
	};
}(window.htmlLint = window.htmlLint || {}));
(function (htmlLint) {
	'use strict';

	htmlLint.init = function () {
		var $htmlLint = $('#html-lint'),
			isMock = window.location.protocol === 'file:' && window.location.pathname.indexOf('/mocks/') > 0,
			output = '<div id="html-lint">' +
				'<h1>HTML-Lint</h1>' +
				'<h2>Total Errors</h2>' +
				'<button class="html-lint-button html-lint-close">&times;</button>' +
				'<ol class="html-lint-tab-list"></ol>' +
				'</div>';

		if (typeof $ === 'undefined') $ = jQuery;

		if (!isMock) {
			htmlLint.editFlash();

			if ($htmlLint.length > 0) {
				$htmlLint.fadeOut(250, function () {
					// TODO - make DRYer
					$('body').append(output);
				});
			} else {
				// TODO - make DRYer
				$('body').append(output);
			}

			$.each(htmlLint.panel, function (index, value) {
				htmlLint.panel[index]();
			});

			$htmlLint.fadeIn(250, function () {
				$(this).removeAttr('style');
			});
		}

		htmlLint.close();
		htmlLint.tabSetup();
	};
}(window.htmlLint = window.htmlLint || {}));
(function (htmlLint) {
	'use strict';

	htmlLint.panel = {};

	htmlLint.panel.metaData = function () {
		var errors = 0,
			output = '<dl>',

			$head = $('head'),
			$metaTags = $head.find('meta'),
			$title = $head.find('title').html(),
			$charset = $metaTags.filter('meta[charset], meta[http-equiv="content-type"], meta[http-equiv="Content-Type"]'),
			$description = $metaTags.filter('meta[name="description"], meta[name="Description"]'),
			$keywords = $metaTags.filter('meta[name="keywords"], meta[name="Keywords"]'),
			$viewport = $metaTags.filter('meta[name="viewport"]'),

			checkTag = function (tag) {
				if (!tag) {
					tag = htmlLint.utility.error();
					errors += 1;
				}
				return tag;
			};

		// title
		output += '<dt>&lt;title&gt;</dt><dd>' + checkTag($title) + '</dd>';

		// charset
		if ($charset.length < 1) {
			output += '<dt>charset</dt><dd>' + htmlLint.utility.error() + '</dd>';
			errors += 1;
		} else if ($charset[0] !== $head.children()[0]) {
			output += '<dt>Character Encoding</dt><dd>' + htmlLint.utility.error('not first child of <code>&lt;head&gt;</code>') + '</dd>';
			errors += 1;
		}

		// description
		if ($description.length < 1) {
			output += '<dt>description</dt><dd>' + htmlLint.utility.error() + '</dd>';
			errors += 1;
		}

		// keywords
		if ($keywords.length < 1) {
			output += '<dt>keywords</dt><dd>' + htmlLint.utility.error() + '</dd>';
			errors += 1;
		}

		$metaTags.not('meta[property^="og:"], meta[property^="fb:"]').each(function (index, value) {
			var $value = $(value),
				contentAttr = $value.attr('content');

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

			if (contentAttr) {
				if ($value.attr('name') === 'msapplication-TileImage') {
					output += '<img src="' + contentAttr + '" style="background-color:' + $metaTags.filter($('meta[name="msapplication-TileColor"]')).attr('content') + '" alt="msapplication-TileImage">';
				} else if (
					contentAttr.indexOf('http') === 0 ||
					contentAttr.indexOf('.txt') > 0
				) {
					output += '<a href="' + contentAttr + '">' + contentAttr + '</a>';
				} else {
					output += contentAttr;
				}

				//  minimal-ui
				if (contentAttr.indexOf('minimal-ui') > 0) {
					output += ' ' + htmlLint.utility.error('<code>minimal-ui</code> has been retired');
				}

				// viewport
				if (
					// http://adrianroselli.com/2015/10/dont-disable-zoom.html
					contentAttr.indexOf('user-scalable=0') > 0 ||
					contentAttr.indexOf('user-scalable=no') > 0 ||
					contentAttr.indexOf('maximum-scale') > 0 ||
					contentAttr.indexOf('minimum-scale') > 0
				) {
					output += ' ' + htmlLint.utility.error('don&rsquo;t prevent user zoom');
				}
			} else if ($value.attr('charset')) {
				output += $value.attr('charset');
			} else {
				output += htmlLint.utility.error('missing value');
				errors += 1;
			}

			output += '</dd>';
		});

		output += '</dl>';

		htmlLint.addPanel('Meta Data', output, errors);
	};

	htmlLint.panel.openGraph = function () {
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
								output += '<dd>' + htmlLint.utility.error() + ' = ' + $content + '</dd>';
							}
						} else if ($property === 'og:url') {
							output += '<dd><a href="' + $content + '">' + $content + '</a></dd>';
						} else {
							output += '<dd>' + $content + '</dd>';
						}
					} else {
						output += '<dd>' + htmlLint.utility.error('missing value') + '</dd>';
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
							output += '<dd><a href="https://www.facebook.com/apps/application.php?id=' + $content + '">' + $content + '</a></dd>';
						} else if ($property === 'fb:admins') {
							adminIds = $content.split(',');

							$.each(adminIds, function (index, value) {
								adminLinks += '<a href="https://www.facebook.com/profile.php?id=' + value + '">' + value + '</a> ';
							});

							output += '<dd>' + adminLinks + '</dd>';
						} else {
							output += '<dd>' + $content + '</dd>';
						}
					} else {
						output += '<dd>' + htmlLint.utility.error('missing value') + '</dd>';
						errors += 1;
					}
				});
			}
		} else {
			output += '<dt>Open Graph</dt><dd>' + htmlLint.utility.error('missing tags') + '</dd>';
			errors += 1;
		}

		output += '</dl>';

		htmlLint.addPanel('Open Graph', output, errors);
	};

	htmlLint.panel.overview = function () {
		var errors = 0,
			$appleTouchIcons = $('link[rel*="apple-touch-icon"]'),
			$shortcutIcons = $('link[rel="shortcut icon"], link[rel="icon"]'),
			$icons = $appleTouchIcons.add($shortcutIcons),
			output = '<dl>';

		if ($icons.length > 0) {
			$icons.each(function (index, value) {
				var $value = $(value);

				output += '<dt>' +
					$value.attr('rel') +
					($value.attr('sizes') ? ' (' + $value.attr('sizes') + ')' : '') +
					'</dt>' +
					'<dd>' +
					'<img src="' + $value.attr('href') + '" alt="' + $value.attr('rel') + '" />' +
					'</dd>';
			});
		}

		// no apple-touch-icon
		if ($appleTouchIcons.length < 0) {
			output += '<dt>apple-touch-icon</dt><dd>' + htmlLint.utility.error() + '</dd>';
			errors += 1;
		}

		// no shortcut icon
		if ($shortcutIcons.length < 0) {
			output += '<dt>shortcut icon</dt><dd>' + htmlLint.utility.error() + '</dd>';
			errors += 1;
		}

		output += '</dl>';

		htmlLint.addPanel('Overview', output, errors);
	};

	htmlLint.panel.technology = function () {
		var errors = 0,
			output = '<dl>';

		// TODO - write this all better

		/* ---- Chartbeat ---- */
		if (window._sf_async_config) {
			output += '<dt>Chartbeat</dt><dd>-</dd>';
		}

		/* ---- Cufon ---- */
		if (window.Cufon) {
			output += '<dt>Cufon</dt>';
			output += '<dd>' + htmlLint.utility.error('obsolete') + '</dd>';
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
		if (!(htmlLint.utility.jQueryAdded)) {
			output += '<dt>jQuery</dt><dd>' + $.fn.jquery;

			if ($.fn.jquery !== htmlLint.utility.jQuery[0] && $.fn.jquery !== htmlLint.utility.jQuery[1]) {
				output += ' ' + htmlLint.utility.error('update to ' + htmlLint.utility.jQuery[0] + ' or ' + htmlLint.utility.jQuery[1]);
				errors += 1;
			}

			output += '</dd>';
		}

		/* ---- jQuery UI ---- */
		if ($.ui) {
			output += '<dt>jQuery UI</dt><dd>' + $.ui.version;

			if ($.ui.version !== htmlLint.utility.jQueryUI) {
				output += ' ' + htmlLint.utility.error('update to ' + htmlLint.utility.jQueryUI);
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

			if (Modernizr._version !== htmlLint.utility.Modernizr) {
				output += ' ' + htmlLint.utility.error('update to ' + htmlLint.utility.Modernizr);
				errors += 1;
			}

			output += '</dd>';
		}

		/* ---- MooTools ---- */
		if (window.MooTools) {
			output += '<dt>MooTools</dt><dd>' + MooTools.version;

			if (MooTools.version !== htmlLint.utility.MooTools) {
				output += ' ' + htmlLint.utility.error('update to ' + htmlLint.utility.MooTools);
				errors += 1;
			}

			output += '</dd>';
		}

		/* ---- New Relic ---- */
		if (window.NREUM) {
			output += '<dt>New Relic</dt><dd>-</dd>';
		}

		/* ---- Prototype ---- */
		if (window.Prototype) {
			output += '<dt>Prototype</dt>';
			output += '<dd>' + window.Prototype.Version + ' ' + htmlLint.utility.error('who uses Prototype anymore?') + '</dd>';
			errors += 1;
		}

		/* ---- RequireJS ---- */
		if (window.require) {
			output += '<dt>RequireJS</dt><dd>' + require.version;

			if (require.version !== htmlLint.utility.RequireJS) {
				output += ' ' + htmlLint.utility.error('update to ' + htmlLint.utility.RequireJS);
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

		/* ---- Tealium ---- */
		if (window.utag) {
			output += '<dt>Tealium</dt><dd>' + utag.cfg.v + '</dd>';
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
			output += '<dt>YUI</dt>';
			output += '<dd>' + window.YUI.version + ' ' + htmlLint.utility.error('YUI is no longer in development') + '</dd>';
			errors += 1;
		}

		/* ---- YepNope ---- */
		if (window.window.yepnope) {
			output += '<dt>yepnope</dt><dd>-</dd>';
		}

		output += '</dl>';

		if (output === '<dl></dl>') {
			output = '';
		}

		htmlLint.addPanel('Technology', output, errors);
	};

	htmlLint.panel.tests = function () {
		htmlLint.handleErrors(htmlLint.test);
	};
}(window.htmlLint = window.htmlLint || {}));

(function (htmlLint) {
	'use strict';

	htmlLint.preInit = function () {
		var link,
			script;

		// Add CSS
		if (document.getElementById('html-lint-css') === null) {
			link = document.createElement('link');
			link.href = htmlLint.utility.css;
			link.id = 'html-lint-css';
			link.rel = 'stylesheet';
			document.body.appendChild(link);
		}

		// Add jQuery
		// if (typeof jQuery !== 'undefined' && !!jQuery.fn && parseInt(jQuery.fn.jquery.replace(/\./g, ''), 10) > 164) {
		if (typeof $ !== 'undefined' && !!$.fn && parseInt($.fn.jquery.replace(/\./g, ''), 10) > 164) {
			htmlLint.init();
		} else {
			htmlLint.utility.jQueryAdded = true;
			script = document.createElement('script');
			script.onload = htmlLint.init;
			script.id = 'html-lint-jquery';
			script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js';
			document.body.appendChild(script);
		}
	};
}(window.htmlLint = window.htmlLint || {}));

(function (htmlLint) {
	'use strict';

	htmlLint.tabAction = function ($href, $tabList, $tabPanels) {
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
}(window.htmlLint = window.htmlLint || {}));
(function (htmlLint) {
	'use strict';

	htmlLint.tabSetup = function () {
		var errors = 0,
			$htmlLint = $('#html-lint'),
			$tabList = $htmlLint.find('.html-lint-tab-list'),
			$tabPanels = $htmlLint.find('.html-lint-tab-panel');

		// tab button
		$tabList.find('a').bind('click', function () {
			htmlLint.tabAction($(this).attr('href'), $tabList, $tabPanels);
			return false;
		});

		// open first panel
		$tabList.find('li:first-child a').trigger('click');

		// total error count
		$.each($tabList.find('.html-lint-error-count'), function (index, value) {
			errors += parseInt($(value).html(), 10);
		});

		$htmlLint.find('h2').append(htmlLint.utility.error(errors));
	};
}(window.htmlLint = window.htmlLint || {}));
// TODO: keep in sync with `/lib/tests.js`
(function (htmlLint) {
	'use strict';

	htmlLint.test = {
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

		// > Describe the image briefly, but avoid the phrase “image of” or “graphic of”. Because screen readers already know it is a graphic.
		// https://www.marcozehe.de/2015/12/14/the-web-accessibility-basics/
		'img[alt*="graphic of"]': {
			'label': '"graphic of" used in `img` `alt`'
		},
		'img[alt*="image of"]': {
			'label': '"image of" used in `img` `alt`'
		},
		'img[alt*="picture of"]': {
			'label': '"picture of" used in `img` `alt`'
		},

		'img[src=""]': {
			'label': '<code>img[src=""]</code>'
		},
		'img[width="1"][height="1"]': {
			'label': 'Tracking pixel <code>img</code>'
		},
		// `button` provides more styling options, pseudo elements, and embedding of more than a text string
		'input[type="submit"]': {
			'label': 'Prefer <code>&lt;button type="submit"&gt;</code> over <code>&lt;input type="submit"&gt;</code>'
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
		// https://msdn.microsoft.com/en-us/library/jj676915%28v=vs.85%29.aspx?f=255&MSPPError=-2147217396
		'meta[http-equiv="X-UA-Compatible"]': {
			'label': 'Specifying a legacy document mode via <code>X-UA-Compatible</code> is considered deprecated and should no longer be used'
		},
		// https://developer.apple.com/library/ios/releasenotes/General/RN-iOSSDK-8.0/
		'meta[name="viewport"][content*="minimal-ui"]': {
			'label': '<code>minimal-ui</code> has been retired'
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

		':not("canvas, img, object, rect, svg")[height]': {
			'label': 'Invalid attribute: <code>height</code>'
		},
		':not("canvas, img, object, rect, svg")[width]': {
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
		// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role
		'[role="button"]': {
			'label': '<code>[role="button"]</code>'
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
		'[oncopy]': {
			'label': 'Non-standard, inline event handler: <code>oncopy</code>'
		},
		'[oncuechange]': {
			'label': 'Inline event handler: <code>oncuechange</code>'
		},
		'[oncut]': {
			'label': 'Non-standard, inline event handler: <code>oncut</code>'
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
		'[onpaste]': {
			'label': 'Non-standard, inline event handler: <code>onpaste</code>'
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
		},

		// http://guides.rubyonrails.org/i18n.html#adding-translations
		'.translation_missing, [placeholder*="translation_missing"]': {
			'label': 'Missing Rails i18n string'
		}
	};
}(window.htmlLint = window.htmlLint || {}));

(function (htmlLint) {
	'use strict';

	htmlLint.utility = {
		css: 'https://curtisj44.github.io/HTML-Lint/dist/html-lint.min.css',

		error: function (message) {
			return '<span class="html-lint-error">' + (message || 'missing tag') + '</span>';
		},

		jQueryAdded: false,

		jQuery: ['1.12.4', '3.0.0'],
		jQueryUI: '1.12.0',
		Modernizr: '3.3.1',
		MooTools: '1.6.0',
		RequireJS: '2.2.0'
	};

	// TODO - organize this better
	htmlLint.preInit();

}(window.htmlLint = window.htmlLint || {}));
