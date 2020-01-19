<script>
	import { mapGetters } from 'vuex';
	import ckeStyle from '!css-loader!stylus-loader?compress!src/styles/wysiwyg.styl';
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
			stylesheet: String,
		},
		computed: {
			...mapGetters(['wysiwygCss']),
		},
		watch: {
			disabled(v) {
				// noinspection JSUnresolvedFunction
				this.ckeInstance.setReadOnly(v);
			},
			value(v) {
				if (this.changedInside) {
					this.changedInside = false;
					return;
				}

				this.removeListeners();
				clearTimeout(this.valueUpdatedTimeout);
				this.valueUpdatedTimeout = setTimeout(() => {
					this.ckeInstance.setData(v || '', { noSnapshot: true });
					setTimeout(() => {
						this.addListeners();
					}, 0);
				}, this.debounce);
			},
		},
		beforeUpdate() {
			// noinspection JSCheckFunctionSignatures
			if (this.ckeInstance && this.value !== this.ckeInstance.getData()) {
				this.ckeInstance.setData(this.value);
			}
		},
		mounted() {
			loadScript('https://cdn.ckeditor.com/4.7.2/full/ckeditor.js').then(() => {
				if (!CKEDITOR.stylesSet.registered.admin) CKEDITOR.stylesSet.add('admin', ckeConfig.styleSet);
				// noinspection ES6ModulesDependencies, NodeModulesDependencies, JSUnresolvedFunction
				this.ckeInstance = CKEDITOR.replace(this.$el, {
					filebrowserBrowseUrl: http.defaults.baseURL + 'wysiwyg/images/browse?api_token=' + getApiToken(),
					filebrowserUploadUrl: http.defaults.baseURL + 'wysiwyg/images/upload?api_token=' + getApiToken(),
					contentsCss: this.stylesheet || this.wysiwygCss || ckeStyle.toString(),
					stylesSet: 'admin',
					...ckeConfig.instanceConfig,
				});
				this.ckeInstance.setData(this.value || '');
				this.addListeners();
			});
		},
		beforeDestroy() {
			if (this.ckeInstance) this.ckeInstance.destroy();
		},
		methods: {
			addListeners() {
				this.ckeInstance.on('change', this.onChange);
				this.ckeInstance.on('key', this.onChange);
			},
			removeListeners() {
				this.ckeInstance.removeListener('change', this.onChange);
				this.ckeInstance.removeListener('key', this.onChange);
			},
			onChange() {
				// noinspection JSUnusedGlobalSymbols
				this.changedInside = true;
				clearTimeout(this.changedTimeout);
				this.changedTimeout = setTimeout(() => {
					// noinspection JSCheckFunctionSignatures
					const value = this.ckeInstance.getData();
					if (!value && this.value !== null) this.$emit('input', null);
					else if (value !== this.value) this.$emit('input', value);
					else // noinspection JSUnusedGlobalSymbols
						this.changedInside = false;
				}, this.debounce);
			},
		},
	};
</script>
<template lang="pug">
	textarea(:disabled="disabled")
</template>