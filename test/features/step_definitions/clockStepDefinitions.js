// features/step_definitions/clockStepDefinitions.js

var myStepDefinitionsWrapper = function () {

	// overwrite default World constructor
	this.World = require("../support/world.js").World;

    var now = function () { return (new Date()).getTime(); };

	this.Given(
		/^that I require "([^"]*)"$/,
		function(arg1, callback) {

  			// express the regexp above with the code you wish you had
			this.clock = require( arg1 );
			callback();

		}
	);

	this.When(
		/^I call the constructor with "([^"]*)" arguments$/,
		function(arg1, callback) {

			// Handle the case where we don't want to pass any argument to
			// the constructor.
			if (!arg1) {
  				this.ClockObject = new this.clock.Clock();
			} else {
	  			this.ClockObject = new this.clock.Clock( { time: arg1  } );		
			}
  			callback();
		}
	);

  	this.Then(
  		/^the time in seconds should be "([^"]*)"$/,
  		function( arg1, callback ) {

  			var epoch = now();

  			if (epoch <= this.ClockObject.epoch + 100) {
  				callback();
  			} else {
  				callback.fail( new Error( 'Expected the date object epoch (' + epoch + ') to be less than or equal to the ClockObject epoch (' + this.ClockObject.epoch + ') + 50' ) );
  			}
		}
	);

  	this.Then(
  		/^the time should be "([^"]*)"$/,
  		function( arg1, callback ) {

  			var hhmmss = this.ClockObject.getTime();
  			if (hhmmss === arg1) {
  				callback();
  			} else {
  				callback.fail( new Error( 'Expected the time to be (' + hhmmss + ') to be equal to (' + arg1 + ')' ) );
  			}
		}
	);

	this.When(
		/^I wait "([^"]*)" seconds?$/,
		function( arg1, callback ) {

			setTimeout( function () { callback(); }, arg1 * 1010 );
		}
	);

	this.Given(
		/^that I visit "([^"]*)"$/,
		function( url, callback ) {
			this.visit( 'file://' + __dirname + url, callback );
		}
	);

	this.Then(
		/^the page should have no errors$/,
		function( callback ) {
			var browser = this.browser;
			var errors = browser.text( '#qunit-testresult .failed' );
			if (parseInt( errors, 10 ) === 0) {
				callback();
			} else if (browser.error) {
    			callback.fail( new Error( 'A browser error occured.' + browser.errors ) );
			} else {
				callback.fail( new Error( errors + ' occurred.' ) );
			}
		}
	);

};

module.exports = myStepDefinitionsWrapper;