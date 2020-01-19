<script>
	import http from 'src/http';
	import { asFormData, httpErrorModalData } from 'src/utils';
	import EntityFilters from 'src/components/entity/filters.vue';

	const DEFAULT_LIMIT = 25;

	export default {
		components: { EntityFilters },
		props: {
			entity: {
				type: String,
				default() {
					// try to guess entity name by route path ("/entity/{name}") if not explicitly provided
					return this.$route.path.split('/')[2];
				},
			},
		},
		data() {
			return {
				total: 0,
				lastPage: 1,
				items: null,
				error: null,
				loading: false,
				initialLoading: false,
				limit: null,
			};
		},
		computed: {
			searchQuery: {
				get() {
					return this.$route.query.search || null;
				},
				set(v) {
					v = v && v.trim();
					this.$router.replace({ query: { ...this.$route.query,
						search: v || undefined, page: undefined,
					} });
				},
			},
			selectedLimit: {
				get() {
					return this.$route.query.limit && parseInt(this.$route.query.limit) || DEFAULT_LIMIT;
				},
				set(v) {
					this.$router.replace({ query: { ...this.$route.query,
						page: undefined,
						limit: v === DEFAULT_LIMIT ? undefined : v,
					} });
				},
			},
			page: {
				get() {
					return parseInt(this.$route.query.page) || 1;
				},
				set(v) {
					this.$router.replace({ query: { ...this.$route.query,
						page: v > 1 ? v : undefined,
					} });
				},
			},
			filterParams: {
				get() {
					// entity-filter value persists within a query string "params" argument as a JSON
					// try to parse this JSON or return default object
					try {
						return this.$route.query.params ? JSON.parse(this.$route.query.params) : null;
					}
					catch (e) {
						return null;
					}
				},
				set(v) {
					this.$router.replace({ query: { ...this.$route.query,
						params: v ? JSON.stringify(v) : undefined, page: undefined,
					} });
				},
			},
			sortParams: {
				get() {
					return this.$route.query.sort || null;
				},
				set(v) {
					this.$router.replace({ query: { ...this.$route.query,
						sort: v ? v : undefined,
					} });
				},
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
			},
		},
		created() {
			this.limitOptions = [10, 25, 50, 100];
			this.searchStagger = 300;
		},
		beforeMount() {
			this.initialLoading = true;
			this.update();
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
						this.initialLoading = false;
					});
			},
			destroy(item) {
				this.$modal.open('confirm', {
					title: this.$t('deleteElement') + '?',
					text: item.title || item.name,
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
									title: this.$t('errors.deleteElement'),
								});
								this.loading = false;
							});
					}
				});
			},
			bulkDestroy(keys) {
				this.$modal.open('confirm', {
					title: this.$t('deleteSelection') + '?',
					text: this.$t('count') + ': ' + keys.length,
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
									title: this.$t('errors.deleteElement'),
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
				if (!this.pendingUpdates) this.pendingUpdates = {};
				if (!this.pendingUpdates[item[this.primaryKey]])
					this.pendingUpdates[item[this.primaryKey]] = { t: null, p: null };
				else
					clearTimeout(this.pendingUpdates[item[this.primaryKey]].t);

				this.pendingUpdates[item[this.primaryKey]].t = setTimeout(() => {
					const p = http.post(this.updateApiPath(item), data);
					this.pendingUpdates[item[this.primaryKey]].p = p;
					p.then(res => {
						if (p === this.pendingUpdates[item[this.primaryKey]].p)
							item[field] = res.data[field];
					});
					p.catch(err => {
						this.$modal.open('error', {
							...httpErrorModalData(err),
							title: this.$t('errors.saveElement'),
						});
					});
				}, 300);
			},
			hasItemActions(pos) {
				if (!pos) return this.hasItemActions('before') || this.hasItemActions('after');
				const name = pos === 'before' ? 'itemActionsBefore' : 'itemActionsAfter';
				return !!(this[name] && (!Array.isArray(this[name]) || this[name].length));
			},
			hasBulkActions(pos) {
				if (!pos) return this.hasBulkActions('before') || this.hasBulkActions('after');
				const name = pos === 'before' ? 'bulkActionsBefore' : 'bulkActionsAfter';
				return !!(this[name] && (!Array.isArray(this[name]) || this[name].length));
			},
			itemActions(pos, item, i) {
				const name = pos === 'before' ? 'itemActionsBefore' : 'itemActionsAfter';
				return Array.isArray(this[name]) ? this[name] : this[name](item, i);
			},
			bulkActions(pos, selection) {
				const name = pos === 'before' ? 'bulkActionsBefore' : 'bulkActionsAfter';
				return Array.isArray(this[name]) ? this[name] : this[name](selection);
			},
			callItemAction(action, item, index) {
				if (typeof action === 'string') action = this[action];
				action(item, index);
			},
			callBulkAction(action, selection) {
				if (typeof action === 'string') action = this[action];
				action(selection);
			},
		},
		beforeRouteUpdate(to, old, next) {
			if (to.path !== old.path) {
				this.items = null;
				this.total = 0;
				this.lastPage = 1;
				this.limit = null;
				this.initialLoading = true;
			}
			next();
			this.$nextTick(() => {
				this.update();
			});
		},
	};
