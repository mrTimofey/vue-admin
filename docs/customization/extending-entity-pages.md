# Extending entity pages

Read [custom pages](custom-pages.md) and [entities](/entities.md) sections first if you didn't.

## Index page

Start from that:

```javascript
// admin/src/pages/entities/your-entity-name/index.js (or index.vue)

import Base from 'vue-admin-front/src/pages/entity/_generic/index.vue'

export default {
    extends: Base
}
```

Default index component relies on computed properties or data entries allowing you to fulfill widespread use cases. These are:
* `itemActionsBefore: Array<Object>|function(item: Object, index: Number)` -
	data/computed array or method returning a list of custom actions that will be inserted **before** standard edit/delete actions.
Each action is an object with fields:
	* `icon: string` - FontAwesome icon class
	* `text: string` - text inside button (HTML is allowed)
	* `btn: string` - Bootstrap btn type (`default`, `danger`, `info`, etc.)
	* `class: string|Array|Object` - custom class(es), should be a valid Vue value for `v-bind:class`
	* `title: string` - title tooltip
	* `action: string|function(item: Object, index: Number)` - component method name or function
* `itemActionsAfter: Array<Object>|function(item: Object, index: Number)` -
	same, but these actions will be inserted **after** standard ones
* `bulkActionsBefore: Array<Object>|function(selection: Array<Number>)` -
	same for bulk actions with multiple selected items. Object fields are same, except for:
	* `action: string|function(selection: Array<Number>)` - argument is an array of selected items' primary keys
* `bulkActionsAfter: Array<Object>|function(selection: Array<Number>)` - actions inserted after default ones

Refer to the original [`vue-admin-front/src/pages/entities/_generic/index.vue`](https://github.com/mrTimofey/vue-admin/blob/master/src/pages/entity/_generic/index.vue).

## Item page

Start from that:

```javascript
// admin/src/pages/entities/your-entity-name/item.js (or item.vue)

import Base from 'vue-admin-front/src/pages/entity/_generic/item.vue'

export default {
    extends: Base,
    routePath: ':id'
}
```

Default item component relies on computed properties or data entries allowing you to fulfill widespread use cases. These are:
* `hiddenFields: Array<string>` - a list of field names to hide
* `disabledFields: Array<string>` - a list of field names to disable

Refer to the original [`vue-admin-front/src/pages/entities/_generic/item.vue`](https://github.com/mrTimofey/vue-admin/blob/master/src/pages/entity/_generic/item.vue).