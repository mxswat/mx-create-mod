# `mx-create-mod`

> A lightweight(ish) CLI for scaffolding new mods

## Installation

You don't actually need to, realistically. 
Run `npm init mx-create-mod` or `npx mx-create-mod` and `npm` will do the hard work of downloading and running the CLI.

If you really want to install it, just run `npm i -g mx-create-mod` then run `mx-create-mod` to get started.

## Options

* Zomboid - Run inside `C:\Users\<Your User Name>\Zomboid\Workshop`. It's similiar to the `ModTemplate` you find in `Zomboid\Workshop`.
* Payday 2 BLT - Run inside your `mods` folder
* Payday 2 Beardlib - Run inside your `asset_overrides` folder
## Credits

Based on https://medium.com/@pongsatt/how-to-build-your-own-project-templates-using-node-cli-c976d3109129

Readme template from @agc93

## Debugging

Run `npm run start`, vscode with auto attach to the process since inside the `.vscode` folder the debugger is set to auto attach