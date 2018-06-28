# Fields

Fields are interactive Vue components accepting a `value` prop as their provided value and emitting `input` event each time user changes something.

## Field component

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/shared/field.vue)

Field component is a [proxy component](https://vuejs.org/v2/api/#v-bind) which passes all its props down to a specified field type component and also displays field title, supports error field state and displays error messages.

Usage: `<field type="String" errors="null|String|Array<String>" title="null|String" v-model="value"></field>`.

## Available field types

Field types available out-of-the-box are described here. See [custom field types section](customization/custom-fields.md) if you want to add a custom type.

All field types support the following props:
* `disabled` - disables user interaction
* `value` - guess what

Type-specific props definitions are provided in their descriptions.

### array

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/array.vue)

Aliases: collection

Array of whatever you want. Allows to add new values and remove existing ones.

Supported props:
* `itemProps` - array item field props (`{ type: 'text' }` by default)
* `itemDefault` - new item default value
* `length` - fixed array length
* `min` - minimum array length
* `max` - maximum array length
* `addLabel` - add button label

`v-model` can be `Array` or `null`

### checkbox

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/checkbox.vue)

Aliases: bool, boolean

Just checkbox :)

Supported props:
* `label`, `placeholder`, `title` - any of these props sets a checkbox label

`v-model` should be a boolean value.

### color

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/color.vue)

Color picker, just an input with `type="color"` so appearence depends on browser. Field contains a checkbox to provide a `null` value and remove a color picker when unchecked.

Supported props:
* `placeholder`
* `required` - disables checkbox and always show a color picker so you can not set value to `null`

`v-model` will always have a format of a 3 or 6-digit hex color code `000000` **without** leading `#` or `null` (if `disabled` is not set or set to `false`)

### date

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/date.vue)

Date picker, just an input with `type="date"` so appearence depends on browser.

Supported props:
* `placeholder`

`v-model` format is a date string `YYYY-MM-DD` or `null` if input is empty. Initial value can be set to `'now'` so it will be immediately updated to a current date.

### datetime

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/datetime.vue)

Aliases: timestamp

Date and picker. Contains 2 inputs with types `date` and `time` respectively. Inputs' appearence depends on browser.

Supported props:
* `placeholder`

`v-model` format is a datetime string `YYYY-MM-DD HH:MM:SS` or `null` if inputs are empty. Initial value can be set to `'now'` so it will be immediately updated to a current datetime.

### file

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/file.vue)

File upload input.

Supported props:
* `placeholder` - `chooseFile` translation message entry by default ('Choose file' for `en`)
* `ajaxMode` - upload file just after choosing a file, `false` by default, requires `POST {basePath}/upload/files` API method.
* `accept` - sets file input's `accept` attribute
* `size` - upload Bootstrap button size (sm, xs)
* `uploadMessage` - message indicating file about to upload
* `valueLabel` - label that will be displayed instead of a file name

`v-model` accepts 3 types of values:
* string value - interpreted as an uploaded file URL
* JavaScript `File` object - interpreted as a file about to upload
* `null`

### float

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/float.vue)

Aliases: real, double, decimal

Same as [number](#number) but accepts floating point values.

### gallery

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/gallery.vue)

Image gallery editor with drag-n-drop ordering.

`v-model` is an array of string values representing image file names. Image preview path will be prepended with `imagePath` acquired from server API with meta-data.

**IMPORTANT**
This field requires additional server API method `POST {basePath}/upload/images` to accept `multipart/form-data` uploads with multiple images.

### geo-point

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/geo/point.vue)

Geographical coordinates field with Google Maps widget.

Supported props:
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
* `ajaxMode` - upload image just after choosing a file, `false` by default, requires `POST {basePath}/upload/images` API method.
* `accept` - accept file input attribute, `'image/*'` by default
* `size` - upload Bootstrap button size (sm, xs)
* `uploadMessage` - message indicating file about to upload
* `valueLabel` - label that will be displayed instead of a file name

`v-model` accepts 3 types of values:
* string value - interpreted as an uploaded file name, image preview path will be prepended with `imagePath` acquired from server API with meta-data
* JavaScript `File` object - interpreted as an image file about to upload
* `null`

### key-value

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/key-value.vue)

Aliases: meta

Key-value pairs.
Widget is a 2-column table where first column contains predefined fixed keys and second contains text inputs.
Convenient for representing meta/OpenGraph/etc. values.

Supported props:
* `keys` - keys array (`['title', 'description', 'keywords']` by default)

`v-model` object with fields from `props.keys` or `null`. This object contains only non-empty text values. Value is set to `null` if no text provided.

### number

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/number.vue)

Aliases: int, integer

Integer value input. Filters any non-numeric letters while typing.

