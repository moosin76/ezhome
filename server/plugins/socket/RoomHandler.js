module.exports = (io, socket) => {
	socket.on('room:join', (roomName) => {
		console.log('room join', roomName, socket.id)
		socket.join(roomName);
	});

	socket.on('rooms:join', (arr) => {
		arr.forEach(room => {
			console.log('rooms:join', room, socket.id);
			socket.join(room);
		})
	})

	socket.on('room:leave', (roomName) => {
		console.log('room leave', roomName, socket.id)
		socket.leave(roomName);
	});
}