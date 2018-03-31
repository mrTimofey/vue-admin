<script>
	// noinspection JSUnusedGlobalSymbols
	export default {
		props: {
			placeholder: String,
			title: String,
			value: null,
			disabled: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			date: {
				get() {
					return this.value ? this.value.substr(0, 10) : null;
				},
				set(v) {
					this.$emit('input', v);
				}
			}
		},
		created() {
			if (this.value === 'now') {
				let now = new Date();
				this.$emit('input', now.toISOString().substr(0, 10));
			}
		}
	};
</script>
<template lang="pug">
	input.form-control(type="date"
		v-model="date"
		:placeholder="placeholder"
		:disabled="disabled")
</template>