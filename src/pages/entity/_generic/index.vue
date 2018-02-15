<script>
	import http from 'src/http';
	import { asFormData, httpErrorModalData } from 'src/utils';
	import { components } from 'src/utils/entities';

	export default {
		components,
		props: {
			entity: {
				type: String,
				default() {
					// try to guess entity name by route path ("/entity/{name}") if not explicitly provided
					return this.$route.path.split('/')[2];
				}
			}
		},
		data() {
			return {
				total: 0,
				lastPage: 1,
				items: null,
				error: null,
				loading: false,
				limit: null
			};
		},
		computed: {
			page() {
				return parseInt(this.$route.query.page) || 1;
			},
			perPage() {
				return parseInt(this.$route.query.per_page) || 25;
			},
			filterParams() {
				const def = () => ({
					scopes: {},
					filters: {}
				});
				// entity-filter value persists within a query string "params" argument as a JSON
				// try to parse this JSON or return default object
				try {
					return this.$route.query.params ? JSON.parse(this.$route.query.params) : def();
				}
				catch (e) {
					return def();
				}
			},
			apiParams() {
				// mix existing query params with filters and scopes from computed.filterParams
				const data = { ...this.$route.query, ...this.filterParams };
				// "params" key defines scopes and filters in JSON format so it is unnecessary
				// since it is exposed by computed.filterParams
				delete data.params;
				return data;
			},
			apiPath() {
				return 'entity/' + this.entity;
			},
			// base path for routes like editing or creating item of the same entity
			basePath() {
				return '/' + this.apiPath;
			},
			bulkDestroyApiPath() {
				return this.apiPath;
			},
			// meta data containing information about fields, permissions, etc.
			meta() {
				return this.$store.getters.entitiesData[this.entity];
			},
			title() {
				return this.meta && this.meta.title || this.$t('elementList');
			},
			primaryKey() {
				return this.meta && this.meta.primary || 'id';
			}
		},
		methods: {
			destroyApiPath(item) {
				return this.apiPath + '/' + item[this.primaryKey];
			},
			updateApiPath(item) {
				return this.apiPath + '/' + item[this.primaryKey] + '/fast';
			},
			update() {
				this.error = null;
				this.loading = true;
				http.get(this.apiPath, { params: this.apiParams })
					.then(res => {
						this.items = res.data.items;
						this.total = res.data.pagination.total;
						this.lastPage = res.data.pagination.last_page;
						this.limit = res.data.pagination.per_page;
					})
					.catch(err => {
						this.$modal.open('error', httpErrorModalData(err));
						this.error = err.response.status;
					})
					.then(() => {
						this.loading = false;
					});
			},
			onFilterChange(data) {
				// just update route, all the list updating routine is made in beforeRouteUpdate hook
				this.$router.replace({ query: { ...this.$route.query, params: JSON.stringify(data) } });
			},
			updatePage(page) {
				if (page === 1) page = undefined;
				// just update route, all the list updating routine is made in beforeRouteUpdate hook
				this.$router.replace({ query: { ...this.$route.query, page } });
			},
			destroy(item) {
				this.$modal.open('confirm', {
					title: this.$t('deleteElement') + '?',
					text: item.title || item.name
				}).then(result => {
					if (result === true) {
						this.loading = true;
						http.delete(this.destroyApiPath(item))
							.then(() => {
								this.update();
							})
							.catch(err => {
								this.$modal.open('error', {
									...httpErrorModalData(err),
									title: this.$t('errors.deleteElement')
								});
								this.loading = false;
							});
					}
				});
			},
			bulkDestroy(keys) {
				this.$modal.open('confirm', {
					title: this.$t('deleteSelection') + '?',
					text: this.$t('count') + ': ' + keys.length
				}).then(result => {
					if (result === true) {
						this.loading = true;
						http.delete(this.bulkDestroyApiPath, { data: { keys } })
							.then(() => {
								this.update();
							})
							.catch(err => {
								this.$modal.open('error', {
									...httpErrorModalData(err),
									title: this.$t('errors.deleteElement')
								});
								this.loading = false;
							});
					}
				});
			},
			// process inline editable fields updates
			updateItem(item, field, value) {
				let data = { [field]: value, __field: field };
				if (value instanceof File || value instanceof FileList)
					data = asFormData(data);
				if (!this.itemUpdateTimeout) this.itemUpdateTimeout = {};
				clearTimeout(this.itemUpdateTimeout[item[this.primaryKey]]);
				this.itemUpdateTimeout[item[this.primaryKey]] = setTimeout(() => {
					http.post(this.updateApiPath(item), data)
						.then(res => {
							item[field] = res.data[field];
						})
						.catch(err => {
							this.$modal.open('error', {
								...httpErrorModalData(err),
								title: this.$t('errors.saveElement')
							});
						});
				}, 300);
			},
			hasProp(name) {
				return !!this[name];
			},
			callItemAction(action, item, index) {
				if (typeof action === 'string') action = this[action];
				action(item, index);
			}
		},
		beforeMount() {
			this.update();
		},
		beforeRouteUpdate(to, old, next) {
			if (to.path !== old.path) {
				this.items = null;
				this.total = 0;
				this.lastPage = 1;
				this.limit = null;
			}
			next();
			this.$nextTick(() => {
				this.update();
			});
		}
	};
</script>
<template lang="pug">
	.entity-index-page(':class'="entity + '-index-page'")
		entity-header(':title'="title")
		.content
			.box
				spinner(v-if="loading")
				.box-header.with-border
					.row
						.col-md-10.col-sm-8
							entity-actions(':permissions'="meta.permissions" ':path'="basePath")
						.col-md-2.col-sm-4
							entity-search(v-if="meta.searchable")
					entity-filters(':fields'="meta.filter_fields" ':value'="filterParams" '@input'="onFilterChange")
				.box-body.table-responsive.no-padding(v-if="items")
					entity-table(v-if="items.length"
						bulk
						':items'="items"
						':fields'="meta.index_fields"
						':permissions'="meta.permissions"
						':primaryKey'="primaryKey"
						':entity'="entity"
						'@destroy'="destroy"
						'@bulk-destroy'="bulkDestroy"
						'@update'="updateItem")
						template(v-if="hasProp('customActionsBefore')" slot="actions-before" slot-scope="{ item, index }")
							.btn(v-for="action in customActionsBefore" ':class'="['btn-' + (action.btn || 'default'), action.class || {}]" '@click'="callItemAction(action.action, item, index)")
								i.fa(v-if="action.fa" ':class'="'fa-' + action.fa")
								!=' '
								span(v-if="action.text" v-html="action.text")
						template(v-if="hasProp('customActionsAfter')" slot="actions-after" slot-scope="{ item, index }")
							.btn(v-for="action in customActionsAfter" ':class'="['btn-' + (action.btn || 'default'), action.class || {}]" '@click'="callItemAction(action.action, item, index)")
								i.fa(v-if="action.fa" ':class'="'fa-' + action.fa")
								!=' '
								span(v-if="action.text" v-html="action.text")
					.well.well-sm(v-else, style="margin:15px") {{ $t('nothingFound') }}
				pager.box-footer(':page'="page" '@input'="updatePage" ':last-page'="lastPage" ':loading'="loading" ':total'="total" ':limit'="limit")
</template>
<style lang="stylus">
	.entity-index-page
		.pagination, .pager
			margin 0
</style>