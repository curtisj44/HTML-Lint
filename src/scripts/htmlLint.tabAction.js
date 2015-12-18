(function (htmlLint) {
	'use strict';

	htmlLint.tabAction = function ($href, $tabList, $tabPanels) {
		var $panelName = $href.replace('#', ''),
			$tabListCurrent = $tabList.find('a[href="' + $href + '"]'),
			$tabPanelCurrent = $tabPanels.filter('[data-panel="' + $panelName + '"]');

		if (!$tabListCurrent.hasClass('selected')) {
			// tab button
			$tabList.find('a').removeClass('selected');
			$tabListCurrent.addClass('selected');

			// panel
			$tabPanels.removeClass('selected');
			$tabPanelCurrent.addClass('selected');
		}
	};
}(window.htmlLint = window.htmlLint || {}));