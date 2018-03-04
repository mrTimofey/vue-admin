<script>
	import http from 'src/http';
	import { mapActions, mapGetters, mapMutations } from 'vuex';
	import { MasterComponent as Modal } from 'src/plugins/modal';
	import Logo from 'src/components/app/logo.vue';
	import SidebarUser from 'src/components/app/sidebar-user.vue';
	import SidebarMenu from 'src/components/app/sidebar-menu.vue';
	import 'src/styles/bootstrap.less';
	import 'src/styles/admin-lte.less';

	export default {
		computed: mapGetters(['user', 'skin', 'title', 'logoTitle', 'shortTitle', 'metaData', 'locale']),
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
		beforeMount() {
			window.document.title = this.title;
		},
		watch: {
			sidebarCollapse(v) {
				if (v) window.localStorage.adminSidebarCollapse = '1';
				else window.localStorage.removeItem('adminSidebarCollapse');
			},
			skin: {
				immediate: true,
				handler(v) {
					const remove = [];
					for (let name of window.document.body.classList) if (name.startsWith('skin-')) remove.push(name);
					for (let name of remove) window.document.body.classList.remove(name);
					if (v) {
						v = v.toString();
						const onLoaded = () => {
							window.document.body.classList.add('skin-' + v);
						};
						import(/* webpackChunkName: "skins/[request]" */ `src/styles/skins/${v}`)
							.then(onLoaded)
							.catch(() => {
								import(/* webpackChunkName: "skins/[request]" */ `admin-lte/dist/css/skins/skin-${v}.min.css`)
									.then(onLoaded);
							});
					}
				}
			}
		},
		components: { Modal, Logo, SidebarUser, SidebarMenu }
	};
</script>
<template lang="pug">
	.wrapper.hold-transition.sidebar-mini(':class'="{ 'sidebar-collapse': sidebarCollapse, 'sidebar-open': !sidebarCollapse }")
		template(v-if="locale")
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
		spinner(v-else)
</template>
<style lang="stylus">
	@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,600,700&subset=cyrillic');
	@import '~src/styles/common.styl';
	@import '~src/styles/modal.styl';
	html, body
		height auto
	.main-sidebar
		.user-panel
			height 38px
			.info
				overflow ellipsis
				max-width 170px
				left auto
				padding 2px 0 0 0
		.logout-button
			display block
			absolute 0 0 0 false
			width 50px
			padding-top 9px
			text-align center
	.main-header
		.sidebar-toggle
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
	.content-wrapper
		padding-top 50px
		margin-top -50px
		min-height 100vh
</style>