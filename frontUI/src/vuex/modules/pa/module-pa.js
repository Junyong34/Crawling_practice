import paGetters from './getters-pa';
import paActions from './actions-pa';
import paMutation from './mutation-pa';

const paModule = {
	namespaced: true,
	state: {
		sample: null,
	},
	mutations: paMutation,
	actions: paActions,
	getters: paGetters,
};
export default paModule;
