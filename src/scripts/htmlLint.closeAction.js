(function (htmlLint) {
	'use strict';

	htmlLint.closeAction = function ($closeButton) {
		$closeButton.parent().fadeOut(250, function () {
			$(this).remove();
			$('#html-lint-css, #html-lint-jquery, #html-lint-js').remove();
		});
	};
}(window.htmlLint = window.htmlLint || {}));