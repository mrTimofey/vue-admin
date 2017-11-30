<script>
	import Draggable from 'vuedraggable';
	import http from 'src/http';

	export default {
		props: {
			value: Array,
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data: () => ({
			updating: false
		}),
		computed: {
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
				const value = this.value ? this.value.slice() : [];
				this.updating = true;
				const data = new FormData();
				for (let file of e.target.files) data.append('images[]', file);
				http.post('gallery', data).then(res => {
					this.updating = false;
					e.target.form.reset();
					this.$emit('input', value.concat(res.data));
				});
			},
			remove(item) {
				const value = this.value.slice();
				value.splice(value.indexOf(item), 1);
				this.$emit('input', value);
			}
		},
		components: { Draggable }
	};
</script>
<template lang="pug">
	.field-gallery(':class'="{ updating, disabled }")
		draggable.list(':value'="value" v-model="images" v-show="images && images.length")
			.image(v-for="id in images" ':key'="id")
				.btn-group
					button.btn.btn-danger.btn-xs('@mousedown.stop.prevent'="remove(id)"): i.fa.fa-remove
					a.btn.btn-default.btn-xs(':href'="'/storage/images/' + id" target="_blank"): i.fa.fa-eye
				img(':src'="'/storage/images/admin-thumb/' + id")
		form: label
			a.btn.btn-default.btn-sm(':class'="{ disabled: updating || disabled }") {{ $t('uploadImages') }}
			input.hidden(type="file" multiple accept="image/*" v-on:change="fileInputChanged" ':disabled'="disabled")
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