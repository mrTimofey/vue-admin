<template functional lang="pug">
	.display-datetime(v-if="props.value") {{ props.value | readableDatetime }}
</template>
<style lang="stylus">
	.display-datetime
		min-width 130px
</style>