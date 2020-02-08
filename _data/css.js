let sass = require('node-sass'),
path = require('path')

const compileSass = () => {
	const result = sass.renderSync({
		file: path.join(__dirname, '../scss/main.scss')
	})

	if(!result.css) {
		console.log('Error compiling stylesheet')
		return `/* Error compiling stylesheet */`
	}

	return result.css.toString()
}

module.exports = compileSass()