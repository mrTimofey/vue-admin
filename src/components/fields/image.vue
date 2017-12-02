<script>
	import { mapGetters } from 'vuex';
	import BaseFileField from './file.vue';

	export default {
		components: { BaseFileField },
		props: {
			placeholder: String,
			value: [String, File],
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data: () => ({
			src: null
		}),
		computed: {
			...mapGetters(['imagePath']),
			fileValue() {
				return typeof this.value === 'string' ? (this.imagePath + '/' + this.value) : this.value;
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
		base-file-field(accept="image/*" ':placeholder'="placeholder || $t('chooseImage')" ':disabled'="disabled" ':value'="fileValue" '@input'="$emit('input', $event)")
</template>
<style lang="stylus">
	.field-image-preview
		margin-bottom 5px
		img
			height 120px
</style>