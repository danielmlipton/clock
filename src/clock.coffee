# Support CommonJS and the browser
root = exports ? this

# This is added for older browsers.  Read: prior to IE8.
if !String.prototype.trim
  String.prototype.trim = -> this.replace( /^\s+|\s+$/g, '' )

# ** clock.coffee **
class root.Clock

  #### Constructor

  # ```
  # new Clock();
  # ```
  # sets time to now

  # ```
  # new Clock( { time: '11:22:33' } )```
  # sets time to 11:22:33 AM

  # ```
  # new Clock( { time: '11:22:33 PM' } )```
  # sets time to 23:22:33
  constructor: () ->

    # http://stackoverflow.com/questions/383402/is-javascript-s-new-keyword-considered-harmful
    if !(@ instanceof arguments.callee)
      throw new Error 'Constructor called as a function'

    if arguments.length is 0
      args = {}
    else
      args = Array.prototype.shift.call arguments

    if typeof args isnt 'object'
      throw new Error 'args is not an object'

    if args.date and args.time
      throw new Error 'Do not set args.date and args.time'

    if args.date and !(args.date instanceof Date)
      throw new Error 'args.date is not an instance of Date'
    else
      @date = new Date()

    if args.time
      if args.time.match(
        /^(0?[0-9]|1[0-9]|2[0-3]):([0-5]\d):([0-5]\d)$/
      )
        @date.setHours RegExp.$1
        @date.setMinutes RegExp.$2
        @date.setSeconds RegExp.$3
      else if args.time.match(
        /^(0?[1-9]|1[0-2]):([0-5]\d):([0-5]\d)\s+([AP]M)$/i
      )
        @date.setHours(
          (if RegExp.$4.toLowerCase() is 'pm' then  12 else 0 ) +
          parseInt RegExp.$1, 10
        )
        @date.setMinutes RegExp.$2
        @date.setSeconds RegExp. $3
      else
        throw new Error 'args.time is not a valid time'

    @start = (new Date).getTime()
    @epoch = @date.getTime()
    @time = 0

    if args.delay and typeof args.delay is 'number'
      @delay = args.delay
    else
      @delay = 1000

    @tick()

  # Simple helper function for padding numbers with a leading zero.
  pad: (i) ->
    (if i < 10 then "0"  else "") + i

  stop: () ->
    clearTimeout( @id )

  tick: ()->
    diff = (new Date).getTime() - @start - @time
    that = @
    that.id = setTimeout(
      ( ->
        that.epoch += that.delay
        that.time  += that.delay
        that.date   = new Date( that.epoch )
        that.tick()
      ),
      @delay - diff
    )

  getTime: ->
    [
      @pad( @date.getHours() ),
      @pad( @date.getMinutes() ),
      @pad( @date.getSeconds() )
    ].join( ':' )