<script>
	export default {
		name: 'EntityFilters',
		props: {
			fields: Array
		},
		data: () => ({
			values: {}
		}),
		watch: {
			values: {
				deep: true,
				handler(v) {
					const data = {
						filters: {},
						scopes: {}
					};
					for (let filter of this.fields) {
						if (v[filter.name] !== null) {
							if (filter.scope) data.scopes[filter.scope] = v[filter.name];
							else data.filters[filter.name] = v[filter.name];
						}
					}
					this.$emit('change', data);
				}
			}
		}
	};
</script>
<template lang="pug">
	.entity-filters: .row
		.col-md-3.col-sm-4(v-for="field in fields"): field(v-bind="field" v-model="values[field.name]")
</template>
