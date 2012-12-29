(function() {

    this.PubSub = (function() {

        
         // A simple Queue class for storing content for subscribers.
        function Queue ( value ) { 

            // The private array content is stored in before it's processed.
            var _queue  = [],

                // This flag allows setTimeout() and setInterval() events to
                // be processed sequentially.   
                _processing = false;

            // A privileged method to push content onto the queue.
            this.push   = function (value) {  _queue.push( value ); };

            // A priviledged method to shift content from the queue.  Also
            // wraps some of the synchronous logic to simplify making
            // synchronous calls.  
            this.shift  = function () {

                // The algorithm here is if there is no callback currently
                // processing the queue and there are items in the queue,
                // then mark the queue as being processed and return the
                // next item from the queue.  Otherwise, there's nothing to
                // see here.
                if (!_processing && _queue.length > 0) {
                    _processing = true;
                    return _queue.shift();
                } else {
                    return false;
                }
            };

            // I don't know why I was hellbent on making this private, but this
            // is just sugar coating for telling the queue the currently
            // executing callback is done.
            this.finish = function () {
                _processing = false;
            };
        }

        function PubSub() {

            // This really doesn't need to be in production code, but once
            // bitten, twice shy of 80's hair bands and their pyrotechnics.
            if (!(this instanceof arguments.callee)) {
                throw new Error('Constructor called as a function');
            }

            // Is it wrong that I labored over whether to call this "topics"
            // or "content" and neither one exactly make sense to me?
            // Regardless of it's name, this object holds the subscribers
            // and queues.
            var _content = {},

                // Theoretically, this is used for unsubscribing.  However, I
                // broke unsubscribing when I added chaining and never fixed
                // it because it wasn't necessary for drift.js.  I keep it here
                // to taunt me into fixing it.
                _subUid = -1;

            // Returns the list of subscribers and queues associated with the
            // given key.
            this.getSubscribers = function ( key ) {
                return key ? _content[ key ] : _content;
            };

            // Creates or sets the value of a subscriber.
            this.setSubscriber = function ( key, value ) {
                if (!_content[ key ]) {
                    _content[ key ] = [];
                }
                value.token = (++_subUid).toString();
                _content[ key ].push( value );
                return value.token;
            };
 
            this.deleteSubscriber = function ( i, j ) {
                _content[ i ].splice( j, 1 );
            };

            this.broadcast = function ( key, value ) {
                var subscribers = this.getSubscribers( key );
                if (!subscribers) {
                    return false;
                }
                for (var i in subscribers) {
                    var subscriber = subscribers[ i ];
                    if (!subscriber[ 'queue' ]) {
                        subscriber[ 'queue' ] = new Queue();
                    }
                    subscriber[ 'queue' ].push( value );
                    subscriber.callback.bind( subscriber );
                    subscriber.callback();
                }
            };
        }

        PubSub.prototype.subscribe = function ( options ) {
            if (typeof options !== 'object') {
                throw new Error('options is not an object');
            }
            if (!options.topic) {
                throw new Error('options.topic is required');
            }
            if (!options.callback) {
                options.callback = function () {};
            }
            return this.setSubscriber( options.topic, {
                'callback': options.callback
            });

        };
 
        PubSub.prototype.publish = function( key, value ) {
            if (!key) {
                throw new Error('key is required');
            }

            this.broadcast( key, value );

        };
 
        // This.  Is.  Not.  Sparta.
        PubSub.prototype.unsubscribe = function( token ) {
            var content = this.getSubscribers();
            for (var i in content) {
                for (var j in content[ i ]) {
                    if (content[ i ][ j ][ 'token' ] === token) {
                        this.deleteSubscriber( i, j );
                    }
                }
            }
        };

        return PubSub;

    })();

}).call(this);
