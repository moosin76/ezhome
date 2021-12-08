function getMixin(vm) {
	const {socket} = vm.$options;
	if(socket) {
		return typeof socket === 'function' ? socket.call(vm) : socket;
	}
}

const serverMixin = null;

const clientMixin = {
	data() {
		return {
			socketEvents : [],
		}
	},
	mounted() {
		const socket = getMixin(this);
		if(socket) {
			this.socketEvents = Object.keys(socket);
			for(const ev of this.socketEvents) {
				this.$socket.on(ev, socket[ev])
			}
		}
	},
	destroyed() {
		for(const ev of this.socketEvents) {
			this.$socket.off(ev)
		}
	}
}

export default process.env.VUE_ENV === 'server' ? serverMixin : clientMixin;