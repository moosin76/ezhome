import Vue from 'vue';
import VueProgressBar from "vue-progressbar";

const option = {
	color : 'rgb(143, 255, 199)',
	failedColor : 'red',
	thickness : '3px',
};

Vue.use(VueProgressBar, option);