</script>
<template lang="pug">
	page.entity-index-page(:class="entity + '-index-page'")
		span(slot="title") {{ title }}
		li(slot="breadcrumbs") {{ title }}
		.box
			spinner(v-if="loading")
			div(v-show="!initialLoading")
				.box-header.with-border
					.row
						.col-lg-9.col-md-6
							field.inline.per-page(type="select" required
								v-model="selectedLimit"
								:title="$t('perPage') + ':'"
								:options="limitOptions"
								:searchable="false")
							!=' '
							router-link.btn.btn-success(v-if="!meta.permissions || meta.permissions.create !== false" :to="basePath + '/item/new'") {{ $t('create') }}
						.col-lg-3.col-md-6
							field(v-if="meta.searchable" :placeholder="$t('search')" :stagger="searchStagger" v-model="searchQuery")
					entity-filters(:fields="meta.filter_fields" v-model="filterParams")
				.box-body.table-responsive.no-padding(v-if="items")
					entity-table(v-if="items.length"
						bulk sortable
						:items="items"
						:fields="meta.index_fields"
						:permissions="meta.permissions"
						:primaryKey="primaryKey"
						:entity="entity"
						:has-item-actions="hasItemActions()"
						:has-bulk-actions="hasBulkActions()"
						:sort-params.sync="sortParams"
						@destroy="destroy"
						@bulk-destroy="bulkDestroy"
						@update="updateItem")
						each pos in ['before', 'after']
							template(v-if=("hasItemActions('" + pos + "')") slot=("item-actions-" + pos) slot-scope="{ item, index }")
								.btn(v-for=("action in itemActions('" + pos + "', item, index)")
									:class="['btn-' + (action.btn || 'default'), action.class || {}]"
									:title="action.title || ''"
									@click="callItemAction(action.action, item, index)")
										i(v-if="action.icon" :class="action.icon")
										!=' '
										span(v-if="action.text" v-html="action.text")
							template(v-if=("hasBulkActions('" + pos + "')") slot=("bulk-actions-" + pos) slot-scope="{ selection }")
								.btn(v-for=("action in bulkActions('" + pos + "')")
									:class="['btn-' + (action.btn || 'default'), action.class || {}]"
									:title="action.title || ''"
									@click="callBulkAction(action.action, selection)")
										i(v-if="action.icon" :class="action.icon")
										!=' '
										span(v-if="action.text" v-html="action.text")
					.empty-message.well.well-sm(v-else) {{ $t('nothingFound') }}
				pager.box-footer(v-model="page" :last-page="lastPage" :loading="loading" :total="total" :limit="limit")
</template>
<style lang="stylus">
	.entity-index-page
		.pagination, .pager
			margin 0
		.empty-message
			margin 10px
		.per-page
			.field
				width 70px
</style>