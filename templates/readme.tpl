# <%= projectNameFileName %>
<%= projectDescription %>

## Prerequisits
* Git installed on command line
* Node & NPM installed

## Install
* Checkout the project from Bitbucket.
* Run npm install to setup Cartridge & Gulp.
___

## Coding Standards

The following coding standards should be used for this project:
* Back end standards (TBC)
* [Front end standards](https://github.com/code-computerlove/frontend-guidelines)

---

## Cartridge

This project uses [Cartridge](https://github.com/code-computerlove/cartridge), a set of modules that makes up the Code Computerlove gulp setup.
This project was created with Cartridge cli, using version <%= currentVersion %> of cartridge on <%= projectGeneratedDate %>

### Modules
The following Cartridge modules are used in this project

[//]: <> (Modules start)
[//]: <> (Modules end)

### Adding modules

Additional modules can be added with the [Cartridge command line tool](https://github.com/code-computerlove/cartridge-cli). To use it you must install it globally using npm.

```bash
> npm i -g cartridge-cli
```
Modules can then be added to the project in the following way

```bash
> cartridge add
```

more details can be found on the [Cartridge cli github page](https://github.com/code-computerlove/cartridge-cli)
