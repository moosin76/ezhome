require('dotenv').config();
const { Server } = require('socket.io');
const redisAdapter = require('socket.io-redis');
const ConfigHandler = require('./ConfigHandler');

const { REDIS_HOST, REDIS_PORT } = process.env;

module.exports = function (webServer) {
	const io = new Server(webServer);
	io.adapter(redisAdapter({ host: REDIS_HOST, port: REDIS_PORT }));

	io.on('connection', (socket) => {
		ConfigHandler(io, socket);

		console.log('a user connected' + socket.id);

		socket.on('disconnect', () => {
			console.log('disconnected' + socket.id);
		});

		socket.on('room:join', (roomName) => {
			console.log('room join', roomName, socket.id)
			socket.join(roomName);
		});
		socket.on('room:leave', (roomName) => {
			console.log('room leave', roomName, socket.id)
			socket.leave(roomName);
		});
		socket.on('room:msg', (data) => {
			switch (data.target) {
				case 1: // 전체 보내기 (나를 포함)
					io.emit('room:testmsg', { msg: data.msg })
					break;
				case 2: // 브로드캐스트 (나를 제외)
					socket.broadcast.emit('room:testmsg', { msg: data.msg })
					break;
				case 3: // 룸에 입장한 전체 보내기 (나를 포함)
					io.to('testroom').emit('room:testmsg', { msg: data.msg })
					break;
				case 4: // 룸에 브로드캐스트 (나를 제외)
					socket.to('testroom').emit('room:testmsg', { msg: data.msg })
					break;
			}
		})
	});

}