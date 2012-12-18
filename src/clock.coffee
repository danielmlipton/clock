# This is added for older browsers.  Read: prior to IE8.
if !String.prototype.trim
  String.prototype.trim = -> this.replace( /^\s+|\s+$/g, '' )

class Clock
    
 

    # new Clock();               (sets time to now)
    # new Clock( '11:22:33' )    (sets time to 11:22:33 AM)
    # new Clock( '11:22:33 PM' ) (sets time to 23:22:33)
    constructor: () ->

        if arguments.lenth == 0
            args = {}
        else
            args = Array.prototype.shift.call arguments

        if args.date and !(args.date instanceof Date)
            throw "args.date is not an instance of Date"
        else 
            @date = new Date();

        if args.time
            [ hours, minutes, seconds ] = args.time.split(':')
            @date.setHours( hours )
            @date.setMinutes( minutes )
            @date.setSeconds( seconds )

        @epoch   = @date.getTime()
        @refresh = 1000
 
        @tock()

    # Simple helper function for padding numbers with a leading zero.
    pad: (i) ->
        (if i < 10 then "0"  else "") + i

    tick: ->
        @date = new Date( @epoch )

    tock: ()->
        t = @
        setInterval(
            ( ->
                t.epoch += t.refresh
                t.tick()
            ), @refresh 
        )

    getTime: ->
        [
            @pad( @date.getHours() ),
            @pad( @date.getMinutes() ),
            @pad( @date.getSeconds() )
        ].join( ':' )