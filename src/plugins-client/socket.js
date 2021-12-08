import Vue from 'vue';
import io from 'socket.io/client-dist/socket.io';

const socket = io({transports: [ "websocket" ]});

socket.onAny((event, ...args) => {
	console.log('SOCKET', event, args);
})

Vue.prototype.$socket = socket;