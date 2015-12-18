(function (htmlLint) {
	'use strict';

	htmlLint.editFlash = function () {
		var $flashObjects = $('object, embed');

		if (
			$flashObjects.length > 0 &&
			$flashObjects.find('param[name="wmode"]').attr('value') !== 'opaque'
		) {
			$('<param />', {
				name: 'wmode',
				value: 'opaque'
			}).appendTo($flashObjects);

			$flashObjects.attr('wmode', 'opaque').hide().show();
		}
	};
}(window.htmlLint = window.htmlLint || {}));