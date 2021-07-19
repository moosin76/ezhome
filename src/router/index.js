import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/about',
		name: 'About',
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	},
	{
		path: '*',
		name: 'Error',
		component: () => import(/* webpackChunkName: "error" */ '../views/Error.vue')
	},
]

export function createRouter() {
	const router = new VueRouter({
		mode: 'history',
		base: process.env.BASE_URL,
		routes
	});

	router.beforeEach((to, from, next) => {
	
		next();
	});

	router.afterEach((to, from)=> {
	
	})

	return router;
}

