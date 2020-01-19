<script>
	import { emitValue, trimValue } from 'src/utils/fields';

	// noinspection JSUnusedGlobalSymbols
	export default {
		props: {
			placeholder: String,
			title: String,
			value: null,
			disabled: {
				type: Boolean,
				default: false,
			},
		},
		methods: {
			emitValue, trimValue,
		},
	};
</script>
<template lang="pug">
	input.form-control(type="time"
		:value="value"
		@input="emitValue"
		@blur="trimValue"
		:placeholder="placeholder"
		:disabled="disabled")
</template>