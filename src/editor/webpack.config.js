module.exports = {
cache: true,
entry: './index.jsx',
output: {
    filename: 'package.js'
},
module: {
    loaders: [
    {test: /\.jsx/, loader: 'jsx-loader'}
    ]
},
externals: {
    'react': 'React',
    'react/addons': 'React',
    'lodash': '_'
}
};