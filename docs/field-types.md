# Fields

Field types available out-of-the-box are described here. See [custom field types section](customization/custom-field-types.md) if you want to add a custom type.

## Field component

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/shared/field.vue)

Field component is a [proxy component](https://vuejs.org/v2/api/#v-bind) which passes all its props down to a specified field type component and also displays field title, supports error field state and displays error messages.

Usage: `<field type="String" errors="null|String|Array<String>" title="null|String"></field>`.

## Available field types

### checkbox

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/checkbox.vue)

Just checkbox :)

Supported props:
* `label`, `placeholder`, `title` - any of these props sets a checkbox label
* `disabled`

`v-model` should be a boolean value.

### color

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/color.vue)

Color picker, just an input with `type="color"` so appearence depends on browser. Field contains a checkbox to provide a `null` value and remove a color picker when unchecked.

Supported props:
* `placeholder`
* `disabled`
* `required` - disables checkbox and always show a color picker so you can not set value to `null`

`v-model` will always have a format of a 3 or 6-digit hex color code `000000` **without** leading `#` or `null` (if `disabled` is not set or set to `false`)

### date

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/date.vue)

Date picker, just an input with `type="date"` so appearence depends on browser.

Supported props:
* `placeholder`
* `disabled`

`v-model` format is a date string `YYYY-MM-DD` or `null` if input is empty. Initial value can be set to `'now'` so it will be immediately updated to a current date.

### datetime

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/datetime.vue)

Date and picker. Contains 2 inputs with types `date` and `time` respectively. Inputs' appearence depends on browser.

Supported props:
* `placeholder`
* `disabled`

`v-model` format is a datetime string `YYYY-MM-DD HH:MM:SS` or `null` if inputs are empty. Initial value can be set to `'now'` so it will be immediately updated to a current datetime.

### file

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/file.vue)

File upload input.

Supported props:
* `placeholder` - `chooseFile` translation message entry by default ('Choose file' for `en`)
* `disabled`
* `accept` - sets file input's `accept` attribute

`v-model` accepts 3 types of values:
* string value - interpreted as an uploaded file URL
* JavaScript `File` object - interpreted as a file about to upload
* `null`

### gallery

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/gallery.vue)

Image gallery editor with drag-n-drop ordering.

Supported props:
* `disabled`

`v-model` is an array of string values representing image file names. Image preview path will be prepended with `imagePath` acquired from server API with meta-data.

**IMPORTANT**
This field requires additional server API method `POST {basePath}/gallery` to accept `multipart/form-data` uploads with multiple images.

### geo-point

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/geo/point.vue)

Geographical coordinates field with Google Maps widget.

Supported props:
* `disabled`
* `zoom` - default Google Maps zoom value (`1` by default); used only if value is set to `null`, otherwise `value.zoom` is used
* `center` - default center coordinates array `[lat, lng]` (`[0, 0]` by default); used only if value is set to `null`, otherwise `value.point` is used
* `height` - Google map height, string value with units (`'20em'`) or number representing value in pixels (`400` by default)

`v-model` is an object `{ zoom: int, point: [float, float] }` or `null`.

**IMPORTANT**
This field requires a Google API key. Refer to [configuration section](configuration.md) for more information.

### image

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/image.vue)

Image upload input.

Supported props:
* `placeholder` - `chooseImage` translation message entry by default ('Choose image' for `en`)
* `disabled`

`v-model` accepts 3 types of values:
* string value - interpreted as an uploaded file name, image preview path will be prepended with `imagePath` acquired from server API with meta-data
* JavaScript `File` object - interpreted as an image file about to upload
* `null`

### meta

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/meta.vue)

Key-value pairs usually used to represent meta/OpenGraph/etc. tags values. Widget is a 2-column table where first column contains keys and second contains text inputs.

Supported props:
* `disabled`
* `keys` - keys array (`['title', 'description', 'keywords']` by default)

`v-model` object with fields from `props.keys` or `null`. This object contains only non-empty text values. Value is set to `null` if no text provided.

### number

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/number.vue)

