import Vue from "vue";

export const state = () => ({
	online: true,
	rooms: [],
});

export const mutations = {
	SET_ONLINE(state, flag) {
		state.online = flag;
	},
	ROOM_JOIN(state, room) {
		state.rooms.push(room);
	},
	ROOM_LEAVE(state, idx) {
		state.rooms.splice(idx, 1);
	}
};

export const getters = {};

export const actions = {
	async initRoom({ state }) {
		const { $socket } = Vue.prototype;
		if (state.rooms.length) {
			$socket.emit('rooms:join', state.rooms);
			console.log('initRooms', state.rooms);
		}
	},
	async joinRoom({ commit, state }, room) {
		const { $socket } = Vue.prototype;
		const idx = state.rooms.indexOf(room);
		if (idx < 0) {
			commit('ROOM_JOIN', room);
			$socket.emit('room:join', room);
			console.log(`join room -> ${room}`);
		}
	},
	async leaveRoom({ commit, state }, room) {
		const { $socket } = Vue.prototype;
		const idx = state.rooms.indexOf(room);
		if (idx >= 0) {
			commit('ROOM_LEAVE', idx);
			$socket.emit('room:leave', room);
			console.log(`leave room -> ${room}`);
		}
	}
};
