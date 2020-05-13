import Component from './js/loadingComp.vue';
import LoadingApi from './js/api';

const Plugin = (Vue, props = {}, slots = {}) => {
	let api = LoadingApi(Vue, props, slots);
	Vue.$loading = api;
	Vue.prototype.$loading = api;
};

Component.install = Plugin;

export default Component;
