<template functional lang="pug">
	.display-time(v-if="props.value") {{ props.value | readableDate }}
</template>
<style lang="stylus">
	.display-time
		min-width 55px
</style>