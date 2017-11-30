<script>
	import 'src/styles/checkbox.styl';

	export default {
		props: {
			placeholder: String,
			label: String,
			title: String,
			value: Boolean,
			disabled: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			emitValue({ target }) {
				this.$emit('input', target.checked);
			}
		}
	};
</script>
<template lang="pug">
	label.styled-checkbox
		span.styled-checkbox-label(v-html="label || placeholder || title" ':class'="{ 'text-muted': disabled }")
		!=' '
		input(type="checkbox" ':checked'="value" '@change'="emitValue" ':disabled'="disabled")
		.styled-checkbox-indicator
</template>