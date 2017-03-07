(function (htmlLint) {
	'use strict';

	htmlLint.close = () => {
		var $closeButton = $('.html-lint-close');

		$closeButton.on('click', () => {
			htmlLint.closeAction($closeButton);
			return false;
		});

		$(document).on('keyup', (e) => {
			if (e.keyCode === 27) {
				htmlLint.closeAction($closeButton);
			}
		});
	};
}(window.htmlLint = window.htmlLint || {}));
