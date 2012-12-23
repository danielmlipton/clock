{spawn, exec} = require 'child_process'
fs	      	  = require 'fs'
#path	        = require 'path'

watchFiles    = [
  'src/clock.coffee',
  'src/clock.jade'
]

# option '-p', '--prefix [DIR]', 'set the installation prefix for `cake install`'
# option '-w', '--watch', 'continually build the docco library'

log = (childProcess) ->

  logData = (data) ->
    data = data.toString().trim()
    console.log( data ) if data isnt ""

  childProcess.stdout.on 'data', logData
  childProcess.stderr.on 'data', logData

# Build Tasks
task 'build', 'build clock library and examples', ->
  log spawn 'coffee', [ '-c', '-o', 'lib', 'src' ]
  log spawn 'jade', [ 'src/clock.jade', '-O', 'examples', '-P' ]

# Lint Tasks
task 'lint', 'run jslint, coffeelint, and jsonlint', ->
  invoke 'jslint'
  invoke 'coffeelint'
  invoke 'jsonlint'

task 'jslint', 'run jsl on lib/clock.js', ->
  exec( "find . -name '*.js'", (error, stdout, stderr) ->
    throw error if error
    for file in stdout.toString().trim().split( '\n' )
      log spawn 'jsl', [ '-conf', 'jsl.conf', '-process', file ]
  )

task 'coffeelint', 'run coffeelint on src/clock.coffee', ->
  exec( "find . -name '*.coffee'", (error, stdout, stderr) ->
    throw error if error
    for file in stdout.toString().trim().split( '\n' )
      log spawn 'coffeelint', [ '-f', 'coffeelint.json', file ]
  )

task 'jsonlint', 'run jsonlint on json files', ->
  exec( "find . -name '*.json'", (error, stdout, stderr) ->
    throw error if error
    for file in stdout.toString().trim().split( '\n' )
      log spawn 'jsonlint', [ file ]
  )

# Watch Tasks
task 'watch', 'watch source files and build changes', ->
    console.log "Watching for changes."
    for file in watchFiles then do (file) ->
        fs.watchFile file, (curr, prev) ->
            if +curr.mtime isnt +prev.mtime
                console.log "Saw change in #{file}"
                invoke 'build'
                console.log "Finished building #{file}"

# Doc Tasks
task 'doc', 'rebuild the clock documentation', ->
  exec([
    'node_modules/docco/bin/docco -o docs src/*.coffee'
    # Is it wrong that this makes me giggle?
    'sed "s/docco.css/..\\/resources\\/docco.css/" < docs/clock.html > docs/index.html'
    'rm -r docs/clock.html'
  ].join(' && '), (err) ->
    throw err if err
  )

# Test Tasks
task 'test', 'run all tests', ->
  log spawn 'qunit', [ '-c', 'lib/clock.js', '-t', 'test/test.js' ]
  log spawn 'phantomjs', [ 'test/runner.js', 'test/index.html' ]
  log spawn 'cucumber.js', [ 
    'test/features/browser.feature',
    '--require',
    'test/features/step_definitions/clockStepDefinitions.js'
  ]
  log spawn 'cucumber.js', [ 
    'test/features/basic.feature',
    '--require',
    'test/features/step_definitions/clockStepDefinitions.js'
  ]
