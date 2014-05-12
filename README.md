# Sagase

A command line tool for searching files recursively.

## Usage

```bash
npm install -g sagase

sagase path/to/search /pattern/ /exclude_pattern/

sagase -i path/to/search /pattern/ /exclude_pattern/

sagase -f path/to/search -p /pattern/ -x /exclude_pattern/
```

### Available Options

`-f`, `--folder`: Folder to search. Default is current folder.

`-p`, `--pattern`: Regular expression to match. Only apply on **filename**.

`-x`, `--exclude`: Regular expression to exclude. Apply on **full path**.

`-i`, `--ignore-case`: Flag for ignore case. Default is true.

`-r`, `--recursive`: Flag for search recursively. Default is true.

## License

Copyright (c) 2014 Chris Yip. Licensed under the MIT license.
