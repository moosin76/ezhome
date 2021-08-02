import Vue from "vue";

export const state = () => ({
	member : null,
});

export const mutations = {};
export const getters = {};
export const actions = {
	async duplicateCheck(ctx, {field, value}) {
		const { $axios } = Vue.prototype;
		const data = await $axios.get(`/api/member/duplicateCheck/${field}/${value}`);
		return data;
	}
};
