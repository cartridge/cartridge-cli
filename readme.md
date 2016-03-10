[![Stories in Ready](https://badge.waffle.io/code-computerlove/cartridge-cli.svg?label=ready&title=Ready)](http://waffle.io/code-computerlove/cartridge-cli)
[![devDependency Status](https://david-dm.org/cartridge/cartridge-cli/dev-status.svg)](https://david-dm.org/code-computerlove/cartridge-cli#info=devDependencies)
[![Dependency Status](https://david-dm.org/cartridge/cartridge-cli.svg)](https://david-dm.org/code-computerlove/cartridge-cli)

# Cartridge cli [![Build Status](https://travis-ci.org/cartridge/cartridge-cli.svg?branch=develop)](https://travis-ci.org/cartridge/cartridge-cli)

> Start with a clean cartridge and get yourself going with a ready made basic static website setup

Command line utility for [Cartridge](https://github.com/cartridge/cartridge)


## Installation

```bash
> npm install -g cartridge-cli
```

## Usage

```bash
> cartridge
```

```bash

  Usage: cartridge [options] [command]


  Commands:

    new   Create a new project (on-screen wizard)

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -s, --silent   Surpress all on-screen messages
    -v, --verbose  Show all on-screen messages

```
## Developing

To work on the project locally clone the repo then from within the checked out directory run:

```bash
> npm link
```
This will allow you to make changes to the project and have them reflected immediately within the command line tool.

## Contributing

* [Workflow](docs/contributing/workflow.md)
* [Testing](docs/contributing/testing.md)
