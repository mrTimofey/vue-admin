<template functional lang="pug">
	pre.display-json(v-if="props.value !== null && props.value !== undefined") {{ props.value | json }}
</template>
<style lang="stylus">
	.display-json
		margin 0
		padding 5px
</style>