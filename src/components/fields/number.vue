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
				default: 0
			},
			max: {
				type: Number,
				default: Infinity
			}
		},
		methods: {
			emitValue(e) {
				const old = e.target.value.toString(),
					v = old.replace(/(?!^-)[^0-9]/g, '');
				if (v !== old) e.target.value = v;
				if (v !== '-') this.$emit('input', v === '' ? null : parseInt(v));
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