/*
 * Sagase
 * A command line tool for searching files recursively.
 * https://github.com/ChrisYip/Sagase
 *
 * Copyright (c) 2014 Chris Yip
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs-extra'),
    chalk = require('chalk'),
    sagase, readFiles

readFiles = function (opts) {
  fs.readdir(opts.folder, function (err, files) {
    if (err) {
      console.error(chalk.red('[Sagase]'), err)
      return;
    }

    files.forEach(function (file) {
      var fullPath = opts.folder + '/' + file

      if ((opts.exclude && opts.exclude.test(fullPath))) {
        return;
      }

      fs.stat(fullPath, function (err, stat) {
        if (err) {
          console.error(chalk.red('[Sagase]'), err)
          return;
        }

        if (stat.isDirectory()) {
          if (opts.recursive) {
            readFiles.call(null, {
              folder: fullPath,
              pattern: opts.pattern,
              exclude: opts.exclude,
              recursive: opts.recursive
            })
          }
        } else {
          if (opts.pattern.test(file)) {
            console.info(chalk.green('[Sagase]'), opts.folder + '/' + chalk.blue(file))
          }
        }
      })
    })
  })
}

sagase = function (opts) {
  var folder = opts.folder.replace(/\/$/, ''),
      reFlag = opts['ignore-case'] ? 'i' : '',
      pattern = new RegExp(opts.pattern, reFlag),
      exclude

  if (opts.exclude) {
    exclude = new RegExp(opts.exclude, reFlag)
  }

  readFiles({
    folder: folder,
    pattern: pattern,
    exclude: exclude,
    recursive: opts.recursive
  })
};

module.exports = sagase;
