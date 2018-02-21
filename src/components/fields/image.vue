<script>
	import { mapGetters } from 'vuex';
	import http from 'src/http';
	import { httpErrorModalData } from 'src/utils';
	import BaseFileField from './file.vue';

	export default {
		components: { BaseFileField },
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
			accept: {
				type: String,
				default: 'image/*'
			}
		},
		data: () => ({
			src: null,
			uploading: false
		}),
		computed: {
			...mapGetters(['imagePath']),
			fileValue() {
				return typeof this.value === 'string' ? (this.imagePath + '/' + this.value) : this.value;
			}
		},
		methods: {
			emitValue(v) {
				if (this.disabled) return;
				if (this.ajaxMode) {
					this.uploading = true;
					const data = new FormData();
					data.append('images[]', v);
					http.post('upload/images', data)
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
				else this.$emit('input', v);
			}
		},
		watch: {
			value: {
				immediate: true,
				handler(v) {
					if (!v) {
						this.src = null;
						return;
					}
					if (typeof v === 'string') this.src = this.imagePath + '/' +
						(v.endsWith('.svg') ? '' : 'admin-thumb/') + v;
					else {
						const reader = new FileReader();
						reader.onloadend = () => {
							this.src = reader.result;
						};
						reader.readAsDataURL(v);
					}
				}
			}
		}
	};
</script>
<template lang="pug">
	.field-image
		.field-image-preview.img-thumbnail(v-if="src"): img(':src'="src")
		base-file-field(':accept'="accept" ':placeholder'="placeholder || $t('chooseImage')" ':disabled'="disabled || uploading" ':value'="fileValue" '@input'="emitValue($event)")
</template>
<style lang="stylus">
	.field-image-preview
		margin-bottom 5px
		img
			height 120px
</style>