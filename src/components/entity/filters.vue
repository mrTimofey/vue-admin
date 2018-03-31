<script>
	export default {
		name: 'EntityFilters',
		props: {
			fields: Array,
			value: Object,
			stagger: {
				type: Number,
				default: 300
			}
		},
		computed: {
			fieldValues() {
				const data = {};
				for (let field of this.fields) {
					if (this.value) {
						data[field.name] = field.scope ?
							(this.value.scopes && this.value.scopes[field.scope]) :
							(this.value.filters && this.value.filters[field.name]);
						if (data[field.name] === undefined) data[field.name] = null;
					}
					else data[field.name] = null;
				}
				return data;
			}
		},
		methods: {
			onChange(field, value) {
				const data = {
					filters: this.value && this.value.filters ? { ...this.value.filters } : {},
					scopes: this.value && this.value.scopes ? { ...this.value.scopes } : {}
				};
				if (Array.isArray(value)) value = value.length ? value.slice().sort() : null;
				const targetObj = field.scope ? data.scopes : data.filters,
					targetKey = field.scope || field.name;
				if (typeof value === 'boolean') value = value ? '' : null;
				if (value === null) {
					if (targetObj[targetKey] === undefined) return;
					delete targetObj[targetKey];
				}
				else {
					if (targetObj[targetKey] === value) return;
					targetObj[targetKey] = value;
				}
				clearTimeout(this.staggerTimeout);
				this.staggerTimeout = setTimeout(() => {
					if (!Object.keys(data.filters).length) delete data.filters;
					if (!Object.keys(data.scopes).length) delete data.scopes;
					this.$emit('input', Object.keys(data).length ? data : null);
				}, this.stagger);
			}
		}
	};
</script>
<template lang="pug">
	.entity-filters: .row
		.col-lg-3.col-md-4(v-for="field in fields")
			field(v-bind="field" :value="fieldValues[field.name]" @input="onChange(field, $event)")
</template>