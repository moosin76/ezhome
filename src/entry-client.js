import { createApp } from "./main";
import './plugins-client/vue-toast';
import './plugins-client/vue-progressbar';

const { app, router, store } = createApp();

if(window.__INITIAL_STATE__) {
	store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(()=>{
	app.$mount('#app');
})