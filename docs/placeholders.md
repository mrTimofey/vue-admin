# Placeholders

*You probably do not want to read this section unless you get there by reference from some other section or you just know what you want :)*

There are some places where you can use a string templates with placeholders.

Each placeholder is a template part with mustache-like entries similar to Vue.js
that can be dynamically replaced with some values from a provided object.


These entries looks like this:
`{{ field [| filter | filterWithArgs(arg1, arg2)] [|| default value ]}}`
where:
* `field ` - source object field name which value will be used
* `filter`, `filterWithArgs(arg1, arg2)` - filter, any Vue.js globally registered filter
* `defaultValue` - guess what

## Examples

Usage in JavaScript code:

```javascript
import { parsePlaceholders } from 'src/utils';

const str = parsePlaceholders('The name is {{ name | uppercase }}', { name: 'Something' });
// str === 'The name is SOMETHING'
```

Usage in Vue component templates with a built-in `placeholders` filter:

```html
<script>
    export default {
        data: () => ({
            priceTemplate: '{{ name | floatFormat || 0.0 }} USD'
        })
    }
</script>
<template lang="pug">
	div
		p {{ priceTemplate | placeholders({ price: 10.1234567 }) }} === 10.12 USD
		p {{ priceTemplate | placeholders({}) }} === 0.0 USD
</template>
```