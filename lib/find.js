'use strict'

const fs = require('mz/fs')
const path = require('path')
const flatten = require('@flatten/array')
const is = require('is')

const compact = require('./array-compact')

function readFiles (opts) {
  return fs.readdir(opts.folder).then(files => {
    var p = []

    for (const file of files) {
      let fullPath = path.resolve(opts.folder + '/' + file)

      p.push(fs.stat(fullPath).then(stat => {
        if (stat.isDirectory()) {
          if (!opts.excludeNameOnly && is.regexp(opts.exclude) && opts.exclude.test(fullPath)) {
            return
          }

          if (opts.recursive) {
            return readFiles(Object.assign({}, opts, { folder: fullPath }))
          }

          return
        }

        if (
          (is.regexp(opts.exclude) && opts.exclude.test(opts.excludeNameOnly ? file : fullPath)) ||
          (is.fn(opts.exclude) && opts.exclude(file, fullPath))
        ) {
          return
        }

        if (
          (is.regexp(opts.pattern) && opts.pattern.test(opts.nameOnly ? file : fullPath)) ||
          (is.fn(opts.pattern) && opts.pattern(file, fullPath) === true)
        ) {
          return fullPath
        }
      }))
    }

    return Promise.all(p).then(results => compact(flatten(results)))
  })
}

module.exports = readFiles
