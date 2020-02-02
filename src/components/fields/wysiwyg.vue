<script>
	import ckeConfig from 'src/ckeditor-config';
	import { mapGetters } from 'vuex';
	import { getApiToken } from 'src/http';

	function loadCKEditor() {
		return import(/* webpackChunkName: 'ckeditor5/editor' */ 'src/lib/ckeditor5/ckeditor').then(module => module.default);
	}

	function loadLanguage(name) {
		if (name === 'en') return Promise.resolve(name);
		return import(/* webpackChunkName: 'ckeditor5/lang/[request]' */ `src/lib/ckeditor5/translations/${name}`).then(() => name);
	}

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
		computed: mapGetters(['locale', 'fallbackLocale']),
		watch: {
			disabled(v) {
				this.ckeInstance.isReadOnly = v;
			},
			value(v, old) {
				if (old !== v && this._internalValue !== v) this.ckeInstance.setData(v || '');
			},
		},
		mounted() {
			Promise.all([
				loadCKEditor(),
				loadLanguage(this.locale).catch(() => loadLanguage(this.fallbackLocale)),
			]).then(([ClassicEditor, language]) => {
				const config = {
					language,
					...ckeConfig,
					...this.config,
				};
				if (!config.simpleUpload) config.simpleUpload = {};
				if (!config.simpleUpload.uploadUrl) config.simpleUpload.uploadUrl = apiRootPath + 'wysiwyg/images/upload';
				if (!config.simpleUpload.headers) config.simpleUpload.headers = {};
				if (!config.simpleUpload.headers.Authorization) config.simpleUpload.headers = {
					Authorization: 'Bearer ' + getApiToken(),
				};
				ClassicEditor.create(this.$refs.textarea, config).then(editor => {
					editor.setData(this.value || '');
					editor.model.document.on('change:data', this.onChange);
					editor.editing.view.document.on('focus', () => {
						this.$emit('focus');
					});
					editor.editing.view.document.on('blur', () => {
						this.$emit('blur');
					});
					editor.isReadOnly = this.disabled;

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
