Administrative interface frontend built with Webpack and Vue.js.

## Install

```bash
npm i -D vue-admin-front cross-env rimraf
```

## Configuration

Add `vue-admin-front.config.js` file to your application root.
See `config.default.js` for available config options.

## Development and bundle building

Add this to package.json scripts:

```json
{
	"admin:dev": "node node_modules/vue-admin-front/index.js",
	"admin:build": "rimraf public/admin-dist && cross-env NODE_ENV=production webpack --config node_modules/vue-admin-front/webpack.config.js --progress --hide-modules"
}
```

This

## Extending frontend

`config.default.js` example:

```js
const path = require('path');

const base = require('vue-admin/config.default');

module.exports = {
	...base,
	sourcePath: path.resolve(__dirname, 'admin')
};
```

After that you will be able to extend this package by overwriting any default files from the package's
`src` directory with your customized files from application `admin/src`.

### Pages and routes

Pages are implicitly imported to the router from `src/pages`.
Just create custom Vue components in this directory to add new page or rewrite existing.

To add routes explicitly or reconfigure `vue-router` instance just override `src/router.js`:

```js
const base = require('vue-admin/src/router');

export default {
	...base,
	routes: [
		{ /* custom route */ },
		...routes
    ]
}
```

## Backend API

Fully compatible with the [mr-timofey/laravel-admin-api](https://github.com/mrTimofey/laravel-admin-api).