import paramsGetters from './getters-params';
import paramsActions from './actions-params';
import paramsMutation from './mutation-params';

const paramsModule = {
	namespaced: true,
	state: {
		system_list: null,
		metricList: null,
		txnList: null,
		instanceList: null,
		systemId: null,
		latelyTime: null,
		pause: false,
		anomalySummary: {},
		failureCount: {},
		timeLine: [],
		main_layer_popup: {
			show: false,
			viewName: '',
			titleLabel: '',
		},
		selected_master_row: null,
		context_menu_data: null,
		playType: true,
		userId: null,
	},
	mutations: paramsMutation,
	actions: paramsActions,
	getters: paramsGetters,
};
export default paramsModule;
