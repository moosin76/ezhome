function getMixin(vm) {
	const {title} = vm.$options;
	if(title) {
		return typeof title === 'function' ? title.call(vm) : title;
	}
}

const serverMixin = {
	created() {
		const title = getMixin(this);
		if(title) {
			this.$ssrContext.title = title;
		}
	}
}

const clientMixin = {
	mounted() {
		const title = getMixin(this);
		if(title) {
			document.title = title;
		}
	}
}

export default process.env.VUE_ENV === 'server' ? serverMixin : clientMixin;