# Custom pages

You can create a custom page within `admin/src/pages` directory. Any source file you create here is automatically mapped to a corresponding route with same name as a relative page path. Files named `index.vue` do not affect a route name.

Examples:
* `admin/src/pages/section/index.vue` -> `/admin/section`
* `admin/src/pages/section/item.vue` -> `/admin/section/item`
* `admin/src/pages/route-with-dashes.vue` -> `/admin/route-with-dashes`

## URL postfix and parameters

You can provide additional route postfix for any of your pages by adding a `routePath` component field. It is convenient when you want to some parts of URL to be mapped to component prop. Example:

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