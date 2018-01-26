# Custom modal windows

Custom modal windows are simple components shown within a modal container. Any custom modal windows should be placed to `admin/src/components/modals` directory.

Use this template as a starting point if you want your modal to look like a standard Bootstrap modal window (you probably do):

```html
<template lang="pug">
    .modal-content
        .modal-header
            //- close button
            button.close('@click'="$modal.close()"): span ×
            //- modal title
            h4.modal-title Title
        //- main content area
        .modal-body: p Some text
        //- actions area
        .modal-footer
            button.btn.btn-default('@click'="$modal.close('Button 1 is clicked')") Button 1
            !=' '
            button.btn.btn-default('@click'="$modal.close('Button 2 is clicked')") Button 2
            !=' '
            button.btn.btn-default('@click'="$modal.close('Button 3 is clicked')") Button 3
</template>
```

Call `this.$modal.close([your data here])` if you want to close modal and optionally resolve its promise with some data.

Remember that modal will be closed automatically without data after user has clicked outside your modal window or pressed ESC.

Also opening other modal will cause current modal to be closed without resolving.