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

## Why?

I was so tired of looking for a robust solution for dashboards and administrative panels.
For they are many and still all of them are a piece of something bad.
And I made this module with all the love my heart can give and I am confident you will feel that love after typing
`npm i -S vue-admin-front` in the console.

## Docs?

Yes, [click here](https://mr-timofey.gitbooks.io/vue-admin).

## Demo?

Work in progress.

## What about server solutions?

Only [PHP7.1/Laravel based solution](https://github.com/mrTimofey/laravel-admin-api) exists at the moment.
Making more of them will be very appreciated.
[Read the docs](https://mr-timofey.gitbooks.io/vue-admin/server-api-prerequisities.html) for more info.

## How to use?

Install:
```bash
npm i -S vue-admin-front cross-env rimraf
```

Add this to package.json scripts:
```json
{
	"admin:dev": "node node_modules/vue-admin-front/index.js",
	"admin:build": "rimraf public/admin-dist && cross-env NODE_ENV=production webpack --config node_modules/vue-admin-front/webpack.config.js --progress --hide-modules"
}
```

Use `npm run admin:dev` to start dev server, `npm run admin:build` to make a static build within `public/admin-dist` directory.

More info [here](https://mr-timofey.gitbooks.io/vue-admin/quick-start.html).
