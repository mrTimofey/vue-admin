<template functional lang="pug">
	span(v-if="props.value && props.value.length")
		a.img-thumbnail(v-for="item in props.value" target="_blank" ':href'="parent.$store.getters.imagePath + '/' + item.id")
			img(':src'!="parent.$store.getters.imagePath + '/' + (item.id.endsWith('.svg') ? '' : (props.pipe || 'admin-thumb')) + '/' + item.id")
</template>