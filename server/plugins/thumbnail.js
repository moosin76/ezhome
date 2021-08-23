const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const imageSize = require('image-size');

const thumbnail = function (uploadPath) {
	return async function (req, res, next) {
		const _path = `${uploadPath}/${req.params._path}`;
		const srcFile = `${_path}${req.path}`;

		if (!fs.existsSync(srcFile)) {
			return res.status(400).json({ err: 'file not found' });
		}

		const fileInfo = path.parse(req.path);
		const dim = imageSize(srcFile);
		// console.log(dim);

		if (dim.type != 'jpg' && dim.type != 'png') {
			return res.end(fs.readFileSync(srcFile));
		}

		const w = parseInt(req.query.w) || 0;
		const h = parseInt(req.query.h) || 0;
		// console.log("요청", w, h)

		if (w == 0 && h == 0) {
			return res.end(fs.readFileSync(srcFile));
		}

		const destPath = _path + '/.cache';
		fs.mkdirSync(destPath, { recursive: true });
		// test4.jpg?w=80&h=60
		// test4_w80_h60.jpg
		const destFile = `${destPath}/${fileInfo.name}_w${w}_h${h}${fileInfo.ext}`;
		
		// 캐쉬 파일이 있으면 캐쉬된 파일을 보내주고
		if(fs.existsSync(destFile)) {
			return res.end(fs.readFileSync(destFile));
		}
		// 이미지를 리사이즈해서 캐쉬 파일을 생성
		await sharp(srcFile).resize(w || null, h || null).toFile(destFile);
		return res.end(fs.readFileSync(destFile));
	}
}

module.exports = thumbnail;
