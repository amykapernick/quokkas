const stylelint = require(`stylelint`);
const rgb = require(`postcss-rgb`)
const gapProperties = require(`postcss-gap-properties`)

module.exports = ({env}) => ({
	syntax: `postcss-scss`,
	plugins: [
		stylelint({
			failAfterError: false,
			reportOutputDir: false,
			fix: true,
			customSyntax: `scss`,
			reporters: [
				{
					formatter: `verbose`,
					console: true
				}
			]
		}),
		rgb(),
		env === `production` ? gapProperties({preserve: true}) : false
	]
})