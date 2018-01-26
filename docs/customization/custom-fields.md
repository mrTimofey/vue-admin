# Custom fields

Any additional field types you want to add should be placed to `admin/src/components/fields` folder. They will be implicitly included and available everywhere by using `<field type="custom-field-file-name"></field>`

Any field type must:
* contain `value` prop
* contain `disabled` prop, disables user interactions
* emit `input` event with new value each time user changes something

## Helpers

Field helpers can be imported with `import { func, ... } from vue-admin-front/utils/fields`.

* `emitValue` can be added to component's `methods` and directly used from HTML input/textarea with `@input="emitValue"`. It will correctly process empty string values and prevent sending same values multiple times.
* `trimValue` is similar to `emitValue` but additionally it trims provided string. Use with `@blur="trimValue"`.
* `transformedOptions` works with select-like widgets. It will try to convert value from component's `options` property to a generalized format. Can be safely added to component's `computed` section.
Supported input:

```javascript
// array
[
    // object
    {
        // will be used as a value if provided
        [this.valueField]: 'Value',
        
        // ...or any of the following will be option's value
        id: 'Value',
        value: 'Value'
        
        // will be used as a label if provided
        [this.labelField]: 'Label',
    
        // ...or any of the following will be option's label
        label: 'Label',
        title: 'Label',
        name: 'Label'
        
        // ...if no label found - value is used as a label
    },
    
    // primitive value will be used as both label and value
    'Value'
    
    // ...
];

// object
{
    // value: label
    [value]: 'Label',
    // ...
}
```
Output:
```javascript
[
    {
        value: 'value',
        label: 'title'
    },
    // ...
]
```