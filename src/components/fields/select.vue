<script>
	import VueSelect from 'src/components/vue-select';
	import { transformedOptions } from 'src/utils/fields';

	export default {
		components: { VueSelect },
		props: {
			placeholder: String,
			title: String,
			options: {
				type: [Array, Object],
				required: true
			},
			value: null,
			multiple: {
				type: Boolean,
				default: false
			},
			required: {
				type: Boolean,
				default: false
			},
			searchable: {
				type: Boolean,
				default: true
			},
			disabled: {
				type: Boolean,
				default: false
			},
			labelField: String,
			valueField: String,
			onSearch: Function,
			onCreate: Function,
			searchDebounce: {
				type: Number,
				default: 200
			}
		},
		computed: {
			transformedOptions,
			selectValue() {
				if (this.multiple) return this.value ?
					this.transformedOptions.filter(({ value }) => this.value.indexOf(value) !== -1) : [];
				return this.transformedOptions.find(({ value }) => value === this.value);
			}
		},
		methods: {
			emitValue(v) {
				if (this.transformedOptions.length === 0) return;
				if (this.multiple) {
					if (!v) return;
					const newValue = v.map(opt => opt.value);
					if (!this.value || newValue.length !== this.value.length)
						return this.$emit('input', newValue);
					for (let i = 0; i < newValue.length; ++i)
						if (this.value[i] !== newValue[i])
							return this.$emit('input', newValue);
				}
				else {
					if (v === null || v === undefined) {
						if (this.required) {
							this.$refs.vueSelect.mutableValue = this.$refs.vueSelect.filteredOptions.find(
								opt => opt.value === this.value
							);
							return;
						}
						return this.$emit('input', null);
					}
					if (this.value !== v.value) this.$emit('input', v.value);
				}
			},
			searchRemote(query, loading) {
				if (!this.onSearch) return;
				clearTimeout(this.searchTimeout);
				this.searchTimeout = setTimeout(() => {
					loading(true);
					this.onSearch(query).then(() => loading(false));
				}, parseInt(this.searchDebounce));
			}
		}
	};
</script>
<template lang="pug">
	vue-select(ref="vueSelect" ':class'="{ required }"
		':value'="selectValue"
		':on-change'="emitValue"
		':multiple'="multiple"
		':options'="transformedOptions"
		':placeholder'="placeholder"
		':taggable'="!!onCreate"
		':push-tags'="false"
		':create-option'="onCreate"
		':disabled'="disabled"
		':searchable'="searchable"
		':disable-search-filter'="!!onSearch"
		'@search'="searchRemote")
		span(slot="no-options") {{ $t('noSelectOptions') }}
</template>
<style lang="stylus">
	.field.v-select
		background white
		.dropdown-toggle
			border-radius 0
		.open-indicator
			bottom 3px
			right 6px
			&:before
				size 8px
				border-width 2px 2px 0 0
	.field.v-select:not(.required)
		.dropdown-menu
			.active
				position relative
				&:before, &:after
					content ''
					display block
					absolute 50% false false 5px
					width 10px
					border-bottom 2px solid
					margin-top -1px
				&:before
					transform rotate(45deg)
				&:after
					transform rotate(-45deg)
	.field.v-select.unsearchable
		input
			width 0 !important
</style>