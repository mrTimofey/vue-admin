<template functional lang="pug">
	a.btn.btn-primary.btn-xs(v-if="props.value" target="_blank" ':href'="props.value" ':title'="props.value")
		i.fa.fa-download
</template>