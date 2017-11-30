<script>
	import { emitValue, trimValue } from 'src/utils/fields';

	export default {
		props: {
			placeholder: String,
			title: String,
			value: String,
			disabled: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			emitValue, trimValue
		}
	};
</script>
<template lang="pug">
	textarea.form-control(
		':value'="value"
		'@input'="emitValue"
		'@blur'="trimValue"
		':placeholder'="placeholder || title"
		':disabled'="disabled")
</template>