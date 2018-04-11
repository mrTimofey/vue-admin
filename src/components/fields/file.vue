<script>
	import http from 'src/http';
	import { httpErrorModalData } from 'src/utils';

	const uploads = [];
	let uploading = false;

	function upload({ data, vm }) {
		vm.uploading = true;
		return http.post('upload/files', data, { onUploadProgress: vm.progressUpload })
			.then(res => {
				vm.$emit('input', res.data[0]);
			})
			.catch(err => {
				vm.$modal.open('error', httpErrorModalData(err));
			})
			.then(() => {
				vm.uploading = false;
				vm.uploadProgress = 0;
			});
	}

	function uploadNext() {
		if (uploads[0]) {
			if (uploading) uploads[0].vm.uploadInQueue = true;
			else {
				uploading = true;
				uploads[0].vm.uploadInQueue = false;
				upload(uploads.shift()).then(() => {
					uploading = false;
					uploadNext();
				});
			}
		}
	}

	function queueUpload(data, vm) {
		uploads.push({ data, vm });
		uploadNext();
	}

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
			uploadInQueue: false,
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
					const data = new FormData();
					data.append('files[]', e.target.files[0]);
					queueUpload(data, this);
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
	.field-file(:class="[size ? 'size-' + size : null, { uploading: uploading || uploadInQueue }]")
		.progress.active(v-if="uploading || uploadInQueue" :class="[size ? ('progress-' + size) : null]")
			.progress-bar.progress-bar-striped(
				:style="{ width: (uploadInQueue ? 100 : (uploadProgress * 100)) + '%', opacity: uploadInQueue ? 0.5 : 1 }")
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