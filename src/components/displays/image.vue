<template functional lang="pug">
	a.img-thumbnail(v-if="props.value" target="_blank" :href="parent.$store.getters.imagePath + '/' + props.value")
		img(:src!="parent.$store.getters.imagePath + '/' + (props.value.endsWith('.svg') ? '' : (props.pipe || 'admin-thumb')) + '/' + props.value")
</template>