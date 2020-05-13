const path = require('path');
const webpack = require('webpack');
// const CopyWebpackPlugin = require("copy-webpack-plugin"); // 뭐하는놈일까...
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// const CleanWebpackPlugin = require('clean-webpack-plugin')
//
// function resolve(dir) {
//   return path.join(__dirname, dir);
// }
/* eslint no-param-reassign:
    ["error", { "props": true, "ignorePropertyModificationsFor": ["options"] }] */
module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	outputDir: path.resolve(__dirname, '../webServer/src/web'),
	css: {
		loaderOptions: {
			sass: {
				data: `@import "@/style/sass/utils/_variables.scss";
                       @import "@/style/sass/utils/_mixins.scss";
                       @import "@/style/sass/utils/_functions.scss";
                `,
			},
		},
	},

	// assetsDir: "/env/",
	// assetsDir: "/assets/",
	//
	// outputDir: path.resolve("./dist"),
	// devtool : 'eval-source-map',
	// devtool: "#cheap-eval-source-map",
	chainWebpack: config => {
		// config.optimization.minimizer("terser").tap(args => {
		//     args[0].terserOptions.compress.drop_console = true;
		//     return args;
		// });
		// config.output
		//     .globalObject("this");
		// config.module.rule('js').exclude.add(/\.worker\.js$/)
		config.module
			.rule('js')
			.exclude.add(/\.worker\.js$/)
			.add(/config.evn.js/)
			.end();

		config.module
			.rule('eslint')
			.use('eslint-loader')
			.tap(options => {
				options.fix = true;
				return options;
			});
		// config.module.rule("js").exclude.add(/\.env.js$/)
		//     .end().output
		//     .path("dist/js/env")
		//     .filename("[name].env.js");

		config.module
			.rule('worker')
			.test(/\.worker\.js$/)
			// .test(/src\common\/XAI.worker.js$/)
			.use('worker-loader')
			.loader('worker-loader')
			.options({
				// name: "XAI.worker.js",
				name: path.join('js/worker', '[hash].worker.js'),
				// publicPath: "js/workers/",
				// fallback: true,
				inline: false,
				//     // name: (path.join("js/worker/", "/[hash:8].worker.js")),
			})
			.end();
		// config.module
		//     .rule("compile")
		//     .test(/\.js$/)
		//     .exclude
		//     .add(/config.evn.js/)
		//     .end()
		//     .externals({
		//         filename: "config.evn.js",
		//     })
		//     .use("babel")
		//     .loader("babel-loader");
	},
	configureWebpack: config => {
		// config.output =
		//   {
		//     globalObject: 'this'
		//   }
		const defaultEnv = {
			// externals:
			//     "config.env.js",

			output: {
				// path: path.resolve(__dirname, '../webServer/web'),
				// filename: ("[name].js"),
				filename: path.join('js/app/', '/[name].[id].[hash:8].js'),
				chunkFilename: path.join('js/chunk/', '/[name].[id].[hash:8].js'),
				globalObject: 'this',
				// chunkFilename: (path.join("js/", "/[name].js")),
			},

			devServer: {
				inline: true,
				hot: true, // Enable Hot Module Replacement feature.
				// open: false, // When open is enabled, the dev server will open the browser.
				// overlay: true, // Show a full-screen overlay in the browser when there are compiler errors or warnings.
				// port: 8080, // Specify a port number to listen for requests on.
			},
			performance: {
				hints: false,
				maxAssetSize: 500000,
			},
			module: {
				rules: [
					{
						test: /\.tsx?$/,
						use: 'ts-loader',
						exclude: /node_modules/,
					},
				],
			},
			resolve: {
				extensions: ['.tsx', '.ts', '.js'],
			},
			plugins: [
				new webpack.DefinePlugin({
					'process.env': {
						NODE_ENV: 'demo',
					},
				}),
				new BundleAnalyzerPlugin({
					openAnalyzer: false,
					analyzerMode: 'disabled',
				}),
				new MomentLocalesPlugin({
					localesToKeep: ['es-us', 'ko'],
				}),
				// new CopyWebpackPlugin([
				//     {
				//         from: "src/env/",
				//         to: "env/",
				//         toType: "dir",
				//         // ignore: ["config.env.js"],
				//     },
				// ]),
				//     // new webpack.HotModuleReplacementPlugin(),
				//     new CopyWebpackPlugin([
				//         {
				//             from: path.resolve(__dirname, "../cloudmonitor_front/src/"),
				//             to: "./cloudmonitor_front/src/",
				//             copyUnmodified: true,
				//         },
				//     ]),
				//     // new CleanWebpackPlugin(['dist'], {
				//     //   root: path.join(__dirname, '..')
				//     // })
			],

			optimization: {
				minimize: false, // true / false 예전 webpack3 UgilfyJsPlugin 계승함 대체됨
				// splitChunks가 CommonsChunkPlugin을 계승함 대체됨
				// mode가 production이면 자동으로 minimze랑 splitChunks 자동 true
				splitChunks: {
					// minSize: 1000,
					// maxSize: 250000,
					// chunks: "all", // all, async, initial
					cacheGroups: {
						commons: {
							chunks: 'initial',
							filename: 'js/[name].js',
							name: 'vendors',
							test: /[\\/]node_modules[\\/]/,
							priority: -10,
						},
						// env: {
						//     chunks: "initial",
						//     name:
						//         "customer",
						//     test:
						//         "/src/env/",
						//     enforce: true,
						//     priority:
						//         -1,
						// },
						// styles: {
						//     name: 'app',
						//     test: /\.(s?css)$/, // chunks plugin has to be aware of all kind of files able to output css in order to put them together
						//     chunks: 'initial',
						//     minChunks: 1,
						//     enforce: true
						// },
						default: {
							minChunks: 2,
							priority: -20,
							reuseExistingChunk: true,
						},
						// test: /[\\/]node_modules[\\/]/,
						// name: "vendors",
						// chunks: "initial",
						// vendors: {
						//     filename: '[name].bundle.js'
						// }
					},
				},
				// 각 모듈에 대한 exports를 결정하기 위해 사용합니다. (production 모드에는 사용하도록 설정되어있음)
				usedExports: true,
				// . concatenateModules 옵션은 ModuleConcatenationPlugin을 계승합니다.
				concatenateModules: true,
				// module: {
				//   rules: [
				//     {
				//       test: /\.worker\.js$/,
				//       loader: 'worker-loader'
				//       // use: {
				//       //   loader: 'worker-loader',
				//       //   options: { publicPath: './js/webWorker' }
				//       // }
				//     }
				//   ]
				// }
			},
		};
		if (process.env.NODE_ENV === 'production') {
			// mutate config for production...
			const productionEnv = {
				// output: {
				// libraryExport: 'default'
				// },
				devtool: 'source-map',
			};

			return Object.assign(productionEnv, defaultEnv);
		} else {
			const developmentEnv = {
				devtool: 'cheap-module-source-map',
				// devtool: "#source-map",
			};

			return Object.assign(developmentEnv, defaultEnv);

			// mutate for development...
		}
		// config.output.globalObject = "this";
	},
	transpileDependencies: [/\/node_modules\/vue-echarts\//, /\/node_modules\/resize-detector\//],
};

