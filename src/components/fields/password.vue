<script>
	import { emitValue } from 'src/utils/fields';

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
			emitValue
		}
	};
</script>
<template lang="pug">
	input.form-control(type="password"
		':value'="value"
		'@input'="emitValue"
		':placeholder'="placeholder"
		':disabled'="disabled")
</template>