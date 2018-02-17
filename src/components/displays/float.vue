<script>
	export default {
		functional: true,
		props: {
			value: null,
			precision: {
				type: Number,
				default: 2
			}
		}
	};
</script>
<template functional lang="pug">
	span(v-if="props.value !== null && props.value !== undefined") {{ props.value | floatFormat(props.precision) }}
</template>