// module.exports = {
//     baseUrl: process.env.NODE_ENV === "production" ?
//         "/Custom/TestProject/" :
//         "./",
//
//     outputDir: path.resolve("./dist"),
//     assetsDir: "/assets/",

// pages:
//     {
//         rtm: {
//             // entry for the page
//             entry: "src/rtm.js",
//             // the source template
//             template:
//                 "public/index.html",
//             // output as dist/index.html
//             filename:
//                 "index.html",
//             // when using title option,
//             // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
//             title:
//                 "Index Page",
//             // chunks to include on this page, by default includes
//             // extracted common chunks and vendor chunks.
//             chunks:
//                 ["chunk-vendors", "chunk-common", "index", "vendor", "rtm"],
//         }
//         ,
//         // when using the entry-only string format,
//         // template is inferred to be `public/subpage.html`
//         // and falls back to `public/index.html` if not found.
//         // Output filename is inferred to be `subpage.html`.
//         // subpage: 'src/vender.js'
//     },

// devServer: {
//     inline: true,
//     hot: true, // Enable Hot Module Replacement feature.
//     // open: false, // When open is enabled, the dev server will open the browser.
//     // overlay: true, // Show a full-screen overlay in the browser when there are compiler errors or warnings.
//     port: 8080, // Specify a port number to listen for requests on.
// },
//
// chainWebpack: config => {
//     config.resolve.alias
//         .set("@", resolve("src"))
//         .set("~", resolve("src/style"));

