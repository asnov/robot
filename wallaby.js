// https://wallabyjs.com/docs/integration/node.html
'use strict';

module.exports = function() {
	return {
		files: [
			'lib/**/*.ts',
			'!lib/**/*spec.ts',
		],

		tests: [
			'lib/**/*spec.ts',
		],

		env: {
			type: 'node',
		},

		// https://wallabyjs.com/docs/integration/overview.html#supported-testing-frameworks
		testFramework: 'jasmine',
	};
};
