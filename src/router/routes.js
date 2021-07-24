import Home from '../views/Home.vue'

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
		path: '/login',
		name: 'NoAuthLogin',
		component: () => import(/* webpackChunkName: "login" */ '../views/member/Login.vue')
	},
	{
		path: '/join',
		name: 'NoAuthJoin',
		component: () => import(/* webpackChunkName: "join" */ '../views/member/Join.vue')
	},
	{
		path: '*',
		name: 'Error',
		component: () => import(/* webpackChunkName: "error" */ '../views/Error.vue')
	},
]

export default routes;