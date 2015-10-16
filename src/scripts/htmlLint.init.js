(function (htmlLint) {
	'use strict';

	htmlLint.init = function () {
		if (typeof $ === 'undefined') {
			$ = jQuery;
		}

		htmlLint.editFlash();

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

		$.each(htmlLint.panel, function (index, value) {
			htmlLint.panel[index]();
		});

		htmlLint.close();
		htmlLint.tabSetup();

		$('#html-lint').fadeIn(250, function () {
			$(this).removeAttr('style');
		});
	};
}(window.htmlLint = window.htmlLint || {}));