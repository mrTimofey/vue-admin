<script>
	let idCounter = 1;
	function nextId() {
		return idCounter++;
	}

	export default {
		props: {
			timeout: {
				default: 2000,
			},
		},
		data: () => ({
			messages: [],
		}),
		created() {
			this.$notify.setMasterComponent(this);
		},
		methods: {
			pushMessage(message, opts = {}) {
				const obj = { message, opts },
					ms = opts.timeout === false ? -1 : parseInt(opts.timeout || this.timeout);
				obj.key = nextId();
				this.messages.push(obj);
				if (ms > 0) obj.timeout = setTimeout(() => {
					this.dismiss(obj);
				}, ms);
				return new Promise(resolve => {
					obj.resolve = resolve;
				});
			},
			dismiss(item) {
				const i = this.messages.indexOf(item);
				if (i === -1) return;
				clearTimeout(item.timeout);
				this.messages.splice(i, 1);
				item.resolve();
			},
		},
	};
</script>
<template lang="pug">
	transition-group.app-notifications(name="app-notifications")
		.app-notifications-item(v-for="item in messages" :key="item.key")
			.alert.alert-dismissible(:class="item.opts.class || 'alert-info'")
				.close(@click="dismiss(item)") &times;
				slot(:item="item"): span(v-html="item.message")
</template>
<style lang="stylus">
	.app-notifications
		fixed 15px 15px false 15px
		z-index 1200
	.app-notifications-item
		display block
		max-width 600px
		margin-right auto
		margin-left auto
	.app-notifications-enter-active, .app-notifications-leave-active
		transition all 0.1s ease-out
	.app-notifications-enter, .app-notifications-leave-to
		opacity 0
		transform translateY(-5px)
	.app-notifications-leave-to
		transform translateY(5px)
</style>