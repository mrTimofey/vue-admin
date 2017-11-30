<script>
	export default {
		name: 'EntityActions',
		props: {
			permissions: Object,
			path: {
				type: String,
				required: true
			},
			noLimit: {
				type: Boolean,
				default: false
			},
			limitOptions: {
				type: Array,
				default: () => ([10, 25, 50, 100])
			},
			defaultLimit: {
				type: Number,
				default: 25
			}
		},
		data() {
			return {
				selectedLimit: this.$route.query.limit && parseInt(this.$route.query.limit) || this.defaultLimit
			};
		},
		watch: {
			selectedLimit(limit) {
				const query = { ...this.$route.query };
				delete query.page;
				if (limit !== this.defaultLimit) this.$router.replace({ query: { ...query, limit } });
				else {
					delete query.limit;
					this.$router.replace({ query });
				}
			}
		}
	};
</script>
<template lang="pug">
	.entity-actions
		field.inline.per-page(v-if="!noLimit" ':title'="$t('perPage') + ':'" type="select" required ':options'="limitOptions" v-model="selectedLimit" ':searchable'="false")
		!=' '
		router-link.btn.btn-success(v-if="!permissions || permissions.create !== false" ':to'="path + '/item/new'") {{ $t('create') }}
		slot
</template>
<style lang="stylus">
	.entity-actions
		.per-page
			.field
				width 70px
</style>