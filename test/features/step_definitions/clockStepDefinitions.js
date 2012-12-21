// features/step_definitions/clockStepDefinitions.js

var myStepDefinitionsWrapper = function () {

	//this.World = require("../support/world.js").World; // overwrite default World constructor
    var now = function () { return (new Date()).getTime() };

	this.Given(/^that I require "([^"]*)"$/, function(arg1, callback) {

  		// express the regexp above with the code you wish you had
		this.clock= require( arg1 );
		callback();
	});

	this.When(/^I call the constructor with "([^"]*)" arguments$/, function(arg1, callback) {

		// Handle the case where we don't want to pass any argument to the constructor.
		if (!arg1) {
  			this.ClockObject = new this.clock.Clock();
		} else {
	  		this.ClockObject = new this.clock.Clock( { time: arg1  } );		
		}
  		callback();
	});

  	this.Then(/^the time in seconds should be "([^"]*)"$/, function(arg1, callback) {

  		var epoch = now();

  		if (epoch <= this.ClockObject.epoch + 50) {
  			callback();
  		} else {
  			callback.fail(
  				new Error(
  					'Expected the date object epoch (' + epoch +
  					') to be less than or equal to the ClockObject epoch (' +
  					this.ClockObject.epoch + ') + 50'
  				)
  			);
  		}
	});

  	this.Then(/^the time should be "([^"]*)"$/, function(arg1, callback) {

  		if (this.ClockObject.getTime() === arg1) {
  			callback();
  		} else {
  			callback.fail(
  				new Error(
  					'Expected the date object epoch (' + epoch +
  					') to be less than or equal to the ClockObject epoch (' +
  					this.ClockObject.epoch + ') + 50'
  				)
  			);
  		}
	});

};

module.exports = myStepDefinitionsWrapper;