export default {
	getSystemList: state => state.system_list,
	getSystemId: state => state.systemId,
	getMainLayerPopup: state => state.main_layer_popup,
	getLatelyTime: state => state.latelyTime,
	getSelectedMasterRow: state => state.selected_master_row,
	getInstanceList: state => state.instanceList,
	getTimeLine: state => state.timeLine,
	getMetricList: state => state.metricList,
	getFailureCount: state => state.failureCount,
	getAnomalySummary: state => state.anomalySummary,
	getTxnList: state => state.txnList,
	getUserId: state => state.userId,
};
