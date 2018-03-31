<script>
	import FieldCheckbox from './checkbox.vue';

	// noinspection JSUnusedGlobalSymbols
	export default {
		components: { FieldCheckbox },
		props: {
			placeholder: String,
			title: String,
			value: null,
			required: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			hasValue: {
				get() {
					return !!this.value;
				},
				set(v) {
					this.$emit('input', v ? '000000' : null);
				}
			},
			colorValue() {
				if (!this.value) return null;
				return '#' + this.value;
			}
		},
		methods: {
			emitValue(e) {
				if (e.target.value) {
					let val = e.target.value.substr(1).toUpperCase();
					if (val !== this.value) this.$emit('input', val);
				}
				else if (this.value) this.$emit('input', null);
			}
		}
	};
</script>
<template lang="pug">
	.field-color.form-inline
		field-checkbox(v-if="!required" v-model="hasValue" :label="hasValue ? ($t('color') + ':') : $t('noColor')" :disabled="disabled")
		!=' '
		input(v-if="hasValue || required" type="color"
			:value="colorValue"
			:placeholder="placeholder"
			:disabled="disabled"
			@input="emitValue")
</template>
<style lang="stylus">
	.field-color
		[type="color"]
			width 80px
			padding 0 2px
			background transparent
			display inline-block
			vertical-align middle
</style>