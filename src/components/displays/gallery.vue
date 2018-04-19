<script>
	export default {
		functional: true,
		props: {
			value: null,
			pipe: {
				type: String,
				default: 'admin-thumb'
			}
		}
	};
</script>
<template functional lang="pug">
	span(v-if="props.value && props.value.length")
		a.img-thumbnail(v-for="id in props.value" target="_blank" :href="parent.$store.getters.imagePath + '/' + id")
			img(:src!="parent.$store.getters.imagePath + '/' + (id.endsWith('.svg') ? '' : (props.pipe + '/')) + id")
</template>