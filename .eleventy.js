module.exports = (eleventyConfig) => {
	// Static Files
	eleventyConfig.addPassthroughCopy('fonts')
	eleventyConfig.addPassthroughCopy('img')

	// Template Formats
	eleventyConfig.setTemplateFormats(['html', 'njk', 'css'])

	// Dev mode settings
	eleventyConfig.addWatchTarget('./scss/')
	eleventyConfig.setBrowserSyncConfig({
		notify: true,
		watch: true
	})
}