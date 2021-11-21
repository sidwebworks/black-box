import { nanoid } from "@reduxjs/toolkit";
import { build, BuildOptions, initialize } from "esbuild-wasm";
import { fetchPlugin } from "./fetch.plugin";
import { unpkgPathPlugin } from "./unpkg-path.plugin";

let serviceLoaded: boolean | null = null;

declare const window: any;

const bundler = async (rawCode: string) => {
	if (!serviceLoaded) {
		await initialize({
			wasmURL: "https://unpkg.com/esbuild-wasm@0.13.14/esbuild.wasm",
			worker: true,
		});
		serviceLoaded = true;
		window.bundler_initialized = true;
	}

	try {
		const result = await build({
			entryPoints: ["index.js"],
			bundle: true,
			write: false,
			plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
			define: {
				"process.env.NODE_ENV": `"production"`,
				global: "window",
			},
		});

		return { code: result.outputFiles[0].text, err: null };
	} catch (error: any) {
		return { code: "", err: { method: "error", data: [error.message], id: nanoid() } };
	}
};

export const normalizeCss = (data: string) => {
	/**
	 * Function to remove any new lines, quotes from imported css packages.
	 */
	const escaped = data.replace(/\n/g, "").replace(/"/g, '\\"').replace(/'/g, "\\'");
	return `const style = document.createElement('style')
	style.innerText = '${escaped}';
	document.head.appendChild(style)`;
};

export default bundler;