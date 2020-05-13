import * as types from './mutation-types-widget';

export default {
	[types.IS_USE_WIDGET_LIST]: (state, dataSet) => {
		state.is_use_widget_list = dataSet;
	},
	[types.DASHBOARD_LIST]: (state, dashboardList) => {
		state.dashboard_list = dashboardList;
	},
	[types.DASHBOARD_LAYOUT_FORMAT]: (state, dashboardLayout) => {
		state.dashboard_layout = dashboardLayout;
	},
	[types.SELECTED_DASHBOARD]: (state, selectedDashboard) => {
		state.selected_dashboard = selectedDashboard;
	},
	[types.SELECTED_WIDGET_FORMAT]: (state, selectedWidgetFormat) => {
		state.selected_widget_format = selectedWidgetFormat;
	},
};
