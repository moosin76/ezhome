import { createApp } from "./main";
import plugins from './plugins-client';

const { app, router, store } = createApp();

// if(window.__INITIAL_STATE__) {
// 	store.replaceState(window.__INITIAL_STATE__);
// }

function addStyle(href) {
	const style = document.createElement('link');
	style.href=href;
	style.rel = 'stylesheet'
	style.type="text/css"
	document.head.append(style);
}

addStyle('/css/style.css');

router.onReady(()=>{
	app.$mount('#app');
})