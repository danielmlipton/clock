# features/browser.feature

Feature: Basic Clock Feature
  As a JavaScript developer
  I would like to have a Clock object
  So that I can keep track of time easily

  Scenario: Loading the qunit test html.
  	Given that I visit "file:///Users/daniel/git/clock/test/index.html"
  	Then the page should have no errors