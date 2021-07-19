const lib = {
	deepCopy(obj) {
		if(obj === null || typeof obj !== 'object') {
			return obj;
		}
		const result = Array.isArray(obj) ? [] : {};
		for(const key of Object.keys(obj)) {
			result[key] = lib.deepCopy(obj[key]);
		}
		return result;
	}
}

module.exports = lib;