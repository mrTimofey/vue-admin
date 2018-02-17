<template functional lang="pug">
	.display-date(v-if="props.value") {{ props.value | time(props.value.length > 5) }}
</template>
<style lang="stylus">
	.display-date
		min-width 85px
</style>