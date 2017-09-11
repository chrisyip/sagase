'use strict'

const find = require('./lib/find')
const findSync = require('./lib/find-sync')
const parseOptions = require('./lib/parse-options')

module.exports = {
  /**
   * @param {Object} options
   * @param {String} options.folder
   * @param {(Function|String|RegExp)} [options.pattern=".*"]
   * @param {Boolean} [options.nameOnly=false]
   * @param {(Function|String|RegExp)} [options.exclude]
   * @param {Boolean} [options.excludeNameOnly=false]
   * @param {Boolean} [options.recursive=true]
   *
   * @returns {Promise.<String[]>}
   */
  find (options) {
    return new Promise(resolve => resolve(find(parseOptions(options))))
  },

  /**
   * @param {Object} options
   * @param {String} options.folder
   * @param {(Function|String|RegExp)} [options.pattern=".*"]
   * @param {Boolean} [options.nameOnly=false]
   * @param {(Function|String|RegExp)} [options.exclude]
   * @param {Boolean} [options.excludeNameOnly=false]
   * @param {Boolean} [options.recursive=true]
   *
   * @returns {String[]}
   */
  findSync (options) {
    return findSync(parseOptions(options))
  }
}
