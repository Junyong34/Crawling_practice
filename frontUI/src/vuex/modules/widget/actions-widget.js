import * as types from './mutation-types-widget';

export default {
	is_use_widget_list: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.IS_USE_WIDGET_LIST, data);
	},
	dashboard_list: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.DASHBOARD_LIST, data);
	},
	dashboard_layout: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.DASHBOARD_LAYOUT_FORMAT, data);
	},
	selected_dashboard: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.SELECTED_DASHBOARD, data);
	},
	selected_widget_format: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.SELECTED_WIDGET_FORMAT, data);
	},
};
