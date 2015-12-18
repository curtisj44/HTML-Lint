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