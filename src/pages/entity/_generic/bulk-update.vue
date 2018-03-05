<script>
	export default {
		props: {
			entity: {
				type: String,
				default() {
					// try to guess entity name by route path ("/entity/{name}") if not explicitly provided
					return this.$route.path.split('/')[2];
				}
			}
		},
		data: () => ({
			loading: false
		}),
		computed: {
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
				return this.meta && this.meta.title || this.$t('bulkUpdate');
			},
			subtitle() {
				return (this.meta && this.meta.title) ? this.$t('bulkUpdate') : null;
			}
		}
	};
</script>
<template lang="pug">
	page.entity-bulk-update-page(':class'="entity + '-bulk-update-page'")
		span(slot="title")!='{{ title }} '
			smal(v-if="subtitle") {{ subtitle }}
		template(slot="breadcrumbs")
			li: router-link(':to'="basePath") {{ meta && meta.title || $t('elementList') }}
			li.active: span {{ $t('bulkUpdate') }}
		.box
			spinner(v-if="loading")
</template>