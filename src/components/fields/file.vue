<script>
	import http from 'src/http';
	import { httpErrorModalData } from 'src/utils';

	export default {
		props: {
			placeholder: String,
			value: [String, File],
			disabled: {
				type: Boolean,
				default: false
			},
			ajaxMode: {
				type: Boolean,
				default: false
			},
			accept: String
		},
		data: () => ({
			uploading: false
		}),
		computed: {
			uploaded() {
				return typeof this.value === 'string';
			}
		},
		methods: {
			onFileChange(e) {
				if (this.disabled) return;
				if (this.ajaxMode) {
					this.uploading = true;
					const data = new FormData();
					data.append('files[]', e.target.files[0]);
					http.post('upload/files', data)
						.then(res => {
							this.$emit('input', res.data[0]);
						})
						.catch(err => {
							this.$modal.open('error', httpErrorModalData(err));
						})
						.then(() => {
							this.uploading = false;
						});
				}
				else this.$emit('input', e.target.files[0]);
			},
			clearValue() {
				if (this.disabled) return;
				this.$emit('input', null);
			}
		}
	};
</script>
<template lang="pug">
	.field-file
		.field-file.btn-group.btn-group-sm
			.btn.btn-danger(v-if="value" '@click'="clearValue" ':disabled'="disabled"): i.fas.fa-trash
			label.btn.btn-default(v-else ':disabled'="disabled")
				input(type="file" style="display:none" '@change'="onFileChange" ':accept'="accept" ':disabled'="disabled")
				i.fas.fa-upload
				!=' {{ placeholder || $t(\'chooseFile\') }}'
			a.btn.btn-default(v-if="uploaded" ':href'="value" target="_blank")
				i.fas.fa-download
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