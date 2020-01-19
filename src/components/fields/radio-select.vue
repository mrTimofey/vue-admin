<script>
	import 'src/styles/checkbox.styl';
	import { transformedOptions } from 'src/utils/fields';

	// noinspection JSUnusedGlobalSymbols
	export default {
		props: {
			options: {
				type: [Array, Object],
				required: true,
			},
			value: null,
			disabled: {
				type: Boolean,
				default: false,
			},
			labelField: String,
			valueField: String,
		},
		computed: {
			transformedOptions,
		},
		methods: {
			emitValue(v) {
				this.$emit('input', v);
			},
		},
	};
</script>
<template lang="pug">
	.radio-select
		div(v-for="opt in transformedOptions"): label.styled-checkbox.radio
			span.styled-checkbox-label(v-html="opt.label")
			!=' '
			input(type="radio" :value="opt.value" @change="emitValue(opt.value)"
				:checked="value === opt.value" :disabled="disabled")
			.styled-checkbox-indicator
</template>