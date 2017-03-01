(function (htmlLint) {
	'use strict';

	htmlLint.closeAction = ($closeButton) => {
		$closeButton.parent().fadeOut(250, () => {
			$(this).remove();
			$('#html-lint-css, #html-lint-jquery, #html-lint-js').remove();
		});
	};
}(window.htmlLint = window.htmlLint || {}));
