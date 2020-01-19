const path = require('path');

module.exports = {
	// application backend proxy
	apiProxy: {
		target: 'http://localhost:8000',
		prefix: ['/api', '/storage', '/css'],
		changeOrigin: true,
	},

	// admin panel routes base path
	basePath: '/admin',

	// api base path
	// WARNING: do not set this option to same or starting with basePath or publicPath!
	apiRoot: '/api/admin/',

	// admin dev app port
	port: 8080,

	// Webpack build output path accessible from a web-server
	buildDest: path.resolve(process.cwd(), 'public/admin-dist'),

	// public root to include bundle files to the app layout HTML (web-server public path root)
	// WARNING: do not set this option to same or starting with basePath or apiRoot!
	publicPath: '/admin-dist/',

	// Webpack will try to resolve sources from this path before a package root
	sourcePath: path.resolve(process.cwd(), 'admin'),

	// Google Maps API key is required to use any of geo field types
	// googleMapsApiKey: 'key'

	// Webpack config modifier
	// original configuration is in webpack.config.js file
	// webpackConfigModifier(config, isDev) {}
};
