// import Vue from "vue";
import * as types from './mutation-types-params';

export default {
	[types.SYSTEM_LIST]: (state, systemList) => {
		state.system_list = systemList;
	},
	[types.SYSTEM_ID]: (state, systemId) => {
		state.systemId = systemId;
	},
	[types.LATELY_TIME]: (state, latelyTime) => {
		state.latelyTime = latelyTime;
	},
	[types.MAIN_LAYER_POPUP]: (state, mainLayerPopup) => {
		state.main_layer_popup = mainLayerPopup;
	},
	[types.SELECTED_MASTER_ROW]: (state, selectedMasterRow) => {
		state.selected_master_row = selectedMasterRow;
	},
	[types.TXN_LIST]: (state, txnList) => {
		state.txnList = txnList;
	},
	[types.INSTANCE_LIST]: (state, instanceList) => {
		state.instanceList = instanceList;
	},
	[types.METRIC_LIST]: (state, metricList) => {
		state.metricList = metricList;
	},
	[types.PAUSE]: (state, pause) => {
		state.pause = pause;
	},
	[types.TIME_LINE]: (state, timeList) => {
		state.timeLine = timeList;
	},
	[types.ANOMALY_SUMMARY]: (state, anomalySummary) => {
		state.anomalySummary = anomalySummary;
	},
	[types.FAILURE_COUNT]: (state, failCount) => {
		state.failureCount = failCount;
	},
	[types.USER_ID]: (state, userId) => {
		state.userId = userId;
	},
};
