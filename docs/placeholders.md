# Placeholders

*You probably do not want to read this section unless you get there by reference from some other section or you just know what you want :)*

There are some places where you can use a string templates with placeholders.

Each placeholder is a template part with mustache-like entries that can be replaced with some values from a provided object.

These entries looks like this:
`{{ field [| filter | filterWithArgs(arg1, arg2)] [|| default value ]}}`
where:
* `field ` - source object field name which value will be used
* `filter`, `filterWithArgs(arg1, arg2)` - filter, any Vue.js globally registered filter
* `defaultValue` - guess what

Examples:
* {{ name | uppercase }} with data { id: 1, name: "Something" } -> `SOMETHING`
* You can buy {{ name }} {{ price | floatFormat(2) }} per item with data { name: "Bread", price: 10.234567 } -> `You can buy Bread 10.23 USD per item`
* Return to your {{ siblingType || sibling }} with data { siblingType: null } -> `Return to your sibling`, with data { siblingType: "sister" } -> `Return to your sister`

Usage within your own modules:

```javascript
import { parsePlaceholders } from 'src/utils';

const str = parsePlaceholders('The name is {{ name | uppercase }}', { name: 'Something' });
// str === 'The name is SOMETHING'
```

Usage within any Vue component template:

```html
<script>
    export default {
        data: () => ({
            priceTemplate: '{{ name | uppercase || 0.0 }} USD',
            source: {
                price: 10.123456
            }
        })
    }
</script>
<template lang="pug">
    p {{ priceTemplate | placeholders(source) }} === 10.12 USD
</template>
```