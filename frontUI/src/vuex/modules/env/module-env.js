import envGetters from './getters-env';
import envActions from './actions-env';
import envMutation from './mutation-env';

const envModule = {
	namespaced: true,
	state: {
		sample: null,
	},
	mutations: envMutation,
	actions: envActions,
	getters: envGetters,
};
export default envModule;
