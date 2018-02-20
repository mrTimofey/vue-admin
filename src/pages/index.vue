<template lang="pug">
	section.page-index
		.content-header
			h1 {{ $t('panel') }}
			!=' '
			ol.breadcrumb
				li.active
					i.fas.fa-dashboard
					!=' '
					| {{ $t('home') }}
</template>