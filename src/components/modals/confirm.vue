<script>
	export default {
		props: {
			title: String,
			yes: String,
			no: String,
			text: String
		}
	};
</script>
<template lang="pug">
	.modal-content
		.modal-header
			button.close('@click'="$modal.close()"): span ×
			h4.modal-title {{ title || $t('confirmDialog') }}
		.modal-body(v-if="text" v-html="text")
		.modal-footer
			button.btn.btn-success.pull-left(v-focus '@click'="$modal.close(true)") {{ yes || $t('yes') }}
			!=' '
			button.btn.btn-danger('@click'="$modal.close(false)") {{ no || $t('no') }}
</template>
<style lang="stylus"></style>