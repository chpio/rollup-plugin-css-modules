import CssModules from 'css-modules-loader-core';
import path from 'path';
import {readFile} from 'js-utils-fs';

export default function rollupCssModules() {
	const cssModules = new CssModules();

	const tokensByFile = Object.create(null);

	return {
		async transform(code, id) {
			if (id.indexOf('.css', id.length - 4) === -1) {
				return null;
			}

			const relativePath = path.relative(process.cwd(), id);
			const relativeDir = path.dirname(relativePath);

			async function fetchDep(_newPath) {
				const newPath = _newPath.replace(/^["']|["']$/g, ''); // WTF?!
				const filePath = path.resolve(relativeDir, newPath);

				if (filePath in tokensByFile) {
					return tokensByFile[filePath];
				}

				const newRelativePath = path.relative(process.cwd(), filePath);
				const newCode = await readFile(filePath);

				const {exportTokens} = await cssModules.load(
					newCode,
					newRelativePath,
					undefined,
					fetchDep
				);

				tokensByFile[filePath] = exportTokens;

				return exportTokens;
			}

			let exportTokens = tokensByFile[relativePath];
			if (!exportTokens) {
				const res = await cssModules.load(
					code,
					relativePath,
					undefined,
					fetchDep
				);
				exportTokens = res.exportTokens;
				tokensByFile[relativePath] = exportTokens;
			}

			return {
				code: `export default ${JSON.stringify(exportTokens)};`,
				map: {mappings: ''},
			};
		},
	};
}