Supported props:
* `placeholder`
* `min` and `max` - minimum and maximum allowed values (`-Infinity` and `Infinity` by default)

### password

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/password.vue)

Just a password input, nothing special.

Supported props:
* `placeholder`

### radio-select

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/radio-select.vue)

List of radio buttons.

Supported props:
* `options` - available options; supported argument types: array of strings, array of objects or key-value pairs object; **required**
    * `labelField` - option item object field used as a label (`label`, `title` and `name` will be tried by default)
    * `valueField` - option item object field used as a value (`id` and `value` will be tried by default)

`v-model` is set to option value.

### relation

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/relation.vue)

A complex field type which can be used to attach, detach and create new related entities. Supports text searching of possible related entity items.

Supported props:
* `placeholder`
* `required` - disallow value removing, works only in single-value mode (not `multiple`)
* `multiple` - accept array of values
* `name` or `entity` - related entity name, **required**
* `display` - label template (see [placeholders section](placeholders.md)) or a function returning label string from an item object passed as argument (`item => (item.title || item.name || item.label) + ' [' + item.id + ']'` by default)
* `valueField` - entity item object field name used as a value (primary key by default)
* `limit` - limit entity items count fetched from API
* `allowCreate` - allow inline creating new related entity items from a single string value (can be allowed when there is no exact search result)
    * `createField` - field name which will take a provided string value (`name` by default)
    * `createDefaults` - other fields values
* `queryParams` - custom entity API query parameters

`v-model` is set to:
* Single-value mode: selected entity item's `valueField` value or `null` if there is no selected item.
* Multiple-values mode: array of selected entities' `valueField` values.

### select

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/select.vue)

Select field.

Supported props:
* `placeholder`
* `required` - disallow value removing, works only in single-value mode (not `multiple`)
* `multiple` - accept array of values
* `options` - available options; supported argument types: array of strings, array of objects or key-value pairs object; **required**
    * `labelField` - option item object field used as a label (`label`, `title` and `name` will be tried by default)
    * `valueField` - option item object field used as a value (`id` and `value` will be tried by default)
* `searchable` - allow values search
    * `onSearch` - provide a function `query:String => Promise` which will be used instead of a simple substring search; modifies options and returns a Promise instance resolved once search results are ready to use (resolve a promise even if any errors occured, use [modals](modals.md) to show errors and interact with user)
    * `searchDebounce` - debounce timeout in ms, used only if `onSearch` is provided (`300` by default)
* `onCreate` - inline creating callback, function `text:String => Promise`; modifies options and value, returns Promise instance resolved once creating is done (resolve a promise even if any errors occured, use [modals](modals.md) to show errors and interact with user)

`v-model` can be `null`, any simple type for single value or `Array` of simple values for multiple mode.

### subform

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/subform.vue)

Group of fields representing single `Object` value with object fields assigned to their field types.

Supported props:
* `fields` - object of `{ [subfield name]: { ...[subfield props], inlineSize: 1 } }`;
	each field can contain `inlineSize` property with field width share in inline mode
* `inline` - show fields inline after each other

`v-model` can be `null` or `Object`.

### switcher

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/switcher.js)

Same as a `checkbox` but emits unchecked state as `null` instead of `false`.
Useful when you want to create a checkbox filter on entity index pages and do not want unchecked state to affect query string.

### text

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/text.vue)

Aliases: string

`<input type="text">`

Supported props:
* `placeholder`

`v-model` is a string or `null` for empty string input value.

### textarea

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/textarea.vue)

`<textarea></textarea>`

Supported props:
* `placeholder`

`v-model` is a string or `null` for empty string input value.

### time

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/time.vue)

Time picker, just an input with `type="time"` so appearence depends on browser.

Supported props:
* `placeholder`

`v-model` format is a time string `HH:MM` or `null` if input is empty.

### time-interval

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/time-interval.vue)

Time interval field.

`v-model` format is an array of 2 time strings `HH:MM` or `null` if one of inputs is empty.

### wysiwyg

[Component sources](https://github.com/mrTimofey/vue-admin/blob/master/src/components/fields/ckeditor.vue)

[CKEditor](https://ckeditor.com/) 4 WYSIWYG field.

Supported props:
* `debounce` - CKEditor->value update debounce timeout in ms (`100` by default)
* `stylesheet` - absolute path to a custom CSS or just a CSS string (default styles: global wysiwyg CSS from API meta data, `src/styles/wysiwyg.styl` otherwise)

`v-model` is a string or `null` for empty string value.

You can customize CKEditor instance configuration by replacing [`src/ckeditor-config.js`](https://github.com/mrTimofey/vue-admin/blob/master/src/ckeditor-config.js) (see [customization section](customization/README.md) for more onformation)