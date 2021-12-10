import Vue from "vue";

export const state = () => ({
	online: false,
});

export const mutations = {
	SET_ONLINE(state, flag) {
		state.online = flag;
	}
};

export const getters = {};

export const actions = {};
