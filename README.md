# Brotli Chrome Extension

Decompress values using Brotli.

## Running and building

### Procedures:

1. Check if your [Node.js](https://nodejs.org/) version is >= **14**.
2. Clone this repository.
3. Change the package's `name`, `description`, and `repository` fields in `package.json`.
4. Change the name of your extension on `src/manifest.json`.
5. Run `npm install` to install the dependencies.
6. Run `npm run build:dev`

## Installing

### Follow the step above or Download the package in the [Releases](https://github.com/ricardotondello/brotli-chrome-extension/releases)
1. Load your extension on Chrome following:
   - Access `chrome://extensions/`
   - Check `Developer mode`
   - Click on `Load unpacked extension`
   - Select the `build` folder.
