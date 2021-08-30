import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes';
import store from '../store';

Vue.use(VueRouter)

export function createRouter() {
	const router = new VueRouter({
		mode: 'history',
		base: process.env.BASE_URL,
		routes
	});

	router.beforeEach(async (to, from, next) => {
		const { $Progress, $toast } = Vue.prototype;
		if($Progress) $Progress.start();

		if(typeof(window) == 'object') {
			if(!store.state.appReady) {
				if(window.__INITIAL_STATE__) {
					store.replaceState(window.__INITIAL_STATE__);
				} else {
					await store.dispatch('appInit');
				}
			}
		}

		if($Progress) $Progress.finish();
		next();
	});

	router.afterEach((to, from)=> {
	
	})

	return router;
}

