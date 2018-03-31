<template functional lang="pug">
	.display-color(v-if="props.value" :style="{ background: '#' + props.value }")
</template>
<style lang="stylus">
	.display-color
		min-width 40px
		height 1.42857143em
		border-radius 3px
</style>