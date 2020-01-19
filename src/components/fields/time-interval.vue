<script>
	// noinspection JSUnusedGlobalSymbols
	export default {
		props: {
			value: Array,
			disabled: {
				type: Boolean,
				default: false,
			},
		},
		methods: {
			emitValue(i, v) {
				if (this.value === null && !v) {
					this.$emit('input', null);
					return;
				}
				// noinspection JSUnresolvedFunction
				const value = this.value ? this.value.slice() : ['00:00', '00:00'];
				value[i] = v;
				this.$emit('input', !(value[0] || value[1]) ? null : value);
			},
		},
	};
</script>
<template lang="pug">
	.field-time-interval
		field.inline(type="time" :disabled="disabled" :value="value && value[0]" @input="emitValue(0, $event)")
		!=' '
		field.inline(title="-" type="time" :disabled="disabled" :value="value && value[1]" @input="emitValue(1, $event)")
</template>