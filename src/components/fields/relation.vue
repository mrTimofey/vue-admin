<script>
	import http from 'src/http';
	import { parsePlaceholders, httpErrorModalData } from 'src/utils';
	import FieldSelect from 'src/components/fields/select.vue';

	const fetchPromisePool = {};

	// noinspection JSUnusedGlobalSymbols
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
			display: [String, Function],
			valueField: String,
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
			},
			queryParams: Object
		},
		data: () => ({
			items: null,
			creating: false
		}),
		computed: {
			entityName() {
				return this.entity || this.name;
			},
			entityPrimaryKey() {
				return this.$store.getters.metaData.entities[this.entityName] &&
					this.$store.getters.metaData.entities[this.entityName].primary || 'id';
			},
			valueKey() {
				return this.valueField || this.entityPrimaryKey;
			},
			options() {
				if (this.items) return this.items.map(item => ({
					value: item[this.valueKey],
					label: this.display &&
						(typeof this.display === 'string' ? parsePlaceholders(this.display, item) : this.display(item)) ||
						`${(item.title || item.name || item.label)} [${item[this.valueKey]}]`
				}));
				if (this.value && this.value.length) return this.value.map(value => ({
					label: '...',
					value
				}));
				return null;
			},
			apiPath() {
				return 'entity/' + this.entityName;
			},
			promiseKey() {
				return this.apiPath + '?' + this.limit + '&' + JSON.stringify(this.queryParams);
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
						...this.queryParams,
						search,
						limit: this.limit
					} })
						.then(res => res.data.items);
				}
				else {
					if (fetchPromisePool[this.promiseKey]) fetch = fetchPromisePool[this.promiseKey];
					else
						fetchPromisePool[this.promiseKey] = fetch =
							http.get(this.apiPath, { params: {
								...this.queryParams,
								limit: this.limit
							} })
								.then(res => res.data.items)
								.catch(() => ([]));
				}

				return Promise.all([
					// get selected items
					ids.length ?
						http.get(this.apiPath, { params: {
							limit: Array.isArray(this.value) ? this.value.length : 1,
							filters: { [this.valueKey]: ids }
						} })
							.then(res => res.data.items)
							.catch(() => ([])) :
						Promise.resolve([]),
					// get selectable items
					fetch
				]).then(results => {
					this.items = results[0].concat(results[1].filter(
						item => {
							return results[0].findIndex(_item => item[this.valueKey] === _item[this.valueKey]) === -1;
						}
					));
				});
			},
			onCreate(value) {
				this.creating = true;
				// noinspection JSCheckFunctionSignatures
				http.post(this.apiPath, { ...this.createDefaults, [this.createField]: value })
					.then(res => {
						delete fetchPromisePool[this.promiseKey];
						let value;
						if (this.multiple) {
							value = this.value ? [...this.value] : [];
							value.push(res.data[this.valueKey]);
						}
						else {
							value = res.data[this.valueKey];
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
		:required="required"
		:disabled="disabled || creating"
		:placeholder="placeholder"
		:multiple="multiple"
		:options="options"
		:on-search="update"
		:value="value"
		:on-create="allowCreate && onCreate || null"
		@input="emitValue")
	input.form-control(v-else disabled readonly :placeholder="$t('loading') + '...'")
</template>