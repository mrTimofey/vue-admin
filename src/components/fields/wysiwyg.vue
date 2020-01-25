<script>
	import ckeConfig from 'src/ckeditor-config';
	import { loadScript } from 'src/utils';

	// noinspection JSUnusedGlobalSymbols
	export default{
		props: {
			value: String,
			disabled: {
				type: Boolean,
				default: false,
			},
			debounce: {
				type: Number,
				default: 100,
			},
			fieldClass: [String, Array],
			config: {
				type: Object,
				default: () => ({}),
			},
		},
		watch: {
			disabled(v) {
				// noinspection JSUnresolvedFunction
				this.ckeInstance.isReadOnly = v;
			},
			value(v, old) {
				if (old !== v && this._internalValue !== v) this.ckeInstance.setData(v || '');
			},
		},
		mounted() {
			loadScript('https://cdn.ckeditor.com/ckeditor5/16.0.0/classic/ckeditor.js').then(() => {
				ClassicEditor.create(this.$refs.textarea, { ...ckeConfig, ...this.config }).then(editor => {
					editor.setData(this.value || '');
					editor.model.document.on('change:data', this.onChange);
					editor.editing.view.document.on('focus', () => {
						this.$emit('focus');
					});
					editor.editing.view.document.on('blur', () => {
						this.$emit('blur');
					});
					editor.ckeInstance.isReadOnly = this.disabled;

					this.ckeInstance = editor;
				});
			});
		},
		beforeDestroy() {
			if (this.ckeInstance) this.ckeInstance.destroy();
		},
		methods: {
			onChange() {
				// noinspection JSUnusedGlobalSymbols
				this.changedInside = true;
				clearTimeout(this.changedTimeout);
				this.changedTimeout = setTimeout(() => {
					const value = this.ckeInstance.getData() || null;
					this._internalValue = value;
					if (value !== this.value) this.$emit('input', value);
				}, this.debounce);
			},
		},
	};
</script>
<template lang="pug">
	.field-wysiwyg(:class="fieldClass")
		div(ref="textarea")
</template>
