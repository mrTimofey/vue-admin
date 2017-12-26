<script>
	import http from 'src/http';
	import { parsePlaceholders, httpErrorModalData } from 'src/utils';
	import FieldSelect from './select.vue';

	const fetchPromisePool = {};

	export default {
		components: { FieldSelect },
		props: {
			value: null,
			multiple: {
				type: Boolean,
				default: false
			},
			required: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			},
			entity: String,
			name: String,
			placeholder: String,
			display: {
				type: [String, Function],
				default: () => function(item) {
					return (item.title || item.name || item.label) + ' [' + item.id + ']';
				}
			},
			valueField: {
				type: [String, Function],
				default: 'id'
			},
			limit: {
				type: Number,
				default: 25
			},
			createField: {
				type: String,
				default: 'name'
			},
			allowCreate: {
				type: Boolean,
				default: false
			},
			createDefaults: {
				type: Object,
				default: () => ({})
			}
		},
		data: () => ({
			items: null,
			creating: false
		}),
		computed: {
			options() {
				if (this.items) return this.items.map(item => {
					const label = typeof this.display === 'string' ?
						parsePlaceholders(this.display, item) : this.display(item);
					const value = typeof this.valueField === 'string' ?
						item[this.valueField] : this.valueField(item);
					return { label, value };
				});
				if (this.value && this.value.length) return this.value.map(value => ({
					label: '...',
					value
				}));
				return null;
			},
			apiPath() {
				return 'entity/' + (this.entity || this.name);
			},
			promiseKey() {
				return this.apiPath + '?' + this.limit;
			}
		},
		methods: {
			emitValue(v) {
				if (this.value !== undefined && !this.creating) {
					this.$emit('input', v);
				}
			},
			update(search) {
				const ids = Array.isArray(this.value) ? this.value : (this.value ? [this.value] : []);

				let fetch;

				if (search) {
					fetch = http.get(this.apiPath, { params: {
						search,
						limit: this.limit
					} })
						.then(res => res.data.items);
				}
				else {
					if (fetchPromisePool[this.promiseKey]) fetch = fetchPromisePool[this.promiseKey];
					else
						fetchPromisePool[this.promiseKey] = fetch =
							http.get(this.apiPath, { params: { limit: this.limit } })
								.then(res => res.data.items)
								.catch(() => ([]));
				}

				return Promise.all([
					// get selected items
					ids.length ?
						http.get(this.apiPath, { params: {
							limit: Array.isArray(this.value) ? this.value.length : 1,
							filters: { id: ids }
						} })
							.then(res => res.data.items)
							.catch(() => ([])) :
						Promise.resolve([]),
					// get selectable items
					fetch
				]).then(results => {
					this.items = results[0].concat(results[1].filter(
						item => {
							return results[0].findIndex(_item => item.id === _item.id) === -1;
						}
					));
				});
			},
			onCreate(value) {
				this.creating = true;
				http.post(this.apiPath, { ...this.createDefaults, [this.createField]: value })
					.then(res => {
						delete fetchPromisePool[this.promiseKey];
						let value;
						if (this.multiple) {
							value = this.value ? [...this.value] : [];
							value.push(res.data.id);
						}
						else {
							value = res.data.id;
						}
						this.$nextTick(() => {
							this.$emit('input', value);
							this.update().then(() => {
								this.creating = false;
							});
						});
					})
					.catch(err => {
						this.$modal.open('error', {
							...httpErrorModalData(err),
							title: this.$t('errors.createRelation')
						});
						this.creating = false;
					});
			}
		},
		created() {
			this.update();
		},
		beforeDestroy() {
			delete fetchPromisePool[this.promiseKey];
		}
	};
</script>
<template lang="pug">
	field-select(v-if="options"
		':requried'="required"
		':disabled'="disabled || creating"
		':placeholder'="placeholder"
		':multiple'="multiple"
		':options'="options"
		':on-search'="update"
		':value'="value"
		':on-create'="allowCreate && onCreate || null"
		'@input'="emitValue")
</template>