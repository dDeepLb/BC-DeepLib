# Installation
### NOTE: This tutorial assumes you have Node.js and TS project set up.

```shell
npm install bc-deeplib
# or
yarn add bc-deeplib
# or
pnpm add bc-deeplib
```

[`bc-stubs`](https://github.com/bananarama92/BC-stubs?tab=readme-ov-file#installation) is *recommended* to be installed as well. It adds typings for the things from BC.

Include the library in your `include` field in `tsconfig.json`

```json
{
  "include": [
    "node_modules/bc-deeplib/**/*.d.ts",
  ]
}
```

And we good to go!

# Initializing mod
`initMod` is the entry point for initializing a mod. Though it has a lot of other options, the bare minimum is:

```ts
import { initMod } from "bc-deeplib/deeplib";

initMod({
  modInfo: {
    info: {
      name: 'My Mod',
      fullName: 'My Cool First Mod',
      version: '1.0.0',
      repository: 'https://example.com',
    },
  },
})
```

This will set up the Mod SDK and prepare storage for your mod. They will be available as `sdk` and `modStorage` respectively.

Some other options are:
* `initFunction` - a function to run when mod initializes
* `beforeLogin` - a function to run before login
* `modules` - an array of modules to register
* `migrators` - an array of migrators to register
* `mainMenuOptions` - options for the main menu
* `translationOptions` - options for the localization system

# Building mod
You can surely build it with any bundler you like, but the best way is to use built-in script with configurations:

1. Create `deeplib.config.js` in root of your project.

```js
import { defineConfig } from 'bc-deeplib/build';

export default defineConfig({
  entry: 'index.ts',
  outfile: 'index.js',
  globalName: 'ModName',
  distDirName: 'dist',
  publicDirName: 'public',
  scripts: ['./path/to/script.js'],
  prodRemoteURL: 'https://example.com/ModName',
  devRemoteURL: 'https://example.com/ModName/dev',
  target: ['es2020'],
  plugins: [], // additional esbuild plugins 
  defines: {}, // additional esbuild defines (see https://esbuild.github.io/api/#define)
  host: 'localhost',
  port: 55555,
})
```

2. Run `deeplib` with your package manager to build your mod.<br><br>
Run `deeplib --help` or `deeplib -h` to see all available options.

3. Now your mod bundle is located at configured path. `distDirName/index.js` by default.