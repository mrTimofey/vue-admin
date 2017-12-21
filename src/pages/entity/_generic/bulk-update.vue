<script>
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
	.entity-bulk-update-page(':class'="entity + '-bulk-update-page'")
		entity-header(':title'="title" ':subtitle'="subtitle")
			template(slot="breadcrumbs")
				li: router-link(':to'="basePath") {{ meta && meta.title || $t('elementList') }}
				li.active: span {{ $t('bulkUpdate') }}
		.content
			.box
				spinner(v-if="loading")
</template>