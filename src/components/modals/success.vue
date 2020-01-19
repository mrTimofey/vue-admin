<script>
	export default {
		props: {
			title: String,
			text: String,
			button: String,
		},
	};
</script>
<template lang="pug">
	.modal-content
		.modal-header
			button.close(@click="$modal.close()"): span ×
			h4.text-success.modal-title {{ title || $t('done') }}
		.modal-body(v-if="text" v-html="text")
		.modal-footer
			button.btn.btn-default(v-focus @click="$modal.close()") {{ button || $t('ok') }}
</template>