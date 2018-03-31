<script>
	import { emitValue } from 'src/utils/fields';

	// noinspection JSUnusedGlobalSymbols
	export default {
		props: {
			placeholder: String,
			title: String,
			value: String,
			disabled: {
				type: Boolean,
				default: false
			},
			autocomplete: {
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
	input.form-control(type="password" :autocomplete="autocomplete ? 'on' : 'new-password'"
		:value="value"
		@input="emitValue"
		:placeholder="placeholder"
		:disabled="disabled")
</template>