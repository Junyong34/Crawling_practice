import rtmGetters from './getters-rtm';
import rtmActions from './actions-rtm';
import rtmMutation from './mutation-rtm';

const rtmModule = {
	namespaced: true,
	state: {
		sample: null,
	},
	mutations: rtmMutation,
	actions: rtmActions,
	getters: rtmGetters,
};
export default rtmModule;
