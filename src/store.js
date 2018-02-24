import Vue from 'vue';
import Vuex from 'vuex';
import http, { authorized, recallToken, logout } from 'src/http';
import { setLocale, setFallbackLocale } from 'src/i18n';
import initialState from 'src/initial-state';

Vue.use(Vuex);

export default new Vuex.Store({
	state: initialState,
	getters: {
		/**
		 * Get current authenticated user.
		 * @param {Object} state state
		 * @return {null|false|Object}
		 *   - null if user has not been fetched yet
		 *   - false if user is not authenticated
		 *   - user object otherwise
		 */
		user: state => state.user,
		title: state => state.title,
		logoTitle: state => state.logoTitle,
		shortTitle: state => state.shortTitle,
		metaData: state => state.metaData,
		entitiesData: state => state.metaData && state.metaData.entities,
		locale: state => state.locale,
		fallbackLocale: state => state.fallbackLocale,
		mainNav: state => state.metaData && state.metaData.nav,
		imagePath: state => state.metaData && state.metaData.image_path,
		wysiwygCss: state => state.metaData && state.metaData.wysiwyg && state.metaData.wysiwyg.css
	},
	mutations: {
		setUser(state, user) {
			state.user = user;
		},
		setMetaData(state, data) {
			state.metaData = data;
		},
		setLocaleData(state, data) {
			state.locale = data.locale;
			state.fallbackLocale = data.fallback_locale;
		}
	},
	actions: {
		fetchUser({ commit }) {
			if (authorized()) return http.get('auth/user')
				.catch(err => err.response && err.response.status === 401 ? recallToken() : Promise.reject(err))
				.then(res => commit('setUser', res.data.user || res.data))
				.catch(err => {
					commit('setUser', false);
					throw err;
				});
			commit('setUser', false);
			return Promise.reject();
		},
		fetchLocaleData({ commit }) {
			return http.get('locale').then(
				res => Promise.all([
					setLocale(res.data.locale),
					setFallbackLocale(res.data.fallback_locale)
				]).then(() => commit('setLocaleData', res.data))
			);
		},
		fetchMetaData({ commit }) {
			return http.get('meta').then(res => {
				commit('setMetaData', res.data);
			});
		},
		logout({ commit }) {
			logout();
			commit('setUser', false);
		}
	}
});
