/* eslint-disable quote-props */
import Axios from 'axios';
import qs from 'qs';

const http = Axios.create({
	baseURL: apiRootPath,
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Accept': 'application/json',
	},
	paramsSerializer: qs.stringify,
});

/**
 * Authorize all further http requests.
 * @param {Object} data login response data
 * @return {undefined}
 */
export function authorize(data = null) {
	if (!window) return;
	if (data) {
		if (data.api_token) window.localStorage.adminApiToken = data.api_token;
		if (data.remember_token) window.localStorage.adminRememberToken = data.remember_token;
	}
	if (!window.localStorage.adminApiToken) return;
	http.defaults.headers.Authorization = 'Bearer ' + window.localStorage.adminApiToken;
}

/**
 * Check 'Authorization' header.
 * @returns {boolean} requests contain 'Authorization' header
 */
export function authorized() {
	return http.defaults.headers.hasOwnProperty('Authorization');
}

export function logout() {
	if (!window) return;
	if (authorized()) http.delete('auth');
	window.localStorage.removeItem('adminApiToken');
	window.localStorage.removeItem('adminRememberToken');
	delete http.defaults.headers.Authorization;
}

export function authenticate(login, password, remember = false) {
	return http.post('auth', { email: login, password, remember })
		.then(res => {
			authorize(res.data);
			return res;
		})
		.catch(err => {
			logout();
			throw err;
		});
}

export function recallToken() {
	if (!window.localStorage.adminRememberToken) return Promise.reject();
	return http.post('auth', { remember_token: window.localStorage.adminRememberToken, remember: true })
		.then(res => {
			authorize(res.data);
			return res;
		})
		.catch(err => {
			logout();
			throw err;
		});
}

export function getApiToken() {
	return http.defaults.headers.Authorization && http.defaults.headers.Authorization.substr(7);
}

authorize();

export default http;
