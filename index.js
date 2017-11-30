const webpack = require('webpack'),
	express = require('express'),
	path = require('path');

const config = require('./config'),
	webpackConfig = require('./webpack.config'),
	app = express();

let layout = 'Compiling up... Refresh in a moment.';

if (config.apiProxy) {
	app.use(config.apiProxy.prefix, require('http-proxy-middleware')(config.apiProxy));
}

// modify client config to work with hot middleware
webpackConfig.entry.app = ['webpack-hot-middleware/client', webpackConfig.entry.app];
webpackConfig.output.filename = '[name].js';
webpackConfig.plugins.push(
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoEmitOnErrorsPlugin()
);

// dev middleware
const compiler = webpack(webpackConfig);
const devMiddleware = require('webpack-dev-middleware')(compiler, {
	publicPath: webpackConfig.output.publicPath,
	stats: {
		colors: true,
		chunks: false
	},
	watchOptions: {
		aggregateTimeout: 300,
		poll: true
	}
});

// noinspection JSUnresolvedFunction
compiler.plugin('done', () => {
	const fs = devMiddleware.fileSystem;
	const filePath = path.join(webpackConfig.output.path, 'index.html');
	if (fs.existsSync(filePath)) layout = fs.readFileSync(filePath, 'utf-8');
});
app.use(devMiddleware);

// hot middleware
app.use(require('webpack-hot-middleware')(compiler));

app.use('/dist', express.static('./dist'));

app.use('*', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.end(layout);
});

app.listen(process.env.PORT || config.port || 8080);
