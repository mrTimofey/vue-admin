<script>
	import http from 'src/http';
	import { mapActions, mapGetters, mapMutations } from 'vuex';
	import { MasterComponent as Modal } from 'src/plugins/modal';
	import Logo from 'src/components/app/logo.vue';
	import SidebarUser from 'src/components/app/sidebar-user.vue';
	import SidebarMenu from 'src/components/app/sidebar-menu.vue';
	import 'src/styles/common.styl';
	import 'src/styles/modal.styl';

	export default {
		computed: mapGetters(['user', 'title', 'shortTitle', 'metaData', 'locale']),
		data: () => ({
			sidebarCollapse: window.localStorage.adminSidebarCollapse || false
		}),
		methods: {
			...mapActions(['fetchLocaleData', 'fetchUser', 'fetchMetaData', 'logout']),
			...mapMutations(['setUser']),
			init(user) {
				const fetchMeta = () => {
					this.fetchMetaData();
					// logout on 401 unauthorized response
					http.interceptors.response.use(null, err => {
						if (err.response.status === 401) this.logout();
						throw err;
					});
				};
				if (user) {
					this.setUser(user);
					fetchMeta();
				}
				else this.fetchUser().then(fetchMeta);
			}
		},
		created() {
			this.fetchLocaleData().then(this.init);
		},
		watch: {
			sidebarCollapse(v) {
				if (v) window.localStorage.adminSidebarCollapse = '1';
				else window.localStorage.removeItem('adminSidebarCollapse');
			}
		},
		components: { Modal, Logo, SidebarUser, SidebarMenu }
	};
</script>
<template lang="pug">
	spinner(v-if="!locale")
	.wrapper.hold-transition.sidebar-mini(v-else ':class'="{ 'sidebar-collapse': sidebarCollapse, 'sidebar-open': !sidebarCollapse }")
		transition(name="modal"): modal.modal(innerClass="modal-dialog")
		template(v-if="user === false")
			login-form('@done'="init()")
		template(v-else-if="metaData")
			header.main-header
				logo
				nav.navbar.navbar-static-top(role="navigation")
					a.sidebar-toggle('@click.prevent'="sidebarCollapse = !sidebarCollapse"): i.fas.fa-bars
			aside.main-sidebar
				section.sidebar
					sidebar-user(':user'="user")
					sidebar-menu
			.content-wrapper
				router-view
</template>
<style lang="stylus">
	.main-header .sidebar-toggle
		padding 15px
		i
			backface-visibility hidden
			display block
			size 20px
			font-size 22px
			line-height @height
		&:before
			content none
	.sidebar-menu li > a > .fas
		width 20px
</style>