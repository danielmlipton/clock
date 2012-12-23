# test/features/basic.feature

Feature: Basic Clock Feature
  As a JavaScript developer
  I would like to have a Clock object
  So that I can keep track of time easily

  Scenario: Start clock at the current time.
  	Given that I require "../../../lib/clock.js"
  	When I call the constructor with "" arguments
  	Then the time in seconds should be "now"

  Scenario: Start clock at a specific time.
  	Given that I require "../../../lib/clock.js"
  	When I call the constructor with "1:23:45" arguments
  	Then the time should be "01:23:45"

  Scenario: Start clock one second before midnight (HH:MM:SS).
  	Given that I require "../../../lib/clock.js"
  	When I call the constructor with "23:59:59" arguments
  	And I wait "1" second
  	Then the time should be "00:00:00"
