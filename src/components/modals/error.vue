<script>
	export default {
		props: {
			title: String,
			text: String,
			button: String,
			jsonData: Object,
		},
	};
</script>
<template lang="pug">
	.modal-content
		.modal-header
			button.close(@click="$modal.close()"): span ×
			h4.text-danger.modal-title {{ title || $t('error') }}
		.modal-body(v-if="text || jsonData")
			div(v-if="text" v-html="text")
			pre.modal-json-data(v-if="jsonData") {{ jsonData | json }}
		.modal-footer
			button.btn.btn-default(@click="$modal.close()") {{ button || $t('ok') }}
</template>
<style lang="stylus">
	.modal-json-data
		margin-top 1.5em
</style>