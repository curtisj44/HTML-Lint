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
