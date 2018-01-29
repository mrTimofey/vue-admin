# Extending entity pages

Read [custom pages](custom-pages.md) and [entities](/entities.md) sections first if you didn't.

## Index page

Start from that:

```javascript
// admin/src/pages/entities/your-entity-name/index.js (or index.vue)

import Base from 'vue-admin-front/src/pages/entities/_generic/index.vue'

export default {
    extends: Base
}
```

And thats all, do your stuff by yourself from here. Just refer to the original [`vue-admin-front/src/pages/entities/_generic/index.vue`](https://github.com/mrTimofey/vue-admin/blob/master/src/pages/entity/_generic/index.vue).

## Item page

Start from that:

```javascript
// admin/src/pages/entities/your-entity-name/item.js (or item.vue)

import Base from 'vue-admin-front/src/pages/entities/_generic/item.vue'

export default {
    extends: Base,
    routePath: ':id'
}
```

Default item component relies on computed properties or data entries allowing you to fulfill widespread use cases. These are:
* `hiddenFields: Array` - a list of field names to hide
* `disabledFields: Array` - a list of field names to disable

Refer to the original [`vue-admin-front/src/pages/entities/_generic/item.vue`](https://github.com/mrTimofey/vue-admin/blob/master/src/pages/entity/_generic/item.vue).