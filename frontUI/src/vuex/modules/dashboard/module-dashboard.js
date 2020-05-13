import dashboardGetters from './getters-dashboard';
import dashboardActions from './actions-dashboard';
import dashboardMutation from './mutation-dashboard';

const dashboardModule = {
	namespaced: true,
	state: {
		sample: null,
	},
	mutations: dashboardMutation,
	actions: dashboardActions,
	getters: dashboardGetters,
};
export default dashboardModule;
