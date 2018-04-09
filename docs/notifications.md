# Notifications

Notifications are convenient when you want user to pay attention to something without requiring any kind of interaction.

To show notification just call `this.$notify('Message string'[, options])` within any of your Vue components.

This will return a promise which is resolved (without any value) when notification is closed.

`options` is an object which can contain fields:
* `class` - array or string with custom class, see
[Bootstrap alerts](https://getbootstrap.com/docs/3.3/components/#alerts) for available class modifiers.
Default: `'alert-info'`
* `timeout` - time in ms to show notification for. Default: `2000`. Set to `false` to disable timeout.

Usage example:

```javascript
// Custom Vue component
export default {
	// I don't wanna die :(
	beforeDestroy() {
		this.$notify('Noooooooo!', { class: 'alert-danger' })
			.then(() => { console.log('What have you done...'); });
	}
}
```