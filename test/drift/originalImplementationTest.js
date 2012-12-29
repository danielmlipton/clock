var originalClock = require('./originalClock').OriginalClock;
var PubSub = require('./PubSub').PubSub;

function originalImplementationTest() {

    var content = this.queue.shift();
    if (content) {
        console.log( 'Starting originalImplementationTest...', content );
        var start   = new Date().getTime(),
            clock   = new originalClock( { 'delay': content.delay } );
            var id      = setTimeout( 
                (function () {
                    var expected = content.max/1000;
                    var actual = (clock.date.getTime() - start)/1000;
                    console.log( 'Results originalImplementationTest...', content, clock.date.getTime() - start, new Date().getTime() - start );
                    console.log( 'Expected total: ', expected, ' seconds' );
                    console.log( 'Actual total: ', actual, ' seconds' );
                    clock.stop();
                    this.queue.finish();
                    this.callback();
                }).bind( this ),
                content.max);
    }
}

var ps = new PubSub();

ps.subscribe({
    'topic':       'originalImplementationTest',
    'callback':     originalImplementationTest
});

/*
    Expected total:  10  seconds
    Actual total:  9.17  seconds
 */
ps.publish( 'originalImplementationTest', {
    'max':     10000,
    'delay': 10
});


/*
    Expected total:  10  seconds
    Actual total:  9.901  seconds
 */
ps.publish( 'originalImplementationTest', {
    'max':     10000,
    'delay': 100
});

/* 
    Expected total:  10  seconds
    Actual total:  9  seconds

    N.B.  These results may look strange, but given the one second delay, they
          actually make sense. The clock simply didn't tick over to the next
          second before the time was taken.  Remember, the "expected" time
          is very close to 10 wallclock seconds.  If the "actual" time is only
          9.999 seconds, it won't register the tenth second.

 */
ps.publish( 'originalImplementationTest', {
    'max':     10000,
    'delay': 1000
});
