const path = require('path');

module.exports = {
	// application backend proxy
	apiProxy: {
		target: 'http://localhost:8000',
		prefix: ['/api', '/storage', '/css'],
		changeOrigin: true
	},

	// admin panel routes base path
	basePath: '/admin',

	// admin dev app port
	port: 8080,

	// webpack build output path
	buildDest: path.resolve(process.cwd(), 'public/admin-dist'),

	// used as a public root for bundle
	publicPath: '/admin-dist/',

	// webpack's resolve.module entry for customized admin assets and sources
	sourcePath: path.resolve(process.cwd(), 'admin')

	// Google Maps API key is required to use any geo field types
	// googleMapsApiKey: 'key'

	// Webpack config modifier
	// webpackConfigModifier(config, isDev) {}
};
