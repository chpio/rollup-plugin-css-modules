import CssModules from 'css-modules-loader-core';
import path from 'path';

export default function rollupCssModules() {
	const cssModules = new CssModules();

	return {
		async transform(code, id) {
			if (id.indexOf('.css', id.length - 4) === -1) {
				return null;
			}

			const relativePath = path.relative(process.cwd(), id);

			const {exportTokens} = await cssModules.load(code, relativePath, null);

			return {
				code: `export default ${JSON.stringify(exportTokens)};`,
				map: {mappings: ''},
			};
		},
	};
}
