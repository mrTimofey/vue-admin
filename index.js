// Development server startup

const webpack = require('webpack'),
	serveStatic = require('serve-static'),
	polka = require('polka'),
	path = require('path');

const appConfig = require('./_config'),
	webpackConfig = require('./webpack.config'),
	app = polka(),
	port = process.env.PORT || appConfig.port;

let layout = 'Compiling... Refresh in a moment.';

if (appConfig.proxy) {
	const hpm = require('http-proxy-middleware');
	for (const prefix of appConfig.proxy.prefix)
		app.use(hpm(prefix, appConfig.proxy));
}

// modify webpack config to work with a hot middleware
// noinspection JSValidateTypes
webpackConfig.entry = ['webpack-hot-middleware/client', webpackConfig.entry];
if (!webpackConfig.plugins) webpackConfig.plugins = [];
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

// dev middleware
const compiler = webpack(webpackConfig),
	devMiddleware = require('webpack-dev-middleware')(compiler, {
		publicPath: webpackConfig.output.publicPath,
		stats: {
			colors: true,
			chunks: false,
		},
		watchOptions: {
			aggregateTimeout: 300,
			poll: true,
		},
	});

// noinspection JSUnresolvedFunction
compiler.hooks.done.tap('done', () => {
	const fs = devMiddleware.fileSystem,
		filePath = path.join(webpackConfig.output.path, 'index.html');
	if (fs.existsSync(filePath)) layout = fs.readFileSync(filePath, 'utf-8');
});
app.use(devMiddleware);

// hot middleware
app.use(require('webpack-hot-middleware')(compiler));

app.use('/dist', serveStatic('./dist'));

app.get('*', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.end(layout);
});

app.listen(port);

module.exports = app;
