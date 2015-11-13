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