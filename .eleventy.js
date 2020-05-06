module.exports = (eleventyConfig) => {
	// Static Files
	eleventyConfig.addPassthroughCopy('fonts')
	eleventyConfig.addPassthroughCopy('img')
	eleventyConfig.addPassthroughCopy('js')

	// Template Formats
	eleventyConfig.setTemplateFormats(['html', 'njk', 'css'])

	// Dev mode settings
	eleventyConfig.addWatchTarget('./scss/')
	eleventyConfig.addWatchTarget('./js/')
	eleventyConfig.setBrowserSyncConfig({
		notify: true,
		watch: true
	})
}