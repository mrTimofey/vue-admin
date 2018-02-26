<template functional lang="pug">
	table.table.table-condensed.display-meta(v-if="props.value && Object.keys(props.value).length")
		tbody
			tr(v-for="(v, k) in props.value")
				th {{ k }}
				td {{ v }}
</template>
<style lang="stylus">
	.table td > .display-meta
		width auto
		margin -9px -8px -8px -8px
</style>