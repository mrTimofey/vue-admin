module.exports = {
	// backend proxy
	apiProxy: {
		target: 'http://localhost:8000',
		prefix: ['/api', '/storage', '/css'],
		changeOrigin: true
	}
	// port: 8080 // admin dev app port
	// buildDest: path.resolve(process.cwd(), 'public/admin-dist') // webpack build output path
	// publicPath: '/admin-dist/' // used as public root for bundle
	// sourcePath: undefined // webpack resolve path to override default assets
};
