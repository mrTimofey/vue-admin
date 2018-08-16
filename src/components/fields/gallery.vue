<script>
	import { mapGetters } from 'vuex';
	import { httpErrorModalData } from 'src/utils';
	import Draggable from 'vuedraggable';
	import http from 'src/http';

	// noinspection JSUnusedGlobalSymbols
	export default {
		props: {
			value: Array,
			disabled: {
				type: Boolean,
				default: false
			},
			pipe: {
				type: String,
				default: 'admin-thumb'
			}
		},
		data: () => ({
			updating: false
		}),
		computed: {
			...mapGetters(['imagePath']),
			images: {
				get() {
					return this.value;
				},
				set(v) {
					this.$emit('input', v);
				}
			}
		},
		methods: {
			fileInputChanged(e) {
				if (!e.target.files.length || this.updating || this.disabled) return;
				// noinspection JSUnresolvedFunction
				const value = this.value ? this.value.slice() : [];
				this.updating = true;
				const data = new FormData();
				for (let file of e.target.files) data.append('images[]', file);
				http.post('upload/images', data)
					.then(res => {
						this.$emit('input', value.concat(res.data));
					})
					.catch(err => {
						this.$modal.open('error', httpErrorModalData(err));
					})
					.then(() => {
						e.target.form.reset();
						this.updating = false;
					});
			},
			remove(item) {
				if (this.disabled) return;
				// noinspection JSUnresolvedFunction
				const value = this.value.slice();
				value.splice(value.indexOf(item), 1);
				this.$emit('input', value);
			}
		},
		components: { Draggable }
	};
</script>
<template lang="pug">
	.field-gallery(:class="{ updating, disabled }")
		draggable.list(v-model="images" v-show="images && images.length")
			.image(v-for="id in images" :key="id")
				.btn-group
					button.btn.btn-danger.btn-xs(@mousedown.stop.prevent="remove(id)" :disabled="disabled"): i.fas.fa-trash
					a.btn.btn-default.btn-xs(:href="imagePath + '/' + id" target="_blank"): i.fas.fa-eye
				img(:src="imagePath + '/' + (id.endsWith('.svg') ? '' : (pipe + '/')) + id")
		form: label
			a.btn.btn-default.btn-sm(:class="{ disabled: updating || disabled }") {{ $t('uploadImages') }}
			input.hidden(type="file" multiple accept="image/*" @change="fileInputChanged" :disabled="disabled")
</template>
<style lang="stylus">
	.field-gallery
		.list
			margin 1em 0 0.5em 0
		.image
			display inline-block
			vertical-align top
			margin 0 0.5em 0.5em 0
			cursor move
			position relative
			.btn-group
				absolute 0 0 false false
				.btn
					border-radius 0
		.updating, .disabled
			opacity 0.5
			pointer-events none
</style>