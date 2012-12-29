var Clock = require('../../lib/clock').Clock;
var PubSub = require('./PubSub').PubSub;

function currentImplementationTest() {

    //
    var content = this.queue.shift();
    if (content) {
        console.log( 'Starting currentImplementationTest...', content );
        var start   = new Date().getTime(),
            clock   = new Clock( { 'delay': content.delay } ),
            id      = setTimeout( 
                (function () {
                    clearInterval( id );
                    var expected = content.max/1000;
                    var actual = (clock.date.getTime() - start)/1000;
                    console.log( 'Results currentImplementationTest...', content );
                    console.log( 'Expected total: ', expected, ' seconds' );
                    console.log( 'Actual total: ', actual, ' seconds' );
                    // withinOnePercent( expected, actual );
                    clock.stop();

                    //
                    this.queue.finish();

                    //
                    this.callback();
                }).bind( this ),
                content.max);
    }


}

var ps = new PubSub();

ps.subscribe({
    'topic':       'currentImplementationTest',
    'callback':     currentImplementationTest
});

/*
    Expected total:  10  seconds
    Actual total:  9.99  seconds
 */
ps.publish( 'currentImplementationTest', {
    'max':     10000,
    'delay': 10
});

/*
    Expected total:  10  seconds
    Actual total:  10.001  seconds
 */
ps.publish( 'currentImplementationTest', {
    'max':     10000,
    'delay': 100
});

/*
    Expected total:  10  seconds
    Actual total:  10  seconds

    N.B.  The actual time can read "9 seconds" here, too - for the same reason.

 */
ps.publish( 'currentImplementationTest', {
    'max':     10000,
    'delay': 1000
});
