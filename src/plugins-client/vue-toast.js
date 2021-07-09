import Vue from "vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
	position :'bottom-center',
	timeout : 3000,
};

Vue.config.errorHandler = (e) => {
	console.error(e);
	if(Vue.$toast) 
		Vue.$toast.error(e.message);
}


Vue.use(Toast, options);