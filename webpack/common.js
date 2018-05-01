const pp = require("project-paths"),
  path = require("path"),
  projectMeta = require(pp.getA("configs", "project.meta.js")),
  webpack = require('webpack');

const plugins = {
  extractTextPlugin: require("extract-text-webpack-plugin"),
  htmlWebpackPlugin: require("html-webpack-plugin"),
  // definePlugin: require("webpack").DefinePlugin,
  clean: require("webpack-cleanup-plugin")
};

/**
 * Возвращает общие настройки webpack
 * которые свойственны всем видам окружения
 * @param env Текущее окружение
 * @returns WebpackConfigObject
 */
module.exports = function(env) {

  // Список зависимостей из файла package.json
  // для записи в отдельный файл vendors.
  const dependencies = Object.keys(require(pp.getA("/", "package.json")).dependencies || {});

  // входные точки для webpack
  let entry = {
    "app": pp.getA("src", "client.tsx")
  };

  if (dependencies.length) entry["vendors"] = dependencies;

  return {
    entry,

    output: {
      path: pp.getA("build"),
      filename: path.join("[name].js"),
      chunkFilename: "[id].[hash].js"
    },

    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".sass", ".scss", ".vue"],
      modules: [pp.get("/", "node_modules")],
      alias: {
        _fonts: pp.get("assets", "fonts"),
        _img: pp.get("assets", "img"),
        _styles: pp.get("assets", "styles")
      }
    },

    module: {
      rules: [{
          test: /\.ejs$/,
          loader: "ejs-loader"
        },

        {
          test: /\.json$/,
          loader: "json-loader",
          exclude: [/node_modules/]
        },

        {
          test: /\.tsx?$/,
          loader: "awesome-typescript-loader"
        },

        {
          test: /\.jsx?$/,
          loader: "react-hot-loader/webpack",
          include: pp.getA("src")
        },

        {
          test: /\.json$/,
          loader: "json-loader",
          exclude: [/node_modules/],
        },

        {
          test: /\.js$/,
          exclude: [/node_modules/],
          loader: `babel?${JSON.stringify(babelSettings)}`,
        },

        {
          test: /\.s[ac]ss$/,
          use: (env == "development" ? ["css-hot-loader"] : []).concat(
            plugins.extractTextPlugin.extract({
              fallback: "style-loader",
              use: 'css-loader!group-css-media-queries-loader!resolve-url-loader!sass-loader?sourceMap!sass-bulk-import-loader'
            })
          )
        },

        {
          test: /\.css$/,
          use: (env == "development" ? ["css-hot-loader"] : []).concat(
            plugins.extractTextPlugin.extract({
              fallback: "style-loader",
              use: ["css-loader"]
            })
          )
        },

        {
          test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.png$|\.jpe?g$|\.gif$/,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
            outputPath: "public/",
            publicPath: "/public"
          }
        },

        {
          test: /\.DS_Store/,
          loader: "ignore-loader"
        }
      ]
    },

    plugins: [
      new plugins.extractTextPlugin('./public/styles/[name].css', {
        allChunks: true,
        disable: env == "development"
      }),
      new plugins.htmlWebpackPlugin({
        ...projectMeta,
        filename: "index.html",
        chunks: ["vendors", "app"],
        template: pp.get("templates", "index.ejs")
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env),
          REBEM_MOD_DELIM: JSON.stringify('--'),
          REBEM_ELEM_DELIM: JSON.stringify('__')
        }
      })
      // new plugins.clean()
    ]
  };
};


const babelSettings = {
	babelrc: false,
	extends: pp.getA("/", ".babelrc")
}