module.exports = {
	// backend proxy
	apiProxy: {
		target: 'http://localhost:8000',
		prefix: ['/api/admin', '/storage'],
		changeOrigin: true
	},
	// admin dev app port
	port: 8080
};
