<script>
	export default {
		props: {
			placeholder: String,
			value: [String, File],
			disabled: {
				type: Boolean,
				default: false
			},
			accept: String
		},
		computed: {
			uploaded() {
				return typeof this.value === 'string';
			}
		},
		methods: {
			onFileChange(e) {
				if (this.disabled) return;
				this.changedInside = true;
				this.$emit('input', e.target.files[0]);
			},
			clearValue() {
				if (this.disabled) return;
				this.changedInside = true;
				this.$emit('input', null);
			}
		}
	};
</script>
<template lang="pug">
	.field-file
		.field-file.btn-group.btn-group-sm
			.btn.btn-danger(v-if="value" '@click'="clearValue" ':disabled'="disabled"): i.fa.fa-trash
			label.btn.btn-default(v-else ':disabled'="disabled")
				input(type="file" style="display:none" '@change'="onFileChange" ':accept'="accept" ':disabled'="disabled")
				i.fa.fa-upload
				!=' {{ placeholder || $t(\'chooseFile\') }}'
			a.btn.btn-primary(v-if="uploaded" ':href'="value" target="_blank")
				i.fa.fa-download
				!=' {{ value }}'
			.btn.btn-warning.field-file-upload-pending(v-else-if="value") {{ $t('uploadMessage') }}
</template>
<style lang="stylus">
	.field-file
		display flex
		align-items center
		label
			margin 0
	.field-file-upload-pending
		pointer-events none
</style>