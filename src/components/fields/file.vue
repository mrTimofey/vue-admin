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
			size: {
				type: String,
				default: 'sm'
			},
			accept: String,
			uploadMessage: String,
			valueLabel: String
		},
		data: () => ({
			uploading: false,
			uploadProgress: 0
		}),
		computed: {
			uploaded() {
				return typeof this.value === 'string';
			}
		},
		methods: {
			progressUpload(e) {
				this.uploadProgress = e.loaded / e.total;
			},
			onFileChange(e) {
				if (this.disabled) return;
				if (this.ajaxMode) {
					this.uploading = true;
					const data = new FormData();
					data.append('files[]', e.target.files[0]);
					http.post('upload/files', data, { onUploadProgress: this.progressUpload })
						.then(res => {
							this.$emit('input', res.data[0]);
						})
						.catch(err => {
							this.$modal.open('error', httpErrorModalData(err));
						})
						.then(() => {
							this.uploading = false;
							this.uploadProgress = 0;
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
	.field-file(:class="[size ? 'size-' + size : null, { uploading }]")
		.progress.active(v-if="uploading" :class="size ? ('progress-' + size) : ''")
			.progress-bar.progress-bar-striped(:style="{ width: uploadProgress * 100 + '%' }")
		.field-file-btns.btn-group(v-else :class="size ? ('btn-group-' + size) : ''")
			.btn.btn-danger(v-if="value" @click="clearValue" :disabled="disabled"): i.fas.fa-trash
			label.btn.btn-default(v-else :disabled="disabled || uploading")
				input(type="file" style="display:none" @change="onFileChange" :accept="accept" :disabled="disabled || uploading")
				i.fas.fa-upload
				!=' {{ placeholder || $t(\'chooseFile\') }}'
			a.btn.btn-default(v-if="uploaded" :href="value" target="_blank")
				i.fas.fa-download
				!=' {{ valueLabel || value }}'
			.btn.btn-warning.field-file-upload-pending(v-else-if="value") {{ uploadMessage || $t('uploadMessage') }}
</template>
<style lang="stylus">
	.field-file .progress
		margin 0 !important
	.field-file.uploading.size-xs
		padding 8px 0 7px 0
	.field-file.uploading.size-sm
		padding 10px 0
	.field-file.uploading.size-md
		padding 7px 0
	.field-file-btns
		display flex
		align-items center
		label
			margin 0
	.field-file-upload-pending
		pointer-events none
</style>