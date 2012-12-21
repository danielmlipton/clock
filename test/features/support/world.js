// features/support/world.js

var zombie = require('zombie');
var World = function World(callback) {
  this.browser = new zombie.Browser(); // this.browser will be available in step definitions
  this.browser.waitFor = 10 * 1000;

  this.visit = function(url, callback) {

    this.browser.visit(url, callback );

  };

  //this.assert = require("assert");

  callback(); // tell Cucumber we're finished and to use 'this' as the world instance
};
exports.World = World;