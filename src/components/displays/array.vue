<script>
	// noinspection JSUnusedGlobalSymbols
	export default {
		functional: true,
		props: {
			value: null,
			itemProps: Object
		}
	};
</script>
<template functional lang="pug">
	span(v-if="props.value && (props.value.length || Object.keys(props.value).length)")
		display(v-for="(item, i) in props.value"
			v-bind="props.itemProps || {}"
			:key="i"
			:value="item")
</template>