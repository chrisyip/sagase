/*
 * Sagase
 * A command line tool for searching files recursively.
 * https://github.com/ChrisYip/Sagase
 *
 * Copyright (c) 2014 Chris Yip
 * Licensed under the MIT license.
 */

/* jshint -W079 */

var fs = require('fs-extra'),
    async = require('async'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    path = require('path')

function readFiles (opts) {
  return new Promise(function (resolve, reject) {
    var res = []
    fs.readdir(opts.folder, function (err, files) {
      if (err) {
        return reject(err)
      }

      async.each(
        files,
        function (file, cb) {
          var fullPath = path.resolve(opts.folder + '/' + file)

          if (opts.shortenPath) {
            fullPath = fullPath.replace(process.cwd() + '/', '')
          }

          fs.stat(fullPath, function (err, stat) {
            if (err) {
              return cb()
            }

            var isDir = stat.isDirectory()

            if (isDir) {
              if (!opts.excludeNameOnly && _.isRegExp(opts.exclude) && opts.exclude.test(fullPath)) {
                return cb()
              }

              if (opts.recursive) {
                readFiles(_.assign({}, opts, { folder: fullPath }))
                  .then(
                    function (data) {
                      res = res.concat(data)
                    }
                  )
                  .catch(function (err) {
                    reject(err)
                  })
                  .finally(function () {
                    cb()
                  })
              }
            } else {
              if (opts.excludeNameOnly && _.isRegExp(opts.exclude) && opts.exclude.test(file) ||
                  _.isFunction(opts.exclude) && opts.exclude(file, fullPath) === true) {
                return cb()
              }

              if (
                  _.isRegExp(opts.pattern) && opts.pattern.test(opts.nameOnly ? file : fullPath) ||
                  _.isFunction(opts.pattern) && opts.pattern(file, fullPath) === true
                ) {
                res.push(fullPath)
              }
              cb()
            }
          })
        },
        function () {
          resolve(res)
        }
      )
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
  } else if (!_.isFunction(pattern)) {
    pattern = /.*/
  }

  if (_.isString(exclude)) {
    exclude = new RegExp(exclude, reFlag)
  } else if (!_.isFunction(exclude)) {
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

function Sagase () {
  Object.defineProperties(
    this,
    {
      find: {
        enumerable: true,
        value: function (opts) {
          return readFiles(formatOptions(opts))
        }
      }
    }
  )
}

module.exports = new Sagase()
