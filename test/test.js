
module(
	"starting a clock at the current time", {
		setup: function () {
			window._date  = new Date();
			window._clock = new Clock();
		},
		teardown: function () {
			delete window._date;
			delete window._clock;
		}
	}
);

test( "start clock now", function() {

	expect( 5 );

	equal( typeof _clock.epoch, "number", "_clock.epoch is number" );
	equal( 0, _clock.epoch % 1, "_clock.epoch is an integer" );
	equal( 1000, _clock.refresh, "_clock.refresh defaults to 1000" );
	ok( _clock.date instanceof Date, "_clock.date is an instance of Date" );

	// Note that clock.epoch could be off by a millisecond.
	ok( _date.getTime() <= _clock.epoch + 50, 'Time in seconds milliseconds' );

});

asyncTest( "clock one second later", function() {

  expect( 1 );
 
  setTimeout(function() {
    ok( _date.getTime() <= _clock.epoch + 1050, "Time in milliseconds is one second-ish later" );
    start();
  }, 1000.5);

});

module(
	"starting a clock at 13:02:03", {
		setup: function () {
			window._clock = new Clock({
				time: '13:02:03',
				refresh: 100,
			});
		},
		teardown: function () {
			delete window._clock;
		}
	}
);

test( "start clock at 13:02:03", function() {

	expect( 5 );

	equal( "number", typeof _clock.epoch, "_clock.epoch is number" );
	equal( _clock.epoch % 1, 0, "_clock.epoch is an integer" );
	equal( _clock.refresh, 100, "_clock.refresh defaults to 1000" );
	ok( _clock.date instanceof Date, "_clock.date is an instance of Date" );
	equal( _clock.getTime(), "13:02:03", 'Time' );

});

asyncTest( "clock one second later", function() {

  expect( 1 );
 
  setTimeout(function() {
    equal( _clock.getTime(), "13:02:04", "Time one second later" );
    start();
  }, 1000);

});

module(
	"starting a clock at 23:59:59", {
		setup: function () {
			window._clock = new Clock({
				time: '23:59:59',
			});
		},
		teardown: function () {
			delete window._clock;
		}
	}
);

test( "start clock at 23:59:59", function() {

	expect( 1 );
	equal( _clock.getTime(), "23:59:59", 'A second before midnight, military time' );

});

asyncTest( "clock one second later", function() {

  expect( 1 );
 
  setTimeout(function() {
    equal( _clock.getTime(), "00:00:00", "At midnight, military time" );
    start();
  }, 1000);

});

module(
	"starting a clock at 11:59:59 PM", {
		setup: function () {
			window._clock = new Clock({
				time: '11:59:59 PM',
			});
		},
		teardown: function () {
			delete window._clock;
		}
	}
);

test( "start clock at 11:59:59 PM", function() {

	expect( 1 );
	equal( _clock.getTime(), "23:59:59", 'A second before midnight, meridiem time' );

});

asyncTest( "clock one second later", function() {

  expect( 1 );
 
  setTimeout(function() {
    equal( _clock.getTime(), "00:00:00", "At midnight, meridiem time" );
    start();
  }, 1000);

});

module( "fail" );

test( "passing a bad argument to the constructor", function () {
	expect( 1 );
	var errorString;
	try {
		c = new Clock( '12:34:56' );
	} catch( e ) {
		errorString = e;
	}
	equal( errorString, "args is not an object", "correct error caught" );
});

test( "passing a bad time: 19:00:00 PM", function () {
	expect( 1 );
	var errorString;
	try {
		c = new Clock({
			time: '19:00:00 PM'
		});
	} catch( e ) {
		errorString = e;
	}
	equal( errorString, "args.time is not a valid time", "correct error caught" );
});

test( "passing a bad time: 00:00:00 PM", function () {
	expect( 1 );
	var errorString;
	try {
		c = new Clock({
			time: '00:00:00 PM'
		});
	} catch( e ) {
		errorString = e;
	}
	equal( errorString, "args.time is not a valid time", "correct error caught" );
});

test( "passing a bad time: 24:00:00", function () {
	expect( 1 );
	var errorString;
	try {
		c = new Clock({
			time: '24:00:00'
		});
	} catch( e ) {
		errorString = e;
	}
	equal( errorString, "args.time is not a valid time", "correct error caught" );
});