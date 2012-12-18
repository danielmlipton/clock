Docco	      = require 'docco'
CoffeScript   = require 'coffee-script'
{spawn, exec} = require 'child_process'
fs	      	  = require 'fs'
path	      = require 'path'

# option '-p', '--prefix [DIR]', 'set the installation prefix for `cake install`'
option '-w', '--watch', 'continually build the docco library'

task 'build', 'build the docco library', (options) ->
  coffee = spawn 'node', ['./node_modules/coffee-script/bin/coffee','-c' + (if options.watch then 'w' else ''), '-o', 'lib', 'src']
  coffee.stdout.on 'data', (data) -> console.log data.toString().trim()
#  coffee.stderr.on 'data', (data) -> console.log data.toString().trim()

task 'doc', 'rebuild the Docco documentation', ->
  exec([
  	'cp node_modules/docco/resources/docco.css resources/'
    'docco src/*.coffee'
    'sed "s/docco.css/resources\\/docco.css/" < docs/clock.html > index.html'
    'rm -r docs'
  ].join(' && '), (err) ->
    throw err if err
  )