module.exports = [
  {
    test: /(\.jsx|\.js)$/,
    exclude: [/(node_modules)/],
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['react', 'es2015']
      }
    }
  },
  {
    test: /\.css$/,
    use: [ 'style-loader', 'css-loader' ]
  },
  {
    test: /\.scss$/,
    use: [
      {
        loader: "style-loader"
      },
      {
        loader: "css-loader",
        options: {
          sourceMap: true
        }
      },
      {
        loader: "sass-loader",
        options: {
          sourceMap: true
        }
      }
    ]
  },
  {
    test: /\.(png|jpg|gif)$/,
    use: [
      {
        loader: 'file-loader',
        options: {}
      }
    ]
  }
]
