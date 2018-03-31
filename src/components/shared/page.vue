<template functional lang="pug">
	.page(:class="[data.class, data.staticClass]")
		.content-header: slot(name="header")
			h1.content-title: slot(name="title")
			!=' '
			ol.breadcrumb
				li
					i.fas.fa-dashboard
					!=' '
					router-link(to="/") {{ parent.$t('home') }}
				slot(name="breadcrumbs")
		.content: slot
</template>