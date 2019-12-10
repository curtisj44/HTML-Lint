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
}(window.htmlLint = window.htmlLint || {}));
