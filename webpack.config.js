const path = require('path'),
	fs = require('fs'),
	qs = require('qs'),
	{ DefinePlugin } = require('webpack'),
	HTMLPlugin = require('html-webpack-plugin'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	{ VueLoaderPlugin } = require('vue-loader');

const appConfig = require('./_config'),
	dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
	basePath = process.env.ADMIN_PATH || appConfig.basePath,
	apiRoot = process.env.API_ROOT || appConfig.apiRoot,
	buildDest = process.env.BUILD_DEST || appConfig.buildDest,
	publicPath = process.env.PUBLIC_PATH || appConfig.publicPath,
	sourcePath = process.env.SOURCE_PATH || appConfig.sourcePath,
	customTemplatePath = path.resolve(sourcePath, 'src/layout.pug'),
	template = fs.existsSync(customTemplatePath) ? customTemplatePath : path.resolve(__dirname, 'src/layout.pug'),
	customStylusSharedFile = path.resolve(sourcePath, 'src/styles/shared.styl'),
	stylusImports = [
		path.resolve(process.cwd(), 'node_modules/kouto-swiss/index.styl'),
		path.resolve(__dirname, 'src/styles/shared.styl')
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

// noinspection JSUnresolvedFunction
const config = {
	devtool: false,
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	entry: 'src/entry.js',
	output: {
		publicPath,
		filename: '[name].js',
		chunkFilename: '[name].js'
	},
	module: {
		rules: [

			// source files

			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'buble-loader',
				// needed for vue-loader to correctly import modules' components
				exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file),
				options: options.buble
			},
			{
				test: /\.pug$/,
				oneOf: [
					// this applies to <template lang="pug"> in Vue components
					{
						resourceQuery: /^\?vue/,
						loader: 'pug-plain-loader',
						options: options.pug
					},
					// this applies to pug imports inside JavaScript
					{
						use: ['raw-loader', {
							loader: 'pug-plain-loader',
							options: options.pug
						}]
					}
				]
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
	resolveLoader: {
		modules: [
			path.resolve(process.cwd(), 'node_modules'),
			path.resolve(__dirname, 'node_modules')
		]
	},
	plugins: [
		new DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
			routerBasePath: JSON.stringify(basePath),
			apiRootPath: JSON.stringify(apiRoot),
			googleMapsApiKey: JSON.stringify(appConfig.googleMapsApiKey || false)
		}),
		new HTMLPlugin({ template }),
		new VueLoaderPlugin()
	],
	optimization: {
		runtimeChunk: {
			name: 'rtm'
		},
		splitChunks: {
			chunks: 'async'
		}
	}
};

function addStyleRules(extract = false) {
	for (let rule of [
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
			test: /\.styl(us)?$/,
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
			test: /\.css$/,
			use: [
				{
					loader: 'css-loader',
					options: options.css
				}
			]
		}
	]) {
		rule.use = [extract ? MiniCssExtractPlugin.loader : 'vue-style-loader', ...rule.use];
		config.module.rules.push(rule);
	}

	if (extract) config.plugins.push(
		new MiniCssExtractPlugin({ filename: '[name].css?[hash:6]' })
	);
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

	config.performance = {
		hints: 'warning'
	};
}

// allow application to customize webpack config
if (appConfig.webpackConfigModifier) appConfig.webpackConfigModifier(config, dev);

module.exports = config;
