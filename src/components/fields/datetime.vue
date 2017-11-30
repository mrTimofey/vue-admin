<script>
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
					this.$emit('input', v ? (v + ' ' + (this.time || '00:00') + ':00') : null);
				}
			},
			time: {
				get() {
					return this.value ? this.value.substr(11, 5) : null;
				},
				set(v) {
					if (!v) v = '00:00';
					const date = this.date ? this.date : (new Date()).toISOString().substr(0, 10);
					this.$emit('input', date + ' ' + v.substr(0, 5) + ':00');
				}
			}
		},
		methods: {
			onTimeBlur(e) {
				if (!e.target.value && this.time) e.target.value = this.time;
			}
		},
		created() {
			if (this.value === 'now') {
				let now = new Date();
				this.$emit('input', now.toISOString().replace('T', ' '));
			}
		}
	};
</script>
<template lang="pug">
	.field-datetime.form-inline
		input.form-control(type="date"
			v-model="date"
			':placeholder'="placeholder"
			':disabled'="disabled")
		!=' '
		input.form-control(type="time"
			v-model="time"
			':placeholder'="placeholder"
			':disabled'="disabled"
			'@blur'="onTimeBlur")
</template>