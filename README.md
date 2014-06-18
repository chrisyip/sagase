# Sagase

Searching files recursively.

## Usage

### Command Line

```bash
npm install -g sagase

sagase path/to/search /pattern/ /exclude_pattern/

sagase -i path/to/search /pattern/ /exclude_pattern/

sagase -f path/to/search -p /pattern/ -x /exclude_pattern/
```

### In Node.js

```bash
npm install --save sagase
```

```js
var find = require('sagase').find;

find({
  folder: './',
  pattern: /pattern/,
  nameOnly: true,
  exclude: /pattern/,
  excludeNameOnly: true,
  recursive: true
  })
  .then(function (files) {

    })

// `pattern` and `exclude` accept [Function]
// in this case, `nameOnly` and `excludeNameOnly` will be ignored
find({
  folder: './',
  pattern: function (name, path) {
    return true // to mark as matched
  },
  exclude: function (name, path) {
    return true // to mark as excluded
  },
  recursive: true
  })
  .then(function (files) {

    })
```

`Sagase.find` returns a [bluebird](https://github.com/petkaantonov/bluebird) `Promise`.

### Available Options

`-f`, `--folder`: Folder to search. Default is current folder (cli) or `process.cwd()` (Node.js).

`-p`, `--pattern`: Regular expression to match..

`--name-only`: Only apply `pattern` on **filename**. Default is `true`.

`-x`, `--exclude`: Regular expression to exclude.

`--exclude-name-only`: Only apply `exclude` on **filename**. Default is `true`.

`-i`, `--ignore-case`: Flag for ignore case. Default is `true`.

`-r`, `--recursive`: Flag for search recursively. Default is `true`.

## License

Copyright (c) 2014 Chris Yip. Licensed under the MIT license.
