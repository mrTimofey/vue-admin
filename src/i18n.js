import Vue from 'vue';
import I18n from 'vue-i18n';
import http from 'src/http';

Vue.use(I18n);

const i18n = new I18n();
const loaded = [];

function load(lang) {
	return System.import(/* webpackChunkName: "lang/[request]" */ `src/lang/${lang}`).then(data => {
		if (data.default && !data.messages) data = data.default;
		i18n.setLocaleMessage(lang, data.messages);
		i18n.setDateTimeFormat(lang, data.dateTime);
		i18n.setNumberFormat(lang, data.num);
		loaded.push(lang);
	});
}

export function setLocale(lang) {
	if (window) window.document.documentElement.setAttribute('lang', lang);
	http.defaults.headers.common['Accept-Language'] = lang;
	if (i18n.locale !== lang) {
		i18n.locale = lang;
		return loaded.contains(lang) ? Promise.resolve() : load(lang);
	}
	return Promise.resolve();
}

export function setFallbackLocale(lang) {
	if (i18n.fallbackLocale !== lang) {
		i18n.fallbackLocale = lang;
		return loaded.contains(lang) ? Promise.resolve() : load(lang);
	}
	return Promise.resolve();
}

export default i18n;
