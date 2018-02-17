<script>
	export default {
		functional: true,
		props: {
			value: Array,
			itemProps: Object
		}
	};
</script>
<template functional lang="pug">
	span(v-if="props.value && props.value.length")
		display(v-for="(item, i) in props.value"
			v-bind="props.itemProps || {}"
			':key'="i"
			':value'="item")
</template>