import Vue from 'vue';
import i18n from 'src/i18n';

/**
 * Converts
 * @param {string} str string to process
 * @param {bool} [lowerFirst] lowercase first letter (uppercase by default)
 * @returns {string} processed string
 */
export function filenameToCamelCase(str, lowerFirst) {
	return str
	// remove extension
		.replace(/\.[a-z0-9]+$/i, '')
		// remove leading ./
		.replace(/^\.\//, '')
		// split by '-', '_', '/'
		.split(/[-_/]/)
		// remove empty pieces
		.filter(piece => piece.length)
		// capitalize each piece
		.map((el, i) => el.substr(0, 1)[(lowerFirst && i === 0) ? 'toLowerCase' : 'toUpperCase']() + el.substr(1))
		.join('');
}

/**
 * Require all modules from require.context, applies callback to each module or returns name => module mappings
 * if callback is omitted.
 * @param {Object|Function} requireFile require.context call result
 * @param {Function} [cb]<{string} name, module> callback function, optional
 * @returns {Object|undefined} {module name} => {module} mapping OR nothing if callback is provided
 */
export function requireAll(requireFile, cb) {
	let modules;
	if (!cb) modules = {};
	// noinspection JSUnresolvedFunction
	for (let name of requireFile.keys()) {
		let module = requireFile(name);
		if (module.default) module = module.default;
		if (cb) cb(module, name);
		else modules[name] = module;
	}
	if (!cb) return modules;
}

const scriptMap = {};

/**
 * Load script and return promise.
 * @param {string} src script src
 * @returns {Promise} script promise
 */
export function loadScript(src) {
	if (!scriptMap[src]) scriptMap[src] = new Promise((resolve, reject) => {
		let script = document.createElement('script');
		script.async = true;
		script.src = src;
		script.onload = () => {
			script.dataset.loaded = true;
			resolve();
		};
		script.onerror = () => {
			script.dataset.loaded = false;
			reject();
		};
		document.head.appendChild(script);
	});
	return scriptMap[src];
}

export function convert2date(str, fixTimezone) {
	if (!str) return null;
	let date;
	// unix timestamp
	if (Number.isInteger(str) && str > 100000000 && str < 9999999999) date = new Date(str * 1000);
	// JavaScript ms timestamp
	else if (Number.isInteger(str) && str > 100000000000 && str < 9999999999999) date = new Date(str);
	// string
	else date = new Date(str.toString().split('-').join('/')) || null;

	// fix timezone
	if (fixTimezone) date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

	if (!date) return null;
	return date;
}

export function asFormData(data) {
	const formData = new FormData(),
		json = {};

	const addFile = (name, file) => formData.append(name, file, file.name.replace(/\.[^.]*$/, ext => ext.toLowerCase()));
	for (let field of Object.keys(data)) {
		if (data[field] instanceof File) addFile('files__' + field, data[field]);
		else if (data[field] instanceof FileList)
			for (let i = 0; i < data[field].length; ++i)
				addFile('files__' + field + '[]', data[field][i]);
		else json[field] = data[field];
	}
	formData.append('__json_data', JSON.stringify(json));
	return formData;
}

/**
 * Parse string with placeholders.
 * Replaces {{ field [| filter] [| filter(param, param)] [|| defaultValue] }}
 * @param {string} str string to process
 * @param {Object|Array} obj object or array of objects, data source for replacements
 * @param {string} def default value
 * @returns {*} processed string
 */
export function parsePlaceholders(str, obj, def = '') {
	// optimization
	if (str.indexOf('{{') >= str.indexOf('}}')) return str;
	/**
	 * parse substrings like {{ field [| filter1 | filter2(arg, arg) || default value] }}
	 * {{ - open placeholder
	 *      \s*
	 *      ([a-zA-Z_0-9]+) - get field name
	 *      \s*
	 *      ((\|\s*([a-zA-Z0-9()\s,]+?)\s*)*) - optional filters, a whole string is then processed ( | filter1 | filter2(arg, arg) )
	 *          \|\s*([a-zA-Z0-9()\s,]+?)\s* - single filter match
	 *      \s*
	 *      (\|\|\s*([^}]+?))? - optional default value ( || default value )
	 *      \s*
	 * }} - close placeholder
	 * @type {RegExp}
	 */
	const regex = /{{\s*([a-zA-Z_0-9]+)\s*((\|\s*([а-яА-Яa-zA-Z0-9()\s,]+?)\s*)*)\s*(\|\|\s*([^}]+?))?\s*}}/g;
	function applyFilters(v, filters) {
		if (!filters || !Vue.options.filters) return v;
		filters = filters.split('|');
		for (let filter of filters) {
			filter = filter.trim();
			if (!filter) continue;
			filter = filter[0].toUpperCase() + filter.substr(1);
			let split = filter.indexOf('(');
			// extract filter name and filter arguments
			if (split > -1) {
				let args = filter
				// remove trailing )
					.substring(split + 1, filter.length - 1)
					// get each argument
					.split(',')
					// trim and remove empty
					.map(arg => arg.trim()).filter(arg => arg);
				filter = filter.substr(0, split);
				v = Vue.options.filters[filter] ? Vue.options.filters[filter].apply(null, [v, ...args]) : v;
			}
			else v = Vue.options.filters[filter] ? Vue.options.filters[filter].call(null, v) : v;
		}
		return v;
	}
	return str.replace(regex, (_, field, filters, f1, f2, f3, localDef) => {
		if (Array.isArray(obj)) {
			const ar = obj.filter(ar => ar);
			for (let item of ar) if (item[field]) return applyFilters(item[field], filters);
			return localDef || def;
		}
		return obj[field] && applyFilters(obj[field], filters) || localDef || def;
	});
}

export function httpErrorModalData(err) {
	let jsonData, text;
	if (!err.response) text = i18n.t('errors.noResponse');
	else {
		jsonData = process.env.NODE_ENV === 'production' ? null : err.response.data;
		if (err.response === 400)
			text = err.response.data.message || err.response.data;
		else if (err.response.status === 422)
			text = Object.keys(err.response.data.errors).map(k => err.response.data.errors[k].join(' ')).join('<br>');
		else if (err.response.status >= 400 && err.response.status < 500)
			text = i18n.t('httpCodes.' + err.response.status);
		else
			text = i18n.t('httpCodes.500');
	}
	return { text, jsonData };
}
