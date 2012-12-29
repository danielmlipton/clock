[![Build Status](https://travis-ci.org/danielmlipton/clock.png?branch=master)](https://travis-ci.org/danielmlipton/clock)

clock
=====

The built in JavaScript Date Object works as follows:

```javascript
var d = new Date();
console.log( d );
```

> Date {Tue Dec 18 2012 23:38:40 GMT-0500 (EST)}

```javascript
setTimeout( function () { console.log( d ) }, 1000 )
```

> Date {Tue Dec 18 2012 23:38:40 GMT-0500 (EST)}

While this behavior makes sense, I intuitively thought the second ```console.log``` should read one second later.

This class implements that functionality for time only - [at least for now](http://stackoverflow.com/questions/6075231/how-to-extend-the-javascript-date-object).

```javascript
var c = new Clock();
console.log( c.getTime );
```

> 23:38:40

```javascript
setTimeout( function () { console.log( c.getTime() ) }, 1000 )
```

> 23:38:41
