# Server API prerequisities

`vue-admin-front` works with any server API supporting specification described [here](https://github.com/mrTimofey/vue-admin/blob/master/docs/swagger.yml).

Admin panel requires descriptions of all data models and action capabilities fetched from a server API. Data format is also descirbed in the specification.

Backend must return an admin panel HTML layout contents to any request starting with a configured root path (`/admin` by default) since the SPA is using the History API. Layout itself is included in a Webpack bundle.

## Supported API solutions

You can find a list of ready-to-use solutions below and see their documentations to configure them. Or feel free to make your own :)

* [laravel-admin-api](https://github.com/mrTimofey/laravel-admin-api) for PHP 7.1 and Laravel 5