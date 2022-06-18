import { defineConfig } from 'astro/config';
import eslint from 'vite-plugin-eslint';
import sitemap from "@astrojs/sitemap";
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	outDir: `../_site`,
	site: `https://quokkas.amyskapers.dev`,
	vite: {
		ssr: {
			external: [`svgo`]
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use 'variables.scss' as var;`,
					includePaths: [`./site/src/styles`]
				}
			}
		},
		plugins: [eslint({
			exclude: [`node_modules`, `*.cjs`],
			fix: true,
			include: [`src/**/*.{js,jsx,ts,tsx,dts}`]
		})]
	},
	markdown: {
		render: [
			`@astrojs/markdown-remark`,
		],
		shikiConfig: {
			theme: `monokai`,
			langs: [],
			wrap: true,
		},
		rehypePlugins: [
			`rehype-figure`
		],
	},
	integrations: [
		sitemap(),
		react()
	]
});