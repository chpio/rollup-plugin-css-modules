#! /usr/bin/env babel-node

import {transformFileSync} from 'babel-core';
import fs from 'fs';
import path from 'path';

const es5 = transformFileSync(path.join(__dirname, './index.js'), {
	babelrc: false,
	presets: ['es2015'],
	plugins: ['transform-async-to-generator', 'transform-runtime'],
	sourceMaps: 'inline',
});

fs.writeFileSync(path.join(__dirname, '../index.js'), es5.code);


const es2015 = transformFileSync(path.join(__dirname, './index.js'), {
	babelrc: false,
	plugins: ['transform-async-to-generator', 'transform-runtime'],
	sourceMaps: 'inline',
});

fs.writeFileSync(path.join(__dirname, '../index.es2015.js'), es2015.code);
