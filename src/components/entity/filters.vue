<script>
	export default {
		name: 'EntityFilters',
		props: {
			fields: Array,
			value: Object,
			stagger: {
				type: Number,
				default: 200
			}
		},
		computed: {
			fieldValues() {
				const data = {};
				for (let field of this.fields) {
					data[field.name] = (field.scope ? this.value.scopes[field.scope] : this.value.filters[field.name]);
					if (data[field.name] === undefined) data[field.name] = null;
				}
				return data;
			}
		},
		methods: {
			onChange(field, value) {
				const data = { filters: { ...this.value.filters }, scopes: { ...this.value.scopes } };
				if (value === null) {
					if (field.scope) delete data.scopes[field.scope];
					else delete data.filters[field.name];
				}
				else {
					if (field.scope) data.scopes[field.scope] = value;
					else data.filters[field.name] = value;
				}
				clearTimeout(this.staggerTimeout);
				this.staggerTimeout = setTimeout(() => {
					this.$emit('input', data);
				}, this.stagger);
			}
		}
	};
</script>
<template lang="pug">
	.entity-filters: .row
		.col-md-3.col-sm-4(v-for="field in fields"): field(v-bind="field" ':value'="fieldValues[field.name]" '@input'="onChange(field, $event)")
</template>