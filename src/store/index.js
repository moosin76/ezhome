import Vue from 'vue'
import Vuex from 'vuex'
import modules from "./modules";
import qs from 'qs';
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		appReady: false,
		config: {
			title: "ezCode",
			footer: "ezCode all right reserved.",
			menu: [
				{
					title: "Home",
					icon: "mdi-home",
					to: '',
					grant: 0,
					newTab: false,
					subItems: [
						{
							title: "Menu1",
							icon: "",
							to: '/menu1',
							grant: 0,
							newTab: false,
							subItems: [
								{
									title: "Menu1-1",
									icon: "",
									to: '/menu1-1',
									grant: 0,
									newTab: false,
									subItems: []
								},
								{
									title: "Menu1-2",
									icon: "",
									to: '/menu1-2',
									grant: 0,
									newTab: false,
									subItems: []
								},
							]
						},
						{
							title: "Menu2",
							icon: "",
							to: '/menu2',
							grant: 0,
							newTab: false,
							subItems: []
						},
					]
				},
				{
					title: "About",
					icon: "mdi-help",
					to: '/about',
					grant: 0,
					newTab: false,
					subItems: []
				},

			]
		}
	},
	mutations: {
		SET_APP_READY(state) {
			state.appReady = true;
		}
	},
	actions: {
		async appInit({ dispatch, commit }, user) {
			if (user) {
				commit('user/SET_MEMBER', user.member);
				commit('user/SET_TOKEN', user.token);
			} else {
				await dispatch('user/initUser');
			}
			commit('SET_APP_READY');
		},
		async configDuplicate(ctx, payload) {
			const { $axios } = Vue.prototype;
			const query = qs.stringify(payload);
			const data = await $axios.get(`/api/config/duplicateCheck?${query}`);
			return data;
		},
		async configSave({ commit }, form) {
			const { $axios } = Vue.prototype;
			const data = await $axios.post(`/api/config`, form);
			return data;
		}

	},
	modules,
});

export function createStore() {
	return store;
}

export default store;

