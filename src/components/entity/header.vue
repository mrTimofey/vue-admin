<script>
	export default {
		name: 'EntityHeader',
		props: {
			title: String,
			subtitle: String
		}
	};
</script>
<template lang="pug">
	.content-header
		h1.content-title!='{{ title }} '
			small(v-if="subtitle") {{ subtitle }}
		!=' '
		slot
		ol.breadcrumb
			li
				i.fa.fa-dashboard
				!=' '
				router-link(to="/") {{ $t('home') }}
			slot(name="breadcrumbs")
				li.active: span {{ title }}
</template>