<script>
	export default {
		name: 'EntitySearch',
		props: {
			stagger: {
				type: Number,
				default: 300
			}
		},
		data: () => ({
			query: ''
		}),
		watch: {
			query(search) {
				clearTimeout(this.staggerTimeout);
				this.staggerTimeout = setTimeout(() => {
					if (search && search.length > 0) {
						this.$router.replace({ query: { ...this.$route.query, search } });
					}
					else {
						const query = { ...this.$route.query };
						delete query.search;
						this.$router.replace({ query });
					}
				}, parseInt(this.stagger));
			},
			'$route.query.search': {
				immediate: true,
				handler(v) {
					if (this.query !== v) this.query = v;
				}
			}
		}
	};
</script>
<template lang="pug">
	.form-group: input.form-control(':placeholder'="$t('search')" v-model.trim="query")
</template>