/*
 * Sagase
 * A command line tool for searching files recursively.
 * https://github.com/ChrisYip/sagase
 *
 * Copyright (c) 2014 Chris Yip
 * Licensed under the MIT license.
 */

var _ = require('lodash')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))
var path = require('path')

function readFiles (opts) {
  return fs.readdirAsync(opts.folder).then(function (files) {
    return Promise.all(
      _.map(files, function (file) {
        var fullPath = path.resolve(opts.folder + '/' + file)

        if (opts.shortenPath) {
          fullPath = fullPath.replace(process.cwd() + '/', '')
        }

        return fs.statAsync(fullPath).then(function (stat) {
          var isDir = stat.isDirectory()

          if (isDir) {
            if (!opts.excludeNameOnly && _.isRegExp(opts.exclude) && opts.exclude.test(fullPath)) {
              return
            }

            if (opts.recursive) {
              return readFiles(_.assign({}, opts, { folder: fullPath }))
            }
          } else {
            if (
              _.isRegExp(opts.exclude) && opts.exclude.test(opts.excludeNameOnly ? file : fullPath) ||
              _.isFunction(opts.exclude) && opts.exclude(file, fullPath)
            ) {
              return
            }

            if (
                _.isRegExp(opts.pattern) && opts.pattern.test(opts.nameOnly ? file : fullPath) ||
                _.isFunction(opts.pattern) && opts.pattern(file, fullPath) === true
              ) {
              return fullPath
            }
          }
        })
      })
    ).then(function (results) {
      return _(results).flatten().compact().value()
    })
  })
}

function formatOptions (opts) {
  if (!_.isPlainObject(opts)) {
    opts = {}
  }

  var folder = (_.isString(opts.folder) ? opts.folder.replace(/\/$/, '') : '').trim(),
      reFlag = opts['ignore-case'] ? 'i' : '',
      pattern = opts.pattern,
      nameOnly = _.isBoolean(opts['name-only']) ? opts['name-only'] : false,
      excludeNameOnly = _.isBoolean(opts['exclude-name-only']) ? opts['exclude-name-only'] : false,
      exclude = opts.exclude

  if (_.isString(pattern)) {
    pattern = new RegExp(pattern || '.*', reFlag)
  } else if (!_.isFunction(pattern) && !_.isRegExp(pattern)) {
    pattern = /.*/
  }

  if (_.isString(exclude)) {
    exclude = new RegExp(exclude, reFlag)
  } else if (!_.isFunction(exclude) && !_.isRegExp(pattern)) {
    exclude = function () {
      return false
    }
  }

  return {
    folder: folder || process.cwd(),
    pattern: pattern,
    nameOnly: nameOnly,
    exclude: exclude,
    excludeNameOnly: excludeNameOnly,
    recursive: _.isBoolean(opts.recursive) ? opts.recursive : true
  }
}

exports.find = function (opts) {
  return readFiles(formatOptions(opts))
}
