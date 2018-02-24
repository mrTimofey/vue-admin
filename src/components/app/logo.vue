<template functional lang="pug">
	router-link.logo(to="/")
		span.logo-mini(v-html="parent.$store.getters.shortTitle")
		span.logo-lg(v-html="parent.$store.getters.logoTitle")
</template>