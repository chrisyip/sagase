'use strict'

const fs = require('fs')
const path = require('path')
const flatten = require('@flatten/array')
const is = require('is')

const compact = require('./array-compact')

function readFiles (opts) {
  const files = fs.readdirSync(opts.folder)

  const result = []

  for (const file of files) {
    let fullPath = path.resolve(opts.folder + '/' + file)

    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      if (!opts.excludeNameOnly && is.regexp(opts.exclude) && opts.exclude.test(fullPath)) {
        continue
      }

      if (opts.recursive) {
        result.push(readFiles(Object.assign({}, opts, { folder: fullPath })))
        continue
      }

      continue
    }

    if (
      (is.regexp(opts.exclude) && opts.exclude.test(opts.excludeNameOnly ? file : fullPath)) ||
      (is.fn(opts.exclude) && opts.exclude(file, fullPath))
    ) {
      continue
    }

    if (
      (is.regexp(opts.pattern) && opts.pattern.test(opts.nameOnly ? file : fullPath)) ||
      (is.fn(opts.pattern) && opts.pattern(file, fullPath) === true)
    ) {
      result.push(fullPath)
      continue
    }
  }

  return compact(flatten(result))
}

module.exports = readFiles
