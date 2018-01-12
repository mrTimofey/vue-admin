const path = require('path'),
	qs = require('qs'),
	webpack = require('webpack'),
	HTMLPlugin = require('html-webpack-plugin'),
	ExtractText = require('extract-text-webpack-plugin'),
	fileExists = require('fs').existsSync;

const appConfig = require('./_config'),
	dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
	basePath = process.env.ADMIN_PATH || appConfig.basePath,
	buildDest = process.env.BUILD_DEST || appConfig.buildDest,
	publicPath = process.env.PUBLIC_PATH || appConfig.publicPath,
	sourcePath = process.env.SOURCE_PATH || appConfig.sourcePath,
	customTemplatePath = path.resolve(sourcePath, 'src/layout.pug'),
	template = fileExists(customTemplatePath) ? customTemplatePath : path.resolve(__dirname, 'src/layout.pug'),
	customStylusShared = path.resolve(sourcePath, 'src/shared.styl'),
	stylusImports = [
		path.resolve(process.cwd(), 'node_modules/kouto-swiss/index.styl'),
		path.resolve(__dirname, 'src/shared.styl')
	];

if (fileExists(customStylusShared)) stylusImports.push(customStylusShared);

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
	stylus: new Options({
		import: stylusImports
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
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
			routerBasePath: JSON.stringify(basePath),
			googleMapsApiKey: JSON.stringify(appConfig.googleMapsApiKey || false)
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor'
		}),
		new HTMLPlugin({
			template
		})
	]
};

if (dev) {
	// it does not make any sense since virtual file system is used in dev mode, webpack just requires this option
	config.output.path = path.resolve(__dirname, 'dist');
	config.devtool = '#sourcemap';
	config.module.rules.push(
		{
			test: /\.styl$/,
			use: [
				'style-loader',
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
				'style-loader',
				{
					loader: 'css-loader',
					options: options.css
				}
			]
		}
	);
}
else {
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

	vueConfig.options.loaders.stylus = ExtractText.extract({
		use: vueConfig.options.loaders.stylus.replace('vue-style-loader!', ''),
		fallback: 'vue-style-loader'
	});

	config.module.rules.push(
		{
			test: /\.styl$/,
			use: ExtractText.extract({
				use: [
					{
						loader: 'css-loader',
						options: options.css
					},
					{
						loader: 'stylus-loader',
						options: options.stylus
					}
				],
				fallback: 'style-loader'
			})
		},
		{
			test: /\.css$/,
			use: ExtractText.extract({
				use: 'css-loader?' + options.css,
				fallback: 'style-loader'
			})
		}
	);

	config.performance = {
		hints: 'warning'
	};
}

// allow application to customize webpack config
if (appConfig.webpackConfigModifier) appConfig.webpackConfigModifier(config, dev);

module.exports = config;