//     config.module
//         .rule("js")
//         .use("babel-loader");
//
//     config.module.rule("images").test(/\.(png|jpe?g|gif|ico|)(\?.*)?$/)
//         .use("url-loader")
//         .loader("file-loader") // replaces the url-loader
//         .tap(options => Object.assign({}, options, {
//             name: "images/[name].[hash:8].[ext]",
//         }));
//
//     config.module
//         .rule("svg")
//         .test(/\.(svg)(\?.*)?$/)
//         .use("file-loader")
//         .loader("file-loader")
//         .options({
//             name: "img/[name].[hash:8].[ext]",
//         });
//
//     config.module
//         .rule("fonts")
//         .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
//         .use("url-loader")
//         .loader("url-loader")
//         .tap(options => Object.assign({}, options, {
//             name: "fonts/[name].[hash:8].[ext]",
//         }));
//         // .options(genUrlLoaderOptions('fonts'))
//
//
//     // config.module
//     //     .rule('vue')
//     //     .use('vue-loader')
//     //     .loader('vue-loader')
//     //     .tap(options => {
//     //         // modify the options...
//     //         return options
//     //     })
//
//     // config.module.rule('images').test(/\.(svg|)(\?.*)?$/)
//     //     .use('url-loader')
//     //     .loader('file-loader') // replaces the url-loader
//     //     .tap(options => Object.assign({}, options, {
//     //         name: 'img/[name].[hash:8].[ext]'
//     //     }))
//
//     // config.module.rule('svg').test(/\.svg$/)
//     //     .use('url-loader')
//     //     .loader('file-loader')
//     //     .loader('vue-svg-loader')
//     //     .tap(options => Object.assign({}, options, {
//     //         // name: 'images/[name].[hash:8].[ext]',
//     //         removeDoctype: true,
//     //         removeComments: true
//     //     }))
//     // config.module.rule('svg')
//     //     .test(/\.(svg)(\?.*)?$/)
//     //     .use('file-loader')
//     //     .loader('svg-sprite-loader')
//     //     .options({
//     //         extract: true,
//     //         // spriteFilename: 'icons.svg'
//     //     })
//     // config.module.rule('images').test(/\.(svg)(\?.*)?$/)
//     //     .use('url-loader')
//     //     .loader('svg-inline-loader') // replaces the url-loader
//     //     .tap(options => Object.assign({},options, {
//     //         name: 'images/svg/[name].[hash:8].[ext]'
//     //     }))
//     // config.module.rule('svg').use('file-loader')
//     //     .tap(options => Object.assign({},options, {
//     //         name: 'images/register/[name].[hash:8].[ext]'
//     //     }))
// },
//
// css: {
//     // extract CSS in components into a single CSS file (only in production)
//     // can also be an object of options to pass to extract-text-webpack-plugin
//     extract: {
//         filename: "css/register/[name].css",
//         chunkFilename: "css/register/[name].css",
//
//         // Enable CSS modules for all css / pre-processor files.
//         // This option does not affect *.vue files.
//         modules: true,
//
//         // enable CSS source maps?
//         sourceMap: false,
//
//     },
// },
//
// configureWebpack: {
//     // devtool : 'eval-source-map',
//     devtool: "#cheap-eval-source-map",
//     output: {
//         filename: (path.join("js/", "/[name].[id].[hash:8].js")),
//         chunkFilename: (path.join("js/", "/[name].[id].[chunkhash:8].js")),
//     },
//     performance: {
//         hints: false,
//         maxAssetSize:
//             500000,
//     },
//     plugins: [
//         // new CopyWebpackPlugin([{ from: 'src/client/public/', to: 'public' }])
//         new CleanWebpackPlugin(["dist"], {
//             root: path.join(__dirname, ".."),
//         }),
//     ],
//
//     optimization:
//         {
//
//             minimize: false, // true / false 예전 webpack3 UgilfyJsPlugin 계승함 대체됨
//             // splitChunks가 CommonsChunkPlugin을 계승함 대체됨
//             // mode가 production이면 자동으로 minimze랑 splitChunks 자동 true
//             splitChunks:
//                 {
//                     // minSize: 1000,
//                     // maxSize: 250000,
//                     chunks: "all", // all, async, initial
//                     cacheGroups:
//                         {
//                             vendors: {
//                                 chunks: "initial",
//                                 name:
//                                     "vendor",
//                                 test:
//                                     /[\\/]node_modules[\\/]/,
//                                 priority:
//                                     -10,
//                             },
//                             // styles: {
//                             //     name: 'app',
//                             //     test: /\.(s?css)$/, // chunks plugin has to be aware of all kind of files able to output css in order to put them together
//                             //     chunks: 'initial',
//                             //     minChunks: 1,
//                             //     enforce: true
//                             // },
//                             default:
//                                 {
//                                     minChunks: 2,
//                                     priority:
//                                         -20,
//                                     reuseExistingChunk:
//                                         true,
//                                 },
//                             // test: /[\\/]node_modules[\\/]/,
//                             // name: "vendors",
//                             // chunks: "initial",
//                             // vendors: {
//                             //     filename: '[name].bundle.js'
//                             // }
//                         }
//                     ,
//
//                 },
//             // . concatenateModules 옵션은 ModuleConcatenationPlugin을 계승합니다.
//             concatenateModules: true,
//         },
// },
//
// productionSourceMap: false,
// lintOnSave: undefined,
// };
