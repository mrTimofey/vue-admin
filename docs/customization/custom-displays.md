# Custom displays

Any additional display types you want to add should be placed to `admin/src/components/displays` folder.
They will be implicitly included and available everywhere by using `<display type="custom-display-file-name"></display>`

Any display type component must receive a `value` prop and generate a markup representing provided value in a fancy looking human-readable form.
Consider using a [functional component](https://vuejs.org/v2/guide/render-function.html#Functional-Components) to increase performance.