var PubSub = require('./PubSub').PubSub;
var now      = function () { return new Date().getTime(); };

function dynamicDelayTest() {

    var content = this.queue.shift();
    if (content) {
        console.log( 'Starting dynamicDelayTest...', content );
        var time    = 0,
            start   = now(),
            count   = 0,
            that    = this;

        function instance() {

            time += content.delay;
            var diff = now() - start - time;
            if (++count >= content.max) {
                var expected = (content.delay * content.max) / 1000;
                var actual   = (now() - start) / 1000;
                console.log( 'Results dynamicDelayTest...', content );
                console.log( 'Expected total: ', expected, ' seconds' );
                console.log( 'Actual total: ', actual, ' seconds' );
                that.queue.finish();
                that.callback();
            } else {
                setTimeout(instance, (content.delay - diff));
            }
        }

        setTimeout(instance, content.delay );

    }

}

var ps = new PubSub();

ps.subscribe({
    'topic':       'dynamicDelayTest',
    'callback':     dynamicDelayTest
});

/*
    Expected total:  10  seconds
    Actual total:  10.001  seconds
 */
ps.publish( 'dynamicDelayTest', {
    'max':     1000,
    'delay': 10
});

/*
    Expected total:  10  seconds
    Actual total:  10.001  seconds
 */
ps.publish( 'dynamicDelayTest', {
    'max':     100,
    'delay': 100
});

/*
    Expected total:  100  seconds
    Actual total:  100  seconds
 */
ps.publish( 'dynamicDelayTest', {
    'max':     1000,
    'delay': 100
});


