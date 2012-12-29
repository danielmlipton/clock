var Clock = require('../lib/clock').Clock;
var originalClock = require('./originalClock').OriginalClock;
var PubSub = require('./PubSub').PubSub;
var assert = require( 'assert' );

var now      = function () { return new Date().getTime(); };

function staticDelayTest() {

    var content = this.queue.shift();
    if (content) {
        // console.log( 'Starting staticDelayTest...', content );
        var start = now(),
            count = 0,
            that  = this,
            id    = setInterval(
                function () {
                    if (++count >= content.max) {
                        clearInterval( id );
                        var expected = (content.delay * content.max)/1000;
                        var actual = (now() - start)/1000;
                        // console.log( 'Results staticDelayTest...', content );
                        // console.log( 'Expected total: ', expected, ' seconds' );
                        // console.log( 'Actual total: ', actual, ' seconds' );
                        notWithinOnePercent( expected, actual );
                        that.queue.finish();
                        that.callback();
                    }
                }, content.delay);
    }
}

function dynamicDelayTest() {

    var content = this.queue.shift();
    if (content) {
        // console.log( 'Starting dynamicDelayTest...', content );
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
                // console.log( 'Results dynamicDelayTest...', content );
                // console.log( 'Expected total: ', expected, ' seconds' );
                // console.log( 'Actual total: ', actual, ' seconds' );
                withinOnePercent( expected, actual );
                that.queue.finish();
                that.callback();
            } else {
                setTimeout(instance, (content.delay - diff));
            }
        }

        setTimeout(instance, content.delay );

    }

}

function originalImplementationTest() {

    var content = this.queue.shift();
    if (content) {
        // console.log( 'Starting originalImplementationTest...', content );
        var start   = now(),
            clock   = new originalClock( { 'delay': content.delay } ),
            id      = setTimeout( 
                (function () {
                    clearInterval( id );
                    var expected = content.max/1000;
                    var actual = (clock.date.getTime() - start)/1000;
                    // console.log( 'Results originalImplementationTest...', content );
                    // console.log( 'Expected total: ', expected, ' seconds' );
                    // console.log( 'Actual total: ', actual, ' seconds' );
                    notWithinOnePercent( expected, actual );
                    clock.stop();
                    this.queue.finish();
                    this.callback();
                }).bind( this ),
                content.max);
    }
}

function currentImplementationTest() {

    var content = this.queue.shift();
    if (content) {
        // console.log( 'Starting currentImplementationTest...', content );
        var start   = now(),
            clock   = new Clock( { 'delay': content.delay } ),
            id      = setTimeout( 
                (function () {
                    clearInterval( id );
                    var expected = content.max/1000;
                    var actual = (clock.date.getTime() - start)/1000;
                    // console.log( 'Results currentImplementationTest...', content );
                    // console.log( 'Expected total: ', expected, ' seconds' );
                    // console.log( 'Actual total: ', actual, ' seconds' );
                    withinOnePercent( expected, actual );
                    clock.stop();
                    this.queue.finish();
                    this.callback();
                }).bind( this ),
                content.max);
    }


}

function withinOnePercent ( expected, actual ) {
    assert.ok(
        essentiallyEqual( expected, actual, 0.01 ),
        "Expected: " + expected + ', Actual: ' + actual);
}

function notWithinOnePercent ( expected, actual ) {
    assert.ok(
        !essentiallyEqual( expected, actual, 0.01 ),
        "Expected: " + expected + ', Actual: ' + actual);
}

// http://mattsnider.com/approximately-and-essentially-equal/
function essentiallyEqual(/* float */ a, /* float */ b, /* float */ epsilon) {
    var A = Math.abs(a), B = Math.abs(b);
    Math.abs(A - B) <= (A > B ? B : A) * epsilon;
}

var ps = new PubSub();

ps.subscribe({
    'topic':       'staticDelayTest',
    'callback':     staticDelayTest
});

ps.subscribe({
    'topic':       'dynamicDelayTest',
    'callback':     dynamicDelayTest
});

ps.subscribe({
    'topic':       'originalImplementationTest',
    'callback':     originalImplementationTest
});

ps.subscribe({
    'topic':       'currentImplementationTest',
    'callback':     currentImplementationTest
});

ps.publish( 'staticDelayTest', {
    'max':     1000,
    'delay': 10
});

ps.publish( 'staticDelayTest', {
    'max':     1000,
    'delay': 10
});

ps.publish( 'staticDelayTest', {
    'max':     1000,
    'delay': 100
});

ps.publish( 'dynamicDelayTest', {
    'max':     1000,
    'delay': 10
});

ps.publish( 'dynamicDelayTest', {
    'max':     1000,
    'delay': 10
});

ps.publish( 'dynamicDelayTest', {
    'max':     1000,
    'delay': 100
});

ps.publish( 'originalImplementationTest', {
    'max':     10000,
    'delay': 10
});

ps.publish( 'originalImplementationTest', {
    'max':     10000,
    'delay': 100
});

ps.publish( 'originalImplementationTest', {
    'max':     10000,
    'delay': 1000
});

ps.publish( 'currentImplementationTest', {
    'max':     10000,
    'delay': 10
});

ps.publish( 'currentImplementationTest', {
    'max':     10000,
    'delay': 100
});

ps.publish( 'currentImplementationTest', {
    'max':     10000,
    'delay': 1000
});
