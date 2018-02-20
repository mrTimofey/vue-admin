<script>
	export default {
		props: {
			value: Object,
			disabled: {
				type: Boolean,
				default: false
			},
			keys: {
				type: Array,
				default: () => ([
					'title',
					'description',
					'keywords'
				])
			}
		},
		methods: {
			trim(k, v) {
				const trimmed = v.trim();
				if (v !== trimmed) this.onInput(k, trimmed);
			},
			onInput(k, v) {
				const value = this.value ? { ...this.value } : {};
				if (v) value[k] = v;
				else delete value[k];
				this.$emit('input', Object.keys(value).length > 0 ? value : null);
			}
		}
	};
</script>
<template lang="pug">
	table.table.table-bordered.table-condensed.field-meta
		tbody
			tr(v-for="key in keys")
				th {{ key }}
				td: input.form-control(':placeholder'="$t('noValue')"
					':value'="value && value[key]"
					'@input'="onInput(key, $event.target.value)"
					'@blur'="trim(key, $event.target.value)")
</template>
<style lang="stylus">
	.field-meta
		th
			vertical-align middle !important
			text-align right
		td
			width 100% !important
</style>