<template functional lang="pug">
	.content-header
		h1.content-title!='{{ props.title }} '
			small(v-if="props.subtitle") {{ props.subtitle }}
		!=' '
		slot
		ol.breadcrumb
			li
				i.fa.fa-dashboard
				!=' '
				router-link(to="/") {{ parent.$t('home') }}
			slot(name="breadcrumbs")
				li.active: span {{ props.title }}
</template>