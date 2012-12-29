// Generated by CoffeeScript 1.4.0
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

  root.OriginalClock = (function() {

    function OriginalClock() {
      var args;
      this.i = 0;
      if (arguments.length === 0) {
        args = {};
      } else {
        args = Array.prototype.shift.call(arguments);
      }
      if (typeof args !== 'object') {
        throw new Error('args is not an object');
      }
      if (args.date && args.time) {
        throw new Error('Do not set args.date and args.time');
      }
      if (args.date && !(args.date instanceof Date)) {
        throw new Error('args.date is not an instance of Date');
      } else {
        this.date = new Date();
      }
      if (args.time) {
        if (args.time.match(/^(0?[0-9]|1[0-9]|2[0-3]):([0-5]\d):([0-5]\d)$/)) {
          this.date.setHours(RegExp.$1);
          this.date.setMinutes(RegExp.$2);
          this.date.setSeconds(RegExp.$3);
        } else if (args.time.match(/^(0?[1-9]|1[0-2]):([0-5]\d):([0-5]\d)\s+([AP]M)$/i)) {
          this.date.setHours((RegExp.$4.toLowerCase() === 'pm' ? 12 : 0) + parseInt(RegExp.$1, 10));
          this.date.setMinutes(RegExp.$2);
          this.date.setSeconds(RegExp.$3);
        } else {
          throw new Error('args.time is not a valid time');
        }
      }
      this.epoch = this.date.getTime();
      if (args.delay && typeof args.delay === 'number') {
        this.delay = args.delay;
      } else {
        this.delay = 1000;
      }
      this.tock();
    }

    OriginalClock.prototype.pad = function(i) {
      return (i < 10 ? "0" : "") + i;
    };

    OriginalClock.prototype.stop = function() {
      clearTimeout( this.id );
    };

    OriginalClock.prototype.tick = function() {
      return this.date = new Date(this.epoch);
    };

    OriginalClock.prototype.tock = function() {
      var t;
      t = this;
      this.id = setInterval((function() {
        t.epoch += t.delay;
        return t.tick();
      }), this.delay);
    };

    OriginalClock.prototype.getTime = function() {
      return [this.pad(this.date.getHours()), this.pad(this.date.getMinutes()), this.pad(this.date.getSeconds())].join(':');
    };

    return OriginalClock;

  })();

}).call(this);