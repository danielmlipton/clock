var PubSub = require('./PubSub').PubSub;
var now      = function () { return new Date().getTime(); };

function staticDelayTest() {

    var content = this.queue.shift();
    if (content) {
        console.log( 'Starting staticDelayTest...', content );
        var start = now(),
            count = 0,
            that  = this,
            id    = setInterval(
                function () {
                    if (++count >= content.max) {
                        clearInterval( id );
                        var expected = (content.delay * content.max)/1000;
                        var actual = (now() - start)/1000;
                        console.log( 'Results staticDelayTest...', content );
                        console.log( 'Expected total: ', expected, ' seconds' );
                        console.log( 'Actual total: ', actual, ' seconds' );
                        that.queue.finish();
                        that.callback();
                    }
                }, content.delay );
    }
}

var ps = new PubSub();

ps.subscribe({
    'topic':       'staticDelayTest',
    'callback':     staticDelayTest
});

/*
    Expected total:  10  seconds
    Actual total:  10.885  seconds
 */
ps.publish( 'staticDelayTest', {
    'max':     1000,
    'delay': 10
});

/*
    Expected total:  10  seconds
    Actual total:  10.086  seconds
 */
ps.publish( 'staticDelayTest', {
    'max':     100,
    'delay': 100
});

/*
    Expected total:  100  seconds
    Actual total:  109.049  seconds
 */
ps.publish( 'staticDelayTest', {
    'max':     10000,
    'delay': 10
});

/*
    Expected total:  100  seconds
    Actual total:  100.875  seconds
 */
ps.publish( 'staticDelayTest', {
    'max':     1000,
    'delay': 100
});

