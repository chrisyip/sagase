# Sagase

[![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Travis CI][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

Searching files recursively.

## Usage

### Command Line

```bash
npm install -g sagase

sagase path/to/search /pattern/ /exclude_pattern/

sagase -i path/to/search /pattern/ /exclude_pattern/

sagase -f path/to/search -p /pattern/ -x /exclude_pattern/

sagase --help
Options:
  --folder, -f                           Path to search
  --pattern, -p                          A regexp or string for matching file
  --exclude, -x                          A regexp or string for excluding file
  --excludeNameOnly, --exclude-nameonly  Apply excluder on file name only
                                                      [boolean] [default: false]
  --recursive, -r                        Search recursively
                                                       [boolean] [default: true]
  --ignore-case, -i                      Ignore case  [boolean] [default: false]
  --version                              Show version number           [boolean]
  --help                                 Show help                     [boolean]
```

### In Node.js

```bash
npm install --save sagase
```

```js
const { find } = require('sagase')

find({
  folder: './',
  pattern: /pattern/, // accept function, regexp or string
  nameOnly: false,
  exclude: /pattern/, // accept function, regexp or string
  excludeNameOnly: false,
  recursive: true
})
  .then(files => {})

// `pattern` and `exclude` accept [Function]
// in this case, `nameOnly` and `excludeNameOnly` will be ignored
find({
  folder: './',
  pattern (name, path) {
    return true // to mark as matched
  },
  exclude (name, path) {
    return true // to mark as excluded
  }
})
  .then(files => {})

// Synchronous `find`
const { findSync } = require('sagase')
const files = findSync(options)
```

### Available Options

`-f`, `--folder`: Path to search.

`-p`, `--pattern`: A regexp or string for matching file.

`--name-only`: Only apply `pattern` on **filename**.

`-x`, `--exclude`: A regexp or string for excluding file.

`--exclude-nameonly`: Only apply `exclude` on **filename**.

`-i`, `--ignore-case`: Should ignore case.

`-r`, `--recursive`: Search recursively.

## License

Licensed under the MIT license.

[npm-url]: https://npmjs.org/package/sagase
[npm-image]: http://img.shields.io/npm/v/sagase.svg?style=flat-square
[daviddm-url]: https://david-dm.org/chrisyip/sagase
[daviddm-image]: http://img.shields.io/david/chrisyip/sagase.svg?style=flat-square
[travis-url]: https://travis-ci.org/chrisyip/sagase
[travis-image]: http://img.shields.io/travis/chrisyip/sagase.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/chrisyip/sagase
[codecov-image]: https://img.shields.io/codecov/c/github/chrisyip/sagase.svg?style=flat-square
