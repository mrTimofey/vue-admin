import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import 'src/styles/bootstrap.less';
import 'src/styles/admin-lte.less';
import 'src/styles/common.styl';

import { filenameToCamelCase, requireAll } from 'src/utils';

import app from 'src/app.vue';

import Modal from 'src/plugins/modal';
import Notifications from 'src/plugins/notifications';
Vue.use(Modal);
Vue.use(Notifications);

// shared components
requireAll([
	require.context('src/components/shared/', true, /\.(vue|js)$/),
	require.context('_local/src/components/shared/', true, /\.(vue|js)$/),
], (module, name) => {
	Vue.component(filenameToCamelCase(name), module);
});

// filters
requireAll([
	require.context('src/filters/', true, /\.js$/),
	require.context('_local/src/filters/', true, /\.js$/),
], (module, name) => {
	Vue.filter(filenameToCamelCase(name), module);
});

// directives
requireAll([
	require.context('src/directives/', true, /\.js$/),
	require.context('_local/src/directives/', true, /\.js$/),
], (module, name) => {
	Vue.directive(filenameToCamelCase(name), module);
});

// modal components
requireAll([
	require.context('src/components/modals/', true, /\.(vue|js)$/),
	require.context('_local/src/components/modals/', true, /\.(vue|js)$/),
], (component, name) => {
	Modal.component(filenameToCamelCase(name), component);
});

import store from 'src/store';
import router from 'src/router';
import i18n from 'src/i18n';
sync(store, router);

const root = new Vue({ store, router, i18n, ...app });
root.$mount(document.body.querySelector('[data-root-element]'));
