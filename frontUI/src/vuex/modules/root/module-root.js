import rootGetters from './getters-root';
import rootActions from './actions-root';
import rootMutation from './mutation-root';

const rootModule = {
	state: {
		activeView: null,
		accessToken: null,
		tokenType: null,
		userId: null,
		menu_list: [],
	},
	mutations: rootMutation,
	actions: rootActions,
	getters: rootGetters,
};
export default rootModule;
