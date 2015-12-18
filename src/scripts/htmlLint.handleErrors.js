(function (htmlLint) {
	'use strict';

	htmlLint.handleErrors = function (tests) {
		var errors = 0,
			currentErrors,
			output = '';

		$.each(tests, function (index, test) {
			currentErrors = $(index).length;

			if (currentErrors > 0) {
				errors += currentErrors;
				output += '<p><i>' + htmlLint.utility.error(currentErrors) + '</i>' + test.label + '</p>';
				//$(index).addClass('html-lint-error-highlight').attr('data-html-lint', test.label);

				console.warn(index, $(index));
			}
		});

		htmlLint.addPanel('Tests', output, errors);
	};
}(window.htmlLint = window.htmlLint || {}));