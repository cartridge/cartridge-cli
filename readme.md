# Cartridge cli  [![Build Status][travis-image]][travis-url]

[![devDependency Status][dev-dependency-image]][dev-dependency-url]
[![dependency Status][dependency-image]][dependency-url]


> Command line utility for [Cartridge](https://github.com/cartridge/cartridge)

## Installation
```sh
npm install -g cartridge-cli
```

## Usage
```sh
cartridge
```

```sh
Usage: cart [options] [command]

Commands:

  new   Create a new project (on-screen wizard)

Options:

  -h, --help     output usage information
  -V, --version  output the version number
  -s, --silent   Surpress all on-screen messages
  -v, --verbose  Show all on-screen messages
```

## Development
To work on the project locally clone the repo then from within the checked out directory run:

```sh
npm link
```
This will allow you to make changes to the project and have them reflected immediately within the command line tool.

## Contributing
* [Workflow](docs/contributing/workflow.md)
* [Testing](docs/contributing/testing.md)




[travis-url]: http://travis-ci.org/cartridge/cartridge-cli
[travis-image]: https://secure.travis-ci.org/cartridge/cartridge-cli.svg?branch=develop

[dev-dependency-url]: https://david-dm.org/cartridge-cli#info=devDependencies
[dev-dependency-image]: https://david-dm.org/cartridge/cartridge-cli/dev-status.svg

[dependency-url]: https://david-dm.org/code-computerlove/cartridge-cli
[dependency-image]: https://david-dm.org/cartridge/cartridge-cli.svg
