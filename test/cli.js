import test from 'ava'
import CliTest from 'command-line-test'
import path from 'path'
import is from 'is'

const BIN = path.resolve(__dirname, '../bin/cli.js')
const FIXTURE_DIR = path.resolve(__dirname, './fixtures')

test('should print files', async t => {
  const cliTest = new CliTest()
  let result = (await cliTest.exec(`${BIN} ${FIXTURE_DIR} foo`)).stdout
  t.true(is.string(result))
  t.is(result.split('\n').length, 3)
  t.true(result.split('\n').every(item => item.trim().endsWith('.json')))

  result = (await cliTest.exec(`${BIN} ${FIXTURE_DIR} foo bar`)).stdout
  t.true(is.string(result))
  t.is(result.split('\n').length, 2)
  t.true(result.split('\n').every(item => item.trim().endsWith('foo.json')))
})

test('should print error', async t => {
  const cliTest = new CliTest()
  const err = (await cliTest.exec(`${BIN} /non-exists foo`)).error
  t.true(err instanceof Error)
  t.true(err.message.includes('no such file or directory'))
})

test('-f, --folder', async t => {
  const cliTest = new CliTest()
  let result = (await cliTest.exec(`${BIN} -f ${FIXTURE_DIR} foo`)).stdout
  t.true(is.string(result))
  t.is(result.split('\n').length, 3)
  t.true(result.split('\n').every(item => item.trim().endsWith('.json')))

  result = (await cliTest.exec(`${BIN} --folder ${FIXTURE_DIR} foo`)).stdout
  t.true(is.string(result))
  t.is(result.split('\n').length, 3)
  t.true(result.split('\n').every(item => item.trim().endsWith('.json')))
})

test('-p, --pattern', async t => {
  const cliTest = new CliTest()
  let result = (await cliTest.exec(`${BIN} ${FIXTURE_DIR} -p foo`)).stdout
  t.true(is.string(result))
  t.is(result.split('\n').length, 3)
  t.true(result.split('\n').every(item => item.trim().endsWith('.json')))

  result = (await cliTest.exec(`${BIN} -f ${FIXTURE_DIR} --pattern foo`)).stdout
  t.true(is.string(result))
  t.is(result.split('\n').length, 3)
  t.true(result.split('\n').every(item => item.trim().endsWith('.json')))

  const err = (await cliTest.exec(`${BIN} ${FIXTURE_DIR}`)).error
  t.true(err instanceof Error)
  t.true(err.message.includes('Please input anything to search'))
})

test('--name-only', async t => {
  const cliTest = new CliTest()
  const result = (await cliTest.exec(`${BIN} -f ${FIXTURE_DIR} -p foo --name-only`)).stdout

  t.true(is.string(result))
  t.is(result.split('\n').length, 2)
  t.true(result.split('\n').every(item => item.trim().endsWith('.json')))
})

test('--ignore-case', async t => {
  const cliTest = new CliTest()
  let result = (await cliTest.exec(`${BIN} -f ${FIXTURE_DIR} -p FOO`)).stdout
  t.true(is.string(result))
  t.is(result.length, 0)

  result = (await cliTest.exec(`${BIN} -f ${FIXTURE_DIR} -p FOO --ignore-case`)).stdout
  t.true(is.string(result))
  t.is(result.split('\n').length, 3)
  t.true(result.split('\n').every(item => item.trim().endsWith('.json')))
})

test('--recursive', async t => {
  const cliTest = new CliTest()
  let result = (await cliTest.exec(`${BIN} -f ${FIXTURE_DIR} -p foo -r false`)).stdout
  t.true(is.string(result))
  t.is(result.split('\n').length, 1)
  t.true(result.split('\n').every(item => item.trim().endsWith('.json')))

  result = (await cliTest.exec(`${BIN} -f ${FIXTURE_DIR} -p foo --recursive true`)).stdout
  t.true(is.string(result))
  t.is(result.split('\n').length, 3)
  t.true(result.split('\n').every(item => item.trim().endsWith('.json')))

  result = (await cliTest.exec(`${BIN} -f ${FIXTURE_DIR} -p foo --recursive false`)).stdout
  t.true(is.string(result))
  t.is(result.split('\n').length, 1)
  t.true(result.split('\n').every(item => item.trim().endsWith('.json')))
})

test('-x, --exclude', async t => {
  const cliTest = new CliTest()
  let result = (await cliTest.exec(`${BIN} ${FIXTURE_DIR} -p foo -x bar`)).stdout
  t.true(is.string(result))
  t.is(result.split('\n').length, 2)
  t.true(result.split('\n').every(item => item.trim().endsWith('.json')))

  result = (await cliTest.exec(`${BIN} -f ${FIXTURE_DIR} -p foo --exclude bar`)).stdout
  t.true(is.string(result))
  t.is(result.split('\n').length, 2)
  t.true(result.split('\n').every(item => item.trim().endsWith('.json')))

  result = (await cliTest.exec(`${BIN} -f ${FIXTURE_DIR} foo foo`)).stdout
  t.true(is.string(result))
  t.is(result.length, 0)
})

test('--exclude-nameonly', async t => {
  const cliTest = new CliTest()
  let result = (await cliTest.exec(`${BIN} -f ${FIXTURE_DIR} -p foo -x foo --exclude-nameonly`)).stdout
  t.true(is.string(result))
  t.is(result.split('\n').length, 1)
  t.true(result.split('\n').every(item => item.trim().endsWith('.json')))
})