Integer value input. Filters any non-numeric letters while typing.

Supported props:
* `placeholder`
* `disabled`
* `min` and `max` - minimum and maximum allowed values (`-Infinity` and `Infinity` by default)

### password

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/password.vue)

Just a password input, nothing special.

Supported props:
* `placeholder`
* `disabled`

### radio-select

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/radio-select.vue)

List of radio buttons.

Supported props:
* `disabled`
* `options` - available options; supported argument types: array of strings, array of objects or key-value pairs object; **required**
    * `labelField` - option item object field used as a label (`label`, `title` and `name` will be tried by default)
    * `valueField` - option item object field used as a value (`id` and `value` will be tried by default)

`v-model` is set to option value.

### relation

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/relation.vue)

A complex field type which can be used to attach, detach and create new related entities. Supports text searching of possible related entity items.

Supported props:
* `placeholder`
* `disabled`
* `required` - disallow value removing, works only in single-value mode (not `multiple`)
* `multiple` - accept array of values
* `name` or `entity` - related entity name, **required**
* `display` - label template (see [placeholders section](placeholders.md)) or a function returning label string from an item object passed as argument (`item => (item.title || item.name || item.label) + ' [' + item.id + ']'` by default)
* `valueField` - entity item object field name used as a value (`id` by default) or a function returning this value `item:Object => Any`
* `limit` - limit values count, works only in multiple-values mode
* `allowCreate` - allow inline creating new related entity items from a single string value (can be allowed when there is no exact search result)
    * `createField` - field name which will take a provided string value (`name` by default)
    * `createDefaults` - other fields values

`v-model` is set to:
* Single-value mode: selected entity item's `valueField` value or `null` if there is no selected item.
* Multiple-values mode: array of selected entities' `valueField` values.

### select

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/select.vue)

Select field.

Supported props:
* `placeholder`
* `disabled`
* `required` - disallow value removing, works only in single-value mode (not `multiple`)
* `multiple` - accept array of values
* `options` - available options; supported argument types: array of strings, array of objects or key-value pairs object; **required**
    * `labelField` - option item object field used as a label (`label`, `title` and `name` will be tried by default)
    * `valueField` - option item object field used as a value (`id` and `value` will be tried by default)
* `searchable` - allow values search
    * `onSearch` - provide a function `query:String => Promise` which will be used instead of a simple substring search; modifies options and returns a Promise instance resolved once search results are ready to use (resolve a promise even if any errors occured, use [modals](modals.md) to show errors and interact with user)
    * `searchDebounce` - debounce timeout in ms, used only if `onSearch` is provided (`300` by default)
* `onCreate` - inline creating callback, function `text:String => Promise`; modifies options and value, returns Promise instance resolved once creating is done (resolve a promise even if any errors occured, use [modals](modals.md) to show errors and interact with user)

### text

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/text.vue)

`<input type="text">`

Supported props:
* `placeholder`
* `disabled`

`v-model` is a string or `null` for empty string input value.

### textarea

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/textarea.vue)

`<textarea></textarea>`

Supported props:
* `placeholder`
* `disabled`

`v-model` is a string or `null` for empty string input value.

### time

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/time.vue)

Time picker, just an input with `type="time"` so appearence depends on browser.

Supported props:
* `placeholder`
* `disabled`

`v-model` format is a time string `HH:MM` or `null` if input is empty.

### worktime

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/worktime.vue)

Time interval field.

Supported props:
* `disabled`

`v-model` format is an array of 2 time strings `HH:MM` or `null` if one of inputs is empty.

### wysiwyg

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/ckeditor.vue)

[CKEditor](https://ckeditor.com/) 4 WYSIWYG field.

Supported props:
* `disabled`
* `debounce` - CKEditor->value update debounce timeout in ms (`100` by default)

`v-model` is a string or `null` for empty string value.

You can customize CKEditor instance configuration by replacing [`src/ckeditor-config.js`](https://github.com/mrTimofey/vue-admin/blob/master/src/ckeditor-config.js) (see [customization section](customization/README.md) for more onformation)