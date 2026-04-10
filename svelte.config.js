import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// Use adapter-vercel for Vercel deployment, adapter-node as fallback
let adapter;
try {
	const { default: adapterVercel } = await import('@sveltejs/adapter-vercel');
	adapter = adapterVercel({ runtime: 'nodejs22.x' });
} catch {
	const { default: adapterNode } = await import('@sveltejs/adapter-node');
	adapter = adapterNode({ out: 'build' });
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex({
			layout: {
				home: path.join(process.cwd(), './src/lib/layouts/Home.layout.svelte'),
				legal: path.join(process.cwd(), './src/routes/(legal)/legal.svelte'),
			},
		})
	],

	compilerOptions: {
		// runes: true
	},

	kit: {
		adapter,
		alias: {
			$appcss: './src/app.css',
			$constants: './src/lib/constants',
			$components: './src/lib/components',
			$stores: './src/lib/stores',
			$utils: './src/lib/utils',
			$images: './src/lib/images',
			'$blog-categories': './src/routes/(blog-categories)',
			$routes: './src/routes',
		}
	},

	extensions: ['.svelte', '.svx']
};

export default config;
