<script>
	import { mapGetters } from 'vuex';
	import ckeConfig from 'src/ckeditor-config';
	import { loadScript } from 'src/utils';
	import http, { getApiToken } from 'src/http';

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
		},
		watch: {
			disabled(v) {
				// noinspection JSUnresolvedFunction
				this.ckeInstance.isReadOnly = v;
			},
			value(v, old) {
				if (old !== v) this.ckeInstance.setData(v || '');
			},
		},
		mounted() {
			loadScript('https://cdn.ckeditor.com/ckeditor5/16.0.0/classic/ckeditor.js').then(() => {
				ClassicEditor.create(this.$refs.textarea, ckeConfig).then(editor => {
					editor.setData(this.value || '');
					editor.model.document.on('change:data', this.onChange);
					editor.editing.view.document.on('focus', () => {
						this.$emit('focus');
					});
					editor.editing.view.document.on('blur', () => {
						this.$emit('blur');
					});

					this.ckeInstance = editor;
				});
				/*
				if (!CKEDITOR.stylesSet.registered.admin) CKEDITOR.stylesSet.add('admin', ckeConfig.styleSet);
				// noinspection ES6ModulesDependencies, NodeModulesDependencies, JSUnresolvedFunction
				this.ckeInstance = CKEDITOR.replace(this.$el, {
					filebrowserBrowseUrl: http.defaults.baseURL + 'wysiwyg/images/browse?api_token=' + getApiToken(),
					filebrowserUploadUrl: http.defaults.baseURL + 'wysiwyg/images/upload?api_token=' + getApiToken(),
					stylesSet: 'admin',
					...ckeConfig.instanceConfig,
				});
				this.ckeInstance.setData(this.value || '');
				this.addListeners();*/
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
					const value = this.ckeInstance.getData();
					if (!value && this.value !== null) this.$emit('input', null);
					else if (value !== this.value) this.$emit('input', value);
				}, this.debounce);
			},
		},
	};
</script>
<template lang="pug">
	.field-wysiwyg(:class="fieldClass")
		div(ref="textarea")
</template>
