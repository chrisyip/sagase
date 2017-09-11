'use strict'

const is = require('is')
const assert = require('assert')

function formatOptions (opts) {
  if (opts == null) {
    opts = {}
  }

  assert(is.string(opts.folder), '`folder` requires a string')

  const reFlag = opts.ignoreCase ? 'i' : ''
  let nameOnly = is.bool(opts.nameOnly) ? opts.nameOnly : false
  const excludeNameOnly = is.bool(opts.excludeNameOnly) ? opts.excludeNameOnly : false

  let exclude = opts.exclude
  let pattern = opts.pattern

  if (pattern == null) {
    pattern = /.*/
  } else {
    if (is.string(pattern)) {
      pattern = new RegExp(pattern, reFlag)
    } else {
      assert(is.fn(pattern) || is.regexp(pattern), '`pattern` requires a function, regexp or string')
    }
  }

  if (exclude != null) {
    if (is.string(exclude)) {
      exclude = new RegExp(exclude, reFlag)
    } else {
      assert(is.regexp(exclude) || is.fn(exclude), '`exclude` requires a function, regexp or string')
    }
  }

  return {
    folder: opts.folder,
    pattern,
    nameOnly,
    exclude,
    excludeNameOnly,
    recursive: is.bool(opts.recursive) ? opts.recursive : true
  }
}

module.exports = formatOptions
