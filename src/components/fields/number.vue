<script>
	export default {
		props: {
			type: String,
			placeholder: String,
			title: String,
			value: null,
			disabled: {
				type: Boolean,
				default: false
			},
			min: {
				type: Number,
				default: -Infinity
			},
			max: {
				type: Number,
				default: Infinity
			}
		},
		methods: {
			emitValue(e) {
				const real = e.target.value.toString(),
					v = real.replace(/(?!^-)[^0-9]/g, '');
				if (v !== real) {
					e.target.value = v;
				}
				if (v !== '-') {
					const newValue = v === '' ? null : parseInt(v);
					if (this.value !== newValue) this.$emit('input', newValue);
				}
			},
			onBlur() {
				if (this.value === null) return;
				if (this.value < this.min) this.$emit('input', this.min);
				else if (this.value > this.max) this.$emit('input', this.max);
			}
		}
	};
</script>
<template lang="pug">
	input.form-control(
		':value'="value"
		'@input'="emitValue"
		'@blur'="onBlur"
		':placeholder'="placeholder"
		':disabled'="disabled")
</template>