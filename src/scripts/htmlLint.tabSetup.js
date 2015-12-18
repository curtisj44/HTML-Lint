(function (htmlLint) {
	'use strict';

	htmlLint.tabSetup = function () {
		var errors = 0,
			$htmlLint = $('#html-lint'),
			$tabList = $htmlLint.find('.html-lint-tab-list'),
			$tabPanels = $htmlLint.find('.html-lint-tab-panel');

		// tab button
		$tabList.find('a').bind('click', function () {
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
}(window.htmlLint = window.htmlLint || {}));