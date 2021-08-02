import camelCase from "lodash/camelCase";

const requireModule = require.context('.', false, /\.js$/);
const modules = {};

requireModule.keys().forEach(filename => {
	if(filename !== './index.js') {
		const moduleName = camelCase(filename.replace(/(\.\/|\.js)/g, ''));
		modules[moduleName] = {namespaced : true, ...requireModule(filename)}
	}
});

export default modules;
