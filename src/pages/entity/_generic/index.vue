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
				loading: false
			};
		},
		computed: {
			page() {
				return parseInt(this.$route.query.page) || 1;
			},
			perPage() {
				return parseInt(this.$route.query.per_page) || 25;
			},
			apiParams() {
				return this.$route.query;
			},
			apiPath() {
				return 'entity/' + this.entity;
			},
			basePath() {
				return '/' + this.apiPath;
			},
			meta() {
				return this.$store.getters.entitiesData[this.entity];
			},
			title() {
				return this.meta && this.meta.title || this.$t('elementList');
			}
		},
		methods: {
			destroyApiPath(item) {
				return this.apiPath + '/' + item.id;
			},
			updateApiPath(item) {
				return this.apiPath + '/' + item.id + '/fast';
			},
			updatePage(page) {
				if (page === 1) page = undefined;
				this.$router.replace({ query: { ...this.$route.query, page } });
			},
			update() {
				this.error = null;
				this.loading = true;
				http.get(this.apiPath, { params: this.apiParams })
					.then(res => {
						this.items = res.data.items;
						this.total = res.data.pagination.total;
						this.lastPage = res.data.pagination.last_page;
					})
					.catch(err => {
						this.error = err.response.status;
					})
					.then(() => {
						this.loading = false;
					});
			},
			destroy(item) {
				this.$modal.open('confirm', {
					title: this.$t('deleteElement') + '?',
					text: item.title || item.name
				}, 'sm').then(result => {
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
			updateItem(item, field, value) {
				let data = { [field]: value, __field: field };
				if (value instanceof File || value instanceof FileList)
					data = asFormData(data);
				if (!this.itemUpdateTimeout) this.itemUpdateTimeout = {};
				clearTimeout(this.itemUpdateTimeout[item.id]);
				this.itemUpdateTimeout[item.id] = setTimeout(() => {
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
			}
		},
		created() {
			this.update();
		},
		beforeRouteUpdate(to, old, next) {
			if (to.path !== old.path) {
				this.items = null;
				this.total = 0;
				this.lastPage = 1;
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
					entity-filters(':fields'="meta.filter_fields")
				.box-body(v-if="items")
					entity-table(v-if="items.length"
						':items'="items"
						':fields'="meta.index_fields"
						':permissions'="meta.permissions"
						':entity'="entity"
						'@destroy'="destroy"
						'@update'="updateItem")
					.well.well-sm(v-else style="margin-bottom:0") {{ $t('nothingFound') }}
					pager(':page'="page" '@input'="updatePage" ':last-page'="lastPage" ':loading'="loading")
</template>