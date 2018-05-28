# Custom pages

You can create a custom page within `admin/src/pages` directory. Any source file you create here is automatically mapped to a corresponding route with same name as a relative page path. Files named `index.vue` do not affect a route name.

Examples:
* `admin/src/pages/section/index.vue` -> `/admin/section`
* `admin/src/pages/section/item.vue` -> `/admin/section/item`
* `admin/src/pages/route-with-dashes.vue` -> `/admin/route-with-dashes`

## URL postfix and parameters

You can provide additional route postfix for any of your pages by adding a `routePath` component field.
It is convenient when you want dynamic URL segments to be mapped to component props.
`routePath` should be compatible with `vue-router` path definition described [here](https://router.vuejs.org/guide/essentials/dynamic-matching.html).
Example:

```html
<!-- admin/src/pages/page-with-param.vue -->
<script>
    export default {
        props: ['id']
        routePath: ':id/details'
    }
</script>
<template lang="pug">
    div
        h1 Page /admin/page-with-param/{{ id }}/details
        p Details for ID {{ id }}
</template>
```

## Page layout

You can use a shared `page` component which provides a standard page layout with all necessary slots.

```html
<template lang="pug">
    page.custom-page
    	span(slot="title") Page title
    		!=' '
    		small Page subtitle
		span(slot="breadcrumbs")
			//- home page entry is already here
			li: router-link(to="somewhere") Somewhere
			li There
		//- any page content bellow
		.box
			.box-body Page content
</template>
```

## User interface and styles

You can find a big variety of style capabilities in the official [AdminLTE demo page](https://adminlte.io/themes/AdminLTE/index2.html).