const path = require('path'),
	fs = require('fs'),
	qs = require('qs'),
	webpack = require('webpack'),
	HTMLPlugin = require('html-webpack-plugin'),
	ExtractText = require('extract-text-webpack-plugin');

const appConfig = require('./_config'),
	dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
	basePath = process.env.ADMIN_PATH || appConfig.basePath,
	apiRoot = process.env.API_ROOT || appConfig.apiRoot,
	buildDest = process.env.BUILD_DEST || appConfig.buildDest,
	publicPath = process.env.PUBLIC_PATH || appConfig.publicPath,
	sourcePath = process.env.SOURCE_PATH || appConfig.sourcePath,
	customTemplatePath = path.resolve(sourcePath, 'src/layout.pug'),
	template = fs.existsSync(customTemplatePath) ? customTemplatePath : path.resolve(__dirname, 'src/layout.pug'),
	customStylusSharedFile = path.resolve(sourcePath, 'src/shared.styl'),
	stylusImports = [
		path.resolve(process.cwd(), 'node_modules/kouto-swiss/index.styl'),
		path.resolve(__dirname, 'src/shared.styl')
	];

// append custom shared stylus file
if (fs.existsSync(customStylusSharedFile)) stylusImports.push(customStylusSharedFile);

// allows options to represent both object and query string
class Options {
	constructor(options) {
		for (let k of Object.keys(options)) this[k] = options[k];
	}
	toString() {
		return qs.stringify(this, { encode: false, arrayFormat: 'brackets' }).replace(/=true/g, '');
	}
}

// shared options
const options = {
	buble: new Options({
		objectAssign: 'Object.assign',
		transforms: {
			dangerousForOf: true,
			modules: false
		}
	}),
	pug: new Options({
		doctype: 'html',
		basedir: __dirname
	}),
	css: new Options({
		minimize: true,
		import: false
	}),
	less: {},
	stylus: new Options({
		import: stylusImports,
		preferPathResolver: 'webpack'
	})
};

const vueConfig = {
	test: /\.vue$/,
	loader: 'vue-loader',
	options: {
		template: options.pug,
		loaders: {
			stylus: `vue-style-loader!css-loader?${options.css}!stylus-loader?${options.stylus}`
		},
		transformToRequire: {
			img: 'src',
			image: 'xlink:href',
			a: 'href'
		},
		buble: options.buble
	}
};

// noinspection JSUnresolvedFunction
const config = {
	entry: {
		app: 'src/entry.js',
		vendor: [
			'axios',
			'vue',
			'vue-router',
			'vue-i18n',
			'vuex',
			'vuex-router-sync',
			'vue-select',
			'vuedraggable'
		]
	},
	devtool: false,
	output: {
		publicPath,
		filename: '[name].js',
		chunkFilename: '[name].js'
	},
	module: {
		rules: [

			// source files

			vueConfig,
			{
				test: /\.js$/,
				loader: 'buble-loader',
				include: /src\//,
				options: options.buble
			},
			{
				test: /\.pug$/,
				loader: 'pug-loader',
				options: options.pug
			},

			// assets

			{
				test: /\.(woff|woff2|eot|otf|ttf)$/,
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[ext]?[hash:6]'
				}
			},
			{
				test: /sprite\.svg$/,
				loader: 'raw-loader'
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/,
				exclude: /sprite\.svg$/,
				loader: 'url-loader',
				options: {
					limit: 256,
					name: 'i/[name].[ext]?[hash:6]'
				}
			},
			{
				test: /\.(pdf|docx?|pptx?|rtf|txt)$/,
				loader: 'file-loader',
				options: {
					name: 'docs/[name].[ext]?[hash:6]'
				}
			}

			// style loading is configured differently in dev/prod mode
		]
	},
	resolve: {
		modules: [
			'node_modules',
			// look for customized sources first
			sourcePath,
			__dirname
		],
		alias: {
			_local: __dirname
		},
		extensions: ['.js', '.json', '.vue', '.styl', '.less', '.css']
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
			routerBasePath: JSON.stringify(basePath),
			apiRootPath: JSON.stringify(apiRoot),
			googleMapsApiKey: JSON.stringify(appConfig.googleMapsApiKey || false)
		}),
		new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
		new HTMLPlugin({ template })
	]
};

function addStyleRules(extract = false) {
	for (let rule of [
		{
			test: /\.styl$/,
			use: [
				{
					loader: 'css-loader',
					options: options.css
				},
				{
					loader: 'stylus-loader',
					options: options.stylus
				}
			]
		},
		{
			test: /\.less$/,
			use: [
				{
					loader: 'css-loader',
					options: options.css
				},
				{
					loader: 'less-loader',
					options: options.less
				}
			]
		},
		{
			test: /\.css$/,
			use: [
				{
					loader: 'css-loader',
					options: options.css
				}
			]
		}
	]) {
		if (extract) rule.use = ExtractText.extract({
			use: rule.use,
			fallback: 'style-loader'
		});
		else rule.use = ['style-loader', ...rule.use];
		config.module.rules.push(rule);
	}
}

if (dev) {
	addStyleRules();
	// it does not make any sense since virtual file system is used in dev mode, webpack just requires this option
	config.output.path = path.resolve(__dirname, 'dist');
	config.devtool = '#sourcemap';
}
else {
	addStyleRules(true);
	config.output.path = buildDest;
	config.output.filename += '?[chunkhash:6]';
	config.output.chunkFilename += '?[chunkhash:6]';
	config.plugins.push(
		new ExtractText('styles.css?[hash:6]'),
		new webpack.optimize.UglifyJsPlugin({
			comment: true,
			compress: {
				warnings: false
			}
		})
	);

	vueConfig.options.extractCSS = true;

	config.performance = {
		hints: 'warning'
	};
}

// allow application to customize webpack config
if (appConfig.webpackConfigModifier) appConfig.webpackConfigModifier(config, dev);

module.exports = config;
