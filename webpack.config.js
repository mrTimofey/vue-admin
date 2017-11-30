const path = require('path'),
	qs = require('qs'),
	webpack = require('webpack'),
	HTMLPlugin = require('html-webpack-plugin'),
	ExtractText = require('extract-text-webpack-plugin');

const basePath = process.env.ADMIN_PATH || '/admin',
	dev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
	buildDest = process.env.BUILD_DEST || path.resolve(process.cwd(), 'dist');

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
		basedir: process.cwd()
	}),
	css: new Options({
		minimize: true,
		import: false
	}),
	stylus: new Options({
		import: [
			path.resolve(process.cwd(), 'node_modules/kouto-swiss/index.styl'),
			path.resolve(process.cwd(), 'src/shared.styl')
		]
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

const htmlConfig = {
	template: 'src/layout.pug'
};

// noinspection JSUnresolvedFunction
const config = {
	entry: {
		app: './src/entry.js',
		vendor: [
			'axios',
			'vue',
			'vue-router',
			'vuex',
			'vuex-router-sync',
			'vue-select',
			'vuedraggable'
		]
	},
	devtool: false,
	output: {
		publicPath: '/admin-dist/',
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
				exclude: /node_modules|chunk-loaders/,
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
			process.cwd()
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
		new HTMLPlugin(htmlConfig)
	]
};

if (dev) {
	config.output.path = path.resolve(process.cwd(), 'dist');
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
	htmlConfig.filename = buildDest + '/app.html';
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
