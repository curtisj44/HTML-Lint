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