Administrative interface frontend built with Webpack and Vue.js.

## Install

```bash
npm i -D vue-admin-front cross-env rimraf
```

## Configuration

Add `vue-admin-front._config.js` file to your application root.
See `config.default.js` for available config options.

## Development and bundle building

Add this to package.json scripts:

```json
{
	"admin:dev": "node node_modules/vue-admin-front/index.js",
	"admin:build": "rimraf public/admin-dist && cross-env NODE_ENV=production webpack --config node_modules/vue-admin-front/webpack._config.js --progress --hide-modules"
}
```

## Configuring

Create `vue-admin-front.config.js` within your application root folder. Example:

```js
const base = require('vue-admin-front/config.default');

module.exports = {
	...base,
	// replace default configuration options
};
```

See original `config.default` file for any further instructions.

## Extending and customizing

You are able to extend or customize this package by simply overwriting any default files from the package's
`src` directory with your customized files from your application `admin/src` (directory is configurable).

### Pages and routes

Pages are implicitly imported to the router from `src/pages`.
Just create custom Vue components in this directory to add new page or rewrite an existing one.

To add routes explicitly or reconfigure `vue-router` instance just override `src/router.js`:

```js
import base from 'vue-admin-front/src/router';

export default {
	...base,
	routes: [
		{ /* custom route */ },
		...routes
    ]
}
```

### Fields and modals

You can rewrite/create new form fields and modal components in
`src/components/fields` and `src/components/modals` respectively.

Fields will be available as a `field` component with a `type` prop set to your custom field component file name.
Example: `src/components/fields/awesome/field.vue` -\> `<field type="awesome-field">`

Modals are also explicitly exposed and can be used inside any of your components with
`vm.$modal.open(name, [props], [size])` where `name` is a modal component file name, `size` can be 'sm' or 'lg'.
`vm.$modal.close()` will close current modal.

See existing components as references for your custom fields/modals.

## Backend API

Fully compatible with the [mr-timofey/laravel-admin-api](https://github.com/mrTimofey/laravel-admin-api).