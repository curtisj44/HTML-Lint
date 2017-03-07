'use strict';

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
})(window.htmlLint = window.htmlLint || {});
'use strict';

(function (htmlLint) {
	'use strict';

	htmlLint.close = function () {
		var $closeButton = $('.html-lint-close');

		$closeButton.on('click', function () {
			htmlLint.closeAction($closeButton);
			return false;
		});

		$(document).on('keyup', function (e) {
			if (e.keyCode === 27) {
				htmlLint.closeAction($closeButton);
			}
		});
	};
})(window.htmlLint = window.htmlLint || {});
'use strict';

(function (htmlLint) {
	'use strict';

	var _this = this;

	htmlLint.closeAction = function ($closeButton) {
		$closeButton.parent().fadeOut(250, function () {
			$(_this).remove();
			$('#html-lint-css, #html-lint-jquery, #html-lint-js').remove();
		});
	};
})(window.htmlLint = window.htmlLint || {});
'use strict';

(function (htmlLint) {
	'use strict';

	htmlLint.editFlash = function () {
		var $flashObjects = $('object, embed');

		if ($flashObjects.length > 0 && $flashObjects.find('param[name="wmode"]').attr('value') !== 'opaque') {
			$('<param />', {
				name: 'wmode',
				value: 'opaque'
			}).appendTo($flashObjects);

			$flashObjects.attr('wmode', 'opaque').hide().show();
		}
	};
})(window.htmlLint = window.htmlLint || {});
'use strict';

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
})(window.htmlLint = window.htmlLint || {});
'use strict';

(function (htmlLint) {
	'use strict';

	var _this = this;

	htmlLint.init = function () {
		var $htmlLint = $('#html-lint'),
		    isMock = window.location.protocol === 'file:' && window.location.pathname.indexOf('/mocks/') > 0,
		    output = '<div id="html-lint">' + '<h1>HTML-Lint</h1>' + '<h2>Total Errors</h2>' + '<button class="html-lint-button html-lint-close">&times;</button>' + '<ol class="html-lint-tab-list"></ol>' + '</div>';

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
				$(_this).removeAttr('style');
			});
		}

		htmlLint.close();
		htmlLint.tabSetup();
	};
})(window.htmlLint = window.htmlLint || {});
'use strict';

(function (htmlLint) {
	'use strict';

	var _this = this;

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
		    checkTag = function checkTag(tag) {
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
				} else if (contentAttr.indexOf('http') === 0 || contentAttr.indexOf('.txt') > 0) {
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
				contentAttr.indexOf('user-scalable=0') > 0 || contentAttr.indexOf('user-scalable=no') > 0 || contentAttr.indexOf('maximum-scale') > 0 || contentAttr.indexOf('minimum-scale') > 0) {
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
					var $property = $(_this).attr('property'),
					    $content = $(_this).attr('content');

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
					var $property = $(_this).attr('property'),
					    $content = $(_this).attr('content'),
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

				output += '<dt>' + $value.attr('rel') + ($value.attr('sizes') ? ' (' + $value.attr('sizes') + ')' : '') + '</dt>' + '<dd>' + '<img src="' + $value.attr('href') + '" alt="' + $value.attr('rel') + '" />' + '</dd>';
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

		/* ---- Hotjar ---- */
		// https://docs.hotjar.com/docs/hotjar-tracking-code
		if (window.hj) {
			output += '<dt>Hotjar</dt><dd>-</dd>';
		}

		/* ---- jQuery ---- */
		if (!htmlLint.utility.jQueryAdded) {
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

		/* ---- Optimizely ---- */
		if (window.optly) {
			output += '<dt>Optimizely</dt><dd>-</dd>';
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
})(window.htmlLint = window.htmlLint || {});
'use strict';

(function (htmlLint) {
	'use strict';

	htmlLint.preInit = function () {
		var link, script;

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
})(window.htmlLint = window.htmlLint || {});
'use strict';

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
})(window.htmlLint = window.htmlLint || {});
'use strict';

(function (htmlLint) {
	'use strict';

	htmlLint.tabSetup = function () {
		var errors = 0,
		    $htmlLint = $('#html-lint'),
		    $tabList = $htmlLint.find('.html-lint-tab-list'),
		    $tabPanels = $htmlLint.find('.html-lint-tab-panel');

		// tab button
		$tabList.find('a').on('click', function () {
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
})(window.htmlLint = window.htmlLint || {});
'use strict';

(function (htmlLint) {
	'use strict';

	htmlLint.utility = {
		css: 'https://curtisj44.github.io/HTML-Lint/dist/html-lint.min.css',

		error: function error(message) {
			return '<span class="html-lint-error">' + (message || 'missing tag') + '</span>';
		},

		jQueryAdded: false,

		jQuery: ['1.12.4', '3.1.1'],
		jQueryUI: '1.12.0',
		Modernizr: '3.3.1',
		MooTools: '1.6.0',
		RequireJS: '2.2.0'
	};

	// TODO - organize this better
	htmlLint.preInit();
})(window.htmlLint = window.htmlLint || {});
'use strict';

var tests = {
	// ---- Tags ----
	'a:empty, b:empty, abbr:empty, acronym:empty, button:empty, dd:empty, div:empty, dl:empty, dt:empty, h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty, form:empty, fieldset:empty, label:empty, li:empty, ol:empty, p:empty, span:empty, strong:empty, ul:empty': {
		'label': 'empty tag'
	},
	'applet': {
		'label': '`applet`'
	},
	'center': {
		'label': '`center`'
	},
	'font': {
		'label': '`font`'
	},
	'iframe': {
		'label': '`iframe`'
	},
	'noscript': {
		'label': '`noscript`'
	},
	's': {
		'label': '`s`'
	},
	'strike': {
		'label': '`strike`'
	},
	'u': {
		'label': '`u`'
	},
	'br + br': {
		'label': 'Multiple `br`’s (* not quite accurate)'
	},

	// // ---- Attributes ----
	':contains("=NOTFOUND!")': {
		'label': 'Missing SiteCore resource'
	},

	'abbr:not([title])': {
		'label': '`abbr` missing `title`'
	},
	'acronym:not([title])': {
		'label': '`acronym` missing `title`'
	},
	'a:contains("Click here"), a:contains("click here")': {
		'label': '“Click here” used as link text'
	},
	'a:contains("Read more"), a:contains("Read more")': {
		'label': '“Read more” used as link text'
	},
	'a:not([href])': {
		'label': '`a` missing `href`'
	},
	'a[href=""]': {
		'label': '`a[href=""]`'
	},
	'a[href="#"]': {
		'label': '`a[href="#"]`'
	},
	'a[href*="javascript:"]': {
		'label': '`a[href*="javascript:"]`'
	},
	'a[href*="<"]': {
		'label': '`a[href*="<"]`'
	},
	'a[href*=">"]': {
		'label': '`a[href*=">"]`'
	},
	'a[href*="{"]': {
		'label': '`a[href*="{"]`'
	},
	'a[href*="}"]': {
		'label': '`a[href*="}"]`'
	},
	'a[target]': {
		'label': '`a[target]`'
	},
	//'head script:not([src*="hasJS.js"], [src*="swfobject.js"], [src*="google-analytics.com"])': {
	//	'label': '`script` in the `head`'
	//},
	'fieldset:not(:has(legend))': {
		'label': '`fieldset` missing `legend`'
	},
	'fieldset > *:not(legend):first-child': {
		'label': '`fieldset`’s first child is not `legend`'
	},
	'form[action=""]': {
		'label': '`form[action=""]`'
	},
	'form[action="#"]': {
		'label': '`form[action="#"]`'
	},
	'form:not(:has(fieldset))': {
		'label': '`form` missing `fieldset`'
	},

	// application caching feature via the `manifest` attribute is deprecated and highly discouraged:
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache
	'html[manifest]': {
		'label': '`manifest` attribute is deprecated'
	},

	'input[type="text"]': {
		'label': '`type="text"` is not needed on `input`'
	},
	'img:not([alt])': {
		'label': '`img` missing `alt` attribute'
	},
	'img:not(".tracking")[alt=""]': {
		'label': '`img[alt=""]`'
	},

	// > Describe the image briefly, but avoid the phrase “image of” or “graphic of”. Because screen readers already know it is a graphic.
	// https://www.marcozehe.de/2015/12/14/the-web-accessibility-basics/
	'img[alt*="graphic of"]': {
		'label': '"graphic of" used in `img` `alt`'
	},
	'img[alt*="Graphic of"]': {
		'label': '"Graphic of" used in `img` `alt`'
	},
	'img[alt*="image of"]': {
		'label': '"image of" used in `img` `alt`'
	},
	'img[alt*="Image of"]': {
		'label': '"Image of" used in `img` `alt`'
	},
	'img[alt*="photo of"]': {
		'label': '"photo of" used in `img` `alt`'
	},
	'img[alt*="Photo of"]': {
		'label': '"Photo of" used in `img` `alt`'
	},
	'img[alt*="picture of"]': {
		'label': '"picture of" used in `img` `alt`'
	},
	'img[alt*="Picture of"]': {
		'label': '"Picture of" used in `img` `alt`'
	},

	'img[src=""]': {
		'label': '`img[src=""]`'
	},
	'img[width="1"][height="1"]': {
		'label': 'Tracking pixel `img`'
	},
	// `button` provides more styling options, pseudo elements, and embedding of more than a text string
	'input[type="submit"]': {
		'label': 'Prefer `<button type="submit">` over `<input type="submit">`'
	},
	'label:not([for])': {
		'label': '`label` missing `for`'
	},
	'body link:not("#html-lint-css")': {
		'label': '`link` not in `head`'
	},
	'link:not([rel])': {
		'label': '`link` missing `rel`'
	},
	'link[charset]': {
		'label': '`link[charset]`'
	},
	'link[rel="shortcut icon"][type="image/ico"]': {
		'label': '`type="images/ico"` is not needed on `link`'
	},
	'link[rel="stylesheet"][media="all"]': {
		'label': '`media="all"` is not needed on `link`'
	},
	'link[rel="stylesheet"][type="text/css"]': {
		'label': '`type="text/css"` is not needed on `link`'
	},
	// https://msdn.microsoft.com/en-us/library/jj676915%28v=vs.85%29.aspx?f=255&MSPPError=-2147217396
	'meta[http-equiv="X-UA-Compatible"]': {
		'label': 'Specifying a legacy document mode via `X-UA-Compatible` is considered deprecated and should no longer be used'
	},
	// https://developer.apple.com/library/ios/releasenotes/General/RN-iOSSDK-8.0/
	'meta[name="viewport"][content*="minimal-ui"]': {
		'label': '`minimal-ui` has been retired'
	},
	'nav:not([role])': {
		'label': '`nav` missing `role`'
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

	// > It is purely advisory and has no influence on rendering or processing.
	// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/version
	'svg[version]': {
		'label': '`version` attribute on `svg` is not needed'
	},

	'table:not([summary])': {
		'label': '`table` missing `summary`'
	},
	//'table:not(:has(caption))': {
	//	'label': '`table` missing `caption`'
	//},
	'table:not(:has(th))': {
		'label': '`table` missing `th`'
	},
	'table table': {
		'label': '`table` inside `table`'
	},

	// TODO: Currently causes this error: `TypeError: Cannot read property 'type' of undefined`
	// 'th:not([scope])': {
	// 	'label': '`th` missing `scope`'
	// },

	'th[scope=""]': {
		'label': '`th[scope=""]`'
	},

	':not("canvas, img, mask, object, rect, svg")[height]': {
		'label': 'Invalid attribute: `height`'
	},
	':not("canvas, img, mask, object, rect, svg")[width]': {
		'label': 'Invalid attribute: `width`'
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

	// React’s JSX uses a `className` attribute instead of the standard `class` attribute.
	// This could cause confusion when switch context between HTML and JSX.
	'[className]': {
		'label': 'Bad attribute: `className`'
	},

	// https://www.w3.org/TR/filter-effects/#AccessBackgroundImage
	'[enable-background]': {
		'label': '`enable-background` attribute is deprecated'
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

	// "defer" is a deprecated value for the SVG attribute `preserveAspectRatio`
	// https://bugzilla.mozilla.org/show_bug.cgi?id=1280425
	'[preserveAspectRatio*="defer"]': {
		'label': '“defer” is a deprecated value for the SVG attribute `preserveAspectRatio`'
	},

	// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role
	'[role="button"]': {
		'label': '`[role="button"]`'
	},

	'[shape]': {
		'label': 'Bad attribute: `shape`'
	},
	'[size]': {
		'label': 'Bad attribute: `size`'
	},
	'[src*="javascript:"]': {
		'label': '`[src*="javascript:"]`'
	},
	'[style*="background"]': {
		'label': 'Inline style: `background`'
	},
	'[style*="border"]': {
		'label': 'Inline style: `border`'
	},
	'[style*="font"]': {
		'label': 'Inline style: `font`'
	},
	'[style*="letter-spacing"]': {
		'label': 'Inline style: `letter-spacing`'
	},
	'[style*="line-height"]': {
		'label': 'Inline style: `line-height`'
	},
	'[style*="list-style"]': {
		'label': 'Inline style: `list-style`'
	},
	'[style*="outline"]': {
		'label': 'Inline style: `outline`'
	},
	'[style*="overflow"]': {
		'label': 'Inline style: `overflow`'
	},
	'[style*="resize"]': {
		'label': 'Inline style: `resize`'
	},
	'[style*="text"]': {
		'label': 'Inline style: `text`'
	},
	'[style*="vertical"]': {
		'label': 'Inline style: `vertical`'
	},
	'[style*="white-space"]': {
		'label': 'Inline style: `white-space`'
	},
	'[style*="word"]': {
		'label': 'Inline style: `word`'
	},
	'[tabindex]': {
		'label': 'Bad attribute: `tabindex`'
	},
	'[title=""]': {
		'label': '`title` attribute is empty'
	},
	'[valign]': {
		'label': 'Invalid attribute: `valign`'
	},
	'[vlink]': {
		'label': 'Bad attribute: `vlink`'
	},

	// --- Inline event handlers ----

	'[onabort]': {
		'label': 'Inline event handler: `onabort`'
	},
	'[onautocomplete]': {
		'label': 'Inline event handler: `onautocomplete`'
	},
	'[onautocompleteerror]': {
		'label': 'Inline event handler: `onautocompleteerror`'
	},
	'[onafterprint]': {
		'label': 'Inline event handler: `onafterprint`'
	},
	'[onbeforeprint]': {
		'label': 'Inline event handler: `onbeforeprint`'
	},
	'[onbeforeunload]': {
		'label': 'Inline event handler: `onbeforeunload`'
	},
	'[onblur]': {
		'label': 'Inline event handler: `onblur`'
	},
	'[oncancel]': {
		'label': 'Inline event handler: `oncancel`'
	},
	'[oncanplay]': {
		'label': 'Inline event handler: `oncanplay`'
	},
	'[oncanplaythrough]': {
		'label': 'Inline event handler: `oncanplaythrough`'
	},
	'[onchange]': {
		'label': 'Inline event handler: `onchange`'
	},
	'[onclick]': {
		'label': 'Inline event handler: `onclick`'
	},
	'[onclose]': {
		'label': 'Inline event handler: `onclose`'
	},
	'[oncontextmenu]': {
		'label': 'Inline event handler: `oncontextmenu`'
	},
	'[oncopy]': {
		'label': 'Non-standard, inline event handler: `oncopy`'
	},
	'[oncuechange]': {
		'label': 'Inline event handler: `oncuechange`'
	},
	'[oncut]': {
		'label': 'Non-standard, inline event handler: `oncut`'
	},
	'[ondblclick]': {
		'label': 'Inline event handler: `ondblclick`'
	},
	'[ondrag]': {
		'label': 'Inline event handler: `ondrag`'
	},
	'[ondragdrop]': {
		'label': 'Inline event handler: `ondragdrop`'
	},
	'[ondragend]': {
		'label': 'Inline event handler: `ondragend`'
	},
	'[ondragenter]': {
		'label': 'Inline event handler: `ondragenter`'
	},
	'[ondragexit]': {
		'label': 'Inline event handler: `ondragexit`'
	},
	'[ondragleave]': {
		'label': 'Inline event handler: `ondragleave`'
	},
	'[ondragover]': {
		'label': 'Inline event handler: `ondragover`'
	},
	'[ondragstart]': {
		'label': 'Inline event handler: `ondragstart`'
	},
	'[ondrop]': {
		'label': 'Inline event handler: `ondrop`'
	},
	'[ondurationchange]': {
		'label': 'Inline event handler: `ondurationchange`'
	},
	'[onemptied]': {
		'label': 'Inline event handler: `onemptied`'
	},
	'[onended]': {
		'label': 'Inline event handler: `onended`'
	},
	'[onerror]': {
		'label': 'Inline event handler: `onerror`'
	},
	'[onfocus]': {
		'label': 'Inline event handler: `onfocus`'
	},
	'[onhashchange]': {
		'label': 'Inline event handler: `onhashchange`'
	},
	'[oninput]': {
		'label': 'Inline event handler: `oninput`'
	},
	'[oninvalid]': {
		'label': 'Inline event handler: `oninvalid`'
	},
	'[onkeydown]': {
		'label': 'Inline event handler: `onkeydown`'
	},
	'[onkeypress]': {
		'label': 'Inline event handler: `onkeypress`'
	},
	'[onkeyup]': {
		'label': 'Inline event handler: `onkeyup`'
	},
	'[onlanguagechange]': {
		'label': 'Inline event handler: `onlanguagechange`'
	},
	'[onload]': {
		'label': 'Inline event handler: `onload`'
	},
	'[onloadeddata]': {
		'label': 'Inline event handler: `onloadeddata`'
	},
	'[onloadedmetadata]': {
		'label': 'Inline event handler: `onloadedmetadata`'
	},
	'[onloadstart]': {
		'label': 'Inline event handler: `onloadstart`'
	},
	'[onmessage]': {
		'label': 'Inline event handler: `onmessage`'
	},
	'[onmousedown]': {
		'label': 'Inline event handler: `onmousedown`'
	},
	'[onmouseenter]': {
		'label': 'Inline event handler: `onmouseenter`'
	},
	'[onmouseleave]': {
		'label': 'Inline event handler: `onmouseleave`'
	},
	'[onmousemove]': {
		'label': 'Inline event handler: `onmousemove`'
	},
	'[onmouseout]': {
		'label': 'Inline event handler: `onmouseout`'
	},
	'[onmouseover]': {
		'label': 'Inline event handler: `onmouseover`'
	},
	'[onmouseup]': {
		'label': 'Inline event handler: `onmouseup`'
	},
	'[onmousewheel]': {
		'label': 'Inline event handler: `onmousewheel`'
	},
	'[onmove]': {
		'label': 'Inline event handler: `onmove`'
	},
	'[onoffline]': {
		'label': 'Inline event handler: `onoffline`'
	},
	'[ononline]': {
		'label': 'Inline event handler: `ononline`'
	},
	'[onpagehide]': {
		'label': 'Inline event handler: `onpagehide`'
	},
	'[onpageshow]': {
		'label': 'Inline event handler: `onpageshow`'
	},
	'[onpaste]': {
		'label': 'Non-standard, inline event handler: `onpaste`'
	},
	'[onpause]': {
		'label': 'Inline event handler: `onpause`'
	},
	'[onplay]': {
		'label': 'Inline event handler: `onplay`'
	},
	'[onplaying]': {
		'label': 'Inline event handler: `onplaying`'
	},
	'[onpopstate]': {
		'label': 'Inline event handler: `onpopstate`'
	},
	'[onprogress]': {
		'label': 'Inline event handler: `onprogress`'
	},
	'[onreset]': {
		'label': 'Inline event handler: `onreset`'
	},
	'[onresize]': {
		'label': 'Inline event handler: `onresize`'
	},
	'[onscroll]': {
		'label': 'Inline event handler: `onscroll`'
	},
	'[onseeked]': {
		'label': 'Inline event handler: `onseeked`'
	},
	'[onseeking]': {
		'label': 'Inline event handler: `onseeking`'
	},
	'[onselect]': {
		'label': 'Inline event handler: `onselect`'
	},
	'[onshow]': {
		'label': 'Inline event handler: `onshow`'
	},
	'[onsort]': {
		'label': 'Inline event handler: `onsort`'
	},
	'[onstalled]': {
		'label': 'Inline event handler: `onstalled`'
	},
	'[onstorage]': {
		'label': 'Inline event handler: `onstorage`'
	},
	'[onsubmit]': {
		'label': 'Inline event handler: `onsubmit`'
	},
	'[onsuspend]': {
		'label': 'Inline event handler: `onsuspend`'
	},
	'[ontimeupdate]': {
		'label': 'Inline event handler: `ontimeupdate`'
	},
	'[ontoggle]': {
		'label': 'Inline event handler: `ontoggle`'
	},
	'[onunload]': {
		'label': 'Inline event handler: `onunload`'
	},
	'[onvolumechange]': {
		'label': 'Inline event handler: `onvolumechange`'
	},
	'[onwaiting]': {
		'label': 'Inline event handler: `onwaiting`'
	},

	// Ids & Classes
	'#ContentWrapper': {
		'label': 'Bad Id: `ContentWrapper`'
	},
	'.MsoNormal': {
		'label': 'Bad Class: `MsoNormal`'
	},

	// http://guides.rubyonrails.org/i18n.html#adding-translations
	'.translation_missing, [alt*="translation_missing"], [placeholder*="translation_missing"]': {
		'label': 'Missing Rails i18n string'
	}
};

// Based on: https://caolan.org/posts/writing_for_node_and_the_browser.html
(function (exports) {
	exports.tests = tests;
})(typeof exports === 'undefined' ? window.htmlLint || {} : exports);