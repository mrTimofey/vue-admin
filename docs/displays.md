# Displays

Displays are Vue components for formatting some input data from a `value` prop.

## Display component

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/shared/display.vue)

Display component is a [proxy component](https://vuejs.org/v2/api/#v-bind) which passes all its props down to a specified display type component.

Usage: `<display type="String" value="value"></display>`.

## Available display types

Display types available out-of-the-box are described here. See [custom display types section](customization/custom-displays.md) if you want to add a custom type.

All display types support a `value` prop. Type-specific props definitions are provided in their descriptions.

### array

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/array.vue)

Aliases: collection

Accepts array of values. Outputs configured display of each value.

Supported props:
* `itemProps` - array item display props (`{ type: 'text' }` by default)

### checkbox

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/checkbox.js)

Aliases: bool, boolean

Formats a `boolean` or `null` value with Font Awesome icon, text and color.
Value variants can be `checked`, `unchecked` and `unknown` for `true`, `false` and `null` respectively.

Supported props:
* `fa` - Font Awesome icon names for each value variant, default is `{ checked: 'check', uncheked: 'times', unknown: 'question-circle' }`
* `text` - same for text, no text by default
* `color` - same for color, can be any Bootstrap color mode for `text-*` class (`primary`, `info`, `danger`, etc.), default is `{ checked: 'primary', unknown: 'muted' }`

### color

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/color.vue)

I bet you can guess what it is :)

Accepts a hex color code without leading `#` as a value.

### date

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/date.vue)

Displays a date in a localized format.

Accepts `Y-m-d` format as a value.

### datetime

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/datetime.vue)

Displays date and time in a local format.

Accepts `Y-m-d H:i:s` format as a value.

### file

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/file.vue)

Displays a file download button.

Accepts file URL as a value.

### float

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/float.vue)

Displays formatted floating point value.

Aliases: real, double, decimal

Supported props:
* `precision` - number of digits after the point

### gallery

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/gallery.vue)

Displays thumbnails for an array of images.

### html

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/html.vue)

Raw html value.

### image

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/image.vue)

Image thumbnail.

### json

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/json.vue)

Displays value as a preformatted JSON

### key-value

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/key-value.vue)

Aliases: meta

Displays a provided object as a key-value pairs in a table.

### relation

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/relation.js)

Displays entity item relation(s) with or without related item editing link.

Supported props:
* `display` - `function(item)` or a string with [placeholders](placeholders.md) generating a display name for related item
* `entity` - related entity name, can be omitted for no-link relation
* `color` - Bootstrap color mode (`primary`, `info`, `danger`, etc.) for entity item button (with link) or label (without link), default is `default`
* `noLink` - disable link, but it will disabled anyway if no `entity` provided or entity editing is not allowed

### time

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/displays/time.vue)

No comments here.