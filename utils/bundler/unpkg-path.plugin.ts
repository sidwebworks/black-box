import * as esbuild from "esbuild-wasm";

const unpkg_path = "http://unpkg.com";

export const unpkgPathPlugin = () => {
	return {
		name: "unpkg-path-plugin",
		setup(build: esbuild.PluginBuild) {
			/**
			 * Resolve the entry file eg. `index.js`
			 */
			build.onResolve({ filter: /^index\.js$/ }, (args: any) => {
				return { path: args.path, namespace: "a" };
			});

			/**
			 * Resolve relative modules imports
			 */
			build.onResolve({ filter: /^\.+\// }, (args: any) => {
				// handle relative imports
				return {
					namespace: "a",
					path: new URL(args.path, unpkg_path + args.resolveDir + "/").href,
				};
			});

			/**
			 * Resolve main module files
			 */
			build.onResolve({ filter: /.*/ }, async (args: any) => {
				// handle all other imports
				return {
					namespace: "a",
					path: new URL(args.path, unpkg_path + "/").href,
				};
			});
		},
	};
};