const fs = require('fs');
const path = require('path');

// /api
module.exports = function(root, app) {
	const dir = fs.readdirSync(path.join(__dirname, root), {
		withFileTypes : true
	});

	dir.forEach(p=>{
		if(p.isDirectory()) {
			if(p.name != '_model') {
				arguments.callee(`${root}/${p.name}`, app);
			}
		} else {
			let moduleName = '/' + p.name.replace(/\.js/g, '');
			if(moduleName == '/index') {
				moduleName = '';
			}
			console.log(`${root}${moduleName} => ${root}/${p.name}`);
			app.use(`${root}${moduleName}`, require(`.${root}/${p.name}`));
		}
	})
}