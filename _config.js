// This is a wrapper to check custom config existence and export it or a default one. For internal usage only!

const resolve = require('path').resolve,
	fileExists = require('fs').existsSync;

const configFile = resolve(process.cwd(), 'vue-admin-front.config.js');

module.exports = fileExists(configFile) ? require(configFile) : require('./config.default');
