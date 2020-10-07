## What is it?

This is the last package you will ever need to build your custom dashboard or administrative panel. It includes:
* AdminLTE (only styles)
* Vue.js based ready-to-use out of the box SPA
* Simple but flexible customization system
* OpenAPI 3 (formerly known as Swagger) specification for a compatible server API implementation
* Big variety of built-in field types
* Big variety of built-in data display format types
* Type-safe by design
* Suitable for a fast prototyping

[Demo with Laravel 5.6 backend](http://admin-demo.shit-free.space)

[Documentation](https://mr-timofey.gitbooks.io/vue-admin)

## How does it work?

The package contains all the necessary files for build and development. There is no prebuilt version since
`vue-admin-front` aims to provide a development environment where you can customize almost everything including
build-time stuff. But you can use this just as-is by executing a build command described bellow.

All the things related to your project data structure and data manipulation capabilities should be provided
by your backend REST API endpoints
[described in OpenAPI 3 format](https://github.com/mrTimofey/vue-admin/blob/master/docs/swagger.yml)

## What about server solutions?

Only [PHP7.1/Laravel based solution](https://github.com/mrTimofey/laravel-admin-api) exists at the moment.
Making more of them will be very appreciated.
[Read the docs](https://mr-timofey.gitbooks.io/vue-admin/server-api-prerequisities.html) for more info.

## How to use?

Install:
```bash
npm i -S vue-admin-front cross-env rimraf webpack-nano
```

Add this to package.json scripts:
```json
{
	"admin:dev": "node node_modules/vue-admin-front/index.js",
	"admin:build": "rimraf public/admin-dist && cross-env NODE_ENV=production wp --config node_modules/vue-admin-front/webpack.config.js"
}
```

Use `npm run admin:dev` to start dev server, `npm run admin:build` to make a static build within `public/admin-dist` directory.

More info [here](https://mr-timofey.gitbooks.io/vue-admin/quick-start.html).
