import Vue from 'vue'
import Vuex from 'vuex'
import modules from "./modules";
Vue.use(Vuex)

export function createStore() {
	const store = new Vuex.Store({
		state: {
			config : {
				title : "ezCode",
				footer : "ezCode all right reserved.",
				menu : [
					{
						title : "Home",
						icon : "mdi-home",
						to : '',
						grant : 0, 
						newTab : false,
						subItems : [
							{
								title : "Menu1",
								icon : "",
								to : '/menu1',
								grant : 0, 
								newTab : false,
								subItems : [
									{
										title : "Menu1-1",
										icon : "",
										to : '/menu1-1',
										grant : 0, 
										newTab : false,
										subItems : []
									},
									{
										title : "Menu1-2",
										icon : "",
										to : '/menu1-2',
										grant : 0, 
										newTab : false,
										subItems : []
									},
								]
							},
							{
								title : "Menu2",
								icon : "",
								to : '/menu2',
								grant : 0, 
								newTab : false,
								subItems : []
							},
						]
					},
					{
						title : "About",
						icon : "mdi-help",
						to : '/about',
						grant : 0, 
						newTab : false,
						subItems : []
					},

				]
			}
		},
		mutations: {
		},
		actions: {
		},
		modules,
	});

	return store;
}

