# Modals

Any important stuff you don't want to be missed by a user can be shown with modal windows. Each modal window is a special component within `src/components/modals` directory.

Modals can be triggered from any component with:
* `this.$modal.open(name: String, props: Object, size: String): Promise` - opens a modal window from `src/components/modals/**name**.vue` with window size from `size` (`'sm'` to shrink window or `'lg'` to widen it), passes component props from `props`. Returns a promise resolving after modal is closed.
* `this.$modal.close([data: Any])` - close current modal and resolve its promise with optional `data`.

All modals can be closed automatically without any provided data after user:
* clicked outside a modal window
* pressed ESC

Also current modal will be closed without resolving if other modal is opened.

## Available modal windows

Modal windows available out-of-the-box are described here. See [custom modal windows section](customization/custom-modal-windows.md) if you want to add a custom modal widnow.

### confirm

Action confirmation with 2 buttons to accept or decline some action.

Props:
* `title` - modal title, default: `confirmDialog` translation message entry ('Are you sure?' for `en`)
* `yes` - accept button text, default `yes` translation message entry ('Yes' for `en`)
* `no`- decline button text, default `no` translation message entry ('No' for `en`)
* `text` - modal window body content, bodyless window by default

Resolved with `true` or `false` depending on user decision.

### error

Just error message with red decorations and single button.

* `title` - modal title, default: `error` translation message entry ('Error' for `en`)
* `button` - button text, default `ok` translation message entry ('OK' for `en`)
* `text` - modal window body text
* `jsonData` - object, shown as a pretty JSON.

Resolved without any data.

### success

Just success message with green decorations and single button.

* `title` - modal title, default: `done` translation message entry ('Done' for `en`)
* `button` - button text, default `ok` translation message entry ('OK' for `en`)
* `text` - modal window body text

Resolved without any data.