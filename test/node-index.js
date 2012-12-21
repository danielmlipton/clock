// Executing node test/node-index.js is not working.
// This file isn't used in this package anywhere.  Fix it or remove it.
var qunit = require('qunit');

qunit.run({
	code: {

		// Include the source code
		path: './lib/clock.js',

		// What global var should it introduce for your tests?
		namespace: 'clock'

    },

    tests: [

		// Include the test suite(s)
		'test.js'

    ].map(function (v) { return './test/' + v; })

});