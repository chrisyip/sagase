import test from 'ava'
import path from 'path'
import is from 'is'

import { find } from '..'

const fixturePath = path.resolve(__dirname, './fixtures')

test('should return files', async t => {
  let result = find({ folder: fixturePath, pattern: 'foo.json' })
  t.true(typeof result === 'object' && result != null)
  t.true(typeof result.then === 'function')

  result = await result
  t.true(Array.isArray(result))
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))
})

test('options', async t => {
  const err = await t.throws(find())
  t.is(err.message, '`folder` requires a string')
})

test('options.folder', async t => {
  const result = await find({ folder: path.resolve(fixturePath, 'foo'), pattern: 'foo.json' })
  t.true(Array.isArray(result))
  t.is(result.length, 1)
  t.is(result[0], path.resolve(fixturePath, 'foo/foo.json'))

  const err = await t.throws(find({ folder: {} }))
  t.is(err.message, '`folder` requires a string')
})

test('options.pattern', async t => {
  let result = await find({
    folder: fixturePath,
    pattern: 'foo.json'
  })
  t.true(Array.isArray(result))
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))

  result = await find({
    folder: fixturePath,
    pattern: /fo{2}\./
  })
  t.true(Array.isArray(result))
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))

  result = await find({
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

  const err = await t.throws(find({
    folder: fixturePath,
    pattern: {}
  }))
  t.is(err.message, '`pattern` requires a function, regexp or string')
})

test('options.nameOnly', async t => {
  let result = await find({
    folder: fixturePath,
    pattern: 'foo',
    nameOnly: true
  })
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))

  result = await find({
    folder: fixturePath,
    pattern: 'foo',
    nameOnly: false
  })
  t.is(result.length, 3)
  t.true(result.every(item => is.string(item) && item.endsWith('.json')))

  result = await find({
    folder: fixturePath,
    pattern: 'foo'
  })
  t.is(result.length, 3)
  t.true(result.every(item => is.string(item) && item.endsWith('.json')))
})

test('options.exclude', async t => {
  let result = await find({
    folder: fixturePath,
    exclude: 'bar'
  })
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))

  result = await find({
    folder: fixturePath,
    exclude: /bar/
  })
  t.is(result.length, 2)
  t.true(result.every(item => is.string(item) && item.endsWith('foo.json')))

  result = await find({
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

  const err = await t.throws(find({
    folder: fixturePath,
    exclude: {}
  }))
  t.is(err.message, '`exclude` requires a function, regexp or string')
})

test('options.excludeNameOnly', async t => {
  let result = await find({
    folder: fixturePath,
    exclude: 'foo',
    excludeNameOnly: true
  })
  t.is(result.length, 1)
  t.true(result.every(item => is.string(item) && item.endsWith('bar.json')))

  result = await find({
    folder: fixturePath,
    pattern: 'foo',
    exclude: 'foo',
    excludeNameOnly: false
  })
  t.is(result.length, 0)

  result = await find({
    folder: fixturePath,
    pattern: 'foo',
    exclude: 'foo'
  })
  t.is(result.length, 0)
})

test('options.recursive', async t => {
  const result = await find({ folder: fixturePath, pattern: 'foo', recursive: false })
  t.is(result.length, 1)
  t.is(result[0], path.resolve(fixturePath, 'foo.json'))
})
