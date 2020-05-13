import socketGetters from './getters-socket';
import socketActions from './actions-socket';
import socketMutation from './mutation-socket';

const socketModule = {
	namespaced: true,
	state: {
		user_alert_data: [],
	},
	mutations: socketMutation,
	actions: socketActions,
	getters: socketGetters,
};
export default socketModule;
