<script>
	export default {
		props: {
			value: Object,
			disabled: {
				type: Boolean,
				default: false
			},
			fields: {
				type: Object,
				required: true
			},
			inline: {
				type: Boolean,
				default: false
			},
			errors: null
		},
		methods: {
			updateItem(k, v) {
				if (this.disabled) return;
				this.$emit('input', this.value ? { ...this.value, [k]: v } : { [k]: v });
			}
		}
	};
</script>
<template lang="pug">
	.field-subform(':class'="{ 'subform-inline': inline }")
		field(v-for="(field, k) in fields" ':key'="k"
			v-bind="field"
			':style'="{ flexGrow: field.inlineSize || 1 }"
			':value'="value && value[k] !== undefined ? value[k] : null"
			':disabled'="disabled"
			':errors'="name && errors && errors[k]"
			'@input'="updateItem(k, $event)")
</template>
<style lang="stylus">
	.field-subform
		&.subform-inline
			display flex
			margin 0 -5px
			justify-content stretch
			> .form-group
				margin 0 5px
				flex-shrink 0
				flex-basis 0
		&:not(.subform-inline)
			> .form-group
				margin-bottom 5px
				&:last-child
					margin-bottom 0
</style>