import { OnLoadResult, PluginBuild } from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";
import { normalizeCss } from ".";

const fileCache = localforage.createInstance({
	name: "filecache",
});

export const fetchPlugin = (inputCode: string) => ({
	name: "fetch-plugin",

	setup(build: PluginBuild) {
		build.onLoad({ filter: /^index\.js$/ }, async () => {
			return {
				loader: "jsx",
				contents: inputCode,
			};
		});

		build.onLoad({ filter: /.*/ }, async (args: any) => {
			/**
			 * Check if module is already in filecache
			 * if yes? return it immediately
			 *
			 * if not, fetch it from unpkg and cache it
			 * and return the result
			 */
			const cachedResult = await fileCache.getItem<OnLoadResult>(args.path);

			if (cachedResult) {
				return cachedResult;
			}

			return null;
		});

		build.onLoad({ filter: /.css$/ }, async (args: any) => {
			const { data, request } = await axios.get(args.path);

			const contents = normalizeCss(data);
			console.log(args.path);

			const result: OnLoadResult = {
				loader: "jsx",
				contents,
				resolveDir: new URL("./", request.responseURL).pathname,
			};

			console.log(request.responseURL);

			await fileCache.setItem(args.path, result);

			return result;
		});

		build.onLoad({ filter: /.*/ }, async (args: any) => {
			const { data, request } = await axios.get(args.path);
			console.log(args.path);
			const result: OnLoadResult = {
				loader: "jsx",
				contents: data,
				resolveDir: new URL("./", request.responseURL).pathname,
			};

			console.log(request.responseURL);

			await fileCache.setItem(args.path, result);

			return result;
		});
	},
});
