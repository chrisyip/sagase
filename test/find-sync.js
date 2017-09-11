import test from 'ava'
import path from 'path'
import is from 'is'

import { findSync } from '..'

const fixturePath = path.resolve(__dirname, './fixtures')

test('should return files', t => {
  let result = findSync({ folder: fixturePath, pattern: 'foo.json' })
  t.true(Array.isArray(result))
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))
})

test('options', t => {
  const err = t.throws(() => findSync())
  t.is(err.message, '`folder` requires a string')
})

test('options.folder', t => {
  const result = findSync({ folder: path.resolve(fixturePath, 'foo'), pattern: 'foo.json' })
  t.true(Array.isArray(result))
  t.is(result.length, 1)
  t.is(result[0], path.resolve(fixturePath, 'foo/foo.json'))

  const err = t.throws(() => findSync({ folder: {} }))
  t.is(err.message, '`folder` requires a string')
})

test('options.pattern', t => {
  let result = findSync({
    folder: fixturePath,
    pattern: 'foo.json'
  })
  t.true(Array.isArray(result))
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))

  result = findSync({
    folder: fixturePath,
    pattern: /fo{2}\./
  })
  t.true(Array.isArray(result))
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))

  result = findSync({
    folder: fixturePath,
    pattern (name, path) {
      t.true(is.string(name))
      t.true(is.string(path))
      t.true(path.endsWith(name))
      t.not(path, name)

      return name === 'foo.json'
    }
  })
  t.true(Array.isArray(result))
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))

  const err = t.throws(() => {
    findSync({
      folder: fixturePath,
      pattern: {}
    })
  })
  t.is(err.message, '`pattern` requires a function, regexp or string')
})

test('options.nameOnly', t => {
  let result = findSync({
    folder: fixturePath,
    pattern: 'foo',
    nameOnly: true
  })
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))

  result = findSync({
    folder: fixturePath,
    pattern: 'foo',
    nameOnly: false
  })
  t.is(result.length, 3)
  t.true(result.every(item => is.string(item) && item.endsWith('.json')))

  result = findSync({
    folder: fixturePath,
    pattern: 'foo'
  })
  t.is(result.length, 3)
  t.true(result.every(item => is.string(item) && item.endsWith('.json')))
})

test('options.exclude', t => {
  let result = findSync({
    folder: fixturePath,
    exclude: 'bar'
  })
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))

  result = findSync({
    folder: fixturePath,
    exclude: /bar/
  })
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))

  result = findSync({
    folder: fixturePath,
    exclude (name, path) {
      t.true(is.string(name))
      t.true(is.string(path))
      t.true(path.endsWith(name))
      t.not(path, name)

      return name === 'bar.json'
    }
  })
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))

  const err = t.throws(() => {
    findSync({
      folder: fixturePath,
      exclude: {}
    })
  })
  t.is(err.message, '`exclude` requires a function, regexp or string')
})

test('options.excludeNameOnly', t => {
  let result = findSync({
    folder: fixturePath,
    exclude: 'foo',
    excludeNameOnly: true
  })
  t.is(result.length, 1)
  t.true(result.every(item => is.string(item) && item.endsWith('bar.json')))

  result = findSync({
    folder: fixturePath,
    pattern: 'foo',
    exclude: 'foo',
    excludeNameOnly: false
  })
  t.is(result.length, 0)

  result = findSync({
    folder: fixturePath,
    pattern: 'foo',
    exclude: 'foo'
  })
  t.is(result.length, 0)
})

test('options.recursive', t => {
  const result = findSync({ folder: fixturePath, pattern: 'foo', recursive: false })
  t.is(result.length, 1)
  t.is(result[0], path.resolve(fixturePath, 'foo.json'))
})
