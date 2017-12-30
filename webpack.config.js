const path = require('path'),
	qs = require('qs'),
	webpack = require('webpack'),
	HTMLPlugin = require('html-webpack-plugin'),
	ExtractText = require('extract-text-webpack-plugin'),
	fileExists = require('fs').existsSync;

const appConfig = require('./config'),
	basePath = process.env.ADMIN_PATH || appConfig.basePath || '/admin',
	dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
	buildDest = process.env.BUILD_DEST || appConfig.buildDest || path.resolve(process.cwd(), 'public/admin-dist'),
	publicPath = process.env.PUBLIC_PATH || appConfig.publicPath || '/admin-dist/',
	sourcePath = process.env.SOURCE_PATH || appConfig.sourcePath || process.cwd(),
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
		filename: '[name].js?[chunkhash:6]',
		chunkFilename: '[name].js?[chunkhash:6]'
	},
	module: {
		rules: [

			// source files

			vueConfig,
			{
				test: /\.js$/,
				loader: 'buble-loader',
				include: [
					path.resolve(__dirname, 'src'),
					sourcePath
				],
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
		]
	},
	resolve: {
		modules: [
			'node_modules',
			sourcePath,
			__dirname
		]
	},
	performance: {
		hints: process.env.NODE_ENV === 'production' ? 'warning' : false
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
			routerBasePath: JSON.stringify(basePath)
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor']
		}),
		new HTMLPlugin({
			template
		})
	]
};

if (dev) {
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
}

module.exports = config;
