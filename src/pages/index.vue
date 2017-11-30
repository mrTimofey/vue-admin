<template lang="pug">
	section.page-index
		.content-header
			h1 {{ $t('panel') }}
			!=' '
			ol.breadcrumb
				li.active
					i.fa.fa-dashboard
					!=' '
					| {{ $t('home') }}
</template>