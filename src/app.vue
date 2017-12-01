<script>
	import http from 'src/http';
	import { mapActions, mapGetters, mapMutations } from 'vuex';
	import { MasterComponent as Modal } from 'src/plugins/modal';
	import SidebarMenu from 'src/components/sidebar-menu.vue';
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
		components: { Modal, SidebarMenu }
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
				router-link.logo(to="/")
					span.logo-mini(v-html="shortTitle")
					span.logo-lg(v-html="title")
				nav.navbar.navbar-static-top(role="navigation")
					a.sidebar-toggle('@click.prevent'="sidebarCollapse = !sidebarCollapse")
			aside.main-sidebar
				section.sidebar
					.user-panel(v-if="user")
						.info {{ user.name || user.email }}
						!=' '
						a.logout-button(@click="logout()"): i.fa.fa-sign-out
					sidebar-menu
			.content-wrapper
				router-view
</template>