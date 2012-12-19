Docco	        = require 'docco'
CoffeScript   = require 'coffee-script'
Jade          = require 'jade'
{spawn, exec} = require 'child_process'
fs	      	  = require 'fs'
path	        = require 'path'

# option '-p', '--prefix [DIR]', 'set the installation prefix for `cake install`'
option '-w', '--watch', 'continually build the docco library'

task 'build', 'build clock library and examples', (options) ->
  coffee = spawn 'node', ['./node_modules/coffee-script/bin/coffee','-c' + (if options.watch then 'w' else ''), '-o', 'lib', 'src']
  coffee.stdout.on 'data', (data) -> console.log data.toString().trim()
  jade = spawn 'node_modules/jade/bin/jade', [ 'src/clock.jade', '-O', 'examples', '-P' ]
  jade.stderr.on 'data', (data) -> console.log data.toString().trim()

task 'doc', 'rebuild the clock documentation', ->
  exec([
    'node_modules/docco/bin/docco -o docs src/*.coffee'
    # Is it wrong that this makes me giggle?
    'sed "s/docco.css/..\\/resources\\/docco.css/" < docs/clock.html > docs/index.html'
    'rm -r docs/clock.html'
  ].join(' && '), (err) ->
    throw err if err
  )