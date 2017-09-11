#!/usr/bin/env node

const find = require('..').find

const argv = require('yargs')
  .option('folder', { alias: 'f', describe: 'Path to search' })
  .option('pattern', {
    alias: 'p',
    describe: 'A regexp or string for matching file'
  })
  .option('nameOnly', {
    alias: 'name-only',
    default: false,
    describe: 'Apply matcher on file name only',
    type: 'boolean'
  })
  .option('exclude', {
    alias: 'x',
    describe: 'A regexp or string for excluding file'
  })
  .option('excludeNameOnly', {
    alias: 'exclude-nameonly',
    default: false,
    describe: 'Apply excluder on file name only',
    type: 'boolean'
  })
  .option('recursive', {
    alias: 'r',
    default: true,
    describe: 'Search recursively',
    type: 'boolean'
  })
  .option('ignore-case', {
    alias: 'i',
    default: false,
    describe: 'Ignore case',
    type: 'boolean'
  })
  .version()
  .help()
  .argv

switch (argv._.length) {
  case 1:
    if (argv.folder != null) {
      argv.pattern = argv._[0]
    } else {
      argv.folder = argv._[0]
    }
    break

  case 2:
    if (argv.folder != null) {
      argv.pattern = argv._[0]
      argv.exclude = argv._[1]
    } else {
      argv.folder = argv._[0]
      argv.pattern = argv._[1]
    }
    break

  case 3:
    argv.folder = argv._[0]
    argv.pattern = argv._[1]
    argv.exclude = argv._[2]
    break
}

if (!argv.pattern) {
  console.error('Please input anything to search')
  process.exit(1)
}

find(argv)
  .then(files => files.forEach(file => console.log(file)))
  .catch(err => {
    console.error(err.message)
    process.exit(1)
  })
