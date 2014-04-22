#!/usr/bin/env node

'use strcit';

var sagase = require('./sagase.js'),
    pkg = require('../package.json'),
    nomnom = require('nomnom'),
    chalk = require('chalk'),
    opts

opts = nomnom
        .option('folder', {
          abbr: 'f',
          default: '.',
          help: 'Folder to search'
        })
        .option('pattern', {
          abbr: 'p',
          help: 'Pattern to match the name'
        })
        .option('exclude', {
          abbr: 'x',
          help: 'Pattern to exclude from search'
        })
        .option('recursive', {
          abbr: 'r',
          default: true,
          flag: true,
          help: 'The pattern of name'
        })
        .option('ignore-case', {
          abbr: 'i',
          default: true,
          flag: true,
          help: 'Ignore case'
        })
        .option('version', {
          abbr: 'v',
          flag: true,
          help: 'Print version and exit',
          callback: function() {
             return 'version ' + pkg.version
          }
        })
        .parse();

switch (opts._.length) {
  case 1:
    opts.pattern = opts._[0]
    break

  case 2:
    opts.folder = opts._[0]
    opts.pattern = opts._[1]
    break

  case 3:
    opts.folder = opts._[0]
    opts.pattern = opts._[1]
    opts.exclude = opts._[2]
    break
}

if (!opts.pattern) {
  console.error(chalk.red('[Sagase]'), 'Please input any pattern to search.')
  process.exit(1)
}

sagase(opts)
