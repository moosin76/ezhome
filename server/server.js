require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');

// 앱 초기화
const app = express();
const port = process.env.SERVER_PORT || 3000;
const webServer = http.createServer(app);

// 정적 폴더
app.use(express.static(path.join(__dirname, "../dist")));

// 서버 응답
webServer.listen(port, () => {
	console.log(`http://localhost:${port}`);